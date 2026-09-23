#!/usr/bin/env bash
#
# Copies the generated redirect configs into nginx's include directory, tests, reloads.
#
# ---------------------------------------------------------------------------
# WHY THIS SCRIPT EXISTS
#
# `git pull` updates the repository checkout. It does NOT update nginx, because nginx
# reads from its own include directory:
#
#   /www/server/panel/vhost/nginx/extension/cantonlock.com/10-taxonomy-redirects.conf
#   /www/server/panel/vhost/nginx/0.legacy-redirects.conf
#
# Those paths are outside the checkout. So a redirect added to
# `deploy/nginx/taxonomy-redirects.conf`, committed, pushed and pulled is still not live —
# and `nginx -s reload` re-reads the OLD file and reports success, which is the confusing
# part. On 2026-09-03 that is exactly what happened: the reload was correct, the output
# was clean, and the three new 301s still returned 200, because the file nginx read had
# never changed.
#
# So the copy has to be a step somebody actually runs, which means it has to be one
# command rather than a paragraph of instructions.
#
# ---------------------------------------------------------------------------
# SAFETY
#
# A broken nginx config takes the whole site down. So: the existing file is backed up
# first, `nginx -t` runs BEFORE the reload, and a failed test restores the backup and
# exits without reloading. The site is never left depending on a config that did not pass.
#
# Usage, from the repository root on the server:
#   sudo bash deploy/install-nginx-redirects.sh

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXT_DIR="/www/server/panel/vhost/nginx/extension/cantonlock.com"
HTTP_DIR="/www/server/panel/vhost/nginx"
STAMP="$(date +%Y%m%d-%H%M%S)"

say() { printf '%s\n' "$*"; }

say "repository : $REPO_DIR"
say ""

# --- 0. pull, so this is ONE command rather than two --------------------------
#
# Client, 2026-09-16: 「我已经提交四五次 nginx 了，每次都是重复一样的内容写到终端，
# 我想一次性修好搞完」.
#
# Half of that repetition is inherent and cannot be removed: these files change whenever
# the catalogue changes, so somebody has to re-install them. The other half was ours —
# we were asking for `git pull` and then this script as two separate pastes, which is two
# chances to run the second against a stale checkout. That is exactly how the legacy conf
# spent eleven days out of date.
#
# So the pull happens here. `--no-pull` skips it for the case where the developer has
# already pulled, or where the server is deliberately held at an older commit.

if [ "${1:-}" = "--no-pull" ]; then
  say "skipping git pull (--no-pull)"
else
  say "pulling latest…"
  # Same lock as the cron deploy job. Without it this pull and the cron fetch can run at
  # once, and two git processes touching .git/shallow is what left the stale shallow.lock
  # that stopped every deploy (server log, 2026-09-22).
  exec 9>/tmp/cantonlock-deploy.lock
  flock -w 300 9 || { say "!! deploy lock busy for 5 minutes — nothing changed, try again."; exit 1; }
  git -C "$REPO_DIR" pull --ff-only || {
    say ""
    say "!! git pull failed. NOTHING has been changed."
    say "   Usually this means the server has local edits — see CLIENT-RUNBOOK section 1c-新."
    exit 1
  }
fi
say ""

# --- 1. sanity: the sources exist and the destinations are where we think ------

for f in taxonomy-redirects.conf legacy-redirects.conf; do
  [ -f "$REPO_DIR/deploy/nginx/$f" ] || { say "MISSING source: deploy/nginx/$f"; exit 1; }
done

[ -d "$EXT_DIR" ] || { say "MISSING nginx include dir: $EXT_DIR"; say "Is this the right server?"; exit 1; }

# --- 2. back up whatever is live now ------------------------------------------

BACKUP_DIR="/www/backup/nginx-redirects-$STAMP"
mkdir -p "$BACKUP_DIR"
cp -p "$EXT_DIR/10-taxonomy-redirects.conf" "$BACKUP_DIR/" 2>/dev/null || true
cp -p "$HTTP_DIR/0.legacy-redirects.conf" "$BACKUP_DIR/" 2>/dev/null || true
say "backed up current configs to $BACKUP_DIR"

# --- 3. install ---------------------------------------------------------------

#
# The "changed / unchanged" line matters more than it looks. Run this after somebody else
# has already run it and the honest answer is "there was nothing to do" — which is a
# different message from "it worked", and the client has been given the second when they
# deserved the first.

CHANGED=0
cmp -s "$REPO_DIR/deploy/nginx/taxonomy-redirects.conf" "$EXT_DIR/10-taxonomy-redirects.conf" || CHANGED=1
cmp -s "$REPO_DIR/deploy/nginx/legacy-redirects.conf" "$HTTP_DIR/0.legacy-redirects.conf" || CHANGED=1

cp "$REPO_DIR/deploy/nginx/taxonomy-redirects.conf" "$EXT_DIR/10-taxonomy-redirects.conf"
cp "$REPO_DIR/deploy/nginx/legacy-redirects.conf" "$HTTP_DIR/0.legacy-redirects.conf"
say "installed:"
say "  $EXT_DIR/10-taxonomy-redirects.conf   ($(grep -c 'return 301' "$EXT_DIR/10-taxonomy-redirects.conf") rules)"
say "  $HTTP_DIR/0.legacy-redirects.conf     ($(grep -cE '^\s+[0-9]+ "/' "$HTTP_DIR/0.legacy-redirects.conf") ids)"
if [ "$CHANGED" = "0" ]; then
  say ""
  say "  (both files were already identical — nothing actually changed)"
fi

# --- 4. test BEFORE reloading, and roll back if it fails -----------------------

say ""
say "testing nginx configuration…"
if ! nginx -t; then
  say ""
  say "!! nginx -t FAILED — restoring the previous configs and NOT reloading."
  cp -p "$BACKUP_DIR/10-taxonomy-redirects.conf" "$EXT_DIR/" 2>/dev/null || true
  cp -p "$BACKUP_DIR/0.legacy-redirects.conf" "$HTTP_DIR/" 2>/dev/null || true
  say "   restored. The site is unchanged. Send this output to the developer."
  exit 1
fi

# --- 5. reload ----------------------------------------------------------------

nginx -s reload
say ""
say "reloaded."

# --- 6. prove it, against the origin rather than through Cloudflare ------------
#
# Cloudflare caches 301 responses. Asking the public URL right after a reload can report
# the state from before it, so these hit 127.0.0.1 with the Host header set — that is the
# origin's own answer, with no cache in front of it.

say ""
say "verifying at the origin (bypassing Cloudflare):"
#
# A third field, `want`, checks WHERE the redirect goes. A status-code-only check passes
# happily on a 301 that lands somewhere wrong — which is what a stale legacy conf produces:
# still a 301, but to a slug that then 301s again. Leave `want` empty to check the code
# only, as the taxonomy cases do.

FAIL=0
while IFS='|' read -r path expect want; do
  [ -n "$path" ] || continue
  # The trailing \n matters. Without it `read` hits EOF, returns 1, and `set -e` ends the
  # script silently right here — which is why the 2026-09-22 run printed "verifying…" and
  # then nothing: not one redirect was actually checked, and no failure was reported.
  read -r code location < <(
    curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' \
      -H 'Host: cantonlock.com' "http://127.0.0.1${path}" || echo "000 -"
  )
  if [ "$code" = "$expect" ] && { [ -z "$want" ] || [ "${location%"$want"}" != "$location" ]; }; then
    say "  OK   $code  $path"
  elif [ "$code" = "$expect" ]; then
    say "  BAD  $code but lands on $location, expected it to end with $want"
    say "       $path"
    FAIL=1
    continue
  else
    say "  BAD  got $code, expected $expect  $path"
    FAIL=1
  fi
#
# ⚠ The last three are LEGACY index.php checks, added 2026-09-16.
#
# Until then every check here was a taxonomy redirect, so the script proved that
# 10-taxonomy-redirects.conf had landed and said nothing whatever about
# 0.legacy-redirects.conf. That is precisely the file that sat eleven days out of date
# while this script reported "All redirects live" each time it ran.
#
# A verification that cannot fail for the file most likely to be wrong is decoration.
#
# ⚠ The /es/ and /pt/ checks were added 2026-09-17, from Search Console's 404 export.
#
# Two Spanish product URLs were 404ing — /es/products/panic-exit-devices/72-panic-exit-device/
# crawled 09-12 and the 030 crawled 09-11 — because every taxonomy rule began /products/
# and nothing carried the locale prefix. The English side had redirected them correctly
# since the rename, so the site looked fixed from the only tree anybody checked.
#
# The lesson is the same one as the legacy checks above: a verification that only covers
# the language you read is a verification that cannot fail where the defect lives.
done <<'CHECKS'
/products/deadbolts/ansi-grade-3-keyed-deadbolt-lock-set/|301
/products/hardware-accessories/315-pry-latch/|301
/products/grip-handle-sets/600-concealed-sliding-door-handle/|301
/products/door-hinges/|301
/es/products/panic-exit-devices/72-panic-exit-device/|301|/es/products/panic-exit-devices/072-panic-exit-device-lock-case/
/es/products/panic-exit-devices/030-panic-exit-device/|301|/es/products/panic-exit-devices/030-panic-exit-device-trim/
/pt/products/panic-exit-devices/72-panic-exit-device/|301|/pt/products/panic-exit-devices/072-panic-exit-device-lock-case/
/index.asp|301|/
/index.php|301|/
/index.php?m=home&c=view&a=index&aid=397|301|/products/panic-exit-devices/x2-panic-exit-device-trim/
/index.php?m=home&c=lists&a=index&tid=97|301|/products/lock-cases/
/index.php?lang=es/|301|/es/
CHECKS

say ""
if [ "$FAIL" = "0" ]; then
  say "All redirects live. Now purge Cloudflare — it caches 301s."
else
  say "Some redirects are not live. Send this output to the developer."
  say "The previous configs are in $BACKUP_DIR if a rollback is needed."
  exit 1
fi

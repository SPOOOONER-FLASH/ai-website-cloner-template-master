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

cp "$REPO_DIR/deploy/nginx/taxonomy-redirects.conf" "$EXT_DIR/10-taxonomy-redirects.conf"
cp "$REPO_DIR/deploy/nginx/legacy-redirects.conf" "$HTTP_DIR/0.legacy-redirects.conf"
say "installed:"
say "  $EXT_DIR/10-taxonomy-redirects.conf   ($(grep -c 'return 301' "$EXT_DIR/10-taxonomy-redirects.conf") rules)"
say "  $HTTP_DIR/0.legacy-redirects.conf"

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
FAIL=0
while IFS='|' read -r path expect; do
  [ -n "$path" ] || continue
  code=$(curl -s -o /dev/null -w '%{http_code}' -H 'Host: cantonlock.com' "http://127.0.0.1${path}" || echo 000)
  if [ "$code" = "$expect" ]; then
    say "  OK   $code  $path"
  else
    say "  BAD  got $code, expected $expect  $path"
    FAIL=1
  fi
done <<'CHECKS'
/products/deadbolts/ansi-grade-3-keyed-deadbolt-lock-set/|301
/products/hardware-accessories/315-pry-latch/|301
/products/grip-handle-sets/600-concealed-sliding-door-handle/|301
/products/door-hinges/|301
CHECKS

say ""
if [ "$FAIL" = "0" ]; then
  say "All redirects live. Now purge Cloudflare — it caches 301s."
else
  say "Some redirects are not live. Send this output to the developer."
  say "The previous configs are in $BACKUP_DIR if a rollback is needed."
  exit 1
fi

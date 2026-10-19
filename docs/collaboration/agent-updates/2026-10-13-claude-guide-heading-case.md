# 2026-10-13 Claude: guide headings from capitals to sentence case, seven languages (task #66)

- **Why:** the guide layout the client approved reads headings as sentences. The source stored 161 English headings in capitals, plus their translations.
- **How:** `scripts/sentence-case-guide-headings.mjs`, which does a dry run by default and writes with `--write`; the review files go to `tmp/claude-heading-case/`.
  - Each word takes the spelling its own language uses for it in our articles' paragraphs, with sentence-initial uses discounted. This keeps German nouns and ß ("Dornmaß") and acronyms (EN, BHMA, BS, MOQ), and gives "North American" and "European" their capitals.
  - A word just before a number keeps its capitals only if it is a standards body (EN, ISO, UL, …). That way "EN 1670" survives, but Spanish/Portuguese/French "de 8301" do not stay capitalised.
  - Only a heading's first word is capitalised; a word after "8301" is mid-sentence.
  - The few words the count got wrong are fixed in `WORDS` / `OVERRIDES`. Examples: German "sie" meaning they vs the formal "Sie"; "Fragen" as a noun; English "US numbers"; Turkish "high cube".
  - Every English line, and every es, pt, fr, de, tr and ru line, was read in the review files.
- **Format:** the cased text is written as `## Text`. A heading used to be a heading *because* it was in capitals (`article-layout.ts`); the explicit form parses to the same level-2 heading with the same id, so all anchors still work (checked on exit-device-comparison).
- **Counts:** en 161, es 155, pt 153, fr 161, de 154, tr 161, ru 159. ja, ko and ar have no case and are unchanged.
- **Bookkeeping:**
  - Overlay `sourceHash.body` moves to the new English hash only where it matched the old one, so a current translation stays current and a stale one stays stale.
  - `article-revisions.json` takes the new hashes for the 23 affected guides without moving `updatedAt`: the words did not change.
- **Checks:** `stamp-article-revisions --check` passes; `npm run content` stamped 0; i18n-lint, titles:check and npm test (484/484) all pass.

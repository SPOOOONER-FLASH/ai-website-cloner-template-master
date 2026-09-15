# Codex — partial model publication

User explicitly requested model publication and selected interactive 3D preview plus file downloads. Original product photographs remain in place.

Published scope: 9004S lever/rose exterior, LC04 case envelope, and 70SN upper housing envelopes. These are three partial reference studies, not complete manufacturing or installation models. EN/ES descriptions enumerate omissions; LC04's assumed 15 mm closure thickness is stated explicitly. Existing GLB geometry is byte-identical to the reviewed source. Public Blender copies retain packed references and replace workstation image paths with relative paths; all three were reopened and verified.

Product pages and download libraries use a click-to-load, locally bundled @google/model-viewer 4.3.1. There is no automatic rotation or AR. Blender, GLB and bilingual scope text are downloadable. A neutral background improves contrast without changing geometry or materials.

Validation: 299 tests passed; TypeScript passed; ESLint passed with two pre-existing unrelated warnings. Browser inspection loaded all three actual models in the English library without console errors. A dev-mode Spanish product route returned 404; production-export route verification is required before release. Added a deterministic export check for all six product pages, both libraries and exact download bytes. Release results follow in a separate update.

Unrelated source and archived rejected imagery were untouched. Current build baton is recorded in NOW.md.

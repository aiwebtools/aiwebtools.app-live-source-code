# Roadmap

- [ ] Copy existing active-bot welcome recordings to website assets, verify byte-identical copies, and play them without Supabase
- [ ] Verify public bot portraits remain portable; keep generated private chat pictures out of public clones
- [ ] Test direct recording playback and document which clone features still require services

- [x] Prepare and verify all 847 high-quality compressed copies; original backups retained; live catalogs prefer smaller hosted copies
- [ ] Replace verified existing Supabase pictures at unchanged URLs (~536 MB total projected; blocked: no authenticated administrator session and no admin role assigned)
- [x] Verify preservation: 1,544 bot records, 1,542 active, 1,544 prompts unchanged; database ~43 MB; original/compacted images verified
- [ ] Verify current egress, function invocations and Realtime/MAU usage in Supabase organization Usage before downgrade (dashboard measurement unavailable)

- [x] Move existing community bot pictures to Lovable Assets without changing their appearance (847 byte-identical copies verified)
- [x] Route both live catalogs to verified migrated pictures; bot room screenshot confirms original artwork renders, tests pass
- [ ] Confirm stored files under 1 GB after same-URL compression (~536 MB projected, current ~2.15 GB); do not delete any original until verified replacement succeeds

- [x] Diagnose hamburger bot search failure: live catalog returns HTTP 402 hosting quota restriction
- [x] Add accurate service-unavailable message and working retry to shared header bot directory
- [x] Restore live bot search: paid upgrade restored live directory access; 1,542 active bots readable

- [x] Fix Custom GPT Maker bot: hosted `custom-` slugs now resolve server-side prompts (live-verified)
- [x] GPT Maker opens faster: survival draft artwork lazy-loads only when the picker opens
- [x] Category picker added to GPT Maker; publish-community-gpt stores the chosen subject
- [x] 25 survival draft bots published via secret-gated owner importer (verified 25 active + prompt hashes match)
- [x] Ethics review falls back to GLM when Lovable credits are out
- [x] TTS fallback: free device voice reads the remainder when the lifelike engine fails (tested)
- [x] GLM lag reviewed: streaming and thinking indicator already live; lag is provider-side, no model change
- [x] Recent bot responses reviewed in gpt_chat_logs (62 ok / 12 failures in 48h; image-credit and pre-fix errors only)

# Roadmap

## Search name accuracy
- [ ] Prioritize exact tool names across global and in-site searches, including live community bots
- [ ] Add bounded spelling/spacing/accent matching without renaming or removing tools
- [ ] Test concrete ranking rules and verify search results and speed in the preview

## Response voice reliability
- [x] Prevent overlapping welcome, waiting and response voices; serialize studio/device fallback and cancel stale playback
- [x] Fourteen speech regressions pass; two real guest Time Machine replies auto-read sequentially with simulated studio quota failure and instrumented device speech, mute stops playback, zero page errors/build OK; actual phone audio remains owner check, preview only

## Incomplete bot replies
- [x] Fix confirmed SpeechSynthesisUtterance errors interrupting complete replies; capability-check optional device voices and isolate speech from text delivery, with instructions/models unchanged
- [x] Twelve speech tests pass; real guest Ancient Egyptian Proverbs chat with unavailable device voice and simulated studio quota failure displayed/saved all 1,960 characters with zero page errors; build OK, preview only

## Current finish request
- [x] Refine Pandora gate: slower opening/confetti, cached Gemini elder announcement with local soft clicks/chimes (ElevenLabs exhausted); hosted clip HTTP 200, playback verified with hosted bytes routed into local browser, phone fit/reload and PIN tests pass; actual phone sound remains owner check, preview only
- [x] Remove remaining forced video quality settings without changing videos or audio controls
- [x] Verify directory task search and existing bot guidance: live directory A–Z, task shortlist, main/music video controls and 19 instruction/speech tests pass; actual phone audio and new model reply quality remain unverified
- [ ] Publication requested for aiwebtools.app; deployment completion and the updated live version await hosting confirmation

- [x] Copy existing active-bot welcome recordings to website assets: 362 byte-identical recordings verified; direct playback prefers website assets
- [x] Verify public bot portraits remain portable; keep generated private chat pictures out of public clones
- [x] Test direct recording playback with Supabase blocked; seven media tests pass; PORTABLE-MEDIA.md documents online asset pointers and remaining service dependencies

- [x] Prepare and verify all 847 high-quality compressed copies; original backups retained; live catalogs prefer smaller hosted copies
- [x] Superseded by completed website-asset migration and external originals backup; do not restore originals into Supabase
- [x] Verify preservation: 1,544 bot records, 1,542 active, 1,544 prompts unchanged; database ~43 MB; original/compacted images verified
- [x] Owner supplied post-downgrade free-plan usage screenshot showing usage within displayed quotas; not a fresh usage measurement

- [x] Move existing community bot pictures to Lovable Assets without changing their appearance (847 byte-identical copies verified)
- [x] Route both live catalogs to verified migrated pictures; bot room screenshot confirms original artwork renders, tests pass
- [x] Completed earlier: Supabase storage approximately 193 MB after public-picture migration; original backups preserved outside Supabase

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

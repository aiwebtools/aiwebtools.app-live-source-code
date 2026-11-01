# Roadmap

## Bot commercial usability
- [x] Scope YouTube events to the commercial iframe, raise video above embedded rooms and drawers, stop audio before close, and release failed embeds after 15 seconds
- [x] Three playback regressions pass; real Time Machine footage visibly plays with close X, unrelated end messages do not dismiss it, close removes iframe and a real guest reply succeeds afterward; build OK. Original reported bot/device and embedded-room playback not directly reproduced

## Recent MTV AI uploads
- [ ] November 1 07:28 UTC request: freshly check Videos and Shorts, add only verified missing uploads to the shared list, and verify playlist access/playback without removing existing videos
- [x] Fresh November 1 recheck: 30 Videos + 48 Shorts cover the two-week boundary; all missing listed IDs predate October 18, so no further additions needed. Newest public Short MKrXzgLxGrY (01:26 UTC) already included; two tests pass and all 26 additions reachable among 296 unique theater entries
- [x] Verified 26 missing uploads (15 videos, 11 Shorts) in October 18–November 1 window; excluded three older uploads using metadata dates, not titles
- [x] Added shared exact titles/URLs/dates/runtime/format metadata to pinned gallery and book-promo reels; main MTV AI page reuses gallery; no existing videos removed
- [x] Two date/ID regressions pass; main MTV AI Next control reaches all 26 additions, zero runtime errors; latest build OK
- [x] Newest Short plays in the theater with real video time advancing and readyState 4; screenshot confirms footage. Rapid full-queue navigation surfaced a third-party YouTube getDuration error, not an app stack
- [ ] Book/pinned visual playback remains unverified; prior isolated book test was invalid without app contexts

## Lovable-first chat, voices and mobile readiness
- [x] Lovable-first site-paid chat deployed and live-verified on GPT-6 Luna; restored stale credit pause after successful live call; explicit models/personal keys and terminal safeguards preserved
- [x] Existing lifelike Lovable speech returns real WAV audio; phone guest chat auto-read state verified; 53 routing/voice/instruction regressions pass and saved recordings preserved
- [x] Audited 422 local instruction records against available capabilities; all 1,542 active live bots have prompts (184–793,826 characters); appended honest execution and real-world safety boundaries without changing originals
- [x] Fixed phone header/title overlap, constrained builder/tablet widths and mobile menu scrolling; phone home/directory/chat and bot drawer checked with zero page errors; current build OK
- [ ] ElevenLabs new speech awaits credits: subscription has used 40,000 of 40,000; saved recordings remain usable
- [ ] Physical phone sound quality and every bot's domain-specific real-world outcomes cannot be certified through automated checks; full-book retrieval remains unavailable for the existing guarded book bot

## Muse and game tools finish
- [x] All seven individual pages render their custom artwork; all seven names present in four search catalogs and sitemap; GearZero phone page has no horizontal overflow
- [x] Correct referral-copy failure state, preserve exact PI0DS6 code and add affiliate tracking to Muse
- [x] Keep access-code gate disabled and update its regression test
- [x] Seven gate/referral/image/promotion regressions pass; current build OK; publication requested for https://aiwebtools.app
- [ ] Automatic referral popup timing/copy flow remains unverified in the browser; accelerated test could not open it under the shared cooldown
- [ ] Confirm deployment serves the updated version; hosting completion remains unconfirmed

## Response voice reliability
- [x] Fix silent phone fallback: separately prime device speech on submit/play, prefer natural English voices, retain/chunk utterances, surface/log speaker failures; 17 speech tests pass and real guest Time Machine reply auto-read/replay verified with simulated quota failure and instrumented Samantha Enhanced, zero page errors/build OK; physical phone sound and paid voice availability remain unverified, preview only
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

# Chatbot completion roadmap

# Current Bionic model connection
- [ ] Restrict automatic DeepSeek selection to advanced/coding tasks, show actual reply model/provider token counts discreetly, and reserve resting status for both exhausted credit balances; verify tests and live UI.
- [x] Add owner-authorized outage/credit-only Lovable fallback with persistent circuit states, hourly watchdog integration and no denial/refusal bypass; no partial-reply replay, automatic top-up or scheduled AI probes. Admin-confirmed resume after restoring credits/access. Mocked failure paths pass; exact Lovable Luna streaming/tool-schema live check HTTP 200; deployed both functions.
- [x] Audit all 1,519 active in-house bot defaults: zero non-GLM defaults in database; device-created bots default GLM too, advanced/coding routes to DeepSeek, explicit models and personal keys preserved. Representative Time Machine, Book Writer, Stellaris and coding replies verified in logs, not all 1,519 live rerun. Browser Stellaris Run Python prints 55 with no page errors; existing generated image success confirmed in logs, separate image/search services preserved.
- [x] Securely collect builder Bionic key; verify both exact model IDs, streaming, vision input and tool calls. GLM recognized the photo test; DeepSeek misidentified its color.
- [x] Route ordinary default bot chats to GLM and advanced reasoning/coding to DeepSeek, preserving instructions, tools and personal-provider priority; hold Gemini fallback. Deployed run-gpt-app; verified logged model selection.
- [x] Pass 453 routing/instruction/privacy regression tests; live Time Machine, Stellaris, coding and web search pass. Actual visitor Stellaris reply and generated spacecraft image with Download/View/Revise verified without page errors. Correction: existing Run Python executes code on the visitor's device via Pyodide; there is no server-side autonomous Python tool.

# Current menu, categories and sign-in repair
- [x] Make desktop Web3 Domains panel opaque and verify expanded content: screenshot and computed RGB(13,13,13), no page errors.
- [x] Reduce redundant All AI Tools ranking work without changing ordering: rank computed once per record, two preservation tests pass; browser verifies 5,431 records and working load-more without page errors. Cold Vite visit still took 21 seconds including entrance; cannot claim instant loading or production speed.
- [ ] Reproduce and repair sign-in error; verify personal-key controls without weakening key ownership: public sign-in form renders correctly without page errors, but authenticated flow blocked by external unmanaged authentication and no reproducible error.
- [x] Hold off shared Gemini fallback at Master's request; superseded by Bionic connection above.

# Starter prompts, compact reading and personal AI providers (Oct 21)
- [x] Replace operational-text starters with one short purpose-trigger prompt per bot; label STARTER PROMPT and reduce chat text to 14px. All 422 catalog families/variants pass coverage; screenshot bots and Book Writer verified on phone, real reply and desktop checked with no page errors. Frontend remains preview-only.
- [x] Deploy supplemental immersive delivery guidance without changing originals. Eighteen tests pass; real Aether two-turn check produces an imaginative scene, though still adds a framing paragraph on the follow-up. Prompt guidance cannot guarantee every future reply.
- [x] Approve secure personal-provider key support for OpenAI, Gemini, Claude and DeepSeek with key-acquisition links, explicit activation and unchanged Lovable default.
- [x] Add personal-key controls, authenticated direct provider routing, tool/history continuation and key privacy. Phone/desktop controls and sign-in links verified without page errors; 449 regression tests and four mocked direct-provider tests pass, including native Gemini tool-signature continuity; build OK.
- [ ] Verify real paid-provider activation and replies: blocked by unavailable authorized provider credentials and external unmanaged authentication; no authenticated end-to-end claim. Frontend remains preview-only until publication.
- [x] Explain local-model hosting and remaining voice/image/search costs in the approval plan; no silent credit-exhaustion fallback or free-hosting promise.

# Recent conversation response review (Oct 21)
- [x] Review recent real conversations: duplicate intake, image re-prompts, exposed tool/scratchpad text, game-menu loops and invented diagnostic evidence identified.
- [x] Deploy supplemental continuity and scoped 3D Concept, Survivalist, card-game and Stellaris improvements without editing originals; 437 preservation/context tests pass. Real Stellaris retest stopped invented numeric charts and generated diagnostic images; its authored mission questionnaire still appears. This representative check does not verify every affected bot's future output.

# Silent bot voice repair (Oct 20)
- [x] Unlock automatic read-aloud from message submission and voice-enable gestures; real reply playback and mute verified, six speech tests pass. Physical iPhone audio remains unverified; frontend update is preview-only until published.

# Header GPTs shortcut + speed (Oct 20)
- [x] Add GPTs waving-robot icon left of GitHub (labeled GIT) opening CUSTOM GPT BUILDER + bot category accordion; verify phone and desktop.
- [x] Fix slow/black home screen before tool and GPT cards appear.
- [x] Fix bot replies occasionally being read aloud twice.

# Apocalypse Survival & Nature expansion (Oct 18)
- [x] Make sidebar tool names smaller and fully readable; verify phone and desktop.
- [ ] Audit existing survival/nature bots and move relevant families without modifying instructions.
- [ ] Author 25 genuinely distinct practical bots with complete directives, art, voices, PDFs and search metadata.
- [ ] Publish through ordinary ethics review within ten-per-day allowance; never bypass the limit.
- [ ] Verify each published bot with real inputs, safety checks, downloads and cross-screen screenshots.

# Off Grid Living expansion (Oct 18)
- [x] Verify existing five bots with real replies now credits are restored.
- [x] Author 25 distinct off-grid bots with practical A–J directives, personalities, individual art, voices and PDFs; publish through ethical review.
- [x] Audit studio subject classification, correct mismatches, and group all 30 under Off Grid Living.
- [x] Add top-of-chat quick switch search using existing room navigation.
- [x] Test each new bot's real use case and verify downloads, art, switching and phone/desktop layouts.

# Off Grid Tribes additions (Oct 17)
- [x] Add five complementary community-support bots with complete directives, branded avatars, voices, ethics review and individual PDFs.
- [x] Add "off grid tribes app" to existing drop-down menus without changing existing destinations.
- [x] Verify new bots, search/suite selection, downloads and menu navigation with real replies and screenshots.

# Community studio finish pass (Oct 16)
- [x] Clean 190 public community names through shared presentation map; preserve slugs, original prompts/documents and all bots.
- [x] Repair sidebar portraits with local visible fallback/lazy remote art; add PikaStory artwork without third-party branding; live phone screenshots verified.
- [x] Remove header version limits; menu navigation and builder verified on phone/computer; live Book Writer V18 opens correctly.
- [x] Create/test 1,044 complete imported instruction PDFs; character tests pass; three random bots replied; live Python total 60/average 20 and both PDF downloads verified.
- [x] Publish and verify live-domain controls without page errors. Fix invented report date through separate guidance; decode four binary Gemini originals without altering archives.
- [ ] Exhaustive real conversations for every bot and physical-device voice/camera checks: not covered by representative automated checks.

# Full original instruction audit (Oct 15)
- [x] Audit 425 hosted bots: 336 seeded official bots, 83 summary-only official rooms and six community bots. Match exact source filenames and existing text against both original ZIP sets; preserve alternate versions and genuinely short authored instructions.
- [x] Install full server-only brains for 418 official bots; restore 83 generic room summaries and 13 clipped ordinary seed originals, preserving complete paragraph text. Synchronize 335 seed records; leave community instructions, identities, models and media unchanged.
- [x] 435 tests pass, including individual source/hash/model-prefix checks for all 418 brains. Deploy run-gpt-app, seed-gpt-apps and watchdog; real 3D Print reply follows source diagnostics/required questions, screenshot verified, no page errors, build OK. All 425 bots remain in directory.
- [ ] Gospel of Deployment source is a 1,965,857-character anthology, not a normal operational prompt. Full-book retrieval requires a separate design; its chat now explicitly reports/logs instruction_error instead of silently using the first 9,000 characters. No source text deleted, book remains archived, no paid service added.

# Professional bot names and instruction fidelity (Oct 15)
- [x] Clean 13 confirmed compliance/version/document labels and spelling errors in hosted names and seed records; preserve all identifiers, prompts, original documents and media.
- [x] Review recent interactions: persona drift, unsupported Python/download promises and search errors. Recover Alan's full 9,136-character DOCX instruction text only for the known truncated legacy runtime prompt; add a separate shared execution/persona supplement. Economy models unchanged; handler deployed.
- [x] 16 tests pass, including exact DOCX text preservation; real Alan question and divine-simulation follow-up maintain character and context without unsolicited AI denials. Cannabis phone title verified with screenshot, no overflow/page errors; build OK.
- [ ] Reliable live web retrieval remains blocked: searches returned no sources during real Alan tests and were logged as search_error; requires an approved usable search source, no paid service added.

# Phone chat labels and richer attachments (Oct 14)
- [x] Label bottom controls in a fitted phone grid and add a separate rear-camera/photo attachment control.
- [x] Support JPG/PNG/WebP/GIF, text-searchable PDF, DOCX, XLSX and text/code/data up to 10 MB; preserve cheap models and saved attachment context. Scanned PDFs, HEIC, legacy Office binaries, archives, audio and video are explicitly unsupported.
- [x] 21 regression tests pass; JPEG/PDF/DOCX/XLSX/3 MB CSV attachments verified; real photo color and PDF revenue answers correct and restored on reload; 320/390/768/1280px screenshots show no overflow or page errors; build OK, focused lint clean. Server deployed; frontend unpublished.
- [ ] Physical phone camera capture: rear-camera input verified in browser, but actual camera permission/capture requires a physical phone.

# First-response web search and larger data uploads (Oct 13)
- [x] Repair first-turn search selection and report genuine failures instead of disguising Wikipedia/background knowledge as live web research; real first-turn tool call verified
- [x] Accept supported data files up to 10 MB; CSV statistics cover every row, JSON/text use labeled bounded excerpts; original instructions and inexpensive models preserved
- [x] 17 regression tests pass; real 3,150,021-byte CSV returned 350,001 rows, sum 350,099 and max 99; attachment restored on reload; phone/desktop screenshots, no overflow/page errors, build OK; server deployed, frontend unpublished
- [ ] Restore dependable live search results: existing DuckDuckGo search returns a bot challenge; Parallel connection declined by Master. Requires approved search-service access; no alternate paid connection attempted.

# Homepage visibility and phone bot navigation (Oct 13)
- [x] Reduce deferred mount wait, show explicit loading status, and remove blanket nested-grid paint containment; homepage content preserved
- [x] Add phone Back and visible Bots controls; raise both drawers/model lists above embedded popup and close popup before bot route changes
- [x] Verify phone homepage sections through search/music/book, popup Back, Einstein switching, model options, and 320/408/820/1280px layouts; lint zero errors and build OK; unpublished

# Scrolling and featured labels (Oct 13)
- [x] Repair deferred loading gaps with persistent skeletons, cancellable queued mounts, and near-viewport priority
- [x] Rename in-site featured actions and ChatGPT destination buttons, retaining destinations and other platform actions
- [x] Verify 408px phone scrolling (9,749px), no horizontal overflow or page errors, usable popup composer, desktop labels, focused lint and build OK; unpublished

# Voice previews and homepage audio (Oct 13)
- [x] Repair voice previews and click-based audio unlock; all eleven homepage voices return playable audio, Time Machine preview returns 200 SSE with character directions
- [x] Repair homepage voice generation and natural-delivery directions; actual MP3 download validated (6.3 seconds), stop and cached previews verified
- [ ] Complete sound-effect generation verification: interface and server deployed below voice generator, but ElevenLabs key lacks sound_generation permission (401); reconnect declined. Real SFX playback/download blocked until owner grants permission.
- [x] Thirteen audio tests pass, changed frontend lint clean, phone/desktop controls inspected, build OK; physical phone sound quality not tested

# Reply celebrations and community creator (Oct 13)
- [x] Add 20 lightweight reply sound/visual combinations with mute and reduced-motion support; count test passes, real reply triggers effect, overlay cleans up, effects-off verified
- [x] Fix phone/desktop bot builder submission and verify ethics-approved bots appear in the selectable library; close competing drawer, visible validation, safe storage failures and retry reuse; phone UI publication and real replies verified
- [ ] Publish remaining Museum Label Editor GPT and Citizen Science Notebook GPT: saved locally and submitted, but existing 3-per-day community publication limit blocked them (429). Repair Cafe Coordinator GPT, Sensory Friendly Event Planner GPT and Seed Library Organizer GPT approved with branded images and real replies.

# Chat replies and sidebar portraits (Oct 13)
- [x] Live replies verified; repair swallowed stream errors and final frames without changing bot instructions or economy default; original intermittent failure not reproduced
- [x] Show matching avatar images beside all selectable GPT names on desktop and phone; all 422 images loaded, existing art retained with local subject-image fallbacks
- [x] Verify real Time Machine and Einstein conversations, sidebar selection, phone/desktop screenshots, eight tests and build OK; project-wide lint has pre-existing errors, focused files have no errors

# Unlimited economy chat (Oct 13)
- [x] Remove guest and member daily chat caps while retaining usage accounting; deployed handler and three tests pass
- [x] Default to GPT-6 Luna, lowest-priced supported non-deprecated text model in the authenticated catalog; real phone-sized Time Machine reply returned 200 and preserved Father Time persona

# Promotional pop-ups and clone destination (Oct 13)
- [x] Space automatic promotions at least 15 minutes apart, preserving user-triggered dialogs
- [x] Update every active clone link to Master's specified remix project, including CSV metadata
- [x] Test cooldown boundaries and shared session timing; browser verified clone destination, first delay, dismissal spacing, screenshots, and zero page errors

# Phone chat reference (Oct 11)
- [x] Match the uploaded polished Matrix phone reference with rounded glass controls, readable messages and a clear bot header
- [x] Fit featured popup chats to the phone viewport while preserving voice, images, downloads and history
- [x] Verify real Time Machine reply, model switching, featured popup controls and phone/desktop screenshots; seven preservation tests pass

# Bot starter readability and subject matching (Oct 10)
- [x] Tailor both visible starters across all 422 active bots without changing operational instructions; future bots use their subject rather than old generic introductions
- [x] Enlarge starter touch targets to at least 56px and show full library bot names on hover/focus; personal bots have full-name hints
- [x] Verify phone/desktop rooms, 422-bot coverage, full-name tooltip, and a real Time Machine starter reply (200, no page errors)

# Cheap model check + community directory (Oct 10)
- [x] Real replies from 4 bots on cheapest model: ~3s vs ~15s before; ~0.0025 vs ~0.011-0.019 credits per message
- [x] Community GPTs get an AI-generated branded image on approval and appear in search + All AI Tools + community page
- [x] Publish

# Matrix example verification and publish (Oct 10)
- [x] Match supplied Matrix styling, fix gold-button contrast, and connect missing usable chat actions
- [x] Check cheap model switching, original instructions, voice casting, images, PDFs, and initialization audio
- [ ] Exercise 15 randomly selected bots with real conversations: all 15 rooms/PDFs checked; seven random bots plus three Time Machine turns used the guest's 10-message allowance. Remaining eight need a later allowance or an authenticated account; external unmanaged auth prevents session minting.
- [x] Verify phone-sized layouts, moving code, drawers, history, and live playback
- [x] Published to aiwebtools.app and verified public phone-sized bot access, PDF download, initialization sound, moving code, and settings without page errors

# Matrix conversation studio (Oct 10)
- [x] Connect initialization audio to bot launches and instruction downloads
- [x] Adapt the uploaded Matrix design into a shared branded room with mobile drawers
- [x] Add device-saved conversations, route-based history, and guest bot switching
- [x] Verify available model selection without changing existing bot instructions
- [x] Verify real guest replies, individual PDFs, hosted audio, images, history, and phone/desktop layouts

- [x] Audit all 222 active bot records and prompt links
- [x] Confirm image generation live on Time Machine GPT
- [x] Unify embedded and full-screen room branding with a unique signature per bot
- [x] Add empty/interrupted reply recovery
- [x] Preserve disabled bots during future seed updates
- [x] Repair AI Tools GPT directory mapping
- [x] Add and run catalog-wide integrity checks
- [x] Verify representative rooms and Care Bot on desktop/mobile
- [x] Publish the completed changes

# Official-version and image reliability

- [x] Relabel hosted-tool launch buttons as official-version links
- [x] Make image requests deterministic with bounded retry and clear failures
- [x] Ensure generated pictures render responsively in both chat surfaces
- [x] Add lightweight room glow effects with reduced-motion safeguards
- [x] Verify representative text and image bots across mobile, tablet, and desktop
- [x] Confirm clean build and browser logs

# Finish pass (Sep 20)

- [x] Publish aiwebtools.app with PDF download fix + glowing gold buttons
- [x] Phone-viewport check: gold "USE THE OFFICIAL VERSION" button glows, PDF downloads
- [x] Static prerendering for all hub pages, homepage, and 222 bot rooms (SSR-equivalent for crawlers)
- [x] Flagship pages optimized for "AI book writer tool" / "movie script generator" phrases
- [x] Sitemap split + resubmitted to Google Search Console (9 sitemaps, HTTP 204)
- [x] Starter prompt audit — 0 generic across 222 bots

# Matrix chat atmosphere (Sep 21)

- [x] Living Matrix rain + embers behind every chat surface (rooms, tool pages, Care Bot)
- [x] Fix layering so the rain is actually visible (backdrop z-0, content z-10)
- [x] Care Bot voice playback + refreshed knowledge deployed
- [x] Verified live on aiwebtools.app (phone + desktop), published

# Download access and finish pass (Sep 29)

- [x] Add a reusable operational-instructions download button across back pages
- [x] Add download access near the bottom of every category page and MTVai
- [x] Add download access to phone, tablet, and desktop menus plus footer links
- [x] Preserve the existing per-tool PDF and download-center behavior
- [x] Verify the Matrix loader, menu links, pinned-player destinations, and downloads on phone and desktop
- [x] Confirm Register Web3 search and featured-card navigation/homepage placement
- [x] Remove the obsolete hosted operational-instructions pointer
- [x] Build and inspect the public download archives and fresh source-code ZIP

# Character voice finish pass (Sep 30)

- [x] Add deterministic subject-specific voice profiles for every hosted chatbot
- [x] Add special era, accent, pacing, and temperament profiles for signature characters
- [x] Use safe character-inspired delivery rather than cloning a real person's voice
- [x] Verify Einstein's tailored control in-browser and generate a valid 88 KB MP3 sample
- [x] Publish the completed voice upgrade

# Cross-device quality pass (Sep 30)

- [x] Test homepage, tools, music, and chatbot rooms at phone, tablet, and desktop sizes
- [x] Remove tablet header overlap by limiting full navigation to desktop widths
- [x] Repair tailored voice resource cleanup, state tracking, and full-page profile matching
- [x] Enlarge confirmed undersized touch controls and prevent mobile blog/table overflow
- [x] Re-test corrected layouts, menus, loading, downloads, links, and voice controls
- [x] Confirm a clean production build of the verified update

# Mobile header downloads (Sep 30)

- [x] Add a visible phone-header download icon
- [x] Put CSV, operational instructions, and source-code downloads above the fold in the phone menu
- [x] Verify both phone download actions and the compact header layout

# Natural voices and compact chat (Oct 9)

- [x] Improve conversational voice delivery without changing bot identities or instructions
- [x] Remove robotic voice fallback; test complete reply chunking and real playback
- [x] Slim chat headers, starter prompts, and typing controls across phone/tablet/desktop
- [x] Audit all 419 registered PDFs and verify a real individual PDF download
- [x] Run focused tests and browser checks; preserve every tool and original document
- [x] Featured-card end-to-end check: fresh homepage visitor opened branded studio popup with initialization audio and individual PDF controls
- [x] Published-site verification: public phone-sized bot, PDF, sound, moving code, and settings passed

# Concurrent voice and image experience (Oct 9)

- [x] Start character speech during replies, with mute and sequential playback
- [x] Add microphone conversation controls to embedded and full-screen bots
- [x] Keep image progress visible until an image or terminal error arrives
- [x] Test Time Machine with real generated images, real hosted speech, immediate mute, and Mira/compass story continuity
- [x] Test microphone-event submission and phone/tablet/desktop controls without horizontal overflow
- [ ] Physical microphone and Safari/Firefox verification: requires actual devices; automated check used simulated recognition events
- [ ] Signed-in history restoration: external unmanaged authentication prevents an authenticated end-to-end check

- [x] Import archived instruction library as community rooms with V1..Vn version accordions (1,044 rooms, verbatim-verified)
- [x] PikaStory Vision GPT picture: brand-free artwork added and verified live

# Five humanitarian bots (Oct 17)
- [x] Complete creator uploaded avatars, public voice persistence and proportionate ethics review; repair blocked voice selector.
- [x] Author five detailed A–J humanitarian instruction sets and submit through CUSTOM GPT MAKER.
- [x] Verify all ten avatars, header selection, exact instruction hashes, real replies and individual branded PDFs; ten tests pass, no page errors, build OK.
- [ ] Confirm latest frontend deployment on aiwebtools.app: publishing requested; live bots are visible, but the new PDF buttons had not reached the live domain during the check.
- [x] Add five additional detailed humanitarian bots through the maker; all ten ethics-approved with uploaded avatars and selected voices.
- [x] Add compact, muted existing-video introductions over bot chats, once per bot per device, with X and shared cooldown; desktop/phone closing and reload persistence verified.

# Chatbot completion roadmap

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

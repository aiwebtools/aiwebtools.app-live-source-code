# Architecture Rules
- Subdirectories may have their own `AGENTS.md`; read it before changing files there.
- Queue deferred mounts cancellably with lazy fallbacks to prevent loading gaps.
- Share companion links across device menus to keep destinations consistent.
- Use subject metadata, not themes; lazy-load unpublished survival brains only in the existing builder.

- Keep the temporary access gate unlock in React memory only and render its own Matrix backdrop; reloads must ask again and loader cleanup must not remove its background.

- Schedule automatic promotional dialogs through the shared session-wide scheduler so navigation and competing pop-ups cannot bypass the cooldown.

- Reuse `DownloadLibraryButton` for library entry points and the shared PDF resolver for separate archived/authored community manifests; this prevents divergent downloads.
- Resolve hosted chatbot speech through `getGptVoiceProfile`; this keeps character-inspired voices consistent without cloning real people.
- Play hosted-bot speech sequentially through the shared speech reader, preserving complete replies and surfacing failures instead of silently switching to browser voices.
- Unlock hosted speech during message submission and explicit voice enabling, before network waits, so gesture-restricted browsers can auto-read replies.
- Share one-utterance microphone input across bot surfaces and pause speaker audio while listening to prevent feedback into the conversation.
- Render hosted bot rooms through `BotStudio` in both embedded and full-page placements so voice, streaming, downloads, branding and guest history cannot diverge.
- Keep studio drawers above embedded dialogs and close their parent dialog before route changes; phone bot switching must never remain hidden behind the previous room.
- Apply offscreen paint containment only to individual tool cards, never all nested grids; homepage sections and studio controls must stay visible across browsers.
- Store device conversations separately by bot and thread, with dedicated `/app/:slug/chat/:threadId` URLs so reloads restore the exact conversation.
- Keep studio image download/revision actions in `StudioImageActions` and route revisions through the existing conversation so generated visuals retain story context.
- Parse documents in the ES worker/PDF.js and send validated resized photos through existing transport; retain bounded context and reject unsupported binaries.
- Visitor community GPTs publish via publish-community-gpt (ethics review); the archived library imports verbatim via secret-gated upsert-only seed-community-library. Variants are `<base>-vN` rooms grouped by `botFamilyKey`; page catalog reads by 1000.
- Device-only custom bots use custom- slugs and send their own instructions to run-gpt-app; they are never stored server-side or in conversation history.
- Share chat/sidebar portrait lookup; lazy-load remote art over a local subject fallback to prevent blanks and image-request floods.
- Read live community GPTs through `communityBots.ts`; use the shared identity map for public names/missing art, preserving slugs, prompts and existing media.
- Resolve exactly one studio starter through `getBotStarters`, with purpose overrides, version-family reuse and name-based fallbacks instead of raw taglines; this keeps imported instructions out of compact starters without changing any brain.
- Keep reply celebrations in a bounded local canvas/audio helper with explicit mute and reduced-motion support so effects never add AI costs or block replies.
- Close the bot drawer before opening the builder; reuse saved drafts on review retries to prevent duplicates. Persist chosen voice and validated uploaded avatar through publication so public and device identities match.

- Unlock generated-audio contexts from the initiating click and reuse decoded clips for replay; homepage audio controls must never regenerate on replay.
- Generate sound effects server-side through the linked ElevenLabs account, preserving provider errors and keeping its key out of the browser.
- Build web workers as ES modules (`worker.format: "es"`); the attachment worker code-splits and IIFE workers fail the build.
- Log every bot failure (gateway, search, image, attachment, analysis, dropped stream) to gpt_chat_logs with a distinct status, including browser-side reports, so chat-watchdog alerts on all of them; show search failure once per reply and keep notices out of speech.
- Record visits, clicks and bot opens only through `siteTracker` (batched rows with identical keys into `site_events`); one tracker keeps data consistent and off the click path.
- Pre-mount large header menus during idle (forceMount + hidden when closed) so the first tap only reveals them.
- Community apps are listed from `community_apps` and only inserted by the AI-reviewing `submit-community-app` function; keeps unverified links out of the menu.
- Keep personal keys in owner-bound page memory and authenticated chat requests, never storage/tracking/logs; explicit activation cannot silently fall back to paid default AI.

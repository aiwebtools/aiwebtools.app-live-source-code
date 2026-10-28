# Architecture Rules
- Prioritize literal/normalized names after merging live and static search results; share bounded spelling helpers across UI searches and keep global catalog scoring off-thread so recommendations cannot bury an exact tool.
- Resolve existing active-bot intro recordings through website asset pointers before invoking Supabase; preserves voices in clones without regenerating audio, while private chat pictures stay in access-controlled storage.
- Resolve verified compressed community portraits through `migratedBotMedia` in both live catalogs, retaining byte-identical originals as backups; exact source matching preserves new uploads and reduces picture transfer size.
- Subdirectories may have their own `AGENTS.md`; read it before changing files there.
- Queue deferred mounts cancellably with lazy fallbacks to prevent loading gaps.
- Share companion links across device menus to keep destinations consistent.
- Use subject metadata, not themes; lazy-load unpublished survival brains only in the existing builder.

- Keep the temporary access gate unlock in React memory only and render its own Matrix backdrop; reloads must ask again and loader cleanup must not remove its background.
- Play gate narration and effects from one cached website audio clip on the unlock gesture; synchronized replay must not regenerate speech or use browser voices.

- Schedule automatic promotional dialogs through the shared session-wide scheduler so navigation and competing pop-ups cannot bypass the cooldown.

- Reuse `DownloadLibraryButton` for library entry points and the shared PDF resolver for separate archived/authored community manifests; this prevents divergent downloads.
- Resolve hosted chatbot speech through `getGptVoiceProfile`; this keeps character-inspired voices consistent without cloning real people.
- Serialize hosted and device response speech through the same completion-aware queue; cancel welcome/waiting voices and stale audio before replies so fallback cannot overlap or lose sentences, and surface studio failures.
- Keep optional voice playback isolated from text delivery and capability-check both device speech APIs; missing phone voices must never truncate displayed or saved replies.
- Unlock hosted speech during message submission and explicit voice enabling, before network waits, so gesture-restricted browsers can auto-read replies.
- Share one-utterance microphone input across bot surfaces and pause speaker audio while listening to prevent feedback into the conversation.
- Render hosted bot rooms through `BotStudio` in both embedded and full-page placements so voice, streaming, downloads, branding and guest history cannot diverge.
- Keep studio drawers above embedded dialogs and close their parent dialog before route changes; phone bot switching must never remain hidden behind the previous room.
- Apply offscreen paint containment only to individual tool cards, never all nested grids; homepage sections and studio controls must stay visible across browsers.
- Store device conversations separately by bot and thread, with dedicated `/app/:slug/chat/:threadId` URLs so reloads restore the exact conversation.
- Carry actual routed model and normalized provider usage in stream metadata and device history; aggregate tool rounds, never infer billable tokens from text or cover chat controls.
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
- Select builder-paid chat transport server-side behind the existing tool loop, retaining personal-provider precedence and separate image/search/speech services; persist outage/credit/denial states shared with the watchdog so authorized fallback never bypasses refusals or exposes credentials.
- Run background helper text jobs (Care Bot, weekly digest, community-app review) through `_shared/glm-helper.ts` first, keeping their existing Lovable AI call as fallback; search tool matching and ethics review stay on gateway models for speed/strictness.
- Let YouTube select playback quality automatically in every player; forced HD and background pause/play loops cause buffering and competing-video interruptions.

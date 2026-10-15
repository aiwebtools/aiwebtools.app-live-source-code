# Architecture Rules
- Keep deferred section mounts in one cancellable priority queue and retain their loading fallback through lazy imports; this prevents simultaneous scroll-time commits and empty loading gaps.

- Keep the temporary access gate unlock in React memory only and render its own Matrix backdrop; reloads must ask again and loader cleanup must not remove its background.

- Schedule automatic promotional dialogs through the shared session-wide scheduler so navigation and competing pop-ups cannot bypass the cooldown.

- Reuse `DownloadLibraryButton` for site-wide operational-instruction entry points so every placement opens the same maintained download center.
- Resolve hosted chatbot speech through `getGptVoiceProfile`; this keeps character-inspired voices consistent without cloning real people.
- Play hosted-bot speech sequentially through the shared speech reader, preserving complete replies and surfacing failures instead of silently switching to browser voices.
- Share one-utterance microphone input across bot surfaces and pause speaker audio while listening to prevent feedback into the conversation.
- Render hosted bot rooms through `BotStudio` in both embedded and full-page placements so voice, streaming, downloads, branding and guest history cannot diverge.
- Keep studio drawers above embedded dialogs and close their parent dialog before route changes; phone bot switching must never remain hidden behind the previous room.
- Apply offscreen paint containment only to individual tool cards, never all nested grids; homepage sections and studio controls must stay visible across browsers.
- Store device conversations separately by bot and thread, with dedicated `/app/:slug/chat/:threadId` URLs so reloads restore the exact conversation.
- Validate models server-side and default to the cheapest allowed; append execution/persona guidance via instruction-fidelity without rewriting per-bot verbatim prompts.
- Keep studio image download/revision actions in `StudioImageActions` and route revisions through the existing conversation so generated visuals retain story context.
- Parse text, DOCX and XLSX in a browser worker, extract PDF text with PDF.js, and send resized photo previews as validated image parts through the existing model transport; preserve bounded attachment context in device chats and explicitly reject unsupported binaries to avoid misleading analysis and excessive payloads.
- Publish community GPTs only through the publish-community-gpt function, which runs an AI ethics review before inserting into gpt_apps/gpt_app_prompts with a community- slug, so public bots reuse the same studio, routing and runtime as official bots.
- Device-only custom bots use custom- slugs and send their own instructions to run-gpt-app; they are never stored server-side or in conversation history.
- Resolve chat and selectable sidebar avatars through the same BotStudio lookup: per-slug portrait, bot/community image, tool hero image by title/name, then theme emblem image; this keeps bot identities consistent without replacing tool media.
- Preserve terminal upstream SSE error events and final unterminated frames in hosted chat transport so failures cannot silently become empty replies.
- Surface community GPTs in search and directories through `src/utils/communityBots.ts` (live `gpt_apps` rows with community- slugs, linking to `/app/<slug>`), so newly approved bots appear without rebuilding the static search catalog.
- Resolve studio starter questions through `getBotStarters`, preserving operational instructions and using subject-based fallbacks for newly created bots so all room placements share relevant starters.
- Keep reply celebrations in a bounded local canvas/audio helper with explicit mute and reduced-motion support so effects never add AI costs or block replies.
- Close the mobile bot drawer before opening the builder and show submit validation explicitly; reuse saved drafts on review retries so failed publishing cannot create duplicate device bots.

- Unlock generated-audio contexts from the initiating click and reuse decoded clips for replay; homepage audio controls must never regenerate on replay.
- Generate sound effects server-side through the linked ElevenLabs account, preserving provider errors and keeping its key out of the browser.
- Select first-turn web research when the request or operational instructions require it and expose failed retrieval as a failed activity; never substitute encyclopedia results or model knowledge as successful live web research.
- Build web workers as ES modules (`worker.format: "es"`); the attachment worker code-splits and IIFE workers fail the build.
- Log every bot failure (gateway, search, image, attachment, analysis, dropped stream) to gpt_chat_logs with a distinct status, including browser-side reports, so chat-watchdog alerts on all of them; show search failure once per reply and keep notices out of speech.

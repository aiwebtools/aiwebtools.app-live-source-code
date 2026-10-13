# Architecture Rules
- Keep deferred section mounts in one cancellable priority queue and retain their loading fallback through lazy imports; this prevents simultaneous scroll-time commits and empty loading gaps.

- Keep the temporary access gate unlock in React memory only and render its own Matrix backdrop; reloads must ask again and loader cleanup must not remove its background.

- Schedule automatic promotional dialogs through the shared session-wide scheduler so navigation and competing pop-ups cannot bypass the cooldown.

- Reuse `DownloadLibraryButton` for site-wide operational-instruction entry points so every placement opens the same maintained download center.
- Resolve hosted chatbot speech through `getGptVoiceProfile`; this keeps character-inspired voices consistent without cloning real people.
- Play hosted-bot speech sequentially through the shared speech reader, preserving complete replies and surfacing failures instead of silently switching to browser voices.
- Share one-utterance microphone input across bot surfaces and pause speaker audio while listening to prevent feedback into the conversation.
- Render hosted bot rooms through `BotStudio` in both embedded and full-page placements so voice, streaming, downloads, branding and guest history cannot diverge.
- Store device conversations separately by bot and thread, with dedicated `/app/:slug/chat/:threadId` URLs so reloads restore the exact conversation.
- Validate runtime model choices against a server-side allowlist and default every bot to the cheapest allowed model; instructions stay per-bot so engine changes never alter persona.
- Keep studio image download/revision actions in `StudioImageActions` and route revisions through the existing conversation so generated visuals retain story context.
- Attach small text/CSV/JSON excerpts through the existing message transport; do not advertise unsupported binary-file analysis.
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

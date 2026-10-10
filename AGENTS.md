# Architecture Rules

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
- Resolve bot chat avatars in BotStudio as per-slug portrait (`botAvatars.ts`, files in `src/assets/bot-avatars/<slug>.jpg`), then tool hero image by title/name, then theme emblem image, so named figures keep a matching portrait without replacing tool media.
- Surface community GPTs in search and directories through `src/utils/communityBots.ts` (live `gpt_apps` rows with community- slugs, linking to `/app/<slug>`), so newly approved bots appear without rebuilding the static search catalog.
- Resolve studio starter questions through `getBotStarters`, preserving operational instructions and using subject-based fallbacks for newly created bots so all room placements share relevant starters.

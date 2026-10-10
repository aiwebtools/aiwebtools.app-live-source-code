# Architecture Rules

- Reuse `DownloadLibraryButton` for site-wide operational-instruction entry points so every placement opens the same maintained download center.
- Resolve hosted chatbot speech through `getGptVoiceProfile`; this keeps character-inspired voices consistent without cloning real people.
- Play hosted-bot speech sequentially through the shared speech reader, preserving complete replies and surfacing failures instead of silently switching to browser voices.
- Share one-utterance microphone input across bot surfaces and pause speaker audio while listening to prevent feedback into the conversation.
- Render hosted bot rooms through `BotStudio` in both embedded and full-page placements so voice, streaming, downloads, branding and guest history cannot diverge.
- Store device conversations separately by bot and thread, with dedicated `/app/:slug/chat/:threadId` URLs so reloads restore the exact conversation.
- Validate runtime model choices against a server-side allowlist while preserving each bot's configured model by default, so changing engines cannot change its instructions.
- Keep studio image download/revision actions in `StudioImageActions` and route revisions through the existing conversation so generated visuals retain story context.
- Attach small text/CSV/JSON excerpts through the existing message transport; do not advertise unsupported binary-file analysis.

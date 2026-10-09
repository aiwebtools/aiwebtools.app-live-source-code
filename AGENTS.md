# Architecture Rules

- Reuse `DownloadLibraryButton` for site-wide operational-instruction entry points so every placement opens the same maintained download center.
- Resolve hosted chatbot speech through `getGptVoiceProfile`; this keeps character-inspired voices consistent without cloning real people.
- Play hosted-bot speech sequentially through the shared speech reader, preserving complete replies and surfacing failures instead of silently switching to browser voices.
# Bot research and larger data attachments
1. Make first replies use web search when the request or bot instructions require current research; show source links and honest search errors.
2. Accept text, Markdown, CSV, TSV and JSON data files up to 10 MB. Compute CSV statistics across every row and include clearly identified representative excerpts, without sending megabytes repeatedly or changing original documents.
3. Keep attachments separate from the typing box, retain their analysis context in saved chats, and test a real 3 MB upload and first-turn web research on phone and desktop.

## Technical details
Use a browser worker for parsing and summaries, bounded attachment context in the existing chat transport, and retain the current inexpensive model choices, voice, image generation and per-bot instructions.
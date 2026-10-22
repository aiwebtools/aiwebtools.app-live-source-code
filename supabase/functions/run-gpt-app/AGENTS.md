# run-gpt-app rules
- Validate models server-side; resolve official prompts from the server-only full-document manifest, append execution/persona guidance separately, and preserve community/device prompts; this prevents summaries or seed truncation replacing authored brains.
- Keep response-review enhancements in the existing scoped supplement registry; distinguish photo analysis from generation so creative images never become diagnostic evidence.
- Decode binary Gemini archive instruction fields server-side; keep original containers intact so serialization bytes cannot pollute bot prompts.
- Preserve terminal upstream SSE error events and final unterminated frames in hosted chat transport so failures cannot silently become empty replies.
- Select first-turn web research when the request or operational instructions require it and expose failed retrieval as a failed activity; never substitute encyclopedia results or model knowledge as successful live web research.
- Retry the primary Perplexity search once before falling back to scrapers, and log each source's failure reason to gpt_chat_logs only; the Oct 13–15 2026 outage showed transient gateway failures otherwise cost chats their research.
- Isolate personal-provider SDK translation behind the shared tool/stream loop; allowlist direct IDs/endpoints, require verified sign-in, omit raw SDK errors from logs, and preserve explicit activation precedence.
- Route builder-owned chat through the server-only Bionic adapter with server-selected economy/advanced models and the existing tool loop; retain separate image/search services and never silently substitute paid providers on failure.

# Roadmap

- [x] Move existing community bot pictures to Lovable Assets without changing their appearance (847 byte-identical copies verified)
- [ ] Verify migrated pictures throughout the app, then remove only verified Supabase copies (cleanup blocked by expired Supabase management connection)
- [ ] Confirm storage is safely under 1 GB and report remaining downgrade limits

- [x] Diagnose hamburger bot search failure: live catalog returns HTTP 402 hosting quota restriction
- [x] Add accurate service-unavailable message and working retry to shared header bot directory
- [x] Restore live bot search: paid upgrade restored live directory access; 1,542 active bots readable

- [x] Fix Custom GPT Maker bot: hosted `custom-` slugs now resolve server-side prompts (live-verified)
- [x] GPT Maker opens faster: survival draft artwork lazy-loads only when the picker opens
- [x] Category picker added to GPT Maker; publish-community-gpt stores the chosen subject
- [x] 25 survival draft bots published via secret-gated owner importer (verified 25 active + prompt hashes match)
- [x] Ethics review falls back to GLM when Lovable credits are out
- [x] TTS fallback: free device voice reads the remainder when the lifelike engine fails (tested)
- [x] GLM lag reviewed: streaming and thinking indicator already live; lag is provider-side, no model change
- [x] Recent bot responses reviewed in gpt_chat_logs (62 ok / 12 failures in 48h; image-credit and pre-fix errors only)

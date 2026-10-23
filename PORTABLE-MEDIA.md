# Saved bot media in clones

Existing public bot portraits and 362 active-bot welcome recordings are hosted as website assets. Recordings are byte-identical to their Supabase copies. Those originals were not deleted. Saved recordings load directly from `https://aiwebtools.app` without a Supabase request or a new ElevenLabs charge.

These are online CDN assets, not offline audio/image bytes embedded in a source ZIP. The source includes asset pointer files. Keep the website-hosted assets available for clones that reference them. A clone with no network connection cannot retrieve them. No free-hosting quota or permanent availability guarantee has been verified.

New recordings not in the saved asset set still use the existing Supabase voice function, with device voice fallback. Copying media does not provide AI chat, new image generation, new lifelike speech, user accounts, or private saved conversations without configured services.

Private generated chat pictures remain in the private Supabase `gpt-images` bucket. They are deliberately not published as website assets or included in public clones. Public generated bot portraits already resolve through the migrated/compressed picture assets.

Verification: 362 copied recordings (113,886,296 bytes), every CDN copy checked against its original SHA-256; Time Machine's saved recording loaded and played with all Supabase requests blocked; seven media and commercial unit tests passed.
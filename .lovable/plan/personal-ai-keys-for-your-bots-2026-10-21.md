# Personal AI keys for your bots

## Already completed
- Each bot now displays one compact **STARTER PROMPT**, with simple purpose-based wording rather than operational descriptions. Book Writer invites a full chapter book from beginning to end.
- Chat reply text is smaller and readable on phones and computers.
- Added and deployed shared imaginative-delivery guidance without rewriting original directions. Real Aether replies were tested: storytelling improved, but a follow-up still included extra framing, so this is not a guarantee that all repeated cautions disappear.
- Eighteen tests passed; phone/computer screenshots checked, no browser errors. The starter/text changes are currently in the preview, not published.

## Build next, subject to approval
1. Add **Use your own AI key** to the existing chat settings, with separate OpenAI, Gemini, Claude and DeepSeek choices.
2. Place the official key-acquisition link beneath each key field, plus a clear **USE THIS API KEY FOR BOTS** action, validation status and a **Use default AI** action.
3. Require sign-in for personal-key requests. Keep keys only in memory during the active page session; re-enter after reload. Never save them in chats, browser storage, analytics or logs. An encrypted persistent key vault would be a separate approved change.
4. Send personal-key text requests directly to the chosen provider through the existing secure bot service. Preserve the original bot brains, full conversation history, attachments and streaming; translate provider-specific tool calls rather than merely swapping URLs.
5. Keep the current Lovable default and existing model choices unchanged when no personal key is active. Do not silently fall back after provider failures or exhausted credits; display the problem and let the visitor choose a fresh action.
6. Show which services still use the site's account: existing speech, generated images, web research and hosting remain separate. Personal keys bypass Lovable **text-model** charges, not all operating costs.
7. Test key activation, rejected keys, clearing keys, provider streaming, history/tool follow-up and privacy protections. Full paid-provider verification needs valid authorized test credentials; do not declare an untested provider ready.

## Is a completely free local fallback possible?
An open-source model can run on a visitor's computer using LM Studio or similar software without per-message provider charges. It still needs downloaded model files, adequate hardware, electricity and setup. This website cannot install and run a persistent local model on Lovable hosting, and the hosted service cannot reach a visitor's computer's localhost.

A genuinely local bot experience needs a separate browser/local integration or desktop companion, including a strategy for original bot instructions, security, browser connection restrictions, model downloads and tool compatibility. Small browser models are hardware/browser dependent and may not meet the quality or tools of these bots. We will not add an unreliable automatic switch or promise zero-cost hosted inference. The existing LM Studio downloads remain available.

## Technical approach
- Reuse `BotStudio` and `run-gpt-app`; isolate provider adapters and validation in server-only modules.
- Allowlist provider endpoints and supported direct-provider model IDs; preserve the current gateway routing/model selection outside personal-key calls.
- Use SDK provider primitives for new provider integrations, normalize the existing stream contract and retain explicit Stop behavior.
- Enforce authenticated ownership, bounded input validation and credential redaction; key-check errors must never echo credentials.
- No new bot database, duplicate chat system, tool deletions, source-prompt rewrites or automatic paid connections.

## Approval
Approve this personal-key addition before changing the bot providers and sign-in requirements. Local inference remains a separate future design rather than a claimed free automatic fallback.
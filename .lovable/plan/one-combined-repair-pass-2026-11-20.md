# One combined repair pass

## Scope
Complete all 12 requested repairs together, preserve every tool and authored bot instruction, then verify at **1919px desktop** and mobile. Master publishes afterward; this pass will not publish.

## Changes
1. **Ask-once gate:** restore the 1111 screen with an unlock check before rendering on every route. Save unlock in localStorage and sessionStorage backup, preserve deep links, and never reopen it during navigation, reload or browser history. Do not restore an automatic music opener.
2. **Wide embedded studio:** remove the tool-page width restriction around chat. Target a 1500–1600px desktop studio with a 700–900px chat column, readable word wrapping, separate instruction controls and collision-free composer buttons; retain compact phone drawers.
3. **Free audio:** retain working hosted voices, add credit-independent local speech/audio generation and synthesized sound fallbacks, and offer correctly named playable WAV/MP3 downloads. Browser speech alone cannot be exported as audio, so downloadable fallback speech needs a local synthesis engine rather than a silent or fake recording. Describe local sounds honestly as synthesized, not paid-provider AI output.
4. **Category integrity:** canonicalize writing/content aliases in the existing shared filter/count system; verify each alias against actual catalog membership, including nonzero writing results, without inventing totals.
5. **Browse All:** reproduce the reported failure and ensure name/description search drives cards and counts, zero matches stay empty, and clearing restores results.
6. **PDF and Word:** keep reply exports unobstructed and verify actual PDF and DOCX files from embedded chat, including phone download handling.
7. **Honest ratings:** use the same real community-review collection for header and review summary. Show unrated/zero reviews when none exist; remove fabricated vote totals and contradictory claims.
8. **Recognizable screenplay bots:** show one featured Movie Script Writer with clearly labelled preserved versions beneath it. Inspect similarly named bots before grouping; retain genuinely distinct playwriting helpers and all original rooms, with clear purpose labels.
9. **Literal scene requests:** add execution safeguards separately from original instructions: no unsolicited offers, downloads or compilations; when one page/scene/location is requested, remain within it and do not introduce a second scene after CUT TO. Validate real generated replies, not only instruction strings. Exact printed page length depends on export formatting, so use the screenplay export's defined page layout for page-limit checks.
10. **Allowance and disclosure:** current code has no daily cap. Configure and enforce **10 site-funded free runs per day**, use one shared limit for the notice and enforcement, and disclose the real configured Bionic model plus any actual fallback. Do not falsely label in-site output ChatGPT or promise unrestricted official ChatGPT use—OpenAI subscription limits still apply.
11. **Header-safe studio:** give studio anchors and official-version/feedback controls correct clearance, and verify scrolling from top to bottom on both sizes.
12. **Device-local history:** label it explicitly, add confirmation before clearing, delete only this app's local chat records, and refresh the visible list without affecting cloud data or saved custom bot definitions.

## Verification
- Reproduce relevant defects on the published site, then exercise the repaired preview; existing live content remains unchanged until Master publishes.
- Test gate unlock/reload/deep links/back-forward and storage fallback, writing aliases/counts, search/clear/empty state, limit enforcement, review summaries and history clearing.
- Drive embedded chat at 1919px and mobile: send real single-scene prompts, inspect reply width, scroll through controls, download PDF/DOCX and inspect file signatures/content.
- Force paid-audio failure and confirm local speech/sound playback and valid audio downloads; distinguish actual playback checks from physical-speaker audibility.
- Run focused regressions, inspect screenshots and current errors, save the combined changes and report each item with any remaining limitation.

## Technical approach
Reuse the existing router, BotStudio, review storage, export helpers, provider transport, category filters and usage tables. Do not introduce duplicate systems. Check storage/security conventions before altering usage enforcement. Use one comprehensive brief per collaborating agent, with non-overlapping ownership, rather than repeated small requests; token savings depend on actual context and work, not prompt length alone.
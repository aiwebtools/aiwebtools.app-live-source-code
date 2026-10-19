# Remaining Work Plan

## 1. Finish the 25 Apocalypse Survival & Nature drafts
- Correct the nine bots whose test replies had math errors or unsupported assumptions: Medical Device Outage Planner, Service Animal Emergency Companion, Wild Fiber Cordage Workshop, Emergency Clothing Repair, Human Powered Logistics, Offline Field Map Tutor, Trail Turnaround Decision, Native Habitat Recovery, Community Resource Fairness Dispatcher.
- Tighten their instructions: show calculations step by step, label user facts vs. estimates, and ask before assuming missing inputs.
- Re-run the live reply test for all 25 bots and review every reply against the safety rules: no edibility certification, no invented hazards or shelters, no weapons.
- Rebuild the PDFs for any changed instructions.
- Browser checks on phone, tablet and desktop: select a draft, open its PDF, search, avatar, a real conversation, and keyboard switching.

## 2. Publish within the daily limit
- Check today's remaining community publication allowance before submitting.
- Publish up to 10 approved drafts per day through the existing ethics review. No bypass.
- Leave the rest as ready drafts and give Master the list of what's still waiting. Publishing all 25 takes 3 days.
- After each one is published, confirm it shows under Apocalypse Survival & Nature, appears in site search, and has matching artwork.

## 3. Build the "Off Grid Living for Sale" real-estate site (separate from the bots)
- Public landing page for buyers age 50+ who care about wellness. U.S. first, with Costa Rica and Panama marked "coming later."
- Honest empty state: "No verified listings yet." A buyer inquiry form takes visitors from there.
- A seller listing submission form. Submissions are saved privately for review and never shown publicly until verified.
- Broker contact block uses the placeholders already given, labeled as placeholders: Harmon, harmon@aiwebtools.ai, +1 800-555-0199. These won't be asked for again.
- Branded artwork and logo, sharing previews, SEO tags, and a privacy notice. No invented property facts, prices or locations.
- Publish it and give Master the live link.

## 4. Wrap-up checks
- Make sure the site builds cleanly with zero console errors and no tools are lost (tool count check).
- Run the analytics scan and report findings.
- Update the roadmap with anything still waiting and what it's blocked on.

## Open question for Master
- Should the real-estate site be a new page on this site (for example /off-grid-for-sale) or a separate standalone project with its own address? The default is a page on this site, so it can launch sooner.

## Technical details
- Draft fixes go to `scripts/data/survival-expansion.json`. Regenerate instruction JSON and PDFs with the existing author and PDF scripts, and keep `scripts/survival-expansion.test.ts` passing.
- Real-estate inquiries and seller submissions go in new Lovable Cloud tables, separate from the bot tables. Public users can insert only; admins can read.

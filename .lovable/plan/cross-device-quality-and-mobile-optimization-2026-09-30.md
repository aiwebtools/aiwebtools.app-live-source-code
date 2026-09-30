# Cross-device quality and mobile optimization

## Goal
Verify the complete public experience on phones, tablets, and desktops, then repair only confirmed usability, speed, or compatibility problems.

## Checks
- Exercise the homepage, Matrix opening, search, featured tools, menus, category navigation, pinned music player, downloads, Care Bot, and representative chatbot rooms.
- Test phone, tablet, and desktop sizes for horizontal overflow, blocked controls, readable text, touch targets, fixed overlays, and stable layouts.
- Verify tailored voice selection, Play/Stop/Mute behavior, generated MP3 responses, and graceful fallback when speech generation fails.
- Check important links, tool destinations, download files, browser errors, failed requests, and loading responsiveness.

## Fixes and verification
- Correct only defects found during testing while preserving every tool, image, video, URL, search record, and existing feature.
- Keep mobile effects lightweight and preserve reduced-motion behavior.
- Re-run focused checks after fixes, confirm a clean build, and publish the verified update.

## Technical notes
- Automated Playwright checks will cover 390×844 phone, 768×1024 tablet, and 1280×1800 desktop layouts.
- Existing design components and the maintained download center remain authoritative; no database restructuring is planned.

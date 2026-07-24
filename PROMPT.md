# Master Prompt for Codex — Meet & Pooja Interactive Wedding Invitation

You are the lead frontend and full-stack engineer responsible for completing and polishing this existing web-based E-Kankotri project.

Read `WORKFLOW.md` completely before editing any file. Treat it as binding project instructions. Then inspect the repository, run the baseline checks, and work through the phases in order.

## Primary goal

Create a premium, mobile-first, scrollable wedding invitation for **Pooja and Meet**, inspired by a cinematic online invitation experience. The site must feel elegant, emotional, culturally appropriate, smooth on mobile devices, and easy for non-technical family members and guests to use.

This is a real website, not a video embedded as the whole invitation. Only the opening ribbon transition is pre-rendered video. The invitation content after the opening must remain semantic, responsive HTML/React content.

## Existing project context

The repository currently uses:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4 plus custom CSS
- `vinext` and Vite
- Cloudflare-compatible project scaffolding
- App Router files under `app/`

Important existing assets include:

- `/public/invitation-cover-v2.png`
- `/public/narayani-heights-venue.png`
- `/public/og.png`
- `/public/ribbon-opening.mp4` — may be absent until supplied by the user

Do not migrate the framework or replace the build system unless the existing stack is genuinely broken and a migration is explicitly approved by the user.

## Non-negotiable opening-transition rule

The ribbon/fabric opening must be handled by a **pre-rendered realistic video** located at:

`public/ribbon-opening.mp4`

Do **not** attempt to create realistic fabric using CSS, SVG, DOM panels, `clip-path`, GSAP, canvas, or Three.js. Those techniques may be used for subtle interface motion after the opening, but not as a substitute for the real ribbon video.

The website must:

1. Show a clear `Open Invitation` button.
2. Start the video only after the user taps/clicks, so audio playback is allowed.
3. Use `playsInline` for iPhone and Android.
4. Lock page scrolling until the opening finishes or is skipped.
5. Display a `Skip opening` control during playback.
6. Fade seamlessly from the final video frame to the real website cover underneath.
7. Fall back to a simple crossfade if the video is missing, fails to load, or cannot play.
8. Respect `prefers-reduced-motion` by skipping the transition.
9. Avoid showing native video controls.
10. Never add a second envelope, ribbon, curtain, card-door, or panel-opening transition after the video.

The final frame of `ribbon-opening.mp4` should visually match `/public/invitation-cover-v2.png`. Implement the handoff so there is no white flash, black frame, scale jump, layout shift, or visible mismatch.

## Wedding content rules

Use the existing repository content as the working source of truth unless the user gives updated details. Do not invent missing dates, times, venues, family names, contact numbers, accommodation details, or RSVP rules.

Currently established content:

- Couple: **Pooja & Meet**
- Bride's parents: **Mrs. Dharmishtha and Mr. Ketan Modi**
- Wedding celebrations: **18–20 September 2026**
- Ganesh Sthapan, Mandap Muhurat and Grah Shanti: **Friday, 18 September 2026**
- Mehendi: **Friday, 18 September 2026**
- Mehendi address currently available: **B.1302, Tremont, Vaishnodevi Circle, Ahmedabad**
- Ring Ceremony: **Saturday, 19 September 2026 at 09:30 AM**
- Haldi: **Saturday, 19 September 2026 at 11:00 AM; lunch at 12:30 PM**
- Mameru: **Saturday, 19 September 2026 at 03:00 PM**
- Sangeet: **Saturday, 19 September 2026 at 07:30 PM**
- Narayani Heights address currently available: **Narayani Heights, Airport-Gandhinagar Road, Bhat, Ahmedabad**
- Main wedding date: **Sunday, 20 September 2026**

Details that must remain marked as pending unless confirmed by the user:

- Exact Ganesh Sthapan/Mandap Muhurat/Grah Shanti time and venue
- Exact Mehendi time
- Confirmed Mameru venue
- Confirmed Sangeet venue
- Main wedding ceremony time and confirmed venue
- Groom's parents/family wording
- RSVP contact details and guest-count policy
- Accommodation, transport, dress code, gifts, and Gujarati translations

If the current code contains assumptions for any pending detail, isolate them in one typed data file and visibly label them `pendingConfirmation: true`. Do not present an unconfirmed statement as verified fact.

## Product requirements

Build and polish the following experience:

### 1. Opening gate

- Elegant loading/fallback state
- Invitation cover poster
- `Open Invitation` button
- Realistic video opening
- Skip control
- Accessible status text
- Seamless handoff to the hero

### 2. Hero section

- Pooja and Meet names
- Celebration dates
- Venue summary only when verified
- Strong mobile visual hierarchy
- Scroll cue
- Optional persistent music control only when a licensed audio file is supplied

### 3. Invitation message

- Family invitation wording
- Cultural blessing area, such as `|| श्री गणेशाय नमः ||`, when included in supplied content
- Elegant but readable typography
- No essential wording embedded only inside an image

### 4. Countdown

- Countdown to a single verified event datetime
- India timezone (`Asia/Kolkata`, UTC+05:30)
- No negative values
- After the target time, show an appropriate static celebration message
- Avoid hydration mismatch and timer memory leaks

### 5. Event schedule

- Data-driven event cards
- Date, time, venue, directions, dress code, notes, and calendar action when values exist
- Hide or label missing values rather than inventing them
- Use real links from the project where available
- External links must open safely

### 6. Venue section

- Narayani Heights visual section using supplied asset
- Readable address
- Directions button
- Do not embed a heavy map during initial load

### 7. Gallery or media section

- Add only when supplied images exist
- Responsive images and lazy loading
- No unlicensed stock imagery

### 8. RSVP

Implement only after the visual invitation is stable.

The initial RSVP version may be a clear demo if backend requirements are not supplied. A production RSVP must include:

- Server-side validation
- Data persistence
- Success/error states
- Duplicate/update strategy
- Exportable responses or an admin view
- Spam/rate-limit consideration
- Privacy-safe handling of names and phone numbers

Never pretend an RSVP is saved when it is only stored in local component state.

### 9. Sharing

- Use Web Share API when available
- Use a safe fallback when clipboard access is unavailable
- Correct Open Graph metadata and preview image
- Do not crash on insecure/local origins

### 10. Accessibility and resilience

- Keyboard-accessible controls
- Visible focus states
- Semantic headings and landmarks
- Sufficient contrast
- Reduced-motion support
- Useful alt text
- Large mobile tap targets
- Invitation remains usable if video, image, audio, sharing, or JavaScript enhancement fails

## Visual direction

Maintain an elegant premium wedding aesthetic:

- Ivory/paper background
- Sage, champagne, blush, and restrained metallic tones
- Editorial serif typography paired with a graceful script only for display text
- Generous spacing
- Subtle reveals and parallax only where performance remains smooth
- Indian wedding warmth without clutter
- No generic corporate cards or dashboard appearance in the guest-facing invitation

Do not copy copyrighted designs or stock preview watermarks. Use supplied/licensed/original assets only.

## Engineering standards

- Keep wedding content in a typed central data/config module rather than scattering strings across components.
- Split large UI into focused components when it improves readability.
- Avoid unnecessary dependencies.
- Do not rewrite working areas without a reason.
- Keep TypeScript strict and avoid `any`.
- Clean up timers, listeners, and media event handlers.
- Prevent body-scroll state from becoming stuck.
- Avoid hydration issues.
- Do not expose secrets to client code.
- Use image/video dimensions or aspect ratios to avoid layout shift.
- Optimise the opening video for web delivery and document its expected export settings.
- Preserve compatibility with the current hosting configuration.

## Required working method

1. Read `WORKFLOW.md`.
2. Inspect the repository and list the relevant files.
3. Run dependency installation if needed.
4. Run baseline `lint`, `build`, and tests before changes.
5. Record existing failures separately from newly introduced failures.
6. Make changes phase-by-phase, not as one uncontrolled rewrite.
7. Test after every meaningful phase.
8. Review the result at mobile widths of 320, 375, 390, and 430 CSS pixels, plus desktop.
9. Verify iPhone Safari and Android Chrome behavior conceptually and through available browser tooling.
10. At completion, provide:
   - concise summary of changes
   - files changed
   - commands run and their results
   - unresolved content placeholders
   - exact steps for the non-technical user to run the project
   - exact location and specification for `ribbon-opening.mp4`

## First task

Start by auditing the current repository against these requirements. Do not immediately redesign everything. Identify:

- whether `public/ribbon-opening.mp4` exists
- whether the opening video handoff is seamless
- whether any old CSS/DOM fake-fabric animation remains
- where wedding data is hardcoded or unverified
- current build/lint/test status
- mobile usability risks
- accessibility problems
- performance risks

Then implement the highest-priority fixes in the order defined in `WORKFLOW.md`.

# WORKFLOW.md — Codex Execution Guide for the Meet & Pooja E-Kankotri

This file defines how Codex must work on this repository. It is intended to prevent uncontrolled rewrites, invented wedding details, unrealistic CSS fabric, and regressions in the mobile invitation experience.

---

## 1. Project mission

Deliver a premium, reliable, mobile-first interactive wedding invitation for **Pooja and Meet**.

The user is non-technical. Every completed delivery must include exact beginner-friendly commands and steps. Never assume the user knows how to install dependencies, open a terminal, run a local server, or locate a file.

The public invitation must prioritise:

1. Smooth mobile experience
2. Correct wedding information
3. Realistic opening transition
4. Fast loading
5. Easy directions and sharing
6. Accessibility and failure recovery
7. Maintainable code

---

## 2. Repository and stack constraints

Current expected stack:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS plus custom global CSS
- `vinext`/Vite
- Cloudflare-compatible configuration

Expected core paths:

```text
app/
  layout.tsx
  page.tsx
  globals.css
public/
  invitation-cover-v2.png
  narayani-heights-venue.png
  og.png
  ribbon-opening.mp4        # supplied separately; may initially be missing
package.json
README.md
```

### Rules

- Do not migrate frameworks as a convenience.
- Do not replace `vinext` or Cloudflare scaffolding without evidence that it is broken and explicit user approval.
- Do not delete hosting, database, or test scaffolding merely because it is not yet used.
- Do not commit generated secrets or local environment files.
- Do not add a dependency when the platform or browser already provides the required feature.

---

## 3. Absolute animation rule

### Realistic fabric is video-rendered

The realistic ribbon opening must use:

```text
public/ribbon-opening.mp4
```

The website controls playback and handoff. It does not simulate satin physics.

### Forbidden replacements

Do not build the main fabric/ribbon opening using:

- CSS rectangles or gradients
- duplicated/clipped invitation images
- `clip-path` doors
- SVG bow pieces pretending to be realistic cloth
- GSAP DOM fabric
- canvas particles as cloth
- Three.js cloth simulation in production
- a second transition after the video

Subtle CSS/SVG/GSAP motion is allowed for petals, buttons, section reveals, and non-physical decorative effects.

### Required video behavior

- User gesture starts playback.
- `playsInline` is present.
- Native controls are hidden.
- The poster/underlay is the matching invitation cover.
- Page scroll is locked only while necessary.
- `Skip opening` is available.
- `ended`, `error`, play rejection, and reduced-motion states all lead to a usable invitation.
- Opening state cannot get stuck.
- Repeated taps do not start overlapping playback.
- The video overlay fades only when the real hero is ready underneath.
- No white, black, transparent, or poster flash at the handoff.

Recommended supplied video specification:

```text
Filename: ribbon-opening.mp4
Format: MP4
Codec: H.264
Aspect ratio: 9:16
Resolution: 1080x1920 master; optionally 720x1280 web alternative
Frame rate: 30 fps
Duration: 3–5 seconds
Audio: AAC when sound is part of the opening
Fast start / web optimised: enabled
Target size: approximately 2–6 MB where quality permits
Final frame: visually matched to invitation-cover-v2.png
```

---

## 4. Content governance

### Never invent wedding data

Keep wedding data in a central typed module, for example:

```text
app/data/invitation.ts
```

Suggested model:

```ts
type ConfirmationState = "confirmed" | "pending";

type WeddingEvent = {
  id: string;
  title: string;
  dateISO: string;
  displayDate: string;
  time?: string;
  venue?: string;
  address?: string;
  mapUrl?: string;
  dressCode?: string;
  note?: string;
  confirmation: ConfirmationState;
};
```

The UI must not silently convert missing data into romantic filler that looks like an actual event time or venue.

### Current working information

Use the repository's existing values unless the user provides corrections. The known project context includes:

- Pooja & Meet
- Mrs. Dharmishtha and Mr. Ketan Modi
- Celebration dates: 18–20 September 2026
- Ganesh Sthapan / Mandap Muhurat / Grah Shanti: 18 September
- Mehendi: 18 September
- Tremont address: B.1302, Tremont, Vaishnodevi Circle, Ahmedabad
- Ring Ceremony: 19 September, 09:30 AM
- Haldi: 19 September, 11:00 AM; lunch 12:30 PM
- Mameru: 19 September, 03:00 PM
- Sangeet: 19 September, 07:30 PM
- Narayani Heights address: Airport-Gandhinagar Road, Bhat, Ahmedabad
- Wedding date: 20 September 2026

### Pending confirmation

Do not mark these as confirmed without user input:

- Ganesh event time and venue
- Mehendi time
- Mameru venue
- Sangeet venue
- Main wedding time and venue
- Groom family wording
- RSVP contact and attendance rules
- Dress codes
- Accommodation/travel recommendations
- Gifts/registry wording
- Gujarati translation

At final delivery, list all pending values clearly.

---

## 5. Phase-based execution

Do not skip directly to visual polishing. Complete each phase and run checks before continuing.

### Phase 0 — Safety and baseline

1. Inspect `git status` if the repository is under Git.
2. Do not overwrite unrelated user changes.
3. List relevant source and asset files.
4. Read `package.json`, `README.md`, `app/page.tsx`, `app/globals.css`, and `app/layout.tsx`.
5. Check whether `public/ribbon-opening.mp4` exists and inspect its metadata when available.
6. Install dependencies using the repository's existing package manager/lockfile.
7. Run:

```bash
npm run lint
npm run build
npm test
```

If a command fails before edits, record it as a baseline issue. Do not hide failures.

**Phase 0 output:** short audit containing current failures, animation architecture, content assumptions, and highest risks.

### Phase 1 — Centralise content and state

1. Move wedding facts, links, dates, and venue values into one typed config module.
2. Add explicit pending/confirmed status for incomplete data.
3. Ensure countdown target is centralised and timezone-aware.
4. Replace scattered strings only after checking output parity.
5. Keep share metadata consistent with the data module where practical.

**Acceptance criteria:** no newly invented details; event list renders from typed data; TypeScript passes.

### Phase 2 — Opening transition reliability

1. Remove any old fake-fabric CSS/DOM animation that conflicts with the video.
2. Implement a small explicit opening state machine, such as:

```text
sealed -> loading -> playing -> finishing -> open
                    \-> failed -> open
                    \-> skipped -> open
```

3. Preload metadata/poster without auto-playing.
4. Handle play rejection, missing file, decode error, interruption, and skip.
5. Ensure body scroll and focus are restored in all exit paths.
6. Match object fit, aspect ratio, background, and scale between video and cover.
7. Avoid relying only on the `ended` event; include a safe fallback timeout based on known duration if useful.
8. Respect reduced motion.
9. Ensure the invitation is not permanently hidden from screen readers after opening.

**Acceptance criteria:** invitation opens under every success/failure path and no fake fabric remains.

### Phase 3 — Responsive invitation structure

1. Break the page into focused components when useful:

```text
components/
  InvitationGate.tsx
  HeroSection.tsx
  InvitationMessage.tsx
  VenueSection.tsx
  Countdown.tsx
  EventSchedule.tsx
  ShareInvitation.tsx
```

2. Preserve the premium visual direction.
3. Test 320, 375, 390, 430, 768, 1024, and 1440 pixel widths.
4. Avoid fixed-height text clipping.
5. Use `svh` carefully with fallbacks where needed.
6. Keep buttons reachable above mobile browser chrome.
7. Avoid horizontal overflow.

**Acceptance criteria:** all sections are readable and operable at 320px without overlap or horizontal scrolling.

### Phase 4 — Accessibility and interaction

1. Verify heading hierarchy.
2. Add visible focus states.
3. Ensure buttons have accurate accessible names.
4. Keep status announcements concise using `aria-live`.
5. Do not put essential text only in background images.
6. Verify reduced-motion behavior.
7. Ensure external links use safe `rel` values.
8. Ensure map/share failure does not block navigation.
9. Move focus appropriately after the opening when it materially improves keyboard access, without disrupting touch users.

**Acceptance criteria:** keyboard-only operation works and essential content remains available without video playback.

### Phase 5 — Performance and media

1. Measure the opening video size and dimensions.
2. Document compression recommendations when it exceeds targets.
3. Use posters and fixed aspect ratios to prevent layout shifts.
4. Lazy-load non-critical images.
5. Avoid loading gallery/video assets before needed.
6. Check for duplicate full-resolution images.
7. Avoid excessive blur/backdrop-filter usage on low-end phones.
8. Keep animation to transform/opacity where possible.

**Acceptance criteria:** opening becomes interactive quickly and scrolling remains smooth on a mid-range mobile device.

### Phase 6 — Sharing and metadata

1. Verify document title, description, canonical behavior where applicable, Open Graph image, and Twitter preview.
2. Use Web Share when available.
3. Clipboard fallback must be feature-detected and error-handled.
4. Local development should show a useful fallback message rather than throw.
5. Confirm names and dates are consistent across page, share text, and metadata.

**Acceptance criteria:** no uncaught errors when sharing is unsupported or cancelled.

### Phase 7 — Optional production features

Only start these when the user explicitly asks or required data is available.

#### Background music

- Start only after a user gesture.
- Provide persistent mute/unmute.
- Do not restart on every section.
- Use a licensed/supplied audio file.
- Remember state during the current page session if appropriate.

#### RSVP

- Define backend/storage choice before implementation.
- Use server-side validation.
- State clearly whether it is demo or production.
- Never show fake success for unsaved data.
- Protect private guest information.

#### Multilingual content

- Do not use machine-created Gujarati as final copy without user approval.
- Keep translations in structured locale files.
- Translate validation, labels, and statuses—not only headings.

#### Personalised guest links

- Use non-guessable tokens.
- Never place phone numbers or database IDs in public URLs.
- Do not reveal the guest list client-side.

---

## 6. Testing matrix

### Required commands

Use the scripts defined by the repository. At minimum:

```bash
npm run lint
npm run build
npm test
```

Run the development server and inspect the browser console.

### Opening test cases

- Video exists and plays normally
- Video file missing
- Video returns an error
- Play promise rejects
- User taps skip immediately
- User taps skip near the end
- Reduced motion enabled
- Repeated rapid taps on `Open Invitation`
- Orientation change during opening
- Slow network/media load
- Audio muted by device/browser
- Browser tab backgrounded and restored

### Layout test cases

- 320x568
- 375x667
- 390x844
- 430x932
- Tablet portrait
- Desktop
- Increased text zoom
- Long pending venue label

### Functional test cases

- Countdown before target
- Countdown after target
- Every directions link
- Web Share supported
- Web Share cancelled
- Clipboard supported
- Clipboard unavailable
- Keyboard tab order
- Reduced motion

---

## 7. Definition of done

A phase is not complete because the UI looks correct in one screenshot.

The complete invitation is done only when:

- Realistic opening video is integrated or the missing-asset fallback is polished.
- No fake CSS/DOM fabric animation remains.
- Opening never traps the guest.
- Page scroll is restored reliably.
- Wedding details are centralised and pending details are not invented.
- Mobile layout works from 320px upward.
- Build, lint, and tests pass, or remaining pre-existing failures are transparently documented.
- Browser console has no relevant uncaught errors.
- Metadata and sharing content match the invitation.
- The user receives exact run instructions.
- Changed files and unresolved placeholders are listed.

---

## 8. Required final response format from Codex

At the end of a work session, report in this order:

### Completed

Describe the user-visible results, not only internal refactors.

### Files changed

List paths with one-line explanations.

### Validation

List commands run and whether each passed.

### Content still awaiting confirmation

List every pending wedding detail. Do not omit assumptions.

### How the user runs it

For Windows, give exact steps such as:

```text
1. Install Node.js version required by package.json.
2. Extract the project ZIP.
3. Open the project folder in Visual Studio Code.
4. Open Terminal > New Terminal.
5. Run: npm install
6. Run: npm run dev
7. Open the local URL printed in the terminal.
```

Adjust commands to the actual repository and do not invent the URL if the terminal uses a different port.

### Ribbon video placement

Always restate:

```text
public/ribbon-opening.mp4
```

and note whether it was present and tested.

### Remaining limitations

Be direct about anything not implemented, not tested, or dependent on a missing asset/service.

---

## 9. Change-control rules

- Make the smallest coherent change that solves the current problem.
- Preserve user-approved design and content.
- Do not remove features silently.
- Do not convert confirmed values into generic placeholder prose.
- Do not declare mobile/browser testing complete unless it was actually performed with available tools.
- Do not claim an RSVP, database, email, WhatsApp, or analytics integration works without testing the real service.
- Do not add watermarked or unlicensed assets.
- Never expose private credentials or personal guest data.

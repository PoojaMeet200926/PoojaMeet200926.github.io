# Meet & Pooja Digital Wedding Invitation

## Complete project handoff for commit `beee435`

This file is the authoritative continuation brief for the Meet & Pooja digital wedding invitation at Git commit:

```text
beee435421fc41f60d21aae244df1d359a94c20b
```

Commit subject: `Add falling petals and leaves effect`  
Commit date: 26 July 2026, 15:30:44 IST  
Original branch: `live-ribbon-v4`

The purpose of this document is to let another Codex session, developer, or designer continue the project on a different computer without losing the exact product decisions, content, animation behavior, personalization format, language rules, venue information, or deployment context that existed at this commit.

> Important: treat `beee435421fc41f60d21aae244df1d359a94c20b` as the visual and functional baseline. Do not casually redesign the opening, change its speed, restore a second ribbon, change name order rules, alter the Gujarati terminology, or replace the venue narrative unless the owner explicitly asks.

### Living handoff status

This document is now maintained as a living handoff. Commit `beee435` remains the historical baseline, and the following approved forward change has been added after that baseline:

- 1 August 2026: add Ganeshji and OM SHANTI blessing emblems at the top of the revealed card only for Pooja-side invitations. Ganeshji is champagne gold; OM SHANTI retains its original red sunburst and black lettering. Meet-side invitations continue to show the original small champagne floret instead.
- 1 August 2026: keep the same Pooja-only blessing artwork visible on the first Narayani Heights hero page, not only on the temporary revealed opening card. The hero version uses a restrained translucent ivory backing for reliable contrast without recoloring either emblem.
- 1 August 2026: make the first-page blessings a persistent hero panel independent of the delayed couple-name animation, add the Sanskrit invocation `॥ श्री गणेशाय नमः ॥` in sage, and replace the easily missed scroll cue with a prominent centered button that smoothly opens the next story section.
- 1 August 2026: add a final Pooja-side-only “With Best Compliments From” page in the invitation’s ivory, sage, and champagne theme, preserving the exact supplied Modi family spellings. Meet-side, missing-token, and invalid-token links do not render this family page.
- 1 August 2026: make every Pooja-side family name bilingual. English mode preserves the owner-supplied Latin spellings; Gujarati mode switches honorifics, names, initials, and younger family names to approved Gujarati-script strings rendered in Noto Serif Gujarati.
- 1 August 2026: replace the final-page P&M initials with the localized full couple names (`Pooja & Meet` / `પૂજા & મીત`), increase compact Gujarati `સપ્ટેમ્બર` labels from 8px to 10px, and add `PYTHON_INVITE_LINK_GUIDE.md` with local, hosted, multiple-link, and troubleshooting instructions.
- 1 August 2026: replace the formal Gujarati guest-allocation wording containing `અનામત` with natural welcome copy. Singular is `આપનું સહર્ષ સ્વાગત છે.` and plural is `આપ સહિત કુલ {count} મહેમાનોનું સહર્ષ સ્વાગત છે.`; encoded count behavior is unchanged.
- 1 August 2026: correct the Narayani Heights Gujarati venue description from `હરિયાળાં લૉન` to `હરિયાળી લૉન`. On Pooja-side links, the revealed names card now shows only a centered Ganeshji emblem plus `॥ श्री गणेशाय नमः ॥`; OM SHANTI is omitted there. The first Narayani Heights hero keeps the combined Ganeshji/OM SHANTI panel, but the invocation has moved off that page and onto the revealed card.
- 1 August 2026: simplify the Pooja-side Narayani Heights hero to a smaller centered OM SHANTI emblem with no Ganeshji and no white backing panel; the revealed card still keeps Ganeshji and the invocation. Correct Gujarati `નૈશા` to `નાયશા`, localize every displayed numeral to Gujarati digits in Gujarati mode, enlarge all eyebrow/section-kicker statements, add featured Vidai (`વિદાય`) on 20 September at 03:00 PM, pair Sangeet with Dinner at 08:00 PM, and pair Wedding Ceremony with Lunch at 12:30 PM.

---

## 1. Instructions for the next Codex session

When this source is opened on another laptop, Codex should do the following before changing anything:

1. Read this entire file.
2. Confirm that the project folder containing `package.json` is the working directory.
3. If Git history is present, run `git rev-parse HEAD` and confirm the result is `beee435421fc41f60d21aae244df1d359a94c20b` before making baseline comparisons.
4. Run `git status --short` and preserve all user-owned changes and untracked reference media.
5. Inspect `app/page.tsx`, `app/invitation-copy.ts`, `app/globals.css`, `lib/invitation-token.mjs`, and `create_invite_link.py` before modifying behavior.
6. Use the existing vinext/Next/React architecture. Do not replace it with another framework merely for convenience.
7. Preserve `.openai/hosting.json` and its existing `project_id`. Never create a second hosted Sites project for this source.
8. Run a build after source changes. Use the targeted invitation-token and Python tests described later in this document.
9. Treat the known lint and stale rendered-HTML test failures as baseline maintenance issues, not proof that the invitation itself is broken.
10. Ask before publishing unless the owner explicitly says to publish/deploy.

### Product decisions that must be preserved by default

- No couple names are visually shown while the gift box is still sealed.
- The satin bow and all four ribbon strips disappear during the first opening; a second ribbon must not appear on the revealed invitation.
- The ribbon/bow opening is symmetric, smooth, and centered. It is not deliberately weighted to the right.
- The speed at this commit is approved: the state changes occur at 1.07 seconds and 3.00 seconds after the opening tap.
- After the names card is revealed, the page waits indefinitely for a tap, swipe/pointer gesture, Enter, or Space before continuing.
- English/Gujarati selection remains available in the top-right corner and must not overlap the opening title.
- Gujarati uses Noto Serif Gujarati and the approved terms `સગાઈ` and `હલ્દી`.
- `ગણેશ સ્થાપન`, `મંડપ મુહૂર્ત`, and `ગ્રહ શાંતિ` are three deliberate non-wrapping lines.
- The wedding visual narrative is Narayani Heights, not a waterfront/yacht venue.
- Invitation guest count, invited day group, and sender side are carried in a single opaque `?i=` token.
- A whole-family invitation does not display a guest count.
- Meet-side links display Meet first; Pooja-side links display Pooja first throughout the invitation.
- Pooja-side links show a centered Ganeshji emblem and `॥ श्री गणेशाय नमः ॥` at the start of the revealed card; OM SHANTI is deliberately omitted from this temporary card. Meet-side links show neither.
- The first full-height Narayani Heights page shows only a small centered OM SHANTI emblem on the venue image, without Ganeshji, a white panel, or the invocation.
- The OM SHANTI emblem must retain its red sunburst and black lettering. Do not apply a recolouring filter to the combined emblem asset.
- Only events for the encoded invited day group are displayed.
- All location actions use the approved Google Maps links and a visible map-pin symbol.
- Falling petals/leaves start only after the invitation is fully opened and disappear for reduced-motion users.

---

## 2. Product summary

This project is a mobile-first, interactive, bilingual wedding invitation for Meet and Pooja’s September 2026 celebration in Ahmedabad.

The experience is deliberately cinematic:

1. A full-screen sealed floral gift/invitation box is displayed.
2. The guest taps the satin ribbon.
3. The bow loosens and vanishes symmetrically.
4. Four ribbon strips retract outward.
5. The four box/lid flaps open outward.
6. A translucent invitation card reveals the couple’s names and invited dates.
7. The reveal pauses until the guest gives another gesture.
8. The gate fades away and a pair of hero doors opens onto Narayani Heights.
9. The guest scrolls through the story, personalized allocation, venue reveal, countdown, invited event cards, and sharing controls.
10. Pooja-side links finish with the supplied Modi family compliments page; Meet-side links omit it.
11. Soft petals and leaves fall continuously over the opened invitation.

The same hosted site supports many guest-specific links. Each link can configure:

- number of invitees: 1–250, or whole family;
- invited dates: only 20 September; 19–20 September; or 18–20 September;
- sender side/name order: Meet first or Pooja first;
- language: selected by the guest in the page UI and stored locally, not encoded into the link.

---

## 3. Technology and runtime

### Core stack

| Area | Technology/version at this commit |
|---|---|
| UI | React `19.2.6` |
| Routing/rendering | Next `16.2.6` App Router API through vinext |
| Next-on-Vite adapter | vinext `0.0.50` |
| Build tool | Vite `8.0.13` |
| Cloudflare integration | `@cloudflare/vite-plugin` `1.37.1` |
| Styling | Handwritten CSS in `app/globals.css`; Tailwind 4 is imported but utility classes are not the product’s styling model |
| Type checking | TypeScript `5.9.3`, strict mode, no emit |
| Hosting target | OpenAI Sites / Cloudflare Worker-compatible vinext output |
| Optional database scaffold | Drizzle ORM `0.45.2` and D1, currently unused |
| Link generator | Python standard library only; JavaScript alternative uses Web Crypto |

### Minimum practical local requirements

- Node.js `22.13.0` or newer, as required by `package.json`.
- npm distributed with that Node installation.
- Python 3.10 or newer for `create_invite_link.py` because it uses modern union type syntax.
- A modern browser with Web Crypto, CSS `clip-path`, sticky positioning, `svh` units, and JavaScript enabled.
- Internet access is helpful for the Google-hosted Gujarati font. The site has system fallbacks when it cannot load.

### Package manager guidance

Both `package-lock.json` and `pnpm-lock.yaml` exist, but the documented and tested workflow uses npm. On a fresh laptop, prefer:

```powershell
npm ci
```

If the downloaded source does not have a lockfile-compatible state, use:

```powershell
npm install
```

Do not run `corepack enable` merely to run this project. On Windows, that command may fail with `EPERM` because it attempts to modify files under `C:\Program Files\nodejs`. npm is sufficient for this project.

---

## 4. Project structure and file ownership

```text
live-ribbon-v4/
├─ .openai/
│  └─ hosting.json                 Existing hosted Sites project identity
├─ app/
│  ├─ globals.css                  All product styling, motion, responsiveness
│  ├─ invitation-copy.ts           Complete English/Gujarati content model
│  ├─ layout.tsx                   Metadata, social cards, Gujarati font import
│  ├─ page.tsx                     Entire invitation UI and client behavior
│  └─ chatgpt-auth.ts              Unused starter authentication helper
├─ build/
│  └─ sites-vite-plugin.ts         Packages Sites metadata/migrations into dist
├─ db/
│  ├─ index.ts                     Optional D1 helper; unused by invitation
│  └─ schema.ts                    Empty database schema
├─ drizzle/
│  └─ meta/_journal.json           Empty migration journal
├─ examples/d1/                    Starter D1 example; not used by invitation
├─ lib/
│  └─ invitation-token.mjs         Browser/Node token encoder and decoder
├─ public/
│  ├─ invitation-box-lid.png       Floral/embroidered cover texture
│  ├─ satin-bow-v2.png             Realistic satin bow sprite source
│  ├─ pooja-blessings.png          Pooja-side Ganeshji/OM SHANTI emblem pair
│  ├─ narayani-heights-venue.png   Main venue image used in three surfaces
│  ├─ invitation-cover-v2.png      Preserved older asset; currently unused
│  ├─ og.png                       Social preview card
│  ├─ favicon.svg                  Site icon
│  └─ file.svg, globe.svg,
│     window.svg                   Preserved starter assets; currently unused
├─ scripts/
│  └─ create-invite-link.mjs       JavaScript link-generator CLI
├─ tests/
│  ├─ invitation-token.test.mjs    Current token tests
│  ├─ pooja-blessings.test.mjs     Pooja-side visibility and exact asset test
│  ├─ family-compliments.test.mjs  Pooja-family localization/content test
│  ├─ test_create_invite_link.py   Current Python generator tests
│  └─ rendered-html.test.mjs       Stale starter tests; known failing baseline
├─ worker/
│  └─ index.ts                     Cloudflare Worker/vinext request entry
├─ create_invite_link.py           Preferred standalone guest-link generator
├─ PYTHON_INVITE_LINK_GUIDE.md     Detailed generator and multiple-link guide
├─ README.md                       Short end-user setup/link instructions
├─ package.json                    Scripts and dependencies
├─ vite.config.ts                  vinext + Sites + Cloudflare build config
├─ next.config.ts                  Minimal Next config
├─ tsconfig.json                   Strict TypeScript/bundler settings
└─ PROJECT_HANDOFF_COMMIT_beee435.md
```

### Primary dependency flow

```text
app/layout.tsx
  ├─ imports app/globals.css
  └─ generates metadata from request headers

app/page.tsx
  ├─ imports COPY and types from app/invitation-copy.ts
  ├─ imports decodeInvitationToken from lib/invitation-token.mjs
  ├─ reads ?i= from window.location.search
  └─ renders the complete single-page invitation

app/globals.css
  ├─ references /invitation-box-lid.png
  ├─ references /satin-bow-v2.png
  └─ references /narayani-heights-venue.png

create_invite_link.py
  └─ independently reproduces the v3 token protocol

scripts/create-invite-link.mjs
  └─ imports encodeInvitationToken from lib/invitation-token.mjs
```

---

## 5. Complete feature catalog

### 5.1 Sealed invitation gate

The initial viewport is a fixed, full-screen gate with scrolling locked.

- State starts as `sealed`.
- `document.body.style.overflow` is set to `hidden` for every state except `open`.
- The background is a neutral champagne/ivory atmosphere made from gradients and a subtle repeating texture.
- The cover keeps a `9 / 16` aspect ratio.
- Desktop width formula: `min(86vw, calc(78svh * .5625), 440px)`.
- Mobile width at 520 px or less: `min(91vw, 40.5svh, 440px)`.
- The gate uses perspective and 3D transforms, but the design remains a single mobile portrait card.
- The heading “A celebration awaits” is above the box.
- On phones up to 520 px, it is left-aligned with `left: 12px; right: 98px`, leaving room for the language toggle.
- The sealed cover itself has no visible names. The name card exists in the DOM behind it but has zero opacity and is marked hidden from accessibility until the `revealed` state.
- The opening button has a localized accessible label and only works while state is `sealed`.

### 5.2 Realistic satin ribbon construction

The ribbon is intentionally built as independent visual pieces instead of a single flat icon:

- Four CSS ribbon strips: horizontal left, horizontal right, vertical top, vertical bottom.
- Ribbon width/height is 10.8% of the cover in the crossing direction.
- Strips use layered champagne gradients, textile-like repeating gradients, inset highlights/shadows, and dashed stitched edges.
- The bow uses `public/satin-bow-v2.png`, split with `clip-path` into five pieces:
  - left loop;
  - right loop;
  - left tail;
  - right tail;
  - center knot.
- Each piece has a separate transform origin and animation.
- The overall bow is 94% of the cover width with a 3:2 aspect ratio and starts at 34.4% from the cover top.
- The animation is symmetric. The left and right pieces translate and rotate with mirrored values.

### 5.3 Opening state machine and approved timings

The state type is:

```ts
"sealed" | "untying" | "opening" | "revealed" | "open"
```

Normal motion sequence after the first tap:

| Time from tap | State/action |
|---:|---|
| 0 ms | State changes from `sealed` to `untying` |
| 0–1,080 ms | Bow pieces settle, fold, release, soften, and fade |
| 420–1,000 ms | Four ribbon strips retract outward |
| 1,070 ms | State changes to `opening`; four lid flaps begin moving outward |
| about 1,420 ms onward | Inner card begins fading/scaling in because its transition has a 350 ms delay |
| about 2,120 ms onward | Inner card text begins its delayed fade/rise |
| 3,000 ms | State changes to `revealed`; page pauses for the guest |
| next guest gesture | State changes to `open`; gate fades away and the main invitation starts |

Exact JavaScript timers in `app/page.tsx`:

```ts
window.setTimeout(() => setInvitationState("opening"), 1070);
window.setTimeout(() => setInvitationState("revealed"), 3000);
```

Key CSS timings:

- bow group: 1.08 s;
- loop pieces: 1.04 s;
- tails: 1.08 s;
- knot: 0.92 s;
- ribbon strip retraction: 0.58 s after 0.42 s delay;
- cover flap transition: 1.72 s using `cubic-bezier(.36,.03,.16,1)`;
- inner card transform: 1.45 s after 0.32 s delay;
- gate fade after `open`: 0.75 s.

The four lid flaps are four clipped copies of `invitation-box-lid.png`:

- top moves `translateY(-94%)` with `rotateX(-14deg)`;
- bottom moves `translateY(94%)` with `rotateX(14deg)`;
- left moves `translateX(-94%)` with `rotateY(-14deg)`;
- right moves `translateX(94%)` with `rotateY(14deg)`;
- all fade to zero opacity.

There is intentionally no free-floating second ribbon after reveal. In `gate-revealed`, both `.satin-ribbons` and `.satin-bow` have zero opacity.

### 5.4 Reveal pause and continuation gestures

The names/dates card remains on screen indefinitely in `revealed` state.

Supported continuation input:

- pointer up, covering mouse/stylus/touch-compatible pointer events;
- touch end;
- Enter;
- Space.

The language toggle is excluded from pointer/touch continuation by checking `event.target.closest(".language-toggle")`. This lets the guest change language while paused on the reveal card.

The reveal prompt reads “Tap or swipe to continue” or its Gujarati equivalent. Technically, the implementation listens for the completion of a pointer/touch gesture; it does not calculate swipe distance.

### 5.4.1 Pooja-side blessing emblems

The top of the revealed names/dates card is sender-side specific:

- When `invitationDetails.side === "pooja"`, the card uses the left portion of `public/pooja-blessings.png` to render only Ganeshji before the family line.
- The Ganeshji crop is centered at `min(102px, 32%)`; OM SHANTI is not visible on this revealed card.
- The invocation `॥ श्री गणेशाय नमः ॥` appears directly below Ganeshji in deep sage.
- Ganeshji uses the invitation’s champagne-gold family, visually matching `--champagne: #b49768`.
- The Ganeshji crop replaces the original `✦` floret on Pooja-side cards so the top does not become visually crowded.
- Meet-side, missing-token, and invalid-token invitations retain the original `✦` floret and do not request/render either religious emblem.
- The condition depends on the successfully decoded token, not on language or name text.
- The crop has localized accessible text in `app/invitation-copy.ts`.
- Pooja-side card spacing is compacted slightly: 30 px vertical padding, 12 px before the family line, 17 px before names, 27 px before the date rule, and 20 px before the opening note.
- Ganeshji and the invocation remain hidden behind the sealed cover and only become visible as the inner card is revealed, preserving the rule that no identifying/reveal content appears before the box opens.

### 5.5 Reduced-motion behavior

If `prefers-reduced-motion: reduce` is active:

- the first opening tap jumps directly to `revealed` instead of running the timers;
- the guest still gives a second gesture to enter the invitation;
- global CSS animation and transition durations are reduced to `0.01ms` and one iteration;
- smooth scrolling is disabled;
- falling botanicals are completely hidden.

### 5.6 Main hero reveal

The first page section is a full-height Narayani Heights hero.

- Two cream “doors” cover the hero until the gate enters `open`.
- Left door moves left and right door moves right over 2.25 seconds, after a 0.12 second delay.
- Hero text fades upward over 1.3 seconds after a 1.45 second delay.
- Main venue image uses `narayani-heights-venue.png` with a dark bottom wash for contrast.
- The displayed names respect sender side.
- Pooja-side invitations render a separate `hero-om-shanti` crop from `pooja-blessings.png`; it shows only a smaller centered OM SHANTI emblem directly over the venue photograph. It is independent of the delayed hero-name fade and has no Ganeshji, backing panel, border, shadow, blur, or invocation. Meet-side invitations render neither hero emblem.
- The date and place line respect the invited day group.
- A localized, pill-shaped button near the bottom links to `#story`. Global smooth scrolling animates the transition, while the existing reduced-motion media query changes it to an immediate jump.

### 5.7 Story section

The story section uses an ivory paper surface, large editorial serif heading, champagne script accent, decorative `❦` botanicals, a floret rule, body copy, and a handwritten-style closing note.

Sender side changes the story:

- Meet side: a neutral “Together with their families” invitation paragraph.
- Pooja side: explicitly names Mrs. Dharmishtha and Mr. Ketan Modi and describes Pooja as their beloved daughter marrying Meet.

Gujarati has fully localized equivalents.

### 5.8 Personalized allocation card

This section appears only when a valid token has decoded into `invitationDetails`.

- It is labeled “Especially for you”.
- For one invitee, it uses singular guest copy.
- For 2–250 invitees, it inserts the encoded number in plural copy.
- For whole-family links, the guest-count line is omitted completely.
- The invited-day sentence is always shown.
- Invalid/missing tokens produce no allocation card.

### 5.9 Narayani Heights venue reveal

The venue reveal is 130 `svh` tall and contains a sticky 100 `svh` visual.

- It uses the actual Narayani Heights venue image, not a waterfront narrative.
- Copy describes lush green lawns, grand gathering spaces, and a celebration-oriented evening.
- The venue image is also used in the hero and the revealed opening card.

### 5.10 Live countdown

The countdown displays days, hours, minutes, and seconds in four equal columns.

- Values update every 1,000 ms.
- Values are padded to two digits.
- Date arithmetic uses an explicit India offset `+05:30`.
- Negative distance is clamped to zero, so the timer stays at `00` after the target.
- Server-rendered initial values are zero, then the browser calculates the current countdown.

Targets:

| Encoded day group | Visible dates | Countdown target |
|---|---|---|
| `days = 1` | 20 September | `2026-09-20T00:00:00+05:30` |
| `days = 2` | 19–20 September | `2026-09-19T09:30:00+05:30` |
| `days = 3` | 18–20 September | `2026-09-18T00:00:00+05:30` |

### 5.11 Event filtering

The event array contains eight entries. A valid token determines the invited dates, and the UI filters the array by each event’s `date` string.

The visible event indexes are recalculated from `01` within the filtered list. Therefore a day-20-only invitation shows Wedding Ceremony as event `01` and Vidai as event `02`. Gujarati mode displays these as `૦૧` and `૦૨`.

### 5.12 Sharing

The project has two share controls:

- a full-width closing button;
- a fixed floating pill near the bottom-right after the gate is gone.

Behavior:

1. Builds localized share title and text using the active name order and date line.
2. Preserves the entire current URL, including the opaque `i` token.
3. Uses `navigator.share()` when available.
4. Otherwise copies the URL with `navigator.clipboard.writeText()`.
5. Shows a localized success/fallback status for 2.4 seconds.
6. Ignores a user-cancelled native share (`AbortError`) without showing an error.

### 5.13 Smooth scrolling and mobile-first responsiveness

- Root `html` uses smooth scrolling unless reduced motion is requested.
- Layout is designed around portrait phones first.
- Event cards use a narrow date rail plus a flexible details column.
- At 720 px and wider, event rail grows from 92 px to 140 px, details padding increases, and the Haldi/Lunch, Sangeet/Dinner, and Wedding/Lunch pairs become two columns.
- At 520 px and below, cover size and gate heading position are adjusted and only the first ten botanical particles render.
- At 380 px and below, event rail shrinks to 78 px, content padding shrinks, and countdown typography tightens.
- Language and share controls account for safe-area insets where relevant.

### 5.14 Accessibility details

- Opening cover is a real button with a localized accessible label.
- Language selector is a button with a localized accessible label.
- Gate prompt and sharing feedback use polite live regions.
- Countdown uses `role="timer"` with `aria-live="off"` to avoid announcing every second.
- Decorative botanicals, flaps, bow pieces, pins, and florets are marked hidden where appropriate.
- Directions are real anchors opening a new tab with `rel="noreferrer"`.
- Keyboard Enter/Space can continue past the reveal.
- Focus-visible outlines exist for the cover and language toggle.
- Reduced-motion preference is respected.

---

## 6. Event schedule, addresses, and map links

These values are product data and should not be inferred or replaced without approval.

### Friday, 18 September 2026 — Tremont

Address in English:

```text
B.1302, Tremont, Vaishnodevi Circle, Ahmedabad, Gujarat 382421
```

Address in Gujarati:

```text
બી-1302, ટ્રેમોન્ટ, વૈષ્ણોદેવી સર્કલ, અમદાવાદ, ગુજરાત 382421
```

Approved map URL:

```text
https://maps.app.goo.gl/g4FNbs7ANbroAfxb8
```

Events:

1. Ganesh Sthapan / Mandap Muhurat / Grah Shanti
   - English supporting copy: “An auspicious beginning”
   - Gujarati title lines: `ગણેશ સ્થાપન`, `મંડપ મુહૂર્ત`, `ગ્રહ શાંતિ`
   - Gujarati supporting copy: `શુભ શરૂઆત`
2. Mehendi
   - English supporting copy: “An afternoon of henna & happiness”
   - Gujarati title: `મહેંદી`
   - Gujarati supporting copy: `મહેંદી અને આનંદની બપોર`

No precise clock times are stored for these two events at this commit.

### Saturday, 19 September 2026 — Narayani Heights

Address in English:

```text
Narayani Heights, Airport-Gandhinagar Road, Bhat, Ahmedabad, Gujarat 382428
```

Address in Gujarati:

```text
નારાયણી હાઇટ્સ, એરપોર્ટ-ગાંધીનગર રોડ, ભાટ, અમદાવાદ, ગુજરાત 382428
```

Approved map URL:

```text
https://maps.app.goo.gl/7QJob2xzgw7PQsBF9
```

Events:

| Event | Gujarati | Time |
|---|---|---|
| Ring Ceremony | `સગાઈ` | 09:30 AM / `સવારે 09:30` |
| Haldi | `હલ્દી` | 11:00 AM / `સવારે 11:00` |
| Lunch | `બપોરનું ભોજન` | 12:30 PM / `બપોરે 12:30` |
| Mameru | `મામેરું` | 03:00 PM / `બપોરે 03:00` |
| Sangeet | `સંગીત સંધ્યા` | 07:30 PM / `સાંજે 07:30` |
| Dinner | `રાત્રિભોજન` | 08:00 PM / `રાત્રે 08:00` |

Haldi and Lunch intentionally share one event card, and Sangeet and Dinner share another. Each paired item uses the same heading style and a smaller italic time beneath it. They stack on narrow screens and use two columns at 720 px or wider.

### Sunday, 20 September 2026 — Narayani Heights

Event: Wedding Ceremony / `લગ્નવિધિ`

- Venue and map are the same Narayani Heights values above.
- The event card is visually featured with deep sage background and a champagne date rail.
- Instead of a time, it displays dynamic name-order copy:
  - Meet side: `Meet weds Pooja`;
  - Pooja side: `Pooja weds Meet`;
  - Gujarati equivalent: `<first> અને <second>ના શુભ લગ્ન`.
- Lunch appears in the same card at 12:30 PM / `બપોરે 12:30`.
- No wedding ceremony clock time is stored.

Event: Vidai / `વિદાય`

- Date: Sunday, 20 September 2026.
- Time: 03:00 PM / `બપોરે 03:00`.
- Venue and map are the same Narayani Heights values above.
- The Vidai card uses the same featured deep-sage/champagne treatment as the Wedding Ceremony card.

---

## 7. Personalization model

### 7.1 Invitation detail shape

```ts
type InvitationDetails = {
  people: number | null;
  days: 1 | 2 | 3;
  side: "meet" | "pooja";
};
```

Meanings:

| Field | Value | Meaning |
|---|---|---|
| `people` | `1`–`250` | Show exact invitee count |
| `people` | `null` | Whole family; hide guest-count sentence |
| `days` | `1` | Only Sunday, 20 September |
| `days` | `2` | Saturday–Sunday, 19–20 September |
| `days` | `3` | Friday–Sunday, 18–20 September |
| `side` | `meet` | Meet is first everywhere |
| `side` | `pooja` | Pooja is first everywhere |

### 7.2 Name order propagation

`firstPerson` is Pooja only when decoded side is exactly `pooja`; otherwise it is Meet. The order affects:

- revealed card names;
- hero names;
- wedding event “weds” line;
- closing names;
- share title and message;
- accessible opening label;
- story paragraph selection.

English names are `Meet` and `Pooja`. Gujarati names are `મીત` and `પૂજા`.

### 7.3 Supported day-copy groups

#### One day

- Date line: `20 September 2026`
- Place: `Narayani Heights`
- Opening note: `One day of love · One beautiful beginning`
- Invitation: Sunday, 20 September only
- Visible events: Wedding Ceremony and Vidai

#### Two days

- Date line: `19 — 20 September 2026`
- Place: `Narayani Heights`
- Opening note: `Two days of love · One beautiful beginning`
- Invitation: Saturday and Sunday
- Visible events: all 19 September events plus Wedding Ceremony and Vidai

#### Three days

- Date line: `18 — 20 September 2026`
- Place: `Tremont · Narayani Heights`
- Opening note: `Three days of love · One beautiful beginning`
- Invitation: complete Friday–Sunday celebration
- Visible events: all eight events

Equivalent Gujarati day-group copy lives in `app/invitation-copy.ts` and must be updated in parallel with English if dates or messaging change.

---

## 8. Opaque invitation token protocol

The URL exposes one query parameter:

```text
?i=<43-character-base64url-token>
```

The token is intentionally not human-readable and detects modification. It is privacy-friendly obfuscation, not authorization or access control.

### 8.1 Security boundary

- The website is public.
- The decoding key is embedded in the downloaded JavaScript and in the Python generator.
- A technically capable person can inspect the source and create or decode invitations.
- Do not put secrets, private guest names, payment data, access credentials, or sensitive personal information into this payload.
- The token prevents casual URL reading and accidental/tampered edits; it does not restrict site access.

### 8.2 Version 3 binary layout

Raw token length is 32 bytes:

| Offset | Length | Meaning |
|---:|---:|---|
| 0 | 1 byte | Version, value `3` |
| 1 | 12 bytes | Cryptographically random nonce |
| 13 | 3 bytes | Obfuscated payload: people, day group, sender side |
| 16 | 16 bytes | Truncated HMAC-SHA256 authentication tag |

Base64url encoding without `=` padding converts 32 bytes to exactly 43 characters.

Plain payload values:

```text
byte 0: people, where 0 means whole family and 1–250 is exact count
byte 1: days, where 1/2/3 maps to the supported groups
byte 2: side, where 0 = Meet and 1 = Pooja
```

### 8.3 Obfuscation/authentication algorithm

The shared 32-byte key is:

```text
f3 5b 22 ba 70 09 e1 44 9d 2a c7 0d 51 ec 37 aa
18 92 db 3f b1 05 6c ca 4d e7 12 9f 2e 7c d3 59
```

Decimal source representation:

```text
243, 91, 34, 186, 112, 9, 225, 68,
157, 42, 199, 13, 81, 236, 55, 170,
24, 146, 219, 63, 177, 5, 108, 202,
77, 231, 18, 159, 46, 124, 211, 89
```

Algorithm:

1. Generate a 12-byte random nonce.
2. Calculate `HMAC-SHA256(key, 0x45 || nonce)`.
3. XOR the three plaintext payload bytes with the first three pad bytes.
4. Build `body = version || nonce || ciphertext`.
5. Calculate `HMAC-SHA256(key, body)`.
6. Append the first 16 signature bytes.
7. Encode using canonical URL-safe Base64 without padding.

The decoder:

- rejects noncanonical Base64url encodings;
- validates exact token length for each version;
- checks the tag with a constant-work byte comparison;
- catches Web Crypto/Base64 errors and returns `null`;
- validates people ≤ 250, days in 1–3, and side in 0–1;
- silently falls back to the nonpersonalized invitation when decoding fails.

### 8.4 Backward compatibility

`lib/invitation-token.mjs` decodes three versions:

- Version 1: legacy AES-GCM token, fixed 31-byte raw length, two-byte people/day payload, defaults sender side to Meet.
- Version 2: HMAC/XOR token with two-byte people/day payload, defaults sender side to Meet.
- Version 3: current three-byte payload including sender side.

The committed compatibility fixture token is:

```text
AR6I5KVyC7QPsoVKgEVOIybQwNyMNGabDwMAOa-jxA
```

It must decode as:

```json
{ "people": null, "days": 3, "side": "meet" }
```

Do not remove old-version support while previously distributed links may still be in use.

### 8.5 Important implementation nuance

The JavaScript encoder internally converts `null` to byte zero. Its validation technically accepts a direct caller passing numeric zero as well, although the public type and CLI treat whole family as `null`/`--family`. The Python generator correctly rejects numeric zero and uses `None` for family.

---

## 9. Generating guest links

### 9.1 Preferred Python program

The preferred generator is `create_invite_link.py` because it is standalone and uses only the Python standard library.

Interactive mode:

```powershell
python create_invite_link.py
```

It asks for:

1. hosted site URL;
2. invited dates;
3. number of invitees, blank for family;
4. sender side.

Two guests invited only for 20 September, Meet side:

```powershell
python create_invite_link.py --url "https://your-hosted-site.example" --days 20 --invitees 2 --side meet
```

Four guests invited for 19 and 20 September, Pooja side:

```powershell
python create_invite_link.py --url "https://your-hosted-site.example" --days 19,20 --invitees 4 --side pooja
```

Whole family invited for all three days, Meet side:

```powershell
python create_invite_link.py --url "https://your-hosted-site.example" --days 18,19,20 --family --side meet
```

Supported Python date syntax is flexible about commas/spaces, sorts and deduplicates input, but accepts only these exact normalized groups:

```text
(20,)
(19, 20)
(18, 19, 20)
```

`18,20`, `18`, or `19` alone are rejected because the UI has no copy/event group for them.

URL behavior:

- URL must use `http` or `https` and have a host.
- Existing non-`i` query parameters are preserved.
- Any existing `i` parameters are removed and one fresh `i` is appended.
- Fragment is preserved.
- Empty path becomes `/`.
- Every run uses a new random nonce, so identical settings generate different valid tokens.

### 9.2 JavaScript alternative

The npm command uses ordinal day groups, not literal date numbers:

```powershell
npm run invite:link -- --people 2 --days 1 --side meet --url "https://your-hosted-site.example"
```

Meaning of JavaScript `--days`:

```text
1 = 20 September
2 = 19–20 September
3 = 18–20 September
```

Family example:

```powershell
npm run invite:link -- --family --days 3 --side pooja --url "https://your-hosted-site.example"
```

At this commit, the JavaScript generator’s hard-coded default URL is:

```text
https://meet-pooja-wedding-2026.abhimanyutextiles.chatgpt.site
```

Always pass `--url` if the invitation is hosted somewhere else.

---

## 10. English/Gujarati implementation

### 10.1 Toggle behavior

- Fixed at top-right with safe-area-aware top/right offsets.
- Size: 78 × 30 px.
- Two compact options: `EN` and `ગુ`.
- Active option has deep sage fill and white text.
- z-index is 160, above the opening gate at z-index 100.
- Preference key: `localStorage["invitation-language"]`.
- Default language is English.
- Saved Gujarati selection is restored after client mount.
- Storage errors are ignored so the in-page toggle still works in privacy modes.
- `<html lang>` is updated to `en` or `gu`.
- Language is not stored in the invitation URL and does not alter personalization.

### 10.2 Font rules

Gujarati web font import:

```text
Noto Serif Gujarati, weights 400, 500, 600
```

Fallbacks:

```text
Shruti, Nirmala UI, serif/sans-serif
```

English body stack:

```text
Iowan Old Style, Baskerville, Times New Roman, serif
```

English script stack:

```text
Snell Roundhand, Segoe Script, cursive
```

Gujarati mode removes English-style uppercase transformations, reduces letter spacing for labels, and uses Gujarati numerals for every visible numeric value. Eyebrow and section-kicker statements use larger responsive sizes so labels such as `WITH LOVE` and `સ્નેહ સાથે` remain clearly legible.

### 10.3 Approved terminology

Do not transliterate these back into English-sounding Gujarati:

| English | Approved Gujarati |
|---|---|
| Ring Ceremony | `સગાઈ` |
| Haldi | `હલ્દી` |
| Mehendi | `મહેંદી` |
| Mameru | `મામેરું` |
| Sangeet | `સંગીત સંધ્યા` |
| Wedding Ceremony | `લગ્નવિધિ` |
| Vidai | `વિદાય` |
| Lunch | `બપોરનું ભોજન` |
| Dinner | `રાત્રિભોજન` |

### 10.4 Three protected Ganesh title lines

The title is represented as an array and rendered as separate `<span>` elements:

```ts
["ગણેશ સ્થાપન", "મંડપ મુહૂર્ત", "ગ્રહ શાંતિ"]
```

Each span uses `display: block; white-space: nowrap`. Keep this structure for every viewport.

### 10.5 Full core copy reference

| Meaning | English | Gujarati |
|---|---|---|
| Opening kicker | A celebration awaits | ઉત્સવ તમારી રાહ જુએ છે |
| Family line | Together with their families | બંને પરિવારોના આશીર્વાદ સાથે |
| Sealed prompt | Tap to pull the ribbon | રિબન ખોલવા માટે ટૅપ કરો |
| Untying prompt | Pulling the satin ribbon | સાટિન રિબન ખૂલી રહી છે |
| Opening prompt | Opening your invitation | આમંત્રણ ખૂલી રહ્યું છે |
| Reveal prompt | Tap or swipe to continue | આગળ વધવા ટૅપ અથવા સ્વાઇપ કરો |
| Story kicker | A new chapter | એક નવી શરૂઆત |
| Story headline | Two hearts, one beautiful forever. | બે હૃદય, એક સુંદર સદાકાળ. |
| Presence note | Your presence will make our joy complete. | આપની ઉપસ્થિતિ અમારા આનંદને પૂર્ણ કરશે. |
| Personal card kicker | Especially for you | ખાસ આપના માટે |
| Venue kicker | The celebration venue | ઉજવણીનું સ્થળ |
| Countdown kicker | Counting every moment | દરેક પળની ગણતરી |
| Countdown heading | Until we celebrate | ઉજવણી સુધી |
| Event section kicker | The wedding weekend | લગ્નોત્સવ |
| Event heading | Celebrate with us | અમારી સાથે ઉજવો |
| Directions | Open directions | માર્ગદર્શન ખોલો |
| Closing kicker | With love | સ્નેહ સાથે |
| Share button | Share the invitation | આમંત્રણ શેર કરો |

The exact complete copy object, including all share messages and day-group sentences, is in `app/invitation-copy.ts`. That file is the single source of truth for UI text.

### 10.6 Exact narrative and personalized copy

Meet-side story:

```text
Together with their families, Meet and Pooja request the pleasure of your gracious presence as they celebrate their wedding.
```

Meet-side Gujarati story:

```text
બંને પરિવારો સાથે, મીત અને પૂજા તેમના શુભ લગ્ન પ્રસંગે આપની સ્નેહસભર ઉપસ્થિતિની અભિલાષા રાખે છે.
```

Pooja-side story:

```text
Mrs. Dharmishtha and Mr. Ketan Modi request the pleasure of your gracious presence as their beloved daughter Pooja celebrates her wedding with Meet.
```

Pooja-side Gujarati story:

```text
શ્રીમતી ધર્મિષ્ઠા અને શ્રી કેતન મોદી તેમની લાડકી પુત્રી પૂજાના મીત સાથેના શુભ લગ્ન પ્રસંગે આપની સ્નેહસભર ઉપસ્થિતિની અભિલાષા રાખે છે.
```

Guest-count templates:

```text
English singular: This invitation is lovingly reserved for one guest.
English plural:   This invitation is lovingly reserved for {count} guests.
Gujarati singular: આપનું સહર્ષ સ્વાગત છે.
Gujarati plural:   આપ સહિત કુલ {count} મહેમાનોનું સહર્ષ સ્વાગત છે.
```

Whole-family behavior is represented by omitting this line, not by displaying the words “whole family”.

Venue descriptions:

```text
English: Lush green lawns, grand gathering spaces, and an evening made for celebration.
Gujarati: હરિયાળી લૉન, ભવ્ય સમારંભ સ્થળો અને યાદગાર ઉજવણી માટેનું સુંદર વાતાવરણ.
```

Share templates:

```text
English title: {first} & {second} — Wedding Invitation
English text:  Join us as {first} and {second} begin their forever, {dateLine}.

Gujarati title: {first} & {second} — લગ્ન આમંત્રણ
Gujarati text:  {first} અને {second}ના શુભ લગ્ન પ્રસંગે અમારી સાથે જોડાઓ, {dateLine}.
```

Share feedback:

| State | English | Gujarati |
|---|---|---|
| Native share succeeded | Invitation shared | આમંત્રણ શેર થયું |
| Clipboard fallback succeeded | Link copied | લિંક કૉપી થઈ |
| Non-cancel error | Share this page from your browser | કૃપા કરીને બ્રાઉઝરમાંથી આ પેજ શેર કરો |

### 10.7 Exact Gujarati day-group copy

| Group | Date line | Place line | Opening note | Invitation sentence | Countdown label |
|---|---|---|---|---|---|
| Day 20 | `20 સપ્ટેમ્બર 2026` | `નારાયણી હાઇટ્સ` | `પ્રેમનો એક દિવસ · એક સુંદર શરૂઆત` | `રવિવાર, 20 સપ્ટેમ્બરના રોજ અમારી સાથે ઉજવણી કરવા આપને હાર્દિક આમંત્રણ.` | `રવિવાર · 20 સપ્ટેમ્બર` |
| Days 19–20 | `19 — 20 સપ્ટેમ્બર 2026` | `નારાયણી હાઇટ્સ` | `પ્રેમના બે દિવસ · એક સુંદર શરૂઆત` | `શનિવાર અને રવિવાર, 19–20 સપ્ટેમ્બરની ઉજવણીમાં આપને હાર્દિક આમંત્રણ.` | `શનિવાર · 19 સપ્ટેમ્બર · સવારે 09:30` |
| Days 18–20 | `18 — 20 સપ્ટેમ્બર 2026` | `ટ્રેમોન્ટ · નારાયણી હાઇટ્સ` | `પ્રેમના ત્રણ દિવસ · એક સુંદર શરૂઆત` | `18–20 સપ્ટેમ્બરની સંપૂર્ણ ઉજવણીમાં આપને હાર્દિક આમંત્રણ.` | `શુક્રવાર · 18 સપ્ટેમ્બર` |

Gujarati event-section descriptions:

```text
One day:   ઉજવણી, હાસ્ય અને પ્રેમથી ભરેલો એક સુંદર દિવસ.
Two days:  પરંપરા, સંગીત, હાસ્ય અને પ્રેમથી ભરેલા બે દિવસ.
Three days: પરંપરા, સંગીત, હાસ્ય અને પ્રેમથી ભરેલા ત્રણ દિવસ.
```

---

## 11. Falling petals and leaves effect

This is the feature introduced by commit `beee435`.

### Composition

- React renders 14 fixed decorative spans.
- Every fourth zero-based item is a leaf: visual items 4, 8, and 12.
- Total on desktop: 11 petals and 3 leaves.
- At 520 px or below, items 11–14 are hidden, leaving 10 particles for performance and visual restraint.

### Layering

- Container is fixed across the viewport.
- z-index: 18.
- Main floating share button is above it at z-index 20.
- Opening gate and language control are above it at z-index 100/160.
- Pointer events are disabled, so particles never block tapping or scrolling.
- Container opacity is zero until `.invitation-open`, then fades to one over 1.2 seconds.

### Appearance

Petals:

- 11 × 17 px;
- irregular organic border radius;
- ivory-to-blush gradient;
- approximately 0.48 opacity;
- subtle inset and drop shadows.

Leaves:

- 9 × 21 px;
- slim asymmetric leaf radius;
- sage-to-deep-green gradient;
- approximately 0.38 opacity.

### Motion

- Linear infinite `botanicalFall` animation.
- Individual durations range from 10.6 to 16 seconds.
- Negative delays range from -1.6 to -15.2 seconds so the screen is populated immediately instead of starting with an empty top edge.
- Horizontal starts are distributed from 4% to 95%.
- Each particle has its own sway and final drift.
- Keyframes move from -10 `vh` to 122 `vh`, rotate up to 520 degrees, and rotate around the Y axis to 360 degrees.
- `will-change: transform` is used on particles.
- Entire effect is disabled under reduced motion.

Do not make the effect dense, interactive, or visually dominant; its approved role is a subtle romantic overlay.

---

## 12. Visual design system

### 12.1 CSS color tokens

```css
--ivory: #f8f4ed;
--paper: #fffdf9;
--ink: #373630;
--sage: #788174;
--sage-deep: #4f5b50;
--champagne: #b49768;
--blush: #dcc9bf;
--hairline: rgba(83, 78, 66, 0.18);
```

### 12.2 Design direction

- Luxury editorial invitation, not app-like chrome.
- Warm whites and ivory paper.
- Muted sage and deep sage for structure and venue association.
- Champagne gold for script, event times, florets, and accents.
- Soft blush only in petals and subtle detail.
- Thin borders, hairline rules, quiet shadows.
- Script typography is reserved for names and emotional accents.
- Sans serif is used for small uppercase/navigation labels.
- Narayani Heights image provides the site-specific visual anchor.

### 12.3 Section order

1. Fixed opening gate
2. Hero / Narayani Heights reveal
3. Story
4. Personalized allocation card, only for valid token
5. Sticky Narayani Heights venue reveal
6. Countdown
7. Filtered event cards
8. Closing and share call-to-action
9. Pooja-side family compliments page
10. Fixed share control

### 12.4 z-index map

| Layer | z-index |
|---|---:|
| Regular page | natural stacking |
| Falling botanicals | 18 |
| Floating share | 20 |
| Opening gate | 100 |
| Language toggle | 160 |

---

## 13. Public asset inventory

Hashes below identify the exact files at commit `beee435`.

| File | Dimensions | Bytes | SHA-256 | Usage |
|---|---:|---:|---|---|
| `invitation-box-lid.png` | 941 × 1672 | 2,711,471 | `c75d0f05e7169710260263fc10a22b6f245bc53019d3404a1b57448420c15587` | Four clipped cover flaps |
| `satin-bow-v2.png` | 1537 × 1023 | 1,492,243 | `04528f174ad5f514c7674191bc72d274d285dd1d1aba2e1505c8b6737f9d72de` | Five clipped bow pieces |
| `pooja-blessings.png` | 1380 × 680 | 307,680 | `7ec62fbe107edadcb9066515f8197821a041403e40b3028904333ea9890c8d19` | Transparent Pooja-side Ganeshji/OM SHANTI emblem pair |
| `narayani-heights-venue.png` | 941 × 1672 | 2,115,219 | `106e705d7960fa78acd9fd4e28e1e02d574cefe34700b0b734f76528e51db8db` | Revealed card, hero, venue reveal |
| `invitation-cover-v2.png` | 941 × 1672 | 2,878,127 | `eea6407ed593c6874faa71927689ebbaf6fec5e9b0135d03646d867c91756268` | Preserved older cover, currently unused |
| `og.png` | 1722 × 913 | 2,202,941 | `73eeadb770d0d278ce8cb40c70a4a0a2fddff3e1abb4f8269918f00e888106f6` | Open Graph/Twitter social card |
| `favicon.svg` | vector | 718 | `3e8863288c2d43dd33d2a71de317dcf9198f09932ea8d61e0def1b846a865435` | Browser icon |
| `file.svg` | vector | 391 | `2b67812c325c199a02536cdbeea0c593a72f707d323b72ee3e08dbab06753bd4` | Unused starter asset |
| `globe.svg` | vector | 1035 | `b614b9bf183925957661ac851498fe1d8029fd43a62fbfed86f9e2624a57e7cf` | Unused starter asset |
| `window.svg` | vector | 385 | `644768c4aaeb4767bce293344eeb0c125fb804a94d801440424072202d85e3a1` | Unused starter asset |

Do not delete unused assets as part of an unrelated feature change. They may be useful as restoration references. If asset cleanup is explicitly requested, verify visual output and social metadata first.

---

## 14. Metadata and social sharing

`app/layout.tsx` generates metadata dynamically from incoming headers.

Origin selection:

1. `x-forwarded-host`;
2. `host`;
3. fallback `localhost:3000`.

Protocol selection:

1. `x-forwarded-proto`;
2. otherwise `http` for a host beginning with `localhost`;
3. otherwise `https`.

Fixed metadata at this commit:

- Title: `Meet & Pooja | Wedding Invitation`
- Description: `Join Meet and Pooja as they celebrate their wedding, 19–20 September 2026.`
- Open Graph description: `19–20 September 2026 · Narayani Heights, Ahmedabad`
- Twitter card: `summary_large_image`
- Icon: `/favicon.svg`
- Social image: absolute `${origin}/og.png`

Known metadata limitation: metadata is not personalized by token. It always says Meet first and 19–20 September, even for Pooja-side, one-day, or three-day links.

Known dimension mismatch: `layout.tsx` declares `og.png` as 1792 × 936, while the committed image is actually 1722 × 913. Social platforms normally still render it, but future cleanup should update the declared dimensions or replace the image with the declared size.

---

## 15. Local setup on the friend’s laptop

### 15.1 Copying the source safely

Copy the complete project directory that contains `package.json`, including hidden folders such as `.openai`.

The following generated/local folders do not need to be transferred:

```text
node_modules/
dist/
.next/
.vinext/
.wrangler/
outputs/
__pycache__/
```

Do transfer:

```text
app/
public/
lib/
scripts/
worker/
build/
tests/
.openai/hosting.json
create_invite_link.py
package.json
package-lock.json
all TypeScript/config files
this handoff document
```

### 15.2 Git portability warning

In the original Codex workspace, the project’s `.git` is a small pointer file that points to a parent `.site-git` worktree location:

```text
gitdir: .../.site-git/worktrees/live-ribbon-v4
```

Copying only the project folder can therefore produce a broken `.git` pointer. This does not affect running the website, but it means Git history may not be available on the new laptop.

Safe options:

- use the downloaded source without Git and treat this document/hash as the baseline; or
- create a new Git repository on the new laptop after copying; or
- transfer a proper Git bundle/repository separately.

There is no ordinary configured `git remote` in this worktree at the baseline.

### 15.3 Install and start

From the project directory:

```powershell
npm ci
npm run dev
```

Open the exact Local URL printed by vinext. Do not assume a port such as 3000, 4173, or 4194; Vite chooses another port if one is occupied.

To preview a personalized invitation locally, generate a link using that exact origin:

```powershell
python create_invite_link.py --url "http://localhost:PORT" --days 20 --invitees 2 --side meet
```

Use `localhost` if the dev server prints `localhost`. On some Windows setups vinext listens on IPv6 loopback (`::1`), so `http://127.0.0.1:PORT` may fail even when `http://localhost:PORT` works.

### 15.4 Production build

```powershell
npm run build
```

Expected output is generated under `dist/`, including:

```text
dist/server/index.js
dist/client/assets/*
dist/.openai/hosting.json
```

The build may classify `/` as “Unknown” because `generateMetadata()` uses request headers. This is a vinext static-analysis limitation, not a build failure.

### 15.5 Production local start

After building:

```powershell
npm run start
```

---

## 16. Hosting and deployment context

### 16.1 Existing Sites identity

`.openai/hosting.json` contains:

```json
{
  "project_id": "appgprj_6a5e6cd4ef1c8191a6bf6662f632cf85",
  "d1": null,
  "r2": null
}
```

This means:

- the site already exists in OpenAI Sites;
- reuse this exact opaque `project_id`;
- do not call “create site” for this source;
- there is no active D1 database binding;
- there is no active R2 object-storage binding;
- the invitation itself is stateless.

### 16.2 Guidance for Codex publishing

When the owner explicitly asks to publish:

1. Read the current Sites building/hosting instructions available to that Codex installation.
2. Confirm a clean successful `npm run build` for the exact source to publish.
3. Preserve `.openai/hosting.json`.
4. Reuse the existing `project_id` and obtain a fresh short-lived source credential if needed.
5. Commit/push the exact validated source state to the Sites source repository.
6. Package the built site using the Sites packaging helper expected by the installed plugin.
7. Save a version and deploy it using the available access level.
8. Poll until deployment succeeds.
9. Return the deployment URL.

Do not store source credentials in files, Git remotes, this document, or shell history.

### 16.3 Current hard-coded default share origin

At this commit, the JavaScript generator defaults to:

```text
https://meet-pooja-wedding-2026.abhimanyutextiles.chatgpt.site
```

Treat this as a source constant, not a guarantee that the domain is still live. If hosting changes, update the JavaScript default and documentation, while Python users can simply pass the new `--url`.

### 16.4 Worker architecture

`worker/index.ts`:

- routes `/_vinext/image` through vinext image optimization;
- uses Cloudflare Images transformation binding when available;
- forwards all other requests to `vinext/server/app-router-entry`;
- declares `ASSETS`, `DB`, and `IMAGES` in its environment type, although the invitation does not use DB;
- uses `nodejs_compat` through `vite.config.ts`.

`build/sites-vite-plugin.ts` copies hosting metadata and any Drizzle migrations into `dist/.openai` after build.

---

## 17. Testing and validation baseline

Validation was repeated against commit `beee435` on 1 August 2026.

### Passing checks

#### Production build

```powershell
npm run build
```

Result: passed.

#### JavaScript token tests

```powershell
node --test tests/invitation-token.test.mjs
```

Result: 4 passed, 0 failed.

Covered behavior:

- numbered invitation round-trip;
- family invitation round-trip;
- tampered token rejection;
- legacy Meet-first token compatibility;
- 43-character opaque token shape.

#### Python generator tests

```powershell
python -m unittest tests.test_create_invite_link
```

Result: 5 passed, 0 failed.

Covered behavior:

- supported date parsing;
- unsupported date rejection;
- authenticated obfuscation;
- preserving URL query parameters while replacing token;
- sender side affecting encrypted payload.

#### Current feature tests

```powershell
npm run test:features
```

This runs the invitation-token suite plus the Pooja blessing-emblem suite. The emblem tests verify:

- visibility is tied to the exact decoded Pooja-side condition;
- Meet-side fallback retains the original floret;
- the asset uses the expected path and localized alternative text;
- the image remains unoptimized/direct;
- the PNG stays 1380 × 680 RGBA;
- its SHA-256 remains exact, protecting the approved red/black/gold artwork from silent replacement or recompression.

### Known failing baseline checks

#### `npm test`

The script is:

```text
npm run build && node --test tests/rendered-html.test.mjs
```

The build passes, but `tests/rendered-html.test.mjs` contains obsolete starter-project assertions. It expects:

- a `codex-preview` development meta tag;
- title `Your site is taking shape`;
- a deleted `app/_sites-preview` skeleton;
- `react-loading-skeleton`.

Those expectations deliberately stopped being true when the real invitation replaced the starter. Therefore the two rendered-HTML tests fail at the baseline. The correct maintenance task is to rewrite this test file for the invitation, not to restore the starter skeleton.

#### `npm run lint`

Baseline result: 2 errors and 1 warning.

Errors are React’s `react-hooks/set-state-in-effect` rule for:

1. restoring Gujarati from localStorage with `setLanguage("gu")` inside the initial effect;
2. immediately initializing the countdown with `setCountdown(getCountdown(target))` inside its effect.

Warning:

- `@next/next/no-page-custom-font` objects to the Google font `<link>` in the App Router layout.

These are maintainability issues, not observed runtime failures. A future cleanup can use lazy state initialization/client-safe logic and a framework-supported font approach, but it must preserve behavior and avoid hydration problems.

---

## 18. Known quirks and maintenance risks

### 18.1 Missing/invalid token fallback is intentionally permissive but internally inconsistent

With no valid `i` token:

- names default to Meet first;
- selected day copy initially defaults to the two-day group;
- cover/hero date line therefore says 19–20 September;
- countdown targets 19 September at 09:30;
- personal allocation card is absent;
- all eight events are shown;
- event-section copy and place line are forcibly taken from the three-day group;
- story selection falls through to the Pooja-side family paragraph because side is undefined.

This produces a public generic invitation, but the date/place/story sources are not perfectly aligned. Do not “fix” this incidentally. If changing it, decide explicitly whether generic links should represent two days, all three days, Meet side, or Pooja side, then add tests.

### 18.2 Metadata is not personalized

Social previews remain Meet-first and 19–20 September for every encoded link. Dynamic per-token metadata would require decoding on the server or another safe design.

### 18.3 Language restoration can briefly show English

The initial server/client render is English. Gujarati saved in localStorage is applied after mount, so a brief English flash is possible.

### 18.4 Google font depends on external network

Noto Serif Gujarati is loaded from Google Fonts. Offline use falls back to Shruti/Nirmala UI/system serif.

### 18.5 Web-share support varies

Native share usually works on mobile and secure origins. Clipboard fallback can also require HTTPS/permission. Failure produces localized advice to share from the browser.

### 18.6 Token is not access control

The key is public in the bundle. Never market the token as secure guest authentication.

### 18.7 No RSVP backend

There is no RSVP form, guest database, attendance tracking, analytics, login, D1 data, or R2 upload. Adding any of these is a new product capability, not a small tweak.

### 18.8 Large raster assets

The principal PNG assets total more than 11 MB before network compression/caching. Mobile performance may benefit from future WebP/AVIF responsive assets, but replacements must retain the exact opening crop and visual quality.

### 18.9 Script fonts are platform-dependent

English names use local script fonts (`Snell Roundhand`, `Segoe Script`). Their appearance varies by operating system. Gujarati names intentionally use Noto Serif Gujarati rather than an English script fallback.

### 18.10 Event times are incomplete by design

No exact time is stored for 18 September rituals, Mehendi, or the 20 September wedding ceremony. Do not invent times.

### 18.11 Preserved but currently unused source elements

These items exist at the baseline but are not part of the rendered invitation path:

- `COPY.en.targetLanguage` and `COPY.gu.targetLanguage` are defined but the compact toggle renders fixed `EN` and `ગુ` labels instead.
- `eventTitles.ganesh` exists, but the UI deliberately renders `ganeshTitleLines` to protect the three-line layout.
- `eventTimes.wedding` is an empty string, and the featured Wedding/Lunch card uses the dynamic `weds()` copy instead.
- CSS tokens `--sage` and `--blush` are defined but not referenced by current rules.
- `@keyframes breathe` is defined but no element uses it.
- `public/invitation-cover-v2.png` and the starter SVGs are not referenced.
- `app/chatgpt-auth.ts`, the D1 helper, empty schema, and `examples/d1` are starter capability scaffolds only.
- Tailwind is imported at the top of `globals.css`, but current product markup does not rely on Tailwind utility classes.

Preserve these during unrelated work; remove them only in an explicit cleanup with a successful build and visual regression check.

### 18.12 Hero zoom begins before the guest opens the gate

`.hero-image` starts its 12-second `heroZoom` animation as soon as the page renders, while the fixed opening gate is still covering it. A guest who spends more than 12 seconds on the ribbon/reveal sequence will see the hero at its final scale immediately. If the desired behavior is to animate from the moment the gate opens, the selector/state trigger must be changed deliberately and tested without disturbing the door timings.

---

## 19. Safe modification map

### Change event text, times, translations, or addresses

Edit:

```text
app/invitation-copy.ts
```

If an event’s date, venue type, map URL, feature status, or order changes, also edit:

```text
app/page.tsx → EVENTS
```

Update both languages together.

### Change invited day groups or countdown targets

Edit:

```text
app/page.tsx → INVITED_DAY_DETAILS
app/invitation-copy.ts → ENGLISH_DAYS and GUJARATI_DAYS
lib/invitation-token.mjs → validation only if protocol values change
create_invite_link.py → DATE_GROUPS and validation
scripts/create-invite-link.mjs → CLI help/validation
tests/* → token and generator expectations
README.md and this handoff
```

Changing beyond the three existing groups is a token-protocol/content-model change and requires careful backward compatibility.

### Change name-order behavior

Edit `app/page.tsx` only after checking all consumers of `firstName` and `secondName`. Keep token side values stable:

```text
0 = Meet
1 = Pooja
```

Never swap those encoded meanings because old links would reverse unexpectedly.

Pooja-side religious emblem visibility uses the same decoded `side` value. Keep the condition exact (`side === "pooja"`); do not infer it from the currently displayed first name because language changes that text.

### Change opening animation

Read together:

```text
app/page.tsx → invitationState and openInvitation()
app/globals.css → gate, bow, ribbon, flap, and keyframe rules
```

Preserve by default:

- 1.07 s opening state transition;
- 3.00 s reveal state;
- symmetric left/right transforms;
- four outward flaps;
- no second ribbon;
- indefinite reveal pause;
- language-toggle exclusion;
- reduced-motion path.

Test on a narrow phone viewport and desktop before approval.

### Change falling botanicals

React count/type assignment is in `app/page.tsx`; appearance, distribution, breakpoints, and motion are at the top and bottom of `app/globals.css`.

Keep `pointer-events: none`, reduced-motion disablement, and restrained opacity.

### Change the venue image

Replace `public/narayani-heights-venue.png` with matching portrait dimensions/crop or adjust all three usage surfaces:

- revealed inner card;
- hero;
- sticky venue reveal.

### Change social preview

Replace `public/og.png`, inspect the result, and update the exact width/height values in `app/layout.tsx`.

### Add RSVP or persistent data

This is a new capability. Decide privacy, fields, authentication, spam protection, and data retention first. Then activate D1 deliberately by updating `.openai/hosting.json`, schema, migrations, and hosting configuration. Do not repurpose the example notes API.

---

## 20. Acceptance checklist after future changes

### Opening

- [ ] Sealed cover shows no visible couple names.
- [ ] Language toggle does not overlap “A celebration awaits”.
- [ ] Opening starts only once per load.
- [ ] Bow loosens smoothly and symmetrically.
- [ ] All four ribbon strips retract outward.
- [ ] Four lid flaps move outward without a right-side glitch.
- [ ] No second ribbon flashes on the revealed card.
- [ ] Names appear only after the box opens.
- [ ] Pooja-side reveal shows only the centered Ganeshji emblem in champagne gold, followed by `॥ श्री गणेशाय नमः ॥`; OM SHANTI is absent from this card.
- [ ] The first Narayani Heights hero shows only the smaller centered OM SHANTI emblem with no Ganeshji, white backing, or invocation, while retaining OM SHANTI's original red/black colours.
- [ ] Meet-side reveal shows neither religious emblem and retains the small floret.
- [ ] Pooja-side symbols remain fully inside the card at narrow phone heights.
- [ ] Reveal waits for a second gesture.
- [ ] Tap, swipe/pointer, Enter, and Space continue.
- [ ] Reduced-motion path works.

### Personalization

- [ ] Two guests/day 20/Meet shows Meet first, guest count 2, Wedding Ceremony, and Vidai.
- [ ] Two guests/day 20/Pooja shows Pooja first and “Pooja weds Meet”.
- [ ] Family link hides guest count.
- [ ] Day group 2 shows only 19 and 20 events.
- [ ] Day group 3 shows all eight events and both venues.
- [ ] Tampered token does not expose partial decoded values.
- [ ] Existing v1/v2 links still decode Meet first.

### Language

- [ ] EN/ગુ toggle remains compact at top-right.
- [ ] Selection persists on the same device.
- [ ] `સગાઈ` is used for Ring Ceremony.
- [ ] `હલ્દી` is used for Haldi.
- [ ] Three Ganesh ritual lines never merge or wrap internally.
- [ ] Lunch has the same heading hierarchy as Haldi and a smaller time.
- [ ] Sangeet shares its card with Dinner at 08:00 PM.
- [ ] Wedding Ceremony shares its card with Lunch at 12:30 PM.
- [ ] Vidai appears on 20 September at 03:00 PM in featured styling.
- [ ] Gujarati mode uses Gujarati numerals for all visible dates, times, countdown values, indexes, guest counts, addresses, and pincodes.
- [ ] Names, dates, directions, share feedback, and accessibility labels translate.

### Content and maps

- [ ] Tremont map opens `https://maps.app.goo.gl/g4FNbs7ANbroAfxb8`.
- [ ] Narayani map opens `https://maps.app.goo.gl/7QJob2xzgw7PQsBF9`.
- [ ] Tremont pincode is 382421.
- [ ] Narayani Heights pincode is 382428.
- [ ] Every directions link shows a map-pin symbol.
- [ ] No waterfront/yacht language or image reappears.

### Visual/performance

- [ ] Petals/leaves start only after `open`.
- [ ] Particles do not block interaction.
- [ ] Particle count drops on small phones.
- [ ] Hero and venue crop remain suitable on portrait and desktop.
- [ ] Countdown remains legible at ≤380 px.
- [ ] Event cards remain readable at phone, tablet, and desktop sizes.

### Technical

- [ ] `npm run build` passes.
- [ ] `node --test tests/invitation-token.test.mjs` passes.
- [ ] `python -m unittest tests.test_create_invite_link` passes.
- [ ] New current rendered-HTML tests are added if the stale starter tests are replaced.
- [ ] No source credential or guest-private data is committed.
- [ ] Existing Sites `project_id` is preserved.

---

## 21. Commit history and design evolution

This history explains why the opening behavior contains many carefully tuned decisions.

| Commit | Purpose |
|---|---|
| `5e4f656` | Create Meet and Pooja wedding invitation |
| `3a107b4` | Update venues and Narayani Heights visual |
| `8e24160` | Upgrade invitation opening experience |
| `0e8318c` | Upgrade opening with realistic satin bow |
| `76a9c7f` | Match ribbon pull and four-way box opening |
| `a834d21` | Prevent ribbon flash after invitation reveal |
| `8cafbe2` | Make satin bow untie naturally |
| `b6bb758` | Speed up ribbon opening transition |
| `e83541e` | Make ribbon opening extra fast |
| `aa0cbb1` | Speed up and smooth invitation opening |
| `12dba54` | Make invitation opening ultra fast and fluid |
| `8543c96` | Smooth ribbon and lid motion |
| `8bc6c39` | Make ribbon untie from right-side pull |
| `09be465` | Match natural right-pull ribbon transition |
| `be47db6` | Remove synthetic loose ribbon transition |
| `0d8d4b4` | Make ribbon opening symmetric and smooth |
| `38a7d01` | Pause on invitation reveal until guest gesture |
| `f1fde64` | Match opening speed to reference recording |
| `28a8af0` | Smooth opening motion without changing total speed |
| `63bb944` | Smooth bow opening motion |
| `5e3998c` | Add encrypted personalized invitation links |
| `53fca50` | Add Python invitation link generator |
| `52f751a` | Add configurable invitation side |
| `4f59ed5` | Add English Gujarati language toggle |
| `4febd67` | Refine Gujarati typography and event layout |
| `0552151` | Prevent opening title overlap on mobile |
| `c17b79d` | Update venue maps, addresses, and direction icons |
| `beee435` | Add falling petals and leaves effect |

The approved baseline is the cumulative result of all these commits, not only the final botanical patch.

---

## 22. Suggested first prompt on the new laptop

Give the new Codex session this source folder and say:

```text
Read PROJECT_HANDOFF_COMMIT_beee435.md completely before taking action.
Treat commit beee435421fc41f60d21aae244df1d359a94c20b as the approved baseline.
Inspect git status and preserve any user changes. Use the existing vinext/React
architecture and .openai/hosting.json project identity. Do not alter the approved
opening speed, symmetric bow behavior, reveal pause, URL token compatibility,
Gujarati terminology, event data, or venue links unless I explicitly request it.
First, run the documented build and targeted personalization tests, then tell me
whether this copy matches the recorded baseline.
```

---

## 23. Verification record

### Historical `beee435` baseline

```text
HEAD: beee435421fc41f60d21aae244df1d359a94c20b
Tracked diff from beee435 to HEAD: none
Production build: PASS
JavaScript invitation-token tests: 4 PASS / 0 FAIL
Python invitation-link tests: 5 PASS / 0 FAIL
npm test: FAIL only because rendered-html.test.mjs still tests deleted starter UI
ESLint: 2 baseline errors and 1 warning, documented above
```

Untracked reference video/frame files in the original workspace were deliberately not modified or included in the commit baseline.

### Current approved forward state — Pooja-side blessing emblems

Validation after the 1 August 2026 emblem change:

```text
Production build: PASS
JavaScript invitation-token tests: 4 PASS / 0 FAIL
Python invitation-link tests: 5 PASS / 0 FAIL
Current feature tests: 9 PASS / 0 FAIL
Final emblem PNG: 1380 × 680, 32-bit RGBA, transparent corners
Final emblem SHA-256: 7ec62fbe107edadcb9066515f8197821a041403e40b3028904333ea9890c8d19
```

Forward-state files introduced or changed:

```text
public/pooja-blessings.png
app/page.tsx
app/globals.css
app/invitation-copy.ts
tests/pooja-blessings.test.mjs
tests/family-compliments.test.mjs
tests/event-details.test.mjs
PYTHON_INVITE_LINK_GUIDE.md
package.json
README.md
PROJECT_HANDOFF_COMMIT_beee435.md
```

The combined emblem was prepared from the two owner-supplied reference images. Ganeshji was changed to champagne gold, the OM SHANTI emblem was constrained to preserve red sunburst/black lettering, a flat temporary chroma background was removed, transparent bounds were cropped with padding, and only the final RGBA PNG was kept in the project.

The same unchanged PNG supports two Pooja-side presentations. The temporary revealed opening card uses a CSS crop to show only centered Ganeshji, followed by the exact Devanagari invocation `॥ श्री गणेशाय नमः ॥` in deep sage. The first Narayani Heights hero uses a separate right-side CSS crop to show only a smaller centered OM SHANTI emblem. It has no Ganeshji, border, white/ivory backing, shadow, blur, or invocation. Hero placement is conditional on the decoded side exactly matching `pooja`; missing, invalid, and Meet-side links do not display it there.

The first-page navigation control is an accessible anchor styled as a button with `href="#story"`. It uses the existing localized `explore` and `exploreAria` copy. The global `html { scroll-behavior: smooth; }` rule provides the requested transition, and the project’s existing `prefers-reduced-motion` rule changes it to `auto` for guests who disable animation.

### Current approved forward state — Pooja-side family compliments

The final page is rendered only inside the exact `showPoojaBlessings` condition, which itself is true only after a valid invitation token decodes with `side === "pooja"`. It appears after the existing closing/share call-to-action, making it the last scrolling section. Meet-side, missing-token, and invalid-token views do not show it.

The exact adult family lines are:

```text
G.S. Savitaben & Late Amrutbhai M. Modi
Late Chandrikaben & Mr. Manaharbhai M. Modi
G.S. Jyotsnaben & Late Kiritbhai A. Modi
Mrs. Sangitaben & Mr. Sureshbhai A. Modi
Mrs. Komal & Mr. Brijesh M. Modi
Mrs. Kashish & Mr. Mitul K. Modi
Mrs. Somya & Mr. Ishan S. Modi
Mrs. Chinar & Mr. Monik S. Modi
Mr. Krunal K. Modi
```

The exact younger family names are:

```text
Devyanshi · Naisha · Dhruv · Roohani · Radhika
```

Do not “correct” or normalize any spelling without explicit owner approval. In particular, preserve `Manaharbhai`, `Monik`, `Roohani`, and all initials exactly. The `Qty...25` print-production note visible above the owner-supplied reference artwork is deliberately excluded from the invitation.

English heading: `With Best Compliments From`

Gujarati heading: `શુભેચ્છા સહ`

English mode keeps the supplied Latin spellings. Gujarati mode uses the following exact adult lines:

```text
ગં.સ્વ. સવિતાબેન અને સ્વ. અમૃતભાઈ એમ. મોદી
સ્વ. ચંદ્રિકાબેન અને શ્રી મનહરભાઈ એમ. મોદી
ગં.સ્વ. જ્યોત્સનાબેન અને સ્વ. કિરીટભાઈ એ. મોદી
શ્રીમતી સંગીતાબેન અને શ્રી સુરેશભાઈ એ. મોદી
શ્રીમતી કોમલ અને શ્રી બ્રિજેશ એમ. મોદી
શ્રીમતી કશિશ અને શ્રી મિતુલ કે. મોદી
શ્રીમતી સૌમ્યા અને શ્રી ઈશાન એસ. મોદી
શ્રીમતી ચિનાર અને શ્રી મોનિક એસ. મોદી
શ્રી કૃણાલ કે. મોદી
```

Gujarati younger family names:

```text
દેવ્યાંશી · નાયશા · ધ્રુવ · રૂહાની · રાધિકા
```

Both arrays are keyed by the live `language` state, so the list updates immediately with the existing English/Gujarati toggle without altering the encoded invitation URL. Gujarati list typography is explicitly forced to Noto Serif Gujarati, overriding the English Georgia list style. The former P&M initials have been replaced with localized full names: `Pooja & Meet` in English and `પૂજા & મીત` in Gujarati. The page uses a full-name script/signature treatment, deep-sage heading, champagne rules/accents, ivory inset card, quiet shadows, and pale sage botanical ornaments. It does not reuse the orange print-reference design.

Compact Gujarati month labels are deliberately larger than their English counterparts for legibility. `.language-gu .inner-rule span` and `.language-gu .event-date-block small` use 10px instead of the shared 8px base size. This affects `સપ્ટેમ્બર` on the revealed opening date rule and on the event-card date rails without enlarging unrelated English labels.

`PYTHON_INVITE_LINK_GUIDE.md` is the dedicated owner-facing generator manual. It documents prerequisites, `--help`, guided mode, every CLI option, local testing on the development-server port, hosted link generation, several Pooja/Meet/date/count examples, appending multiple outputs to `test-invite-links.txt`, token behavior, and common errors. Keep it aligned with `create_invite_link.py` whenever the generator interface changes.

This document describes both the historical `beee435` baseline and every approved forward change listed in its Living handoff status. Later changes must be appended rather than silently treated as part of the original baseline.

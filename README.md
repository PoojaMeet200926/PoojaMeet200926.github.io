# Pooja & Meet Interactive Wedding Invitation

A mobile-first wedding invitation built with Next.js, React, TypeScript, Tailwind CSS, and the existing vinext/Cloudflare Sites setup.

## Before you begin

Install [Node.js](https://nodejs.org/) version `22.13.0` or newer.

## Run the invitation on Windows

1. Extract the project ZIP to a folder on your computer.
2. Open that folder in Visual Studio Code.
3. In Visual Studio Code, choose **Terminal > New Terminal**.
4. Install the project packages:

   ```text
   npm install
   ```

5. Start the local website:

   ```text
   npm run dev
   ```

6. Open the exact `Local` address printed in the terminal. The port can vary, so use the address shown there.
7. To stop the local website, return to the terminal and press `Ctrl+C`.

## Ribbon opening video

The realistic opening must be supplied at this exact path:

```text
public/ribbon-opening.mp4
```

When the file is absent, blocked, or cannot play, the invitation uses a simple cover crossfade. It does not simulate realistic ribbon or fabric in CSS, SVG, canvas, DOM panels, or Three.js.

Recommended video export:

- MP4 with H.264 video
- 9:16 aspect ratio
- 1080 × 1920 master, or 720 × 1280 web version
- 30 frames per second
- 3–5 seconds
- AAC audio only when needed
- Web optimized / fast start enabled
- Approximately 2–6 MB when quality permits
- First and final visual handoff matched to `public/invitation-cover-v2.png`

More detail is available in `public/RIBBON-OPENING-INSTRUCTIONS.txt`.

## Check the project

Run these commands in the project terminal:

```text
npm run lint
npm run build
npm test
```

## Wedding details awaiting confirmation

The site labels these values as pending and does not present them as verified:

- Ganesh Sthapan / Mandap Muhurat / Grah Shanti time and venue
- Mehendi time
- Mameru venue
- Sangeet venue
- Main wedding time and venue
- Groom family wording
- RSVP contact and attendance rules
- Dress codes
- Accommodation and travel recommendations
- Gifts or registry wording
- Gujarati translation

Update confirmed facts in `app/data/invitation.ts`.

import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("keeps the opening screen lightweight and defers noncritical assets", async () => {
  const [layout, page, css, lid, bow] = await Promise.all([
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
    stat(new URL("public/invitation-box-lid.webp", root)),
    stat(new URL("public/satin-bow-v2.webp", root)),
  ]);

  assert.ok(lid.size + bow.size < 400 * 1024, "critical opening images must remain under 400 KB");
  assert.doesNotMatch(layout, /rel="preload"[\s\S]*?invitation-box-lid\.webp/);
  assert.doesNotMatch(layout, /rel="preload"[\s\S]*?satin-bow-v2\.webp/);
  assert.doesNotMatch(layout, /fonts\.googleapis\.com/);
  assert.match(page, /language !== "gu"[\s\S]*?fonts\.googleapis\.com/);
  assert.match(css, /\.gate-untying \.gate-inner-card[\s\S]*?url\('\/narayani-heights-venue\.webp'\)/);
  assert.match(css, /\.invitation-open \.event-garland \{ background-image: url\('\/festive-floral-garland-optimized\.webp'\); \}/);
});

test("scales every floral page background responsively", async () => {
  const css = await readFile(new URL("app/globals.css", root), "utf8");

  assert.match(
    css,
    /\.invitation-open \.story,[\s\S]*?\.invitation-open \.personal-invitation-card,[\s\S]*?\.invitation-open \.countdown-section,[\s\S]*?\.invitation-open \.events-section,[\s\S]*?\.invitation-open \.closing,[\s\S]*?\.invitation-open \.compliments-card \{[\s\S]*?background-image: url\('\/festive-floral-frame-optimized\.webp'\);[\s\S]*?background-size: cover;/,
  );
  assert.match(
    css,
    /\.invitation-open \.events-section \{[\s\S]*?background-repeat: repeat-y;[\s\S]*?background-size: 100% auto;/,
  );
  assert.doesNotMatch(css, /\.floral-frame/);
});

test("opens the ribbon with tap, click, multidirectional gestures, wheel, and keyboard", async () => {
  const [page, copy, css] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/invitation-copy.ts", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);

  assert.match(page, /onClick=\{openInvitation\}/);
  assert.match(page, /onPointerDown=\{beginOpeningGesture\}/);
  assert.match(page, /onPointerMove=\{continueOpeningGesture\}/);
  assert.match(page, /const finishOpeningGesture[\s\S]*?openingGestureRef\.current = null;[\s\S]*?openInvitation\(\);/);
  assert.match(page, /Math\.hypot\(event\.clientX - start\.x, event\.clientY - start\.y\)/);
  assert.match(page, /onWheel=\{openFromWheel\}/);
  assert.match(page, /onKeyDown=\{openFromKeyboard\}/);
  assert.match(copy, /Tap, click, swipe, or drag to open/);
  assert.match(copy, /રિબન ખોલવા ટૅપ, ક્લિક, સ્વાઇપ અથવા ડ્રૅગ કરો/);
  assert.match(css, /\.invitation-gate \{[\s\S]*?touch-action: none;/);
});

test("starts with licensed romantic music after the ribbon gesture and keeps controls accessible", async () => {
  const [page, copy, css, romanticTrack, firstTrack, secondTrack, thirdTrack] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/invitation-copy.ts", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
    stat(new URL("public/music/wedding-romantic-leberch.mp3", root)),
    stat(new URL("public/music/mangal-prabhat.wav", root)),
    stat(new URL("public/music/phoolon-ki-hawa.wav", root)),
    stat(new URL("public/music/shubh-milan.wav", root)),
  ]);

  assert.match(page, /const SOFT_SOUNDTRACKS = \[/);
  assert.match(page, /SOFT_SOUNDTRACKS = \[\s*\{ src: "\/music\/wedding-romantic-leberch\.mp3"/);
  assert.match(page, /openingStartedRef\.current = true;[\s\S]*?startSoundtrack\(\);/);
  assert.match(page, /preload="none"/);
  assert.match(page, /onEnded=\{playNextSoundtrack\}/);
  assert.match(page, /aria-pressed=\{musicEnabled && soundtrackStarted\}/);
  assert.match(copy, /Mute the background music/);
  assert.match(copy, /પાર્શ્વ સંગીત બંધ કરો/);
  assert.match(css, /\.floating-music[\s\S]*?left: 16px; bottom: 16px;/);
  assert.match(page, /Wedding Romantic — leberch/);
  assert.match(page, /pixabay\.com\/service\/license-summary/);
  assert.match(css, /\.music-credit \{[\s\S]*?font: 400 8px\/1\.55/);
  assert.ok(romanticTrack.size < 3 * 1024 * 1024);
  assert.ok(firstTrack.size + secondTrack.size + thirdTrack.size < 4 * 1024 * 1024);
});

test("allows private PDF links to request Gujarati without changing encrypted invitation details", async () => {
  const page = await readFile(new URL("app/page.tsx", root), "utf8");

  assert.match(page, /new URLSearchParams\(window\.location\.search\)\.get\("lang"\)/);
  assert.match(page, /requestedLanguage === "gu" \|\| requestedLanguage === "en"/);
  assert.match(page, /setLanguage\(requestedLanguage\);/);
});

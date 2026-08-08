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
  assert.match(layout, /rel="preload"[\s\S]*?href="\/invitation-box-lid\.webp"[\s\S]*?fetchPriority="high"/);
  assert.match(layout, /rel="preload" href="\/satin-bow-v2\.webp"/);
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
  assert.match(page, /Math\.hypot\(event\.clientX - start\.x, event\.clientY - start\.y\)/);
  assert.match(page, /onWheel=\{openFromWheel\}/);
  assert.match(page, /onKeyDown=\{openFromKeyboard\}/);
  assert.match(copy, /Tap, click, swipe, or drag to open/);
  assert.match(copy, /રિબન ખોલવા ટૅપ, ક્લિક, સ્વાઇપ અથવા ડ્રૅગ કરો/);
  assert.match(css, /\.invitation-gate \{[\s\S]*?touch-action: none;/);
});

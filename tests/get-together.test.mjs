import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("renders an encrypted-link-controlled post-wedding get-together", async () => {
  const [page, copy, css, background] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/invitation-copy.ts", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
    stat(new URL("public/ghee-gud-get-together.webp", root)),
  ]);

  assert.ok(background.size < 250 * 1024, "get-together hero background should stay mobile-friendly");
  assert.match(page, /occasion: "wedding" \| "get-together"/);
  assert.match(page, /key: "getTogether",[\s\S]*?date: "20",[\s\S]*?venue: "gheeGud"/);
  assert.match(page, /https:\/\/maps\.app\.goo\.gl\/7bnxnocVCByBzjG49/);
  assert.match(page, /invitationDetails\?\.occasion === "get-together"/);
  assert.match(page, /invitationDetails && !isGetTogether/);
  assert.match(page, /isGetTogether && \([\s\S]*?className="get-together-inviters paper-section"/);
  assert.match(page, /renderInviters\(MEET_INVITERS\[language\], MEET_CONTACT_NUMBERS\)/);
  assert.match(page, /"Mr\. Mukesh Dhirajlal Modi"/);
  assert.match(page, /"Mrs\. Belaben Mukesh Modi"/);
  assert.match(copy, /heroHeading: "Let's Get Together"/);
  assert.match(copy, /getTogether: "08:00 PM – 10:00 PM"/);
  assert.match(copy, /getTogether: "રાત્રે 08:00 થી 10:00"/);
  assert.match(copy, /gheeGud: "Ghee Gud Restaurant"/);
  assert.match(copy, /gheeGud: "ઘી ગુડ રેસ્ટોરન્ટ"/);
  assert.match(css, /occasion-get-together[\s\S]*?url\('\/ghee-gud-get-together\.webp'\)/);
  assert.match(css, /\.occasion-get-together \.event-garland \{ display: none; \}/);
  assert.match(css, /\.get-together-inviters \.compliments-contact\s*\{[\s\S]*?background: rgba\(255,250,241,\.86\)/);
});


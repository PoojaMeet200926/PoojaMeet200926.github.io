import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("adds Vidai and the requested meal pairings", async () => {
  const [page, copy] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/invitation-copy.ts", root), "utf8"),
  ]);

  assert.match(page, /key: "haldi",[\s\S]*?date: "19",[\s\S]*?meal: "lunch"/);
  assert.match(page, /key: "sangeet",[\s\S]*?date: "19",[\s\S]*?meal: "dinner"/);
  assert.match(page, /key: "wedding",[\s\S]*?date: "20",[\s\S]*?featured: true,[\s\S]*?meal: "lunch"/);
  assert.match(page, /key: "vidai",[\s\S]*?date: "20",[\s\S]*?featured: true/);
  assert.match(page, /event\.meal === "dinner" \? copy\.dinnerTitle : copy\.lunchTitle/);
  assert.match(copy, /vidai: "Vidai"/);
  assert.match(copy, /vidai: "વિદાય"/);
  assert.match(copy, /vidai: "03:00 PM"/);
  assert.match(copy, /vidai: "બપોરે 03:00"/);
  assert.match(copy, /dinnerTitle: "Dinner"/);
  assert.match(copy, /dinnerTime: "08:00 PM"/);
  assert.match(copy, /dinnerTitle: "રાત્રિભોજન"/);
  assert.match(copy, /dinnerTime: "રાત્રે 08:00"/);
});

test("localizes every rendered number for Gujarati and enlarges statement labels", async () => {
  const [page, css] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);

  assert.match(page, /const GUJARATI_DIGITS = \["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"\]/);
  assert.match(page, /return text\.replace\(\/\\d\/g, \(digit\) => GUJARATI_DIGITS\[Number\(digit\)\]\)/);
  assert.match(page, /formatDigits\(displayDetails\.dateLine\)/);
  assert.match(page, /formatDigits\(displayDetails\.invitationCopy\)/);
  assert.match(page, /formatDigits\(String\(value\)\.padStart\(2, "0"\)\)/);
  assert.match(page, /formatDigits\(copy\.venues\[event\.venue\]\)/);
  assert.match(css, /\.eyebrow, \.section-kicker \{[^}]*clamp\(12px,3vw,14px\)/);
  assert.match(css, /\.language-gu \.eyebrow, \.language-gu \.section-kicker \{ font-size: clamp\(13px,3\.2vw,15px\)/);
});

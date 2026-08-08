import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("shows the complete Wedding Ceremony card on both invitation sides", async () => {
  const [page, copy] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/invitation-copy.ts", root), "utf8"),
  ]);

  assert.match(page, /key: "haldi",[\s\S]*?date: "19",[\s\S]*?meal: "lunch"/);
  assert.match(page, /key: "sangeet",[\s\S]*?date: "19",[\s\S]*?meal: "dinner"/);
  assert.match(page, /key: "wedding",[\s\S]*?date: "20",[\s\S]*?featured: true,[\s\S]*?meal: "lunch"/);
  assert.doesNotMatch(page, /\{\s*key: "vidai",[\s\S]*?weekday:/);
  assert.match(page, /event\.meal === "dinner" \? copy\.dinnerTitle : copy\.lunchTitle/);
  assert.match(copy, /vidai: "Vidai"/);
  assert.match(copy, /vidai: "વિદાય"/);
  assert.match(copy, /vidai: "03:00 PM"/);
  assert.match(copy, /vidai: "બપોરે 03:00"/);
  assert.match(copy, /dinnerTitle: "Dinner"/);
  assert.match(copy, /dinnerTime: "08:00 PM"/);
  assert.match(copy, /dinnerTitle: "રાત્રિભોજન"/);
  assert.match(copy, /dinnerTime: "રાત્રે 08:00"/);
  assert.match(copy, /ganesh: "08:00 AM"/);
  assert.match(copy, /mehendi: "મહેંદી"/);
  assert.doesNotMatch(copy, /મહેંદી અને આનંદની બપોર/);
  assert.match(copy, /ganesh: "સવારે 08:00"/);
  assert.match(page, /event\.key === "wedding" \? \([\s\S]*?copy\.eventTitles\.wedding[\s\S]*?copy\.weds\(firstName, secondName\)[\s\S]*?className="event-schedule-stack"[\s\S]*?copy\.hastaMelapTitle[\s\S]*?copy\.hastaMelapTime[\s\S]*?copy\.lunchTitle[\s\S]*?copy\.lunchTime[\s\S]*?copy\.eventTitles\.vidai[\s\S]*?copy\.eventTimes\.vidai/);
  assert.doesNotMatch(page, /event\.key === "wedding" \? \(\s*isMeetSide \?/);
  assert.match(copy, /hastaMelapTitle: "Hast Melap"/);
  assert.match(copy, /hastaMelapTime: "11:00 AM"/);
  assert.match(copy, /hastaMelapTitle: "હસ્ત મેળાપ"/);
  assert.match(copy, /hastaMelapTime: "સવારે 11:00"/);
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

test("keeps the original heading and gives Meet a Sunday-only schedule", async () => {
  const [page, copy] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/invitation-copy.ts", root), "utf8"),
  ]);

  assert.match(page, /<p className="section-kicker">\{copy\.weekend\}<\/p>/);
  assert.match(page, /<h2>\{copy\.celebrate\}<\/h2>/);
  assert.match(page, /const selectedDays: DayCount = isMeetSide \? 1 : invitationDetails\?\.days \?\? 2/);
  assert.match(page, /if \(invitationDetails\?\.side === "meet"\) return MEET_EVENTS/);
  assert.match(page, /const MEET_EVENTS:[\s\S]*?key: "ganesh",[\s\S]*?weekday: "sunday",[\s\S]*?date: "20",[\s\S]*?key: "wedding",[\s\S]*?weekday: "sunday",[\s\S]*?date: "20"/);
  assert.match(page, /isMeetSide \? copy\.meetEventCopy : displayDetails\.eventCopy/);
  assert.match(page, /isMeetSide && event\.key === "ganesh" \? copy\.meetGaneshTime/);
  assert.match(copy, /meetGaneshTitleLines: \["વિઘ્નહર્તાનું આગમન", "તથા ગ્રહ શાંતિ"\]/);
  assert.match(copy, /meetGaneshTime: "સવારે 08:00 કલાકે"/);
  assert.match(copy, /meetEventCopy:[\s\S]*?"વિક્રમ સંવત 2082ના ભાદરવાના નોમ, રવિવાર, 20\/09\/2026ના શુભ દિવસે શુભ મુહૂર્ત\."/);
});

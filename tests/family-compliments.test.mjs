import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("shows the exact Modi family compliments only on Pooja-side invitations", async () => {
  const [page, copy, css] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/invitation-copy.ts", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);

  assert.match(page, /showPoojaBlessings && \([\s\S]*?<section className="family-compliments"/);
  assert.match(page, /"G\.S\. Savitaben & Late Amrutbhai M\. Modi"/);
  assert.match(page, /"Late Chandrikaben & Mr\. Manaharbhai M\. Modi"/);
  assert.match(page, /"G\.S\. Jyotsnaben & Late Kiritbhai A\. Modi"/);
  assert.match(page, /"Mrs\. Sangitaben & Mr\. Sureshbhai A\. Modi"/);
  assert.match(page, /"Mrs\. Komal & Mr\. Brijesh M\. Modi"/);
  assert.match(page, /"Mrs\. Kashish & Mr\. Mitul K\. Modi"/);
  assert.match(page, /"Mrs\. Somya & Mr\. Ishan S\. Modi"/);
  assert.match(page, /"Mrs\. Chinar & Mr\. Monik S\. Modi"/);
  assert.match(page, /"Mr\. Krunal K\. Modi"/);
  assert.match(page, /en: \["Devyanshi", "Naisha", "Dhruv", "Roohani", "Radhika"\]/);
  assert.match(page, /"ગં\.સ્વ\. સવિતાબેન અને સ્વ\. અમૃતભાઈ એમ\. મોદી"/);
  assert.match(page, /"સ્વ\. ચંદ્રિકાબેન અને શ્રી મનહરભાઈ એમ\. મોદી"/);
  assert.match(page, /"શ્રીમતી સૌમ્યા અને શ્રી ઈશાન એસ\. મોદી"/);
  assert.match(page, /gu: \["દેવ્યાંશી", "નાયશા", "ધ્રુવ", "રૂહાની", "રાધિકા"\]/);
  assert.doesNotMatch(page, /"નૈશા"/);
  assert.match(page, /POOJA_FAMILY_COMPLIMENTS\[language\]\.map/);
  assert.match(page, /POOJA_YOUNG_FAMILY\[language\]\.map/);
  assert.match(page, /aria-label=\{`Call \$\{phone\.display\}`\}>\{formatDigits\(phone\.display\)\}<\/a>/);
  assert.match(page, /className="compliments-monogram"[\s\S]*?copy\.names\.pooja[\s\S]*?copy\.names\.meet/);
  assert.match(page, /className="compliments-heading-panel"[\s\S]*?className="compliments-monogram"/);
  assert.match(copy, /complimentsHeading: "With Best Compliments From"/);
  assert.match(copy, /complimentsHeading: "શુભેચ્છા સહ"/);
  assert.match(copy, /youngerFamilyAria: "દેવ્યાંશી, નાયશા, ધ્રુવ, રૂહાની અને રાધિકા તરફથી સ્નેહ સહ"/);
  assert.match(copy, /guestOne: "આપનું સહર્ષ સ્વાગત છે\."/);
  assert.match(copy, /`આપ સહિત કુલ \$\{count\} મહેમાનોનું સહર્ષ સ્વાગત છે\.`/);
  assert.doesNotMatch(copy, /અનામત/);
  assert.match(css, /\.family-compliments\s*\{/);
  assert.match(css, /\.compliments-card\s*\{/);
  assert.match(css, /\.compliments-card::before\s*\{[\s\S]*?linear-gradient\(90deg/);
  assert.match(css, /\.compliments-heading-panel\s*\{[\s\S]*?background: none; border: 0/);
  assert.match(css, /\.compliments-contact\s*\{[\s\S]*?background: none; border: 0/);
  assert.match(css, /\.language-gu \.compliments-list li,[\s\S]*?"Noto Serif Gujarati"/);
  assert.match(css, /\.language-gu \.compliments-monogram[\s\S]*?"Noto Serif Gujarati"/);
  assert.match(css, /\.language-gu \.inner-rule span \{ font-size: 10px; \}/);
  assert.match(css, /\.language-gu \.event-date-block small \{ font-size: 10px;/);
});

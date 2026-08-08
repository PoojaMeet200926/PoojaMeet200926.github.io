import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("shows the correct family compliments for both invitation sides", async () => {
  const [page, copy, css] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/invitation-copy.ts", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);

  assert.match(page, /invitationDetails && \([\s\S]*?className=\{`family-compliments\$\{isMeetSide/);
  assert.match(page, /aria-label=\{isMeetSide \? copy\.meetComplimentsAria : copy\.complimentsAria\}/);
  assert.match(page, /"G\.S\. Savitaben & Late Amrutbhai M\. Modi"/);
  assert.match(page, /"Late Chandrikaben & Mr\. Manaharbhai M\. Modi"/);
  assert.match(page, /"G\.S\. Jyotsnaben & Late Kiritbhai A\. Modi"/);
  assert.match(page, /"Mrs\. Sangitaben & Mr\. Sureshbhai A\. Modi"/);
  assert.match(page, /"Mrs\. Komal & Mr\. Brijesh M\. Modi"/);
  assert.match(page, /"Mrs\. Kashish & Mr\. Mitul K\. Modi"/);
  assert.match(page, /"Mrs\. Somya & Mr\. Ishan S\. Modi"/);
  assert.match(page, /"Mrs\. Chinar & Mr\. Monik S\. Modi"/);
  assert.match(page, /"Mr\. Krunal K\. Modi"/);
  assert.match(page, /"Late Dahiben and Late Ramanlal Lalluram Modi"/);
  assert.match(page, /\["Sheetal and Jay Modi", "Krupaben and Kaushal Modi"\]/);
  assert.match(page, /\["Chandni and Darshit Modi", "Dr\. Nikiben and Dr\. Ronak Modi"\]/);
  assert.match(page, /\["Aarohi and Ishan Modi", "Yash Dineshbhai Modi"\]/);
  assert.match(page, /"Shivam and Rishit Mayurbhai Modi"/);
  assert.match(page, /"Niruben and Mayurbhai Modi"\],[\s\S]*?\["Sheetalben and Jatinbhai Modi"/);
  assert.match(page, /en: \["Devyanshi", "Naisha", "Dhruv", "Roohani", "Radhika"\]/);
  assert.match(page, /"ગં\.સ્વ\. સવિતાબેન અને સ્વ\. અમૃતભાઈ એમ\. મોદી"/);
  assert.match(page, /"સ્વ\. ચંદ્રિકાબેન અને શ્રી મનહરભાઈ એમ\. મોદી"/);
  assert.match(page, /"શ્રીમતી સૌમ્યા અને શ્રી ઈશાન એસ\. મોદી"/);
  assert.match(page, /gu: \["દેવ્યાંશી", "નાયશા", "ધ્રુવ", "રૂહાની", "રાધિકા"\]/);
  assert.doesNotMatch(page, /"નૈશા"/);
  assert.match(page, /POOJA_FAMILY_COMPLIMENTS\[language\]\.map/);
  assert.match(page, /POOJA_YOUNG_FAMILY\[language\]\.map/);
  assert.match(page, /aria-label=\{`Call \$\{phone\.display\}`\}>\{formatDigits\(phone\.display\)\}<\/a>/);
  assert.match(page, /className="compliments-monogram"[\s\S]*?firstName[\s\S]*?secondName/);
  assert.match(page, /"મામા, મામી, નાના, નાની"/);
  assert.match(page, /"ડાહીબેન તથા રમણલાલ લલ્લુરામ મોદી"/);
  assert.match(page, /"સ્વ\. મહેશકુમાર મોદી"/);
  assert.doesNotMatch(page, /સ્વર્ગસ્થ મહેશકુમાર મોદી/);
  assert.match(page, /"મોંઘેરા મહેમાન"/);
  assert.match(page, /"વિશ્વા હર્ષ મોદી"/);
  assert.doesNotMatch(page, /"વિશ્વ હર્ષ મોદી"/);
  assert.match(page, /\["શીતલ જય મોદી", "કૃપાબેન તથા કૌશલ મોદી"\]/);
  assert.match(page, /\["ચાંદની દર્શિત મોદી", "ડૉ\. નિકીબેન તથા ડો\. રોનક મોદી"\]/);
  assert.match(page, /"સ્વ\. ચંપાબેન તથા સ્વ\. નટવરલાલ મોદી"/);
  assert.match(page, /MEET_FAMILY_COMPLIMENTS\[language\]\.map/);
  assert.match(page, /className="compliments-heading-panel"[\s\S]*?className="compliments-monogram"/);
  assert.match(copy, /complimentsHeading: "With Best Compliments From"/);
  assert.match(copy, /complimentsHeading: "શુભેચ્છા સહ"/);
  assert.match(copy, /meetComplimentsAria: "મીતના પરિવાર તરફથી શુભેચ્છાઓ"/);
  assert.match(copy, /youngerFamilyAria: "દેવ્યાંશી, નાયશા, ધ્રુવ, રૂહાની અને રાધિકા તરફથી સ્નેહ સહ"/);
  assert.match(copy, /guestOne: "આપનું સહર્ષ સ્વાગત છે\."/);
  assert.match(copy, /`આપ સહિત કુલ \$\{count\} મહેમાનોનું સહર્ષ સ્વાગત છે\.`/);
  assert.doesNotMatch(copy, /અનામત/);
  assert.match(css, /\.family-compliments\s*\{/);
  assert.match(css, /\.compliments-card\s*\{/);
  assert.match(css, /\.compliments-card::before\s*\{[\s\S]*?linear-gradient\(90deg/);
  assert.match(css, /\.compliments-heading-panel\s*\{[\s\S]*?background: none; border: 0/);
  assert.match(css, /\.compliments-contact\s*\{[\s\S]*?background: none; border: 0/);
  assert.match(css, /\.meet-compliments-row\.is-paired \{ grid-template-columns: repeat\(2,minmax\(0,1fr\)\); gap: 0; align-items: stretch; \}/);
  assert.match(css, /\.meet-compliments-row\.is-paired p \+[\s\S]*?border-left: 1px solid/);
  assert.match(css, /\.invitation-open \.compliments-card-meet \{[\s\S]*?background-repeat: repeat-y;[\s\S]*?background-size: 100% auto;/);
  assert.match(css, /\.language-gu \.compliments-list li,[\s\S]*?"Noto Serif Gujarati"/);
  assert.match(css, /\.language-gu \.compliments-monogram[\s\S]*?"Noto Serif Gujarati"/);
  assert.match(css, /\.language-gu \.inner-rule span \{ font-size: 10px; \}/);
  assert.match(css, /\.language-gu \.event-date-block small \{ font-size: 10px;/);
});

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("shows Ganeshji blessings for both sides and OM SHANTI only for Pooja", async () => {
  const [page, copy, css] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/invitation-copy.ts", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);

  assert.match(page, /invitationDetails\?\.side === "pooja"/);
  assert.match(page, /const showOpeningBlessings = invitationDetails !== null/);
  assert.match(page, /showOpeningBlessings[\s\S]*?className="ganesh-emblem"[\s\S]*?copy\.ganeshInvocation[\s\S]*?isMeetSide &&[\s\S]*?copy\.mahalaxmiInvocation[\s\S]*?:[\s\S]*?<span className="inner-floret">✦<\/span>/);
  assert.match(page, /showPoojaBlessings && \([\s\S]*?className="hero-om-shanti"[\s\S]*?aria-label=\{copy\.omShantiAlt\}/);
  assert.match(page, /isMeetSide && \([\s\S]*?className="hero-deity-trio"[\s\S]*?aria-label=\{copy\.deityTrioAlt\}/);
  assert.doesNotMatch(page, /className="hero-blessing-invocation"/);
  assert.match(page, /className="hero-next-button" href="#story"/);
  assert.match(copy, /omShantiAlt: "OM SHANTI blessing symbol"/);
  assert.match(copy, /deityTrioAlt: "Saraswati, Lakshmi, and Ganesh blessings"/);
  assert.match(copy, /deityTrioAlt: "સરસ્વતીજી, લક્ષ્મીજી અને ગણેશજીનું શુભ પ્રતીક"/);
  assert.match(copy, /ganeshBlessingAlt: "Ganeshji blessing symbol"/);
  assert.match(copy, /ganeshInvocation: "॥ श्री गणेशाय नमः ॥"/);
  assert.match(copy, /mahalaxmiInvocation: "॥ श्री महालक्ष्मी मातायै नमः ॥"/);
  assert.match(copy, /"હરિયાળી લૉન, ભવ્ય સમારંભ સ્થળો અને યાદગાર ઉજવણી માટેનું સુંદર વાતાવરણ\."/);
  assert.match(css, /\.ganesh-emblem\s*\{/);
  assert.match(css, /\.gate-inner-card-blessed > \.gate-blessing-invocation\s*\{/);
  assert.match(css, /\.hero-om-shanti\s*\{[\s\S]*?top: max\(58px,calc\(env\(safe-area-inset-top\) \+ 50px\)\)[\s\S]*?width: min\(70px,16\.5vw\)[\s\S]*?aspect-ratio: 640 \/ 680[\s\S]*?background-position: right top; background-size: auto 100%; background-repeat: no-repeat;/);
  assert.match(css, /\.invitation-open \.hero-om-shanti \{ background-image: url\('\/pooja-blessings\.webp'\); \}/);
  assert.match(css, /\.hero-deity-trio\s*\{[\s\S]*?width: min\(340px,68vw\)[\s\S]*?url\('\/meet-deity-trio\.webp'\)/);
  assert.match(css, /\.invitation-open \.hero-deity-trio \{ animation: deityTrioReveal/);
  assert.doesNotMatch(css, /\.hero-om-shanti\s*\{[^}]*background-color/);
  assert.match(css, /\.hero-next-button\s*\{/);
  assert.match(css, /html \{ scroll-behavior: smooth;/);

  const deityTrio = await readFile(new URL("public/meet-deity-trio.webp", root));
  assert.equal(deityTrio.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(deityTrio.subarray(8, 12).toString("ascii"), "WEBP");
  assert.ok(deityTrio.length < 300 * 1024, "Meet deity trio must remain under 300 KB");
  assert.equal(
    createHash("sha256").update(deityTrio).digest("hex"),
    "84d6bb899bebff5b84ae5d1a32f14042e4f50c1b094ea4d4158ccbf38f99bb7b",
  );
});

test("adds the parents' complete invitation message only to Meet's side", async () => {
  const [page, copy, css] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/invitation-copy.ts", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);

  assert.match(page, /isMeetSide && \([\s\S]*?className="meet-family-message paper-section"/);
  assert.match(page, /copy\.meetFamilyMessage\.familyHome/);
  assert.match(page, /copy\.meetFamilyMessage\.parentPairs\.map/);
  assert.match(copy, /groom: "Meet"/);
  assert.match(copy, /bride: "Pooja"/);
  assert.match(copy, /groom: "ચિ\. મીત"/);
  assert.match(copy, /bride: "ચિ\. પૂજા"/);
  assert.doesNotMatch(copy, /Chi\./);
  assert.match(copy, /heading: "પધારજો"/);
  assert.match(copy, /"નર્મદાબેન તથા રેવાભાઈ હરજીવનદાસ મોદી પરિવાર ગૃહે"/);
  assert.match(copy, /"સહર્ષ ખુશાલી સાથે કાન્તાબેન તથા ધીરજલાલ મોદી વડોદરાથી/);
  assert.match(copy, /"શ્રી મોઢેશ્વરી માતાજીની અસીમ કૃપાથી સંવત ૨૦૮૨ના ભાદરવા સુદ નોમને રવિવાર, ૨૦\/૦૯\/૨૦૨૬/);
  assert.match(copy, /\["શ્રી મુકેશકુમાર મોદી", "શ્રી કેતનભાઈ મોદી"\]/);
  assert.match(copy, /શુભ દિને નિર્ધાર્યા છે/);
  assert.match(copy, /\["શ્રીમતી બેલાબેન મોદી", "શ્રીમતી ધર્મિષ્ઠાબેન મોદી"\]/);
  assert.match(css, /\.meet-parent-pair span \+ span \{ border-left: 1px solid/);
  assert.match(css, /\.invitation-open \.meet-family-message \{[\s\S]*?background-repeat: repeat-y;/);
});

test("keeps the approved transparent emblem asset byte-for-byte", async () => {
  const asset = await readFile(new URL("public/pooja-blessings.png", root));
  assert.equal(asset.subarray(1, 4).toString("ascii"), "PNG");
  assert.equal(asset.readUInt32BE(16), 1380);
  assert.equal(asset.readUInt32BE(20), 680);
  assert.equal(asset[25], 6, "PNG must remain RGBA");
  assert.equal(
    createHash("sha256").update(asset).digest("hex"),
    "7ec62fbe107edadcb9066515f8197821a041403e40b3028904333ea9890c8d19",
  );
});

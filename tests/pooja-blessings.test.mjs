import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("shows the blessing emblems only for the decoded Pooja side", async () => {
  const [page, copy, css] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/invitation-copy.ts", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);

  assert.match(page, /invitationDetails\?\.side === "pooja"/);
  assert.match(page, /showPoojaBlessings[\s\S]*?className="pooja-ganesh-emblem"[\s\S]*?className="gate-blessing-invocation">\{copy\.ganeshInvocation\}<\/p>[\s\S]*?:[\s\S]*?<span className="inner-floret">✦<\/span>/);
  assert.match(page, /showPoojaBlessings && \([\s\S]*?className="hero-om-shanti"[\s\S]*?aria-label=\{copy\.omShantiAlt\}/);
  assert.doesNotMatch(page, /className="hero-blessing-invocation"/);
  assert.match(page, /className="hero-next-button" href="#story"/);
  assert.match(copy, /omShantiAlt: "OM SHANTI blessing symbol"/);
  assert.match(copy, /ganeshBlessingAlt: "Ganeshji blessing symbol"/);
  assert.match(copy, /ganeshInvocation: "॥ श्री गणेशाय नमः ॥"/);
  assert.match(copy, /"હરિયાળી લૉન, ભવ્ય સમારંભ સ્થળો અને યાદગાર ઉજવણી માટેનું સુંદર વાતાવરણ\."/);
  assert.match(css, /\.pooja-ganesh-emblem\s*\{/);
  assert.match(css, /\.gate-inner-card-pooja > \.gate-blessing-invocation\s*\{/);
  assert.match(css, /\.hero-om-shanti\s*\{[\s\S]*?top: max\(58px,calc\(env\(safe-area-inset-top\) \+ 50px\)\)[\s\S]*?width: min\(70px,16\.5vw\)[\s\S]*?aspect-ratio: 640 \/ 680[\s\S]*?background-position: right top; background-size: auto 100%; background-repeat: no-repeat;/);
  assert.match(css, /\.invitation-open \.hero-om-shanti \{ background-image: url\('\/pooja-blessings\.webp'\); \}/);
  assert.doesNotMatch(css, /\.hero-om-shanti\s*\{[^}]*background-color/);
  assert.match(css, /\.hero-next-button\s*\{/);
  assert.match(css, /html \{ scroll-behavior: smooth;/);
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

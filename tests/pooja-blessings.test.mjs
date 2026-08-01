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
  assert.match(page, /src="\/pooja-blessings\.png"/);
  assert.match(page, /unoptimized/);
  assert.match(page, /showPoojaBlessings[\s\S]*?<Image[\s\S]*?:[\s\S]*?<span className="inner-floret">✦<\/span>/);
  assert.match(copy, /poojaBlessingsAlt: "Ganeshji and OM SHANTI blessing symbols"/);
  assert.match(css, /\.pooja-blessing-emblems\s*\{/);
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

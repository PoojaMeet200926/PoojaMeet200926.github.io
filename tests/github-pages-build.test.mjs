import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const output = new URL("../dist-github/", import.meta.url);

test("creates a self-contained GitHub Pages build", async () => {
  const html = await readFile(new URL("index.html", output), "utf8");

  assert.match(html, /<div id="root"><\/div>/);
  assert.match(html, /\/assets\/[^"']+\.js/);
  assert.match(html, /\/assets\/[^"']+\.css/);
  assert.match(html, /https:\/\/YOUR-USERNAME\.github\.io\/og\.png/);
  assert.doesNotMatch(html, /__SITE_URL__/);
  await access(new URL(".nojekyll", output));
  await access(new URL("invitation-box-lid.webp", output));
  await access(new URL("satin-bow-v2.webp", output));
  assert.ok((await stat(new URL("og.png", output))).size > 0);
});

test("keeps encrypted query-link decoding in the static client", async () => {
  const [page, token, workflow] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("lib/invitation-token.mjs", root), "utf8"),
    readFile(new URL(".github/workflows/deploy-pages.yml", root), "utf8"),
  ]);

  assert.match(page, /new URLSearchParams\(window\.location\.search\)\.get\("i"\)/);
  assert.match(page, /decodeInvitationToken\(token\)/);
  assert.match(token, /globalThis\.crypto\.subtle/);
  assert.match(workflow, /npm run build:github/);
  assert.match(workflow, /actions\/upload-pages-artifact@v3/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
});

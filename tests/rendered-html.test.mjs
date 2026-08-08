import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const previewRoot = new URL("../app/_sites-preview/", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the finished wedding invitation", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Meet &amp; Pooja \| Wedding Invitation<\/title>/i);
  assert.match(html, /class="invitation-sealed language-en"/);
  assert.match(html, /class="cover-button"/);
  assert.match(html, /class="story paper-section"/);
  assert.match(html, /class="countdown-section paper-section"/);
  assert.match(html, /class="events-section"/);
  assert.match(html, /class="closing paper-section"/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Building your site/i);
});

test("keeps starter preview code out of the completed invitation", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /export default function Home\(\)/);
  assert.match(page, /className=\{`invitation-\$\{invitationState\} language-\$\{language\}`\}/);
  assert.match(layout, /title: "Meet & Pooja \| Wedding Invitation"/);
  assert.match(layout, /images: \[\{ url: `\$\{origin\}\/og\.png`/);
  assert.match(layout, /href="\/invitation-box-lid\.webp"/);
  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview|codex-preview/);
  assert.doesNotMatch(layout, /_sites-preview|SkeletonPreview|codex-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(previewRoot));
});

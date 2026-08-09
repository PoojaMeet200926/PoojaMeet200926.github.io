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

test("server-renders only the private-link gate without a token", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Private Invitation<\/title>/i);
  assert.match(html, /class="private-link-screen"/);
  assert.match(html, /Checking your link/);
  assert.doesNotMatch(html, /Meet|Pooja|Narayani|Tremont|Ghee Gud|September|Wedding Ceremony/i);
  assert.doesNotMatch(html, /class="cover-button"|class="events-section"|class="venue-reveal"/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Building your site/i);
});

test("keeps starter preview code out of the completed invitation", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /export default function Home\(\)/);
  assert.match(page, /className=\{`invitation-\$\{invitationState\} language-\$\{language\} occasion-\$\{isGetTogether \? "get-together" : "wedding"\}`\}/);
  assert.match(page, /type LinkStatus = "checking" \| "valid" \| "missing" \| "invalid"/);
  assert.match(page, /if \(!token\) \{[\s\S]*?setLinkStatus\("missing"\)/);
  assert.match(page, /if \(details\) \{[\s\S]*?setLinkStatus\("valid"\)[\s\S]*?setLinkStatus\("invalid"\)/);
  assert.match(page, /if \(linkStatus !== "valid"\)/);
  assert.match(layout, /title: "Private Invitation"/);
  assert.match(layout, /robots: \{ index: false, follow: false \}/);
  assert.doesNotMatch(layout, /Meet & Pooja|Narayani|September|og\.png|invitation-box-lid/);
  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview|codex-preview/);
  assert.doesNotMatch(layout, /_sites-preview|SkeletonPreview|codex-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(previewRoot));
});

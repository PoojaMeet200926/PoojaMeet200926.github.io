import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

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

test("server-renders the invitation and resilient video gate", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Pooja &amp; Meet \| Wedding Invitation<\/title>/i);
  assert.match(html, />Open Invitation</);
  assert.match(html, /src="\/ribbon-opening\.mp4"/);
  assert.match(html, /poster="\/invitation-cover-v2\.png"/);
  assert.match(html, /\bplaysInline=""/);
  assert.match(html, /18–20 September 2026/);
  assert.match(html, /Details pending confirmation/);
  assert.match(html, /To be confirmed/);
  assert.match(html, /Narayani Heights, Airport-Gandhinagar Road, Bhat, Ahmedabad/);
  assert.doesNotMatch(html, /19–20 September 2026/);
  assert.doesNotMatch(html, /codex-preview|Building your site/);
});

test("keeps wedding facts typed and realistic opening video-only", async () => {
  const [experience, data, css, page] = await Promise.all([
    readFile(new URL("../app/components/InvitationExperience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data/invitation.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(data, /pendingConfirmation:\s*true/);
  assert.match(data, /targetISO:\s*"2026-09-19T09:30:00\+05:30"/);
  assert.match(data, /displayDates:\s*"18–20 September 2026"/);
  assert.match(experience, /"sealed"/);
  assert.match(experience, /"loading"/);
  assert.match(experience, /"playing"/);
  assert.match(experience, /"finishing"/);
  assert.match(experience, /"failed"/);
  assert.match(experience, /"skipped"/);
  assert.match(experience, /prefers-reduced-motion/);
  assert.match(experience, /onEnded=\{\(\) => completeHandoff\("finishing"\)\}/);
  assert.match(experience, /onError=\{handleMediaError\}/);
  assert.match(experience, />\s*Skip opening\s*</);
  assert.match(page, /<EventSchedule \/>/);

  const forbiddenFakeFabric =
    /openDoor|openDoorRight|clip-path\s*:|three(?:\.min)?\.js|canvas|fabric-panel|curtain-panel|gsap/i;
  assert.doesNotMatch(experience, forbiddenFakeFabric);
  assert.doesNotMatch(css, forbiddenFakeFabric);
  assert.doesNotMatch(page, forbiddenFakeFabric);
});

test("does not present pending venues as confirmed event facts", async () => {
  const data = await readFile(
    new URL("../app/data/invitation.ts", import.meta.url),
    "utf8",
  );

  for (const id of ["ganesh-sthapan", "mameru", "sangeet", "wedding"]) {
    const eventStart = data.indexOf(`id: "${id}"`);
    assert.ok(eventStart >= 0, `missing event ${id}`);
    const nextEvent = data.indexOf("\n  {", eventStart + 1);
    const eventSource = data.slice(eventStart, nextEvent === -1 ? undefined : nextEvent);
    assert.match(eventSource, /venue:\s*pending<Venue>\(\)/);
  }
});

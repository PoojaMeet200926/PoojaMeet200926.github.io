import assert from "node:assert/strict";
import test from "node:test";

import { decodeInvitationToken, encodeInvitationToken } from "../lib/invitation-token.mjs";

test("round-trips a numbered guest invitation", async () => {
  const token = await encodeInvitationToken({ people: 4, days: 2 });
  assert.deepEqual(await decodeInvitationToken(token), { people: 4, days: 2 });
  assert.doesNotMatch(token, /(?:people|guests|days)/i);
  assert.match(token, /^[A-Za-z0-9_-]{42}$/);
});

test("round-trips a whole-family invitation without a guest count", async () => {
  const token = await encodeInvitationToken({ people: null, days: 3 });
  assert.deepEqual(await decodeInvitationToken(token), { people: null, days: 3 });
});

test("rejects a modified token", async () => {
  const token = await encodeInvitationToken({ people: 2, days: 1 });
  const replacement = token.at(-1) === "A" ? "B" : "A";
  assert.equal(await decodeInvitationToken(`${token.slice(0, -1)}${replacement}`), null);
});

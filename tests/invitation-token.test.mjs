import assert from "node:assert/strict";
import test from "node:test";

import { decodeInvitationToken, encodeInvitationToken } from "../lib/invitation-token.mjs";

test("round-trips a numbered guest invitation", async () => {
  const token = await encodeInvitationToken({ people: 4, days: 2, side: "pooja" });
  assert.deepEqual(await decodeInvitationToken(token), { people: 4, days: 2, side: "pooja", occasion: "wedding" });
  assert.doesNotMatch(token, /(?:people|guests|days)/i);
  assert.match(token, /^[A-Za-z0-9_-]{44}$/);
});

test("round-trips a whole-family invitation without a guest count", async () => {
  const token = await encodeInvitationToken({ people: null, days: 3, side: "meet" });
  assert.deepEqual(await decodeInvitationToken(token), { people: null, days: 3, side: "meet", occasion: "wedding" });
});

test("round-trips a post-wedding get-together invitation", async () => {
  const token = await encodeInvitationToken({
    people: 6,
    days: 1,
    side: "meet",
    occasion: "get-together",
  });
  assert.deepEqual(await decodeInvitationToken(token), {
    people: 6,
    days: 1,
    side: "meet",
    occasion: "get-together",
  });
});

test("rejects a modified token", async () => {
  const token = await encodeInvitationToken({ people: 2, days: 1, side: "meet" });
  const replacement = token.at(-1) === "A" ? "B" : "A";
  assert.equal(await decodeInvitationToken(`${token.slice(0, -1)}${replacement}`), null);
});

test("keeps existing links valid with Meet first", async () => {
  const existingToken = "AR6I5KVyC7QPsoVKgEVOIybQwNyMNGabDwMAOa-jxA";
  assert.deepEqual(
    await decodeInvitationToken(existingToken),
    { people: null, days: 3, side: "meet", occasion: "wedding" },
  );
});

test("keeps existing side-aware links valid with Pooja first", async () => {
  const existingToken = "A-H7CwwfqCBjBQkWtCQ6p959BZy1l4AjeKlNpve2HBY";
  assert.deepEqual(
    await decodeInvitationToken(existingToken),
    { people: null, days: 3, side: "pooja", occasion: "wedding" },
  );
});

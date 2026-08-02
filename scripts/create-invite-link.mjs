import { encodeInvitationToken } from "../lib/invitation-token.mjs";

const DEFAULT_URL = "https://meet-pooja-wedding-2026.abhimanyutextiles.chatgpt.site";
const values = new Map();
const flags = new Set();

for (let index = 2; index < process.argv.length; index += 1) {
  const argument = process.argv[index];
  if (!argument.startsWith("--")) continue;
  const name = argument.slice(2);
  const next = process.argv[index + 1];
  if (next && !next.startsWith("--")) {
    values.set(name, next);
    index += 1;
  } else {
    flags.add(name);
  }
}

const days = Number(values.get("days"));
const isFamily = flags.has("family");
const people = isFamily ? null : Number(values.get("people"));
const side = values.get("side")?.toLowerCase();

if (
  ![1, 2, 3].includes(days)
  || !["meet", "pooja"].includes(side)
  || (side === "meet" && days !== 1)
  || (!isFamily && (!Number.isInteger(people) || people < 1 || people > 250))
) {
  console.error(
    [
      "Create a personalized wedding invitation link:",
      "  npm run invite:link -- --people 4 --days 2 --side pooja",
      "  npm run invite:link -- --family --days 1 --side meet",
      "",
      "Days: 1 = 20 Sep, 2 = 19–20 Sep, 3 = 18–20 Sep.",
      "Side: pooja = Pooja first, meet = Meet first.",
      "Meet-side invitations support only day 1 (20 September).",
      "Use --url https://example.com to override the live invitation address.",
    ].join("\n"),
  );
  process.exitCode = 1;
} else {
  const token = await encodeInvitationToken({ people, days, side });
  const invitationUrl = new URL(values.get("url") ?? DEFAULT_URL);
  invitationUrl.searchParams.set("i", token);
  console.log(invitationUrl.toString());
}

const TOKEN_VERSION = 1;
const IV_LENGTH = 12;
const TOKEN_KEY = new Uint8Array([
  243, 91, 34, 186, 112, 9, 225, 68,
  157, 42, 199, 13, 81, 236, 55, 170,
  24, 146, 219, 63, 177, 5, 108, 202,
  77, 231, 18, 159, 46, 124, 211, 89,
]);

/**
 * @typedef {{ people: number | null, days: 1 | 2 | 3 }} InvitationDetails
 */

function bytesToBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function importTokenKey(usage) {
  return globalThis.crypto.subtle.importKey(
    "raw",
    TOKEN_KEY,
    { name: "AES-GCM" },
    false,
    [usage],
  );
}

/**
 * @param {InvitationDetails} details
 * @returns {Promise<string>}
 */
export async function encodeInvitationToken(details) {
  const people = details.people === null ? 0 : details.people;
  if (!Number.isInteger(people) || people < 0 || people > 250) {
    throw new Error("Guest count must be between 1 and 250, or omitted for the whole family.");
  }
  if (![1, 2, 3].includes(details.days)) {
    throw new Error("Invited days must be 1, 2, or 3.");
  }

  const iv = globalThis.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await importTokenKey("encrypt");
  const plaintext = new Uint8Array([people, details.days]);
  const encrypted = new Uint8Array(
    await globalThis.crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext),
  );
  const token = new Uint8Array(1 + iv.length + encrypted.length);
  token[0] = TOKEN_VERSION;
  token.set(iv, 1);
  token.set(encrypted, 1 + iv.length);
  return bytesToBase64Url(token);
}

/**
 * @param {string} token
 * @returns {Promise<InvitationDetails | null>}
 */
export async function decodeInvitationToken(token) {
  try {
    const bytes = base64UrlToBytes(token);
    if (bytesToBase64Url(bytes) !== token) return null;
    if (bytes.length !== 31 || bytes[0] !== TOKEN_VERSION) return null;

    const iv = bytes.slice(1, 1 + IV_LENGTH);
    const encrypted = bytes.slice(1 + IV_LENGTH);
    const key = await importTokenKey("decrypt");
    const plaintext = new Uint8Array(
      await globalThis.crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted),
    );
    const people = plaintext[0];
    const days = plaintext[1];
    if (plaintext.length !== 2 || people > 250 || ![1, 2, 3].includes(days)) return null;

    return {
      people: people === 0 ? null : people,
      days: /** @type {1 | 2 | 3} */ (days),
    };
  } catch {
    return null;
  }
}

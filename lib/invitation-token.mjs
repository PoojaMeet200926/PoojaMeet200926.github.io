const AES_TOKEN_VERSION = 1;
const HMAC_TOKEN_VERSION = 2;
const SIDE_TOKEN_VERSION = 3;
const TOKEN_VERSION = 4;
const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const TOKEN_KEY = new Uint8Array([
  243, 91, 34, 186, 112, 9, 225, 68,
  157, 42, 199, 13, 81, 236, 55, 170,
  24, 146, 219, 63, 177, 5, 108, 202,
  77, 231, 18, 159, 46, 124, 211, 89,
]);

/**
 * @typedef {{
 *   people: number | null,
 *   days: 1 | 2 | 3,
 *   side: "meet" | "pooja",
 *   occasion?: "wedding" | "get-together"
 * }} InvitationDetails
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

async function hmac(data) {
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    TOKEN_KEY,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(await globalThis.crypto.subtle.sign("HMAC", key, data));
}

function equalBytes(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index];
  }
  return difference === 0;
}

/**
 * @param {InvitationDetails} details
 * @returns {Promise<string>}
 */
export async function encodeInvitationToken(details) {
  const people = details.people === null ? 0 : details.people;
  const occasion = details.occasion ?? "wedding";
  if (!Number.isInteger(people) || people < 0 || people > 250) {
    throw new Error("Guest count must be between 1 and 250, or omitted for the whole family.");
  }
  if (![1, 2, 3].includes(details.days)) {
    throw new Error("Invited days must be 1, 2, or 3.");
  }
  if (!["meet", "pooja"].includes(details.side)) {
    throw new Error("Invitation side must be meet or pooja.");
  }
  if (!["wedding", "get-together"].includes(occasion)) {
    throw new Error("Invitation occasion must be wedding or get-together.");
  }
  if (occasion === "get-together" && details.days !== 1) {
    throw new Error("Get-together invitations support only 20 September 2026.");
  }

  const nonce = globalThis.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const plaintext = new Uint8Array([
    people,
    details.days,
    details.side === "pooja" ? 1 : 0,
    occasion === "get-together" ? 1 : 0,
  ]);
  const padInput = new Uint8Array(1 + nonce.length);
  padInput[0] = 0x45;
  padInput.set(nonce, 1);
  const pad = await hmac(padInput);
  const ciphertext = Uint8Array.from(
    plaintext,
    (value, index) => value ^ pad[index],
  );

  const body = new Uint8Array(1 + nonce.length + ciphertext.length);
  body[0] = TOKEN_VERSION;
  body.set(nonce, 1);
  body.set(ciphertext, 1 + nonce.length);
  const signature = await hmac(body);
  const token = new Uint8Array(body.length + TAG_LENGTH);
  token.set(body);
  token.set(signature.slice(0, TAG_LENGTH), body.length);
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

    let plaintext;
    if (bytes[0] === AES_TOKEN_VERSION) {
      if (bytes.length !== 31) return null;
      const iv = bytes.slice(1, 1 + IV_LENGTH);
      const encrypted = bytes.slice(1 + IV_LENGTH);
      const key = await importTokenKey("decrypt");
      plaintext = new Uint8Array(
        await globalThis.crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted),
      );
    } else if ([HMAC_TOKEN_VERSION, SIDE_TOKEN_VERSION, TOKEN_VERSION].includes(bytes[0])) {
      const payloadLength = bytes[0] === TOKEN_VERSION ? 4 : bytes[0] === SIDE_TOKEN_VERSION ? 3 : 2;
      const bodyLength = 1 + IV_LENGTH + payloadLength;
      if (bytes.length !== bodyLength + TAG_LENGTH) return null;

      const body = bytes.slice(0, bodyLength);
      const signature = bytes.slice(body.length);
      const expectedSignature = (await hmac(body)).slice(0, TAG_LENGTH);
      if (!equalBytes(signature, expectedSignature)) return null;

      const nonce = bytes.slice(1, 1 + IV_LENGTH);
      const ciphertext = bytes.slice(1 + IV_LENGTH, body.length);
      const padInput = new Uint8Array(1 + nonce.length);
      padInput[0] = 0x45;
      padInput.set(nonce, 1);
      const pad = await hmac(padInput);
      plaintext = Uint8Array.from(
        ciphertext,
        (value, index) => value ^ pad[index],
      );
    } else {
      return null;
    }

    const people = plaintext[0];
    const days = plaintext[1];
    const side = plaintext.length >= 3 ? plaintext[2] : 0;
    const occasion = plaintext.length === 4 ? plaintext[3] : 0;
    if (
      ![2, 3, 4].includes(plaintext.length)
      || people > 250
      || ![1, 2, 3].includes(days)
      || ![0, 1].includes(side)
      || ![0, 1].includes(occasion)
      || (occasion === 1 && days !== 1)
    ) return null;

    return {
      people: people === 0 ? null : people,
      days: /** @type {1 | 2 | 3} */ (days),
      side: side === 1 ? "pooja" : "meet",
      occasion: occasion === 1 ? "get-together" : "wedding",
    };
  } catch {
    return null;
  }
}

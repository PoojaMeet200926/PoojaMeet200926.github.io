"""Generate encrypted guest-specific links for Meet & Pooja's invitation.

No third-party Python packages are required.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import hmac
import secrets
import sys
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit


TOKEN_VERSION = 3
NONCE_LENGTH = 12
TAG_LENGTH = 16
TOKEN_KEY = bytes(
    [
        243, 91, 34, 186, 112, 9, 225, 68,
        157, 42, 199, 13, 81, 236, 55, 170,
        24, 146, 219, 63, 177, 5, 108, 202,
        77, 231, 18, 159, 46, 124, 211, 89,
    ]
)
DATE_GROUPS = {
    (20,): 1,
    (19, 20): 2,
    (18, 19, 20): 3,
}
SIDE_VALUES = {
    "meet": 0,
    "pooja": 1,
}


def parse_invited_dates(value: str | list[str]) -> tuple[int, ...]:
    """Convert comma/space-separated dates into a supported date group."""
    raw = " ".join(value) if isinstance(value, list) else value
    parts = raw.replace(",", " ").split()
    try:
        dates = tuple(sorted(set(int(part) for part in parts)))
    except ValueError as error:
        raise ValueError("Dates must contain only 18, 19, and 20.") from error

    if dates not in DATE_GROUPS:
        raise ValueError(
            "Choose exactly one supported group: 20; 19,20; or 18,19,20."
        )
    return dates


def create_token(
    invitees: int | None,
    dates: tuple[int, ...],
    side: str,
    *,
    nonce: bytes | None = None,
) -> str:
    """Create the opaque URL token understood by the invitation website."""
    if invitees is not None and not 1 <= invitees <= 250:
        raise ValueError("Number of invitees must be between 1 and 250.")
    if dates not in DATE_GROUPS:
        raise ValueError("Unsupported invited-date group.")
    side = side.strip().lower()
    if side not in SIDE_VALUES:
        raise ValueError("Invitation side must be Meet or Pooja.")

    nonce = secrets.token_bytes(NONCE_LENGTH) if nonce is None else nonce
    if len(nonce) != NONCE_LENGTH:
        raise ValueError(f"Nonce must be exactly {NONCE_LENGTH} bytes.")

    people_value = 0 if invitees is None else invitees
    day_count = DATE_GROUPS[dates]
    plaintext = bytes([people_value, day_count, SIDE_VALUES[side]])
    pad = hmac.new(TOKEN_KEY, b"E" + nonce, hashlib.sha256).digest()
    ciphertext = bytes(
        value ^ pad[index] for index, value in enumerate(plaintext)
    )
    body = bytes([TOKEN_VERSION]) + nonce + ciphertext
    tag = hmac.new(TOKEN_KEY, body, hashlib.sha256).digest()[:TAG_LENGTH]
    return (
        base64.urlsafe_b64encode(body + tag)
        .decode("ascii")
        .rstrip("=")
    )


def build_invitation_url(
    website_url: str,
    dates: tuple[int, ...],
    invitees: int | None,
    side: str,
) -> str:
    """Add a fresh encrypted invitation token to the hosted website URL."""
    parsed = urlsplit(website_url.strip())
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise ValueError("Website URL must start with http:// or https://.")
    if side.strip().lower() == "meet" and dates != (20,):
        raise ValueError("Meet-side invitations support only 20 September 2026.")

    token = create_token(invitees, dates, side)
    query = [
        (key, value)
        for key, value in parse_qsl(parsed.query, keep_blank_values=True)
        if key != "i"
    ]
    query.append(("i", token))
    return urlunsplit(
        (
            parsed.scheme,
            parsed.netloc,
            parsed.path or "/",
            urlencode(query),
            parsed.fragment,
        )
    )


def interactive_values() -> tuple[str, tuple[int, ...], int | None, str]:
    print("Meet & Pooja — Invitation Link Generator\n")
    website_url = input("Hosted website URL: ").strip()
    dates = parse_invited_dates(
        input("Invited dates (20 / 19,20 / 18,19,20): ").strip()
    )
    invitee_text = input(
        "Number of invitees (leave blank for the whole family): "
    ).strip()
    invitees = None if not invitee_text else int(invitee_text)
    side = input("Invitation from whose side (Meet/Pooja): ").strip().lower()
    if side not in SIDE_VALUES:
        raise ValueError("Invitation side must be Meet or Pooja.")
    return website_url, dates, invitees, side


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create an encrypted, guest-specific wedding invitation link."
    )
    parser.add_argument(
        "--url",
        help="Hosted invitation URL, for example https://wedding.example.com",
    )
    parser.add_argument(
        "--days",
        nargs="+",
        help='Invited dates: "20", "19,20", or "18,19,20"',
    )
    group = parser.add_mutually_exclusive_group()
    group.add_argument(
        "--invitees",
        type=int,
        help="Number of invited people, from 1 to 250",
    )
    group.add_argument(
        "--family",
        action="store_true",
        help="Invite the whole family without showing a guest count",
    )
    parser.add_argument(
        "--side",
        choices=sorted(SIDE_VALUES),
        help="Whose name appears first: meet or pooja",
    )
    return parser.parse_args()


def main() -> int:
    interactive = len(sys.argv) == 1
    try:
        if interactive:
            website_url, dates, invitees, side = interactive_values()
        else:
            arguments = parse_arguments()
            if not arguments.url or not arguments.days:
                raise ValueError("--url and --days are required.")
            if not arguments.side:
                raise ValueError("Use --side meet or --side pooja.")
            if arguments.invitees is None and not arguments.family:
                raise ValueError("Use --invitees NUMBER or --family.")
            website_url = arguments.url
            dates = parse_invited_dates(arguments.days)
            invitees = arguments.invitees
            side = arguments.side

        invitation_url = build_invitation_url(
            website_url,
            dates,
            invitees,
            side,
        )
        print("\nShare this link with the guest:\n")
        print(invitation_url)
        if interactive:
            input("\nPress Enter to close.")
        return 0
    except (ValueError, OverflowError) as error:
        print(f"\nError: {error}", file=sys.stderr)
        if interactive:
            input("\nPress Enter to close.")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

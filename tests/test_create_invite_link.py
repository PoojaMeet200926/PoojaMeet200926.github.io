import base64
import hashlib
import hmac
import unittest
from urllib.parse import parse_qs, urlsplit

from create_invite_link import (
    DATE_GROUPS,
    SIDE_VALUES,
    TAG_LENGTH,
    TOKEN_KEY,
    build_invitation_url,
    create_token,
    parse_invited_dates,
)


class InviteLinkTests(unittest.TestCase):
    def test_accepts_supported_date_formats(self):
        self.assertEqual(parse_invited_dates("18, 19, 20"), (18, 19, 20))
        self.assertEqual(parse_invited_dates(["19", "20"]), (19, 20))
        self.assertEqual(parse_invited_dates("20"), (20,))

    def test_rejects_unsupported_date_groups(self):
        with self.assertRaises(ValueError):
            parse_invited_dates("18,20")

    def test_token_contains_authenticated_obfuscated_values(self):
        token = create_token(4, (19, 20), "pooja", nonce=bytes(range(12)))
        padded = token + "=" * (-len(token) % 4)
        raw = base64.urlsafe_b64decode(padded)
        body, tag = raw[:-TAG_LENGTH], raw[-TAG_LENGTH:]

        self.assertEqual(len(token), 43)
        self.assertNotEqual(
            body[-3:],
            bytes([4, DATE_GROUPS[(19, 20)], SIDE_VALUES["pooja"]]),
        )
        self.assertEqual(
            tag,
            hmac.new(TOKEN_KEY, body, hashlib.sha256).digest()[:TAG_LENGTH],
        )

    def test_builds_shareable_url_and_replaces_old_token(self):
        result = build_invitation_url(
            "https://example.com/invite?source=family&i=old",
            (20,),
            None,
            "meet",
        )
        parsed = urlsplit(result)
        query = parse_qs(parsed.query)
        self.assertEqual(parsed.path, "/invite")
        self.assertEqual(query["source"], ["family"])
        self.assertEqual(len(query["i"][0]), 43)
        self.assertNotEqual(query["i"][0], "old")

    def test_side_changes_the_encrypted_payload(self):
        nonce = bytes(range(12))
        meet_token = create_token(2, (19, 20), "meet", nonce=nonce)
        pooja_token = create_token(2, (19, 20), "pooja", nonce=nonce)
        self.assertNotEqual(meet_token, pooja_token)

    def test_meet_side_url_accepts_only_twentieth_september(self):
        with self.assertRaisesRegex(ValueError, "only 20 September"):
            build_invitation_url(
                "https://example.com/invite",
                (18, 19, 20),
                None,
                "meet",
            )


if __name__ == "__main__":
    unittest.main()

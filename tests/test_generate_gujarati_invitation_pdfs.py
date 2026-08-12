import importlib.util
import unittest
from pathlib import Path
from unittest.mock import patch


PROJECT_ROOT = Path(__file__).resolve().parents[1]
GENERATOR_PATH = PROJECT_ROOT / "scripts" / "generate-gujarati-invitation-pdfs.py"
SPEC = importlib.util.spec_from_file_location("gujarati_pdf_generator", GENERATOR_PATH)
if SPEC is None or SPEC.loader is None:
    raise RuntimeError("Could not load Gujarati PDF generator")
GENERATOR = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(GENERATOR)


class GujaratiInvitationPdfTests(unittest.TestCase):
    def test_direction_button_draws_google_map_pin(self):
        from PIL import Image, ImageDraw

        image = Image.new("RGB", (80, 80), GENERATOR.IVORY)
        draw = ImageDraw.Draw(image)
        GENERATOR.draw_google_map_pin(draw, 40, 36, size=28)

        rendered_colours = set(image.get_flattened_data())
        for colour in ("#34A853", "#4285F4", "#EA4335", "#FBBC04"):
            self.assertIn(tuple(bytes.fromhex(colour[1:])), rendered_colours)

    def test_selects_only_the_applicable_venues(self):
        self.assertEqual(
            GENERATOR.relevant_venues({"days": (18, 19, 20)}),
            ["ટ્રેમોન્ટ", "નારાયણી હાઇટ્સ"],
        )
        self.assertEqual(
            GENERATOR.relevant_venues({"days": (19, 20)}),
            ["નારાયણી હાઇટ્સ"],
        )

    def test_writes_one_page_with_invitation_and_map_links(self):
        configuration = {
            "filename": "test-gujarati.pdf",
            "side": "pooja",
            "days": (18, 19, 20),
            "invitees": None,
        }
        invitation_url = "https://example.com/?i=private&lang=gu"
        cover = PROJECT_ROOT / "public" / "test-cover.png"
        qr_box = (510, 985, 730, 1195)
        invitation_button = (315, 1322, 925, 1405)
        map_links = [
            ((837, 780, 1095, 840), GENERATOR.SOURCE.TREMONT_MAP),
            ((837, 876, 1095, 936), GENERATOR.SOURCE.NARAYANI_MAP),
        ]

        with patch.object(
            GENERATOR,
            "create_cover_image",
            return_value=(cover, qr_box, invitation_button, map_links),
        ), patch.object(GENERATOR.canvas, "Canvas") as canvas_factory:
            pdf = canvas_factory.return_value
            with patch.object(GENERATOR, "add_qr"):
                GENERATOR.create_gujarati_pdf(configuration, invitation_url)

        self.assertEqual(pdf.drawImage.call_count, 1)
        self.assertEqual(pdf.showPage.call_count, 1)
        linked_urls = [call.args[0] for call in pdf.linkURL.call_args_list]
        self.assertEqual(
            linked_urls,
            [invitation_url, GENERATOR.SOURCE.TREMONT_MAP, GENERATOR.SOURCE.NARAYANI_MAP],
        )


if __name__ == "__main__":
    unittest.main()

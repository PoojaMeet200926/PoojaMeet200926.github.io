"""Create Gujarati editions of the six approved invitation PDFs."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from PIL import Image, ImageDraw, ImageFont
from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


PROJECT_ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIRECTORY = PROJECT_ROOT / "output" / "pdf"
TEMP_DIRECTORY = PROJECT_ROOT / "tmp" / "pdfs" / "gujarati"
FLORAL_FRAME = PROJECT_ROOT / "public" / "festive-floral-frame-optimized.webp"
GUJARATI_FONT = Path(r"C:\Windows\Fonts\Nirmala.ttc")

SOURCE_GENERATOR_PATH = PROJECT_ROOT / "scripts" / "generate-invitation-pdfs.py"
SOURCE_SPEC = importlib.util.spec_from_file_location("invitation_pdf_source", SOURCE_GENERATOR_PATH)
if SOURCE_SPEC is None or SOURCE_SPEC.loader is None:
    raise RuntimeError("Could not load the invitation PDF configuration.")
SOURCE = importlib.util.module_from_spec(SOURCE_SPEC)
SOURCE_SPEC.loader.exec_module(SOURCE)

PAGE_WIDTH_PX = 1240
PAGE_HEIGHT_PX = 1754
PDF_WIDTH, PDF_HEIGHT = A4

FOREST = "#245B43"
FOREST_DARK = "#173E30"
GOLD = "#C68A25"
PALE_GOLD = "#E9C978"
IVORY = "#FFF9EE"
PAPER = "#F8F1E5"
INK = "#40372F"
MUTED = "#736A60"
HAIRLINE = "#DFCDA8"
WHITE = "#FFFFFF"

GUJARATI_DIGITS = str.maketrans("0123456789", "૦૧૨૩૪૫૬૭૮૯")

GUJARATI_VENUES = {
    "ટ્રેમોન્ટ": {
        "address": "બી-૧૩૦૨, ટ્રેમોન્ટ, વૈષ્ણોદેવી સર્કલ, અમદાવાદ, ગુજરાત ૩૮૨૪૨૧",
        "map": SOURCE.TREMONT_MAP,
    },
    "નારાયણી હાઇટ્સ": {
        "address": "એરપોર્ટ-ગાંધીનગર રોડ, ભાટ, અમદાવાદ, ગુજરાત ૩૮૨૪૨૮",
        "map": SOURCE.NARAYANI_MAP,
    },
}

def font(size: int) -> ImageFont.FreeTypeFont:
    if not GUJARATI_FONT.exists():
        raise FileNotFoundError(f"Gujarati font not found: {GUJARATI_FONT}")
    return ImageFont.truetype(str(GUJARATI_FONT), size=size, layout_engine=ImageFont.Layout.RAQM)


def with_gujarati_language(invitation_url: str) -> str:
    parsed = urlsplit(invitation_url)
    query = [(key, value) for key, value in parse_qsl(parsed.query) if key != "lang"]
    query.append(("lang", "gu"))
    return urlunsplit((parsed.scheme, parsed.netloc, parsed.path, urlencode(query), parsed.fragment))


def draw_centered(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, text_font: ImageFont.FreeTypeFont, fill: str) -> None:
    draw.text(xy, text, font=text_font, fill=fill, anchor="mm", embedded_color=False)


def wrap_text(draw: ImageDraw.ImageDraw, text: str, text_font: ImageFont.FreeTypeFont, width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textlength(candidate, font=text_font) <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_wrapped_centered(
    draw: ImageDraw.ImageDraw,
    center_x: int,
    y: int,
    text: str,
    text_font: ImageFont.FreeTypeFont,
    fill: str,
    width: int,
    line_height: int,
) -> int:
    lines = wrap_text(draw, text, text_font, width)
    for line in lines:
        draw_centered(draw, (center_x, y), line, text_font, fill)
        y += line_height
    return y


def base_page() -> Image.Image:
    floral = Image.open(FLORAL_FRAME).convert("RGBA").resize((PAGE_WIDTH_PX, PAGE_HEIGHT_PX), Image.Resampling.LANCZOS)
    paper = Image.new("RGBA", floral.size, PAPER)
    paper.alpha_composite(floral)
    overlay = Image.new("RGBA", floral.size, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rounded_rectangle((70, 55, PAGE_WIDTH_PX - 70, PAGE_HEIGHT_PX - 55), radius=36, fill=(255, 249, 238, 236), outline=HAIRLINE, width=2)
    paper.alpha_composite(overlay)
    return paper.convert("RGB")


def draw_sacred_knot(draw: ImageDraw.ImageDraw, center_x: int, center_y: int) -> None:
    draw.ellipse((center_x - 48, center_y - 48, center_x + 48, center_y + 48), fill=FOREST, outline=PALE_GOLD, width=4)
    draw.ellipse((center_x - 9, center_y - 9, center_x + 9, center_y + 9), fill=PALE_GOLD)
    draw.ellipse((center_x - 38, center_y - 8, center_x - 4, center_y + 18), outline=PALE_GOLD, width=9)
    draw.ellipse((center_x + 4, center_y - 8, center_x + 38, center_y + 18), outline=PALE_GOLD, width=9)
    draw.line((center_x - 7, center_y + 9, center_x - 22, center_y + 39), fill=PALE_GOLD, width=9)
    draw.line((center_x + 7, center_y + 9, center_x + 22, center_y + 39), fill=PALE_GOLD, width=9)
    draw.polygon((center_x - 26, center_y + 38, center_x - 10, center_y + 31, center_x - 16, center_y + 49), fill=PALE_GOLD)
    draw.polygon((center_x + 26, center_y + 38, center_x + 10, center_y + 31, center_x + 16, center_y + 49), fill=PALE_GOLD)
    draw_centered(draw, (center_x, center_y - 69), "✦", font(23), IVORY)


def draw_button(draw: ImageDraw.ImageDraw, label: str, box: tuple[int, int, int, int]) -> None:
    draw.rounded_rectangle(box, radius=(box[3] - box[1]) // 2, fill=FOREST)
    draw_centered(draw, ((box[0] + box[2]) // 2, (box[1] + box[3]) // 2 + 2), label, font(25), IVORY)


def draw_google_map_pin(draw: ImageDraw.ImageDraw, center_x: int, center_y: int, size: int = 28) -> None:
    """Draw a compact Google Maps-style multicolour pin without an external asset."""
    half = size // 2
    top = center_y - half
    bottom = center_y + half
    left = center_x - half
    right = center_x + half
    middle = center_y + 1

    # Four coloured quarters form the familiar Google Maps pin silhouette.
    draw.pieslice((left, top, right, top + size), 90, 180, fill="#34A853")
    draw.pieslice((left, top, right, top + size), 180, 270, fill="#4285F4")
    draw.pieslice((left, top, right, top + size), 270, 360, fill="#EA4335")
    draw.pieslice((left, top, right, top + size), 0, 90, fill="#FBBC04")
    draw.polygon(
        (
            (center_x - half + 3, middle),
            (center_x + half - 3, middle),
            (center_x, bottom + 8),
        ),
        fill="#EA4335",
    )
    draw.ellipse(
        (center_x - 5, center_y - 5, center_x + 5, center_y + 5),
        fill=WHITE,
    )


def localized_date_line(days: tuple[int, ...]) -> str:
    if len(days) == 1:
        return "રવિવાર, ૨૦ સપ્ટેમ્બર ૨૦૨૬"
    return f"{str(days[0]).translate(GUJARATI_DIGITS)}-{str(days[-1]).translate(GUJARATI_DIGITS)} સપ્ટેમ્બર ૨૦૨૬"


def names_for_side(side: str) -> tuple[str, str]:
    return ("પૂજા", "મીત") if side == "pooja" else ("મીત", "પૂજા")


def relevant_venues(configuration: dict[str, object]) -> list[str]:
    venues = ["નારાયણી હાઇટ્સ"]
    if 18 in configuration["days"]:
        venues.insert(0, "ટ્રેમોન્ટ")
    return venues


def draw_venue_details(
    draw: ImageDraw.ImageDraw,
    configuration: dict[str, object],
) -> list[tuple[tuple[int, int, int, int], str]]:
    venues = relevant_venues(configuration)
    heading_y = 770 if configuration["invitees"] is not None else 735
    row_y = heading_y + 58
    row_gap = 96
    left = 145
    right = PAGE_WIDTH_PX - 145
    button_width = 258
    address_width = right - left - button_width - 42
    map_links: list[tuple[tuple[int, int, int, int], str]] = []

    draw.text((left, heading_y), "સ્થળની વિગતો", font=font(32), fill=FOREST_DARK, anchor="la")
    draw.line((left, heading_y + 37, right, heading_y + 37), fill=HAIRLINE, width=2)

    for venue_name in venues:
        details = GUJARATI_VENUES[venue_name]
        draw.text((left, row_y), venue_name, font=font(24), fill=INK, anchor="la")
        address_lines = wrap_text(draw, details["address"], font(17), address_width)
        address_y = row_y + 30
        for line in address_lines[:2]:
            draw.text((left, address_y), line, font=font(17), fill=MUTED, anchor="la")
            address_y += 23

        link_box = (right - button_width, row_y - 17, right, row_y + 43)
        draw.rounded_rectangle(link_box, radius=28, fill="#F2E9D9", outline=HAIRLINE, width=2)
        pin_x = link_box[0] + 39
        pin_y = (link_box[1] + link_box[3]) // 2 - 2
        draw_google_map_pin(draw, pin_x, pin_y, size=28)
        draw_centered(
            draw,
            ((link_box[0] + link_box[2]) // 2 + 16, (link_box[1] + link_box[3]) // 2 + 2),
            "માર્ગદર્શન ખોલો",
            font(20),
            FOREST,
        )
        map_links.append((link_box, details["map"]))
        row_y += row_gap

    return map_links


def create_cover_image(
    configuration: dict[str, object],
) -> tuple[
    Path,
    tuple[int, int, int, int],
    tuple[int, int, int, int],
    list[tuple[tuple[int, int, int, int], str]],
]:
    image = base_page()
    draw = ImageDraw.Draw(image)
    first_name, second_name = names_for_side(configuration["side"])

    draw_sacred_knot(draw, PAGE_WIDTH_PX // 2, 215)
    draw_centered(draw, (PAGE_WIDTH_PX // 2, 325), "બંને પરિવારોના આશીર્વાદ સાથે", font(27), FOREST)
    draw_centered(draw, (PAGE_WIDTH_PX // 2, 420), f"{first_name} અને {second_name}", font(76), GOLD)
    draw_centered(draw, (PAGE_WIDTH_PX // 2, 510), "લગ્ન આમંત્રણ", font(51), INK)
    draw.line((245, 565, PAGE_WIDTH_PX - 245, 565), fill=HAIRLINE, width=5)
    draw_centered(draw, (PAGE_WIDTH_PX // 2, 635), localized_date_line(configuration["days"]), font(33), FOREST)
    if configuration["invitees"] is not None:
        draw_centered(draw, (PAGE_WIDTH_PX // 2, 700), "આપ સહિત કુલ ૨ મહેમાનોનું સહર્ષ સ્વાગત છે", font(29), GOLD)

    map_links = draw_venue_details(draw, configuration)

    qr_box = (PAGE_WIDTH_PX // 2 - 105, 985, PAGE_WIDTH_PX // 2 + 105, 1195)
    draw.rounded_rectangle((qr_box[0] - 16, qr_box[1] - 16, qr_box[2] + 16, qr_box[3] + 16), radius=16, fill=WHITE)
    draw_centered(draw, (PAGE_WIDTH_PX // 2, 1250), "QR કોડ સ્કેન કરો અથવા ડિજિટલ આમંત્રણ ખોલવા નીચે ટૅપ કરો", font(21), MUTED)
    button_box = (315, 1322, PAGE_WIDTH_PX - 315, 1405)
    draw_button(draw, "ડિજિટલ આમંત્રણ ખોલો", button_box)
    draw_centered(draw, (PAGE_WIDTH_PX // 2, 1460), "અંગ્રેજી અને ગુજરાતી ઉપલબ્ધ", font(22), MUTED)
    draw_centered(draw, (PAGE_WIDTH_PX // 2, 1560), "આ ખાનગી આમંત્રણ માત્ર આમંત્રિત મહેમાનો માટે છે", font(18), MUTED)

    destination = TEMP_DIRECTORY / f"{configuration['filename']}-cover.png"
    image.save(destination, optimize=True)
    return destination, qr_box, button_box, map_links


def pdf_rect_from_pixels(box: tuple[int, int, int, int]) -> tuple[float, float, float, float]:
    x1, y1, x2, y2 = box
    scale_x = PDF_WIDTH / PAGE_WIDTH_PX
    scale_y = PDF_HEIGHT / PAGE_HEIGHT_PX
    return (x1 * scale_x, PDF_HEIGHT - y2 * scale_y, x2 * scale_x, PDF_HEIGHT - y1 * scale_y)


def add_qr(pdf: canvas.Canvas, invitation_url: str, box: tuple[int, int, int, int]) -> None:
    x1, y1, x2, y2 = pdf_rect_from_pixels(box)
    size = min(x2 - x1, y2 - y1)
    widget = qr.QrCodeWidget(invitation_url)
    bounds = widget.getBounds()
    width = bounds[2] - bounds[0]
    height = bounds[3] - bounds[1]
    drawing = Drawing(size, size, transform=[size / width, 0, 0, size / height, 0, 0])
    drawing.add(widget)
    drawing.drawOn(pdf, x1, y1)


def create_gujarati_pdf(configuration: dict[str, object], invitation_url: str) -> Path:
    filename = configuration["filename"].replace(".pdf", "-gujarati.pdf")
    destination = OUTPUT_DIRECTORY / filename
    cover_image, qr_box, cover_button, map_links = create_cover_image(configuration)

    pdf = canvas.Canvas(str(destination), pagesize=A4, pageCompression=1)
    first_name, second_name = names_for_side(configuration["side"])
    pdf.setTitle(f"{first_name} અને {second_name} - લગ્ન આમંત્રણ")
    pdf.setAuthor("મીત અને પૂજાનો પરિવાર")
    pdf.setSubject("ખાનગી લગ્ન આમંત્રણ")

    pdf.drawImage(str(cover_image), 0, 0, PDF_WIDTH, PDF_HEIGHT)
    add_qr(pdf, invitation_url, qr_box)
    pdf.linkURL(invitation_url, pdf_rect_from_pixels(cover_button), relative=0)
    for box, map_url in map_links:
        pdf.linkURL(map_url, pdf_rect_from_pixels(box), relative=0)
    pdf.showPage()
    pdf.save()
    return destination


def main() -> None:
    OUTPUT_DIRECTORY.mkdir(parents=True, exist_ok=True)
    TEMP_DIRECTORY.mkdir(parents=True, exist_ok=True)
    manifest = []
    for source_configuration in SOURCE.CONFIGURATIONS:
        configuration = dict(source_configuration)
        base_configuration = dict(source_configuration)
        base_url = SOURCE.stable_invitation_url(base_configuration)
        invitation_url = with_gujarati_language(base_url)
        destination = create_gujarati_pdf(configuration, invitation_url)
        manifest.append(
            {
                "pdf": destination.name,
                "language": "gu",
                "side": configuration["side"],
                "days": list(configuration["days"]),
                "invitees": configuration["invitees"],
                "url": invitation_url,
            }
        )
        print(f"Created {destination.name}")
    (OUTPUT_DIRECTORY / "invitation-links-gujarati.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()

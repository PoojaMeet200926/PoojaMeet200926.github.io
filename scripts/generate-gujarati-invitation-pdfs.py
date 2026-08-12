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

POOJA_EVENTS = {
    18: [
        ("ગણેશ સ્થાપન, મંડપ મુહૂર્ત અને ગ્રહ શાંતિ", "સવારે ૦૮:૦૦", "ટ્રેમોન્ટ"),
        ("મહેંદી", "મહેંદી", "ટ્રેમોન્ટ"),
    ],
    19: [
        ("સગાઈ", "સવારે ૦૯:૩૦", "નારાયણી હાઇટ્સ"),
        ("હલ્દી", "સવારે ૧૧:૦૦ - બપોરનું ભોજન ૧૨:૩૦", "નારાયણી હાઇટ્સ"),
        ("મામેરું", "બપોરે ૦૩:૦૦", "નારાયણી હાઇટ્સ"),
        ("સંગીત સંધ્યા", "સાંજે ૦૭:૩૦ - રાત્રિભોજન ૦૮:૦૦", "નારાયણી હાઇટ્સ"),
    ],
    20: [
        ("લગ્નવિધિ", "હસ્ત મેળાપ સવારે ૧૧:૦૦ - બપોરનું ભોજન ૧૨:૩૦ - વિદાય બપોરે ૦૩:૦૦", "નારાયણી હાઇટ્સ"),
    ],
}

MEET_EVENTS = {
    20: [
        ("વિઘ્નહર્તાનું આગમન તથા ગ્રહ શાંતિ", "સવારે ૦૮:૦૦", "નારાયણી હાઇટ્સ"),
        ("લગ્નવિધિ", "હસ્ત મેળાપ સવારે ૧૧:૦૦ - બપોરનું ભોજન ૧૨:૩૦ - વિદાય બપોરે ૦૩:૦૦", "નારાયણી હાઇટ્સ"),
    ],
}

WEEKDAYS = {18: "શુક્રવાર", 19: "શનિવાર", 20: "રવિવાર"}


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


def localized_date_line(days: tuple[int, ...]) -> str:
    if len(days) == 1:
        return "રવિવાર, ૨૦ સપ્ટેમ્બર ૨૦૨૬"
    return f"{str(days[0]).translate(GUJARATI_DIGITS)}-{str(days[-1]).translate(GUJARATI_DIGITS)} સપ્ટેમ્બર ૨૦૨૬"


def names_for_side(side: str) -> tuple[str, str]:
    return ("પૂજા", "મીત") if side == "pooja" else ("મીત", "પૂજા")


def create_cover_image(configuration: dict[str, object]) -> tuple[Path, tuple[int, int, int, int], tuple[int, int, int, int]]:
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

    qr_box = (PAGE_WIDTH_PX // 2 - 105, 985, PAGE_WIDTH_PX // 2 + 105, 1195)
    draw.rounded_rectangle((qr_box[0] - 16, qr_box[1] - 16, qr_box[2] + 16, qr_box[3] + 16), radius=16, fill=WHITE)
    draw_centered(draw, (PAGE_WIDTH_PX // 2, 1250), "QR કોડ સ્કેન કરો અથવા ડિજિટલ આમંત્રણ ખોલવા નીચે ટૅપ કરો", font(21), MUTED)
    button_box = (315, 1322, PAGE_WIDTH_PX - 315, 1405)
    draw_button(draw, "ડિજિટલ આમંત્રણ ખોલો", button_box)
    draw_centered(draw, (PAGE_WIDTH_PX // 2, 1460), "અંગ્રેજી અને ગુજરાતી ઉપલબ્ધ", font(22), MUTED)
    draw_centered(draw, (PAGE_WIDTH_PX // 2, 1560), "આ ખાનગી આમંત્રણ માત્ર આમંત્રિત મહેમાનો માટે છે", font(18), MUTED)

    destination = TEMP_DIRECTORY / f"{configuration['filename']}-cover.png"
    image.save(destination, optimize=True)
    return destination, qr_box, button_box


def create_schedule_image(configuration: dict[str, object]) -> tuple[Path, list[tuple[tuple[int, int, int, int], str]], tuple[int, int, int, int]]:
    image = base_page()
    draw = ImageDraw.Draw(image)
    first_name, second_name = names_for_side(configuration["side"])
    event_source = POOJA_EVENTS if configuration["side"] == "pooja" else MEET_EVENTS
    map_links: list[tuple[tuple[int, int, int, int], str]] = []

    draw_centered(draw, (PAGE_WIDTH_PX // 2, 115), f"{first_name} અને {second_name}", font(45), GOLD)
    draw_centered(draw, (PAGE_WIDTH_PX // 2, 180), "ઉજવણીનો કાર્યક્રમ", font(54), FOREST_DARK)
    draw_centered(draw, (PAGE_WIDTH_PX // 2, 232), localized_date_line(configuration["days"]), font(23), MUTED)

    y = 285
    left = 140
    right = PAGE_WIDTH_PX - 140
    content_width = right - left
    for day in configuration["days"]:
        draw.rounded_rectangle((left, y, right, y + 58), radius=14, fill=FOREST)
        day_label = f"{WEEKDAYS[day]}  {str(day).translate(GUJARATI_DIGITS)} સપ્ટેમ્બર"
        draw.text((left + 25, y + 28), day_label, font=font(27), fill=IVORY, anchor="lm")
        y += 74

        for title, timing, venue in event_source[day]:
            title_font = font(27)
            time_font = font(22)
            title_lines = wrap_text(draw, title, title_font, 455)
            timing_lines = wrap_text(draw, timing, time_font, 430)
            row_height = max(90, 50 + 30 * max(len(title_lines), len(timing_lines)))
            draw.rounded_rectangle((left, y, right, y + row_height), radius=13, fill=WHITE)
            title_y = y + 30
            for line in title_lines[:2]:
                draw.text((left + 26, title_y), line, font=title_font, fill=INK, anchor="lm")
                title_y += 31
            time_y = y + 28
            for line in timing_lines[:2]:
                draw.text((right - 26, time_y), line, font=time_font, fill=GOLD, anchor="rm")
                time_y += 29
            draw.text((left + 26, y + row_height - 17), venue, font=font(18), fill=MUTED, anchor="lm")
            y += row_height + 9
        y += 8

    relevant_venues = ["નારાયણી હાઇટ્સ"]
    if 18 in configuration["days"]:
        relevant_venues.insert(0, "ટ્રેમોન્ટ")
    venue_y = max(y + 12, 1190 if len(configuration["days"]) < 3 else y + 12)
    draw.text((left, venue_y), "સ્થળની વિગતો", font=font(34), fill=FOREST_DARK, anchor="la")
    venue_y += 57
    for venue_name in relevant_venues:
        details = GUJARATI_VENUES[venue_name]
        draw.text((left, venue_y), venue_name, font=font(25), fill=INK, anchor="la")
        address_lines = wrap_text(draw, details["address"], font(18), content_width - 280)
        address_y = venue_y + 34
        for line in address_lines[:2]:
            draw.text((left, address_y), line, font=font(18), fill=MUTED, anchor="la")
            address_y += 25
        link_box = (right - 250, venue_y - 2, right, venue_y + 49)
        draw.rounded_rectangle(link_box, radius=22, fill="#F2E9D9", outline=HAIRLINE, width=2)
        draw_centered(draw, ((link_box[0] + link_box[2]) // 2, (link_box[1] + link_box[3]) // 2 + 2), "માર્ગદર્શન ખોલો", font(20), FOREST)
        map_links.append((link_box, details["map"]))
        venue_y = max(address_y + 35, venue_y + 90)

    button_box = (260, 1545, PAGE_WIDTH_PX - 260, 1630)
    draw_button(draw, "સંપૂર્ણ ડિજિટલ આમંત્રણ ખોલો", button_box)
    draw_centered(draw, (PAGE_WIDTH_PX // 2, 1670), "આમંત્રણ અને સ્થળના માર્ગદર્શન માટે ઉપરના બટન પર ટૅપ કરો", font(18), MUTED)

    destination = TEMP_DIRECTORY / f"{configuration['filename']}-schedule.png"
    image.save(destination, optimize=True)
    return destination, map_links, button_box


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
    cover_image, qr_box, cover_button = create_cover_image(configuration)
    schedule_image, map_links, schedule_button = create_schedule_image(configuration)

    pdf = canvas.Canvas(str(destination), pagesize=A4, pageCompression=1)
    first_name, second_name = names_for_side(configuration["side"])
    pdf.setTitle(f"{first_name} અને {second_name} - લગ્ન આમંત્રણ")
    pdf.setAuthor("મીત અને પૂજાનો પરિવાર")
    pdf.setSubject("ખાનગી લગ્ન આમંત્રણ")

    pdf.drawImage(str(cover_image), 0, 0, PDF_WIDTH, PDF_HEIGHT)
    add_qr(pdf, invitation_url, qr_box)
    pdf.linkURL(invitation_url, pdf_rect_from_pixels(cover_button), relative=0)
    pdf.showPage()

    pdf.drawImage(str(schedule_image), 0, 0, PDF_WIDTH, PDF_HEIGHT)
    for box, map_url in map_links:
        pdf.linkURL(map_url, pdf_rect_from_pixels(box), relative=0)
    pdf.linkURL(invitation_url, pdf_rect_from_pixels(schedule_button), relative=0)
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

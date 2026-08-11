"""Create share-ready PDFs for the approved invitation configurations."""

from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing
from reportlab.lib.colors import Color, HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

from create_invite_link import create_token  # noqa: E402


WEBSITE_URL = "https://poojameet200926.github.io/"
OUTPUT_DIRECTORY = PROJECT_ROOT / "output" / "pdf"
FLORAL_FRAME = PROJECT_ROOT / "public" / "festive-floral-frame-optimized.webp"
PAGE_WIDTH, PAGE_HEIGHT = A4

FOREST = HexColor("#245B43")
FOREST_DARK = HexColor("#173E30")
GOLD = HexColor("#C68A25")
PALE_GOLD = HexColor("#E9C978")
IVORY = HexColor("#FFF9EE")
PAPER = HexColor("#F8F1E5")
INK = HexColor("#40372F")
MUTED = HexColor("#736A60")
HAIRLINE = HexColor("#DFCDA8")

TREMONT_MAP = "https://maps.app.goo.gl/g4FNbs7ANbroAfxb8"
NARAYANI_MAP = "https://maps.app.goo.gl/7QJob2xzgw7PQsBF9"

VENUES = {
    "Tremont": {
        "address": "B.1302, Tremont, Vaishnodevi Circle, Ahmedabad, Gujarat 382421",
        "map": TREMONT_MAP,
    },
    "Narayani Heights": {
        "address": "Airport-Gandhinagar Road, Bhat, Ahmedabad, Gujarat 382428",
        "map": NARAYANI_MAP,
    },
}

POOJA_EVENTS = {
    18: [
        ("Ganesh Sthapan, Mandap Muhurat & Grah Shanti", "08:00 AM", "Tremont"),
        ("Mehendi", "Afternoon", "Tremont"),
    ],
    19: [
        ("Ring Ceremony", "09:30 AM", "Narayani Heights"),
        ("Haldi", "11:00 AM - Lunch at 12:30 PM", "Narayani Heights"),
        ("Mameru", "03:00 PM", "Narayani Heights"),
        ("Sangeet", "07:30 PM - Dinner at 08:00 PM", "Narayani Heights"),
    ],
    20: [
        ("Wedding Ceremony", "Hast Melap 11:00 AM - Lunch 12:30 PM - Vidai 03:00 PM", "Narayani Heights"),
    ],
}

MEET_EVENTS = {
    20: [
        ("Arrival of Vighnaharta & Grah Shanti", "08:00 AM", "Narayani Heights"),
        ("Wedding Ceremony", "Hast Melap 11:00 AM - Lunch 12:30 PM - Vidai 03:00 PM", "Narayani Heights"),
    ],
}

CONFIGURATIONS = [
    {
        "filename": "pooja-18-19-20-full-family.pdf",
        "side": "pooja",
        "days": (18, 19, 20),
        "invitees": None,
    },
    {
        "filename": "pooja-19-20-full-family.pdf",
        "side": "pooja",
        "days": (19, 20),
        "invitees": None,
    },
    {
        "filename": "pooja-20-full-family.pdf",
        "side": "pooja",
        "days": (20,),
        "invitees": None,
    },
    {
        "filename": "pooja-20-2-invitees.pdf",
        "side": "pooja",
        "days": (20,),
        "invitees": 2,
    },
    {
        "filename": "meet-20-full-family.pdf",
        "side": "meet",
        "days": (20,),
        "invitees": None,
    },
    {
        "filename": "meet-20-2-invitees.pdf",
        "side": "meet",
        "days": (20,),
        "invitees": 2,
    },
]


def register_fonts() -> None:
    regular = Path(r"C:\Windows\Fonts\georgia.ttf")
    bold = Path(r"C:\Windows\Fonts\georgiab.ttf")
    italic = Path(r"C:\Windows\Fonts\georgiai.ttf")
    if regular.exists() and bold.exists() and italic.exists():
        pdfmetrics.registerFont(TTFont("WeddingSerif", regular))
        pdfmetrics.registerFont(TTFont("WeddingSerif-Bold", bold))
        pdfmetrics.registerFont(TTFont("WeddingSerif-Italic", italic))


def stable_invitation_url(configuration: dict[str, object]) -> str:
    day_count = len(configuration["days"])
    seed = f"pdf-v1:{configuration['filename']}".encode("utf-8")
    nonce = hashlib.sha256(seed).digest()[:12]
    token = create_token(
        configuration["invitees"],
        configuration["days"],
        configuration["side"],
        nonce=nonce,
    )
    assert day_count in (1, 2, 3)
    return f"{WEBSITE_URL}?i={token}"


def draw_page_background(pdf: canvas.Canvas) -> None:
    pdf.setFillColor(PAPER)
    pdf.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, stroke=0, fill=1)
    pdf.drawImage(
        str(FLORAL_FRAME),
        0,
        0,
        PAGE_WIDTH,
        PAGE_HEIGHT,
        preserveAspectRatio=False,
        mask="auto",
    )
    pdf.saveState()
    pdf.setFillAlpha(0.91)
    pdf.setFillColor(IVORY)
    pdf.roundRect(37, 38, PAGE_WIDTH - 74, PAGE_HEIGHT - 76, 17, stroke=0, fill=1)
    pdf.restoreState()
    pdf.setStrokeColor(HAIRLINE)
    pdf.setLineWidth(0.8)
    pdf.roundRect(37, 38, PAGE_WIDTH - 74, PAGE_HEIGHT - 76, 17, stroke=1, fill=0)


def draw_sacred_knot(pdf: canvas.Canvas, center_x: float, center_y: float) -> None:
    pdf.setFillColor(FOREST)
    pdf.circle(center_x, center_y, 26, stroke=0, fill=1)
    pdf.setStrokeColor(PALE_GOLD)
    pdf.setLineWidth(1.2)
    pdf.circle(center_x, center_y, 23, stroke=1, fill=0)
    pdf.setFillColor(PALE_GOLD)
    pdf.circle(center_x, center_y, 5.2, stroke=0, fill=1)
    path = pdf.beginPath()
    path.moveTo(center_x - 5, center_y + 2)
    path.curveTo(center_x - 17, center_y + 13, center_x - 22, center_y - 2, center_x - 8, center_y - 4)
    path.curveTo(center_x - 14, center_y - 2, center_x - 12, center_y + 3, center_x - 5, center_y + 2)
    pdf.drawPath(path, stroke=0, fill=1)
    path = pdf.beginPath()
    path.moveTo(center_x + 5, center_y + 2)
    path.curveTo(center_x + 17, center_y + 13, center_x + 22, center_y - 2, center_x + 8, center_y - 4)
    path.curveTo(center_x + 14, center_y - 2, center_x + 12, center_y + 3, center_x + 5, center_y + 2)
    pdf.drawPath(path, stroke=0, fill=1)
    pdf.setStrokeColor(PALE_GOLD)
    pdf.setLineWidth(4)
    pdf.line(center_x - 3, center_y - 4, center_x - 10, center_y - 19)
    pdf.line(center_x + 3, center_y - 4, center_x + 10, center_y - 19)
    pdf.setFillColor(IVORY)
    pdf.setFont("WeddingSerif", 12)
    pdf.drawCentredString(center_x, center_y + 34, "*")


def draw_button(pdf: canvas.Canvas, label: str, url: str, x: float, y: float, width: float) -> None:
    height = 43
    pdf.setFillColor(FOREST)
    pdf.roundRect(x, y, width, height, height / 2, stroke=0, fill=1)
    pdf.setFillColor(IVORY)
    pdf.setFont("WeddingSerif-Bold", 10)
    pdf.drawCentredString(x + width / 2, y + 15.5, label)
    pdf.linkURL(url, (x, y, x + width, y + height), relative=0)


def draw_qr_code(pdf: canvas.Canvas, url: str, x: float, y: float, size: float) -> None:
    widget = qr.QrCodeWidget(url)
    bounds = widget.getBounds()
    width = bounds[2] - bounds[0]
    height = bounds[3] - bounds[1]
    drawing = Drawing(size, size, transform=[size / width, 0, 0, size / height, 0, 0])
    drawing.add(widget)
    drawing.drawOn(pdf, x, y)


def date_line(days: tuple[int, ...]) -> str:
    if len(days) == 1:
        return "Sunday, 20 September 2026"
    return f"{days[0]}-{days[-1]} September 2026"


def draw_cover(pdf: canvas.Canvas, configuration: dict[str, object], invitation_url: str) -> None:
    draw_page_background(pdf)
    first_name = "Pooja" if configuration["side"] == "pooja" else "Meet"
    second_name = "Meet" if first_name == "Pooja" else "Pooja"

    draw_sacred_knot(pdf, PAGE_WIDTH / 2, PAGE_HEIGHT - 133)
    pdf.setFillColor(FOREST)
    pdf.setFont("WeddingSerif-Bold", 10)
    pdf.drawCentredString(PAGE_WIDTH / 2, PAGE_HEIGHT - 194, "TOGETHER WITH THEIR FAMILIES")

    pdf.setFillColor(GOLD)
    pdf.setFont("WeddingSerif-Italic", 38)
    name_width = pdfmetrics.stringWidth(first_name, "WeddingSerif-Italic", 38)
    second_width = pdfmetrics.stringWidth(second_name, "WeddingSerif-Italic", 38)
    amp_width = pdfmetrics.stringWidth(" & ", "WeddingSerif", 22)
    total_width = name_width + amp_width + second_width
    start_x = (PAGE_WIDTH - total_width) / 2
    pdf.drawString(start_x, PAGE_HEIGHT - 258, first_name)
    pdf.setFillColor(FOREST)
    pdf.setFont("WeddingSerif", 22)
    pdf.drawString(start_x + name_width, PAGE_HEIGHT - 254, " & ")
    pdf.setFillColor(GOLD)
    pdf.setFont("WeddingSerif-Italic", 38)
    pdf.drawString(start_x + name_width + amp_width, PAGE_HEIGHT - 258, second_name)

    pdf.setFillColor(INK)
    pdf.setFont("WeddingSerif", 25)
    pdf.drawCentredString(PAGE_WIDTH / 2, PAGE_HEIGHT - 312, "Wedding Invitation")
    pdf.setStrokeColor(HAIRLINE)
    pdf.line(133, PAGE_HEIGHT - 335, PAGE_WIDTH - 133, PAGE_HEIGHT - 335)
    pdf.setFillColor(FOREST)
    pdf.setFont("WeddingSerif-Bold", 17)
    pdf.drawCentredString(PAGE_WIDTH / 2, PAGE_HEIGHT - 375, date_line(configuration["days"]))

    if configuration["invitees"] is not None:
        pdf.setFillColor(GOLD)
        pdf.setFont("WeddingSerif-Italic", 14)
        pdf.drawCentredString(PAGE_WIDTH / 2, PAGE_HEIGHT - 407, "Reserved with love for 2 guests")

    qr_size = 108
    qr_x = (PAGE_WIDTH - qr_size) / 2
    qr_y = 228
    pdf.setFillColor(Color(1, 1, 1, alpha=0.95))
    pdf.roundRect(qr_x - 8, qr_y - 8, qr_size + 16, qr_size + 16, 8, stroke=0, fill=1)
    draw_qr_code(pdf, invitation_url, qr_x, qr_y, qr_size)
    pdf.setFillColor(MUTED)
    pdf.setFont("WeddingSerif", 10)
    pdf.drawCentredString(PAGE_WIDTH / 2, 204, "Scan the code or tap below to open the interactive invitation")
    draw_button(pdf, "OPEN DIGITAL INVITATION", invitation_url, (PAGE_WIDTH - 224) / 2, 142, 224)
    pdf.setFillColor(MUTED)
    pdf.setFont("WeddingSerif-Italic", 9)
    pdf.drawCentredString(PAGE_WIDTH / 2, 112, "English and Gujarati available")
    pdf.setFont("WeddingSerif", 7.5)
    pdf.drawCentredString(PAGE_WIDTH / 2, 77, "This private invitation link is intended for the invited guests.")
    pdf.showPage()


def wrap_text(text: str, font: str, size: float, width: float) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if pdfmetrics.stringWidth(candidate, font, size) <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_schedule(pdf: canvas.Canvas, configuration: dict[str, object], invitation_url: str) -> None:
    draw_page_background(pdf)
    first_name = "Pooja" if configuration["side"] == "pooja" else "Meet"
    second_name = "Meet" if first_name == "Pooja" else "Pooja"
    event_source = POOJA_EVENTS if configuration["side"] == "pooja" else MEET_EVENTS

    pdf.setFillColor(GOLD)
    pdf.setFont("WeddingSerif-Italic", 23)
    pdf.drawCentredString(PAGE_WIDTH / 2, PAGE_HEIGHT - 79, f"{first_name} & {second_name}")
    pdf.setFillColor(FOREST_DARK)
    pdf.setFont("WeddingSerif-Bold", 25)
    pdf.drawCentredString(PAGE_WIDTH / 2, PAGE_HEIGHT - 113, "Celebration Schedule")
    pdf.setFillColor(MUTED)
    pdf.setFont("WeddingSerif", 9.5)
    pdf.drawCentredString(PAGE_WIDTH / 2, PAGE_HEIGHT - 135, date_line(configuration["days"]))

    y = PAGE_HEIGHT - 169
    event_card_left = 67
    event_card_width = PAGE_WIDTH - 134
    for day in configuration["days"]:
        pdf.setFillColor(FOREST)
        pdf.roundRect(event_card_left, y - 24, event_card_width, 28, 8, stroke=0, fill=1)
        pdf.setFillColor(IVORY)
        pdf.setFont("WeddingSerif-Bold", 11)
        weekday = {18: "FRIDAY", 19: "SATURDAY", 20: "SUNDAY"}[day]
        pdf.drawString(event_card_left + 13, y - 15, f"{weekday}  {day} SEPTEMBER")
        y -= 35

        for title, timing, venue in event_source[day]:
            title_lines = wrap_text(title, "WeddingSerif-Bold", 10.5, 224)
            timing_lines = wrap_text(timing, "WeddingSerif-Italic", 8.5, 168)
            row_height = 45 if len(timing_lines) == 1 and len(title_lines) == 1 else 53
            pdf.saveState()
            pdf.setFillAlpha(0.88)
            pdf.setFillColor(Color(1, 1, 1))
            pdf.roundRect(event_card_left, y - row_height, event_card_width, row_height - 4, 7, stroke=0, fill=1)
            pdf.restoreState()
            pdf.setFillColor(INK)
            pdf.setFont("WeddingSerif-Bold", 10.5)
            for line_index, line in enumerate(title_lines[:2]):
                pdf.drawString(event_card_left + 13, y - 18 - line_index * 12, line)
            pdf.setFillColor(GOLD)
            pdf.setFont("WeddingSerif-Italic", 8.5)
            for line_index, line in enumerate(timing_lines[:2]):
                pdf.drawRightString(event_card_left + event_card_width - 13, y - 17 - line_index * 11, line)
            pdf.setFillColor(MUTED)
            pdf.setFont("WeddingSerif", 7.6)
            pdf.drawString(event_card_left + 13, y - row_height + 8, venue)
            y -= row_height
        y -= 5

    relevant_venues = ["Narayani Heights"]
    if 18 in configuration["days"]:
        relevant_venues.insert(0, "Tremont")

    y = min(y - 4, 274)
    pdf.setFillColor(FOREST_DARK)
    pdf.setFont("WeddingSerif-Bold", 13)
    pdf.drawString(event_card_left, y, "Venue details")
    y -= 19
    for venue_name in relevant_venues:
        details = VENUES[venue_name]
        pdf.setFillColor(INK)
        pdf.setFont("WeddingSerif-Bold", 9.5)
        pdf.drawString(event_card_left, y, venue_name)
        pdf.setFillColor(MUTED)
        pdf.setFont("WeddingSerif", 7.5)
        address_lines = wrap_text(details["address"], "WeddingSerif", 7.5, event_card_width - 95)
        for line_index, line in enumerate(address_lines[:2]):
            pdf.drawString(event_card_left, y - 12 - line_index * 9, line)
        pdf.setFillColor(FOREST)
        pdf.setFont("WeddingSerif-Bold", 7.5)
        pdf.drawRightString(event_card_left + event_card_width, y - 8, "OPEN DIRECTIONS")
        pdf.linkURL(
            details["map"],
            (event_card_left + event_card_width - 92, y - 15, event_card_left + event_card_width, y + 4),
            relative=0,
        )
        y -= 40

    draw_button(pdf, "OPEN THE FULL INTERACTIVE INVITATION", invitation_url, (PAGE_WIDTH - 266) / 2, 60, 266)
    pdf.setFillColor(MUTED)
    pdf.setFont("WeddingSerif", 7.5)
    pdf.drawCentredString(PAGE_WIDTH / 2, 45, "Tap the buttons above for the invitation and map directions.")
    pdf.showPage()


def create_pdf(configuration: dict[str, object], invitation_url: str) -> Path:
    destination = OUTPUT_DIRECTORY / configuration["filename"]
    pdf = canvas.Canvas(str(destination), pagesize=A4, pageCompression=1)
    first_name = "Pooja" if configuration["side"] == "pooja" else "Meet"
    second_name = "Meet" if first_name == "Pooja" else "Pooja"
    pdf.setTitle(f"{first_name} & {second_name} - Wedding Invitation")
    pdf.setAuthor("Meet & Pooja Families")
    pdf.setSubject("Private wedding invitation")
    draw_cover(pdf, configuration, invitation_url)
    draw_schedule(pdf, configuration, invitation_url)
    pdf.save()
    return destination


def main() -> None:
    register_fonts()
    OUTPUT_DIRECTORY.mkdir(parents=True, exist_ok=True)
    manifest = []
    for configuration in CONFIGURATIONS:
        invitation_url = stable_invitation_url(configuration)
        destination = create_pdf(configuration, invitation_url)
        manifest.append(
            {
                "pdf": destination.name,
                "side": configuration["side"],
                "days": list(configuration["days"]),
                "invitees": configuration["invitees"],
                "url": invitation_url,
            }
        )
        print(f"Created {destination.name}")
    (OUTPUT_DIRECTORY / "invitation-links.json").write_text(
        json.dumps(manifest, indent=2),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()

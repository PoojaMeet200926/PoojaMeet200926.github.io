# Meet & Pooja — Digital Wedding Invitation

Interactive mobile wedding invitation for Meet and Pooja’s September 2026 celebration.

## Run locally

Requires Node.js 22.13 or newer.

```powershell
npm install
npm run dev
```

Open the local address printed in the terminal.

## Create personalized invitation links with Python

Each personalized link contains one encrypted `i` token. Guest count, invited days, and which family sent the invitation are not readable from the URL.

You host the website once. Run this program whenever you need a guest-specific link. It uses only Python’s standard library; no packages need to be installed.

For local testing, batch examples, every command option, hosted-link generation, and troubleshooting, see [PYTHON_INVITE_LINK_GUIDE.md](./PYTHON_INVITE_LINK_GUIDE.md).

### Guided mode

Run:

```powershell
python create_invite_link.py
```

It will ask for:

1. Your hosted website URL.
2. Invited dates: `20`, `19,20`, or `18,19,20`.
3. Number of invitees. Leave it blank for the whole family.
4. Invitation side: `Pooja` or `Meet`.

### One-command mode

Four people invited for 19 and 20 September:

```powershell
python create_invite_link.py --url "https://your-wedding-site.com" --days 19,20 --invitees 4 --side pooja
```

Whole-family invitation, with no guest count shown:

```powershell
python create_invite_link.py --url "https://your-wedding-site.com" --days 18,19,20 --family --side meet
```

Day selection:

- `--days 20`: Sunday, 20 September
- `--days 19,20`: Saturday–Sunday, 19–20 September
- `--days 18,19,20`: Friday–Sunday, 18–20 September

Name order:

- `--side pooja`: displays `Pooja & Meet` and `Pooja weds Meet`.
- `--side meet`: displays `Meet & Pooja` and `Meet weds Pooja`.

Pooja-side invitations show a centered Ganeshji emblem and `॥ श्री गणेशाय नमः ॥` at the top of the revealed opening card. OM SHANTI is intentionally omitted from that card. The first Narayani Heights page shows only a smaller centered OM SHANTI emblem directly over the venue image, without Ganeshji, a white panel, or the invocation. Meet-side invitations keep the original minimal floret and do not show the emblems or invocation.

The first Narayani Heights page includes a centered invitation button near the bottom. Pressing it smoothly scrolls to the next story section; reduced-motion browser preferences disable the smooth animation automatically.

Pooja-side invitations end with a themed “With Best Compliments From” family page containing the supplied Modi family names. In English mode it preserves the supplied English spellings; in Gujarati mode the honorifics, names, initials, and younger family names switch to Gujarati in Noto Serif Gujarati. This final page is not shown on Meet-side links.

The program prints the final encoded link. Copy that complete link and send it to the guest through WhatsApp, email, or another messaging service.

The site shows only the events included in that link. For `--family`, it shows the invited dates but does not mention a guest count. The selected side controls name order throughout the invitation.

## Narayani Garden visual theme

The invitation uses the approved Narayani Garden palette: warm ivory paper, deep garden sage, eucalyptus, antique champagne gold, charcoal ink, and restrained blush details. Backgrounds intentionally rotate by section instead of repeating a single solid color:

- oversized pale botanical corners on the story and closing pages;
- ivory handmade-paper grain on editorial content and cards;
- a soft silk-light sweep on the personalized invitation, plus botanical corners and an edge-faded jaali veil on the countdown;
- a faint geometric jaali lattice behind the event schedule;
- botanical and lattice details on the Pooja-side family compliments page.

Patterns remain low contrast so English and Gujarati copy stays readable. The red-and-black OM SHANTI emblem is not recolored by the theme.

## English and Gujarati

Guests can switch the complete invitation between English and Gujarati using the fixed language button in the top-right corner. The selection is saved on that device and does not modify the guest's encoded invitation link, invited dates, guest count, or name order.

Gujarati mode converts dates, years, times, countdown values, event indexes, guest counts, address numbers, and pincodes to Gujarati numerals. The event schedule includes the Ganesh rituals at 08:00 AM, Sangeet with Dinner at 08:00 PM, Wedding Ceremony with Hast Melap at 11:00 AM above Lunch at 12:30 PM, and a separate featured Vidai card for Sunday, 20 September at 03:00 PM.

### JavaScript alternative

```powershell
npm run invite:link -- --people 4 --days 2 --side pooja --url "https://your-wedding-site.com"
```

The token prevents casual reading and detects URL modification. Because the invitation is public and decrypts in the guest’s browser, it should be treated as privacy-friendly obfuscation rather than access control.

## Build

```powershell
npm run build
```

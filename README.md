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

Pooja-side invitations also show the Ganeshji and OM SHANTI blessing emblems at the top of the revealed card. Meet-side invitations keep the original minimal floret and do not show those two emblems.

The program prints the final encoded link. Copy that complete link and send it to the guest through WhatsApp, email, or another messaging service.

The site shows only the events included in that link. For `--family`, it shows the invited dates but does not mention a guest count. The selected side controls name order throughout the invitation.

## English and Gujarati

Guests can switch the complete invitation between English and Gujarati using the fixed language button in the top-right corner. The selection is saved on that device and does not modify the guest's encoded invitation link, invited dates, guest count, or name order.

### JavaScript alternative

```powershell
npm run invite:link -- --people 4 --days 2 --side pooja --url "https://your-wedding-site.com"
```

The token prevents casual reading and detects URL modification. Because the invitation is public and decrypts in the guest’s browser, it should be treated as privacy-friendly obfuscation rather than access control.

## Build

```powershell
npm run build
```

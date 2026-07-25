# Meet & Pooja — Digital Wedding Invitation

Interactive mobile wedding invitation for Meet and Pooja’s September 2026 celebration.

## Run locally

Requires Node.js 22.13 or newer.

```powershell
npm install
npm run dev
```

Open the local address printed in the terminal.

## Create personalized invitation links

Each personalized link contains one encrypted `i` token. Guest count and invited days are not readable from the URL.

Numbered invitation:

```powershell
npm run invite:link -- --people 4 --days 2
```

Whole-family invitation, with no guest count shown:

```powershell
npm run invite:link -- --family --days 3
```

Day selection:

- `--days 1`: Sunday, 20 September
- `--days 2`: Saturday–Sunday, 19–20 September
- `--days 3`: Friday–Sunday, 18–20 September

The generator uses the live invitation address by default. To use another address:

```powershell
npm run invite:link -- --people 2 --days 1 --url http://127.0.0.1:4194
```

The site shows only the events included in the selected day range. For `--family`, it shows the invited dates but does not mention a guest count.

The token prevents casual reading and detects URL modification. Because the invitation is public and decrypts in the guest’s browser, it should be treated as privacy-friendly obfuscation rather than access control.

## Build

```powershell
npm run build
```

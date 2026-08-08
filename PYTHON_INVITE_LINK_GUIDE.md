# Python Invitation-Link Generator Guide

This guide explains how to create and test guest-specific Meet & Pooja invitation links with `create_invite_link.py`.

The generator creates an opaque `?i=` token containing:

- the number of invited people, or a whole-family invitation;
- the invited date group;
- whether the invitation is sent from Meet's side or Pooja's side;
- whether the link opens the wedding invitation or the post-wedding get-together.

The website is hosted only once. Run the generator again for every guest or family that needs a different link.

## Requirements

- Python 3.10 or newer.
- No third-party Python packages.
- Run commands from the project folder containing `create_invite_link.py`.

Confirm Python is available:

```powershell
python --version
```

Show the built-in command reference:

```powershell
python create_invite_link.py --help
```

## Test links on the local website

Open PowerShell in the project folder and start the invitation in the first terminal:

```powershell
npm.cmd run dev
```

Keep that terminal open. Note the exact local URL it prints, such as `http://localhost:3000`.

Open a second PowerShell window in the same project folder. Use the local URL as `--url` when generating test links.

Pooja-side invitation for two people on 20 September:

```powershell
python create_invite_link.py --url "http://localhost:3000" --days 20 --invitees 2 --side pooja
```

Pooja-side invitation for four people on 19 and 20 September:

```powershell
python create_invite_link.py --url "http://localhost:3000" --days 19,20 --invitees 4 --side pooja
```

Meet-side whole-family wedding invitation for 20 September:

```powershell
python create_invite_link.py --url "http://localhost:3000" --days 20 --family --side meet
```

Post-wedding Ghee Gud get-together for four people:

```powershell
python create_invite_link.py --url "http://localhost:3000" --days 20 --invitees 4 --side meet --occasion get-together
```

Open each generated URL in the browser. If the development server uses another port, replace `3000` with the port printed by `npm.cmd run dev`.

## Command options

| Option | Accepted value | Result |
|---|---|---|
| `--url` | Full `http://` or `https://` website URL | Website to which the encrypted token is added |
| `--days 20` | Exact date group | Shows only the 20 September events |
| `--days 19,20` | Exact date group | Shows the 19 and 20 September events |
| `--days 18,19,20` | Exact date group | Shows all three invited dates |
| `--invitees N` | Integer from 1 through 250 | Displays the invited guest count |
| `--family` | No value | Invites the whole family without displaying a count |
| `--side pooja` | `pooja` | Pooja appears first and Pooja-side blessings/family details are shown |
| `--side meet` | `meet` | Meet appears first and Pooja-specific content is hidden |
| `--occasion wedding` | `wedding` | Shows the wedding invitation; this is the default |
| `--occasion get-together` | `get-together` | Shows only the post-wedding 20 September gathering at Ghee Gud Restaurant |

Use exactly one of `--invitees N` or `--family`.

The only supported wedding date groups are `20`, `19,20`, and `18,19,20`. A group such as `18,20` is intentionally rejected because it does not correspond to an invitation configuration. Get-together links always use `20`.

## Generate several links for testing

Run several commands one after another. Every successful command prints a complete link that can be opened or shared.

```powershell
python create_invite_link.py --url "http://localhost:3000" --days 20 --invitees 1 --side pooja
python create_invite_link.py --url "http://localhost:3000" --days 20 --invitees 2 --side meet
python create_invite_link.py --url "http://localhost:3000" --days 19,20 --invitees 4 --side pooja
python create_invite_link.py --url "http://localhost:3000" --days 18,19,20 --family --side pooja
python create_invite_link.py --url "http://localhost:3000" --days 20 --invitees 4 --side meet --occasion get-together
```

To save the output from multiple commands in one text file:

```powershell
python create_invite_link.py --url "http://localhost:3000" --days 20 --invitees 1 --side pooja | Out-File -Append test-invite-links.txt
python create_invite_link.py --url "http://localhost:3000" --days 19,20 --invitees 4 --side pooja | Out-File -Append test-invite-links.txt
python create_invite_link.py --url "http://localhost:3000" --days 18,19,20 --family --side pooja | Out-File -Append test-invite-links.txt
```

`test-invite-links.txt` will be created in the current folder. The descriptive output and generated URLs are both saved.

## Guided mode

Run the script without arguments:

```powershell
python create_invite_link.py
```

The program asks for the website URL, invitation type, invited dates (for wedding links), guest count, and sender side. Leave the guest-count answer blank to invite the whole family. Get-together links automatically use Sunday, 20 September.

## Generate links for the hosted website

Replace the local URL with the final hosted invitation URL:

```powershell
python create_invite_link.py --url "https://your-wedding-site.com" --days 19,20 --invitees 4 --side pooja
```

Copy the complete generated link, including its `?i=` token, and send that link to the guest.

## Important behavior

- A fresh opaque token is generated every time. Two links created with identical options can look different while producing the same invitation configuration.
- Do not manually edit or shorten the `?i=` value. Modified tokens are rejected by the website.
- The token prevents casual reading of guest details and detects modification, but it is not an authentication or access-control system.
- Language is selected by the guest on the website and is not encoded into the link.
- Pooja-side and Meet-side links intentionally display different name order and side-specific content.
- `--occasion get-together` hides Narayani Heights, all wedding events, side-specific family copy, and family compliments. It shows only the 08:00–10:00 PM indoor gathering at Ghee Gud Restaurant with the supplied directions link.

## Common errors

`--url and --days are required.`

- Include both options, or run the program without any arguments to use guided mode.

`Use --invitees NUMBER or --family.`

- Specify exactly one invitation size option.

`Choose exactly one supported group: 20; 19,20; or 18,19,20.`

- Correct the date group to one of the three supported combinations.

`Number of invitees must be between 1 and 250.`

- Use a number from 1 through 250, or use `--family`.

`Website URL must start with http:// or https://.`

- Pass the complete local or hosted URL, including its protocol.

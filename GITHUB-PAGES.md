# GitHub Pages edition

This branch is the GitHub-friendly edition of the wedding invitation. The original ChatGPT Sites/Cloudflare edition remains on `live-ribbon-v4`.

## Switch editions locally

```powershell
git switch github-pages
git switch live-ribbon-v4
```

Use `github-pages` for GitHub hosting. Use `live-ribbon-v4` to return to the original hosting setup.

## Local GitHub build

Requires Node.js 22 or newer.

```powershell
npm install
npm run dev:github
```

Production check:

```powershell
npm run test:github
```

The static output is written to `dist-github/` and is intentionally ignored by Git.

## Connect the future repository

Create a public repository named exactly `YOUR-USERNAME.github.io`, then run:

```powershell
git remote add github https://github.com/YOUR-USERNAME/YOUR-USERNAME.github.io.git
git push -u github github-pages:main
```

In the repository, open **Settings → Pages** and select **GitHub Actions** as the source. Every later push to remote `main` builds and publishes automatically.

The workflow calculates `https://YOUR-USERNAME.github.io` from the repository owner. No username is hardcoded in source.

## Guest links

Generate links with the final GitHub URL:

```powershell
python create_invite_link.py --url "https://YOUR-USERNAME.github.io" --days 18,19,20 --family --side pooja
python create_invite_link.py --url "https://YOUR-USERNAME.github.io" --days 20 --invitees 2 --side meet
```

Existing encrypted tokens remain valid. Replace only the old domain and retain the complete `?i=...` query value.

## Custom domain later

Change `VITE_SITE_URL` in `.github/workflows/deploy-pages.yml` to the final `https://` domain before publishing. Configure the same domain under GitHub **Settings → Pages**.

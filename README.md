# Home Dashboard

A lightweight dashboard for HomeDroid with a clock, weather, LAN service status, shortcuts, tasks, and quick notes.

## Features

- Static site with no dependencies or build step.
- Uses the current hostname to create links to HomeDroid ports.
- Checks HomeDroid, AdGuard Home, Mộc, Jellyfin, Home Assistant, and Local AI.
- Uses Open-Meteo for weather and supports changing the city.
- Stores tasks, notes, city, and theme in each browser's `localStorage`.

## Run locally

```bash
python -m http.server 4174
node dashboard.test.mjs
```

Open `http://localhost:4174`.

## Deploy with HomeDroid

Create a deployment with:

| Field | Value |
| --- | --- |
| Repository | This repository's HTTPS URL |
| Branch | `main` |
| Port | `4174` |
| Runtime | `Static` or `Auto` |
| Build command | Leave blank |
| Start command | Leave blank |

After deployment, open `http://<HomeDroid-IP>:4174`.

The default service cards use HomeDroid's standard ports. Services that are not installed appear as `Offline`.

# Nikah Invitation

A lightweight, config-driven digital invitation that can be deployed as a static site.

## Customize an invitation

Edit `config/wedding.json`:

- `groom` and `bride`: names shown throughout the invitation.
- `date`: ISO date/time, including the timezone offset.
- `venue`, `address`, and `googleMapsUrl`: ceremony details.
- `whatsappNumber`: RSVP number in international format.
- `music`: optional relative path to an MP3 file.
- `gallery`: relative paths to image files.
- `design`: the design registry key to use.

The existing page remains the invitation template. Its content is populated at runtime by `src/js/config.js` and `src/js/app.js`.

## Add or switch designs

Design metadata lives in `config/designs.json`. The current registry includes:

- `burgundy-floral`: the default classic gold-accented design.
- `emerald-gold`: an emerald variant with warmer gold contrast.

To switch designs, change the `design` value in `config/wedding.json`. To add another visual variant, register a new key and add scoped styles in `index.html` under `body[data-design="your-key"]`.

## Run locally

Because the app loads JSON with `fetch`, serve the folder over HTTP instead of opening `index.html` directly:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/` in a browser. Music begins only after the visitor taps **Open Invitation**, as required by browser autoplay policies.

## Deploy

The project is static and can be deployed to GitHub Pages, Cloudflare Pages, or any static hosting provider. Keep asset paths relative so they continue to work under a hosted project path.

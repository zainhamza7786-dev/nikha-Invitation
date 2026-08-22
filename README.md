# Nikah Invitation

A lightweight, config-driven digital invitation that can be deployed as a static site.

## Customize an invitation

Edit `config/wedding.json`:

- `couple.groom.name` and `couple.bride.name`: names shown throughout the invitation.
- `wedding.date`, `wedding.time`, and `wedding.timezone`: ceremony timing.
- `venue`, `address`, and `googleMapsUrl`: ceremony details.
- `whatsappNumber`: RSVP number in international format.
- `music`: optional relative path to an MP3 file.
- `gallery`: relative paths to image files.
- `design`: the design registry key to use.

The loader also accepts the older flat keys (`groom`, `bride`, `date`, and so on) for existing invitations.

## Platform structure

- `config/wedding.json`: invitation-specific content.
- `config/templates.json`: template registry and entry points.
- `config/themes.json`: reusable visual themes.
- `engine/`: shared countdown, events, maps, WhatsApp, RSVP, gallery, music, navigation, sharing, and validation helpers.
- `templates/nikah-calligraphy/`: independently accessible calligraphy template.

The existing page remains the invitation template. Its content is populated at runtime by `src/js/config.js` and `src/js/app.js`.

## Add or switch designs

Design metadata lives in `config/designs.json`. The current registry includes:

- `burgundy-floral`: the default classic gold-accented design.
- `emerald-gold`: an emerald variant with warmer gold contrast.
- `brown-black-luxurious`: a brown, black, and champagne editorial variant inspired by the supplied Canva reference.

To switch templates, change `template` in `config/wedding.json` and use the registered entry point. To switch visual style, change `theme` or `design`. Add a new template by creating its folder, registering its entry in `config/templates.json`, and reusing the shared engine modules.

To preview another invitation with the same template, place its JSON in `config/invitations/` and open it with the query parameter:

```text
templates/nikah-calligraphy/?invitation=demo-second
```

The included `config/invitations/demo-second.json` demonstrates different names, dates, events, venue, WhatsApp, background, gallery, and disabled music.

## Run locally

Because the app loads JSON with `fetch`, serve the folder over HTTP instead of opening `index.html` directly:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/` in a browser. Music begins only after the visitor taps **Open Invitation**, as required by browser autoplay policies.

## Deploy

The project is static and can be deployed to GitHub Pages, Cloudflare Pages, or any static hosting provider. Keep asset paths relative so they continue to work under a hosted project path.

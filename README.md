# Nikah Invitation Platform

Reusable static digital-invitation template engine for Cloudflare Pages. The design and runtime live in `src/`; each customer is represented by `config/wedding.json` and files in `assets/`.

## Structure

```text
index.html                 Template shell
config/wedding.json        Customer data contract
src/css/                   Base, theme, component, and responsive styles
src/js/                    Runtime, feature modules, and config loader
src/components/            Reusable invitation sections
assets/                    Customer-specific backgrounds, gallery, and music
templates/                 Theme entry points for future designs
public/                    Static public files
```

## Create a new invitation

1. Replace the values in `config/wedding.json`.
2. Put the customer's files in `assets/backgrounds`, `assets/gallery`, and `assets/music`.
3. Update only the asset paths in the JSON file.
4. Choose a theme with `theme`: `emerald-gold`, `ivory-gold`, `burgundy-gold`, or `minimal`.

Customer data is never embedded in the design components. The app fetches JSON at runtime, formats the configured date and timezone, builds the gallery, connects WhatsApp RSVP, and enables music after the visitor opens the invitation.

## Local check

Run `npm run check` to validate the JavaScript modules. To preview the page locally, serve the repository over HTTP because ES modules and `fetch()` are blocked from `file://` pages:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Cloudflare Pages

Create a Pages project connected to this repository. Use the repository root as the output directory and leave the build command empty for this static site. New customers only require changes to the JSON and asset files.

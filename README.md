# Nikah Invitation — Customization & Deploy

Files:

- `index.html` — Single-file invitation. Edit the `WEDDING_CONFIG` object near the bottom to customize.
- `images/` — The invitation currently uses `creative-arabic-calligraphy-ashraf-masculine-260nw-1846598230.jpg.webp` and `images.jpeg`.
- `music/` — The invitation uses `NikhaSong.mp3` for background music.

How to customize (quick):

1. Open `index.html` and find the `WEDDING_CONFIG` object.
   - `nikahDate`: set to `YYYY-MM-DDTHH:mm:ss+05:30` (example timezone +05:30).
   - `venue` / `address`: replace placeholders.
   - `googleMapsUrl`: paste your venue Google Maps link.
   - `whatsappNumber`: set your number in international format (e.g. `919876543210`).
   - `music`: keep `music/NikhaSong.mp3` or remove if unused.

2. Replace images: update the image paths in the gallery section of `index.html`.

3. Add music (optional): update the `music` path in `WEDDING_CONFIG`.

Deploy to GitHub Pages:

1. Commit the `nikah-invitation` folder to your repository root.
2. In GitHub, go to repository **Settings → Pages** and set Source to the `main` branch and folder `/ (root)`.
3. Visit `https://<username>.github.io/<repo>/nikah-invitation/` after a couple minutes.

Notes:
- All asset paths are relative so they work on GitHub Pages.
- The invitation will not autoplay music until the visitor taps "Open Invitation".

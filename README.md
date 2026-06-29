# Samuel Marshall Photo — Portfolio Site

A fast, image-forward marketing/portfolio site for **Samuel Marshall** (sports + wedding
photographer, Kingsburg / Fresno / Central Valley CA). It's a static site — pure HTML, CSS,
and vanilla JS, no build step — so it can be hosted anywhere (Netlify, Vercel, GitHub Pages,
SmugMug custom pages, or any web host) and loads instantly.

It is designed to **complement** the existing SmugMug business: the **Find Your Photos**
section funnels game-day visitors to the SmugMug galleries for buying prints/downloads, while
the rest of the site showcases the work and drives **booking** inquiries.

```
samuel-marshall-portfolio/
├── index.html        all the content/sections
├── css/style.css     all styling (theme variables at the top)
├── js/main.js        slideshow, lightbox, filtering, form, reveals
└── README.md         this file
```

Open `index.html` in a browser to view — no server required.

---

## ✅ Before it goes live — replace the placeholders

Everything below is a **placeholder** and should be swapped for Samuel's real assets/info.

### 1. Photos (most important)
All images are currently **stock photos from Unsplash** for layout only.

- **Hero slideshow** — 4 `.hero__slide` `background-image` URLs in `index.html`.
- **Portfolio gallery** — each `<figure class="shot">` has two image references:
  - `src="…w=700…"` → the small grid thumbnail
  - `data-full="…w=1600…"` → the large image shown in the lightbox
  Also update `data-title`, `data-meta`, and the `alt` text per photo.
- **About headshot** — the `.about__photo img` (needs a real photo of Samuel).

**Recommended:** drop real images into an `assets/` folder and point the `src` / `data-full`
attributes at them (e.g. `assets/football-01.jpg`). Keep web-sized files (~1600px on the long
edge, compressed) so the site stays fast.

### 2. Stats (`.stats` in the Intro section)
The four numbers (seasons, games, frames, turnaround) are **illustrative** — edit the
`data-count` / `data-suffix` attributes to Samuel's real, confirmable numbers, or remove the
section.

### 3. Testimonials (`.quotes`)
Currently **generic placeholders**. Replace with real client quotes (with permission), or
remove the section.

### 4. The contact form
Out of the box the form **falls back to opening the visitor's email app** (mailto to
`samuelmphoto@gmail.com`) — so it works immediately with zero setup.

To collect submissions properly (recommended), create a free **Formspree** form and paste the
endpoint into the `<form action="…">` in `index.html`:
```html
<form ... action="https://formspree.io/f/abc123xyz" method="POST">
```
The JS auto-detects a real Formspree ID and switches to AJAX submit (no page reload, inline
success message). Any other form backend that accepts a POST works too.

### 5. Links & contact
Already wired to the real public info — double-check before launch:
- Email: `samuelmphoto@gmail.com`
- Instagram: `https://www.instagram.com/samuelmarshallphoto/`
- Facebook: `https://www.facebook.com/samuelmarshallphoto/`
- "Find Your Photos" / "Browse galleries" buttons point to `https://www.samuelmarshallphoto.com/`
  (the SmugMug site). Point these at the exact gallery landing page if there's a better one.

---

## 🎨 Theming — matched to samuelmarshallphoto.com
The look is deliberately consistent with Samuel's existing SmugMug site so the two feel like
one brand:
- **Type:** Lora (serif headings) + Lato (body) — the same pairing as his current site.
- **Base:** black background, white headings, `#949494`-style gray body text.
- **Brand colors:** green + gold, pulled from his "Marshall PHOTO" logo badge. `--accent`
  (green) drives buttons/links/brand moments; `--accent-2` (gold) is the decorative accent.

All of it lives in CSS variables at the top of `css/style.css` (`:root`) — change a couple of
values to re-skin everything.

**Logo:** the nav uses a green/gold "SM" badge that echoes his real photographer badge. To use
his **actual logo**, drop the file in as `assets/logo.png` and replace the `.nav__logo-mark`
span in `index.html` with `<img src="assets/logo.png" ...>`.

## ♿ / 🔍 Built in
- Responsive (desktop → mobile), accessible (skip link, ARIA, keyboard-navigable lightbox,
  `prefers-reduced-motion` support).
- SEO meta tags, Open Graph/social preview, and `ProfessionalService` JSON-LD structured data
  for local search. Update the `og:image` and canonical URL to the real domain on launch.

# Awodeyi Jesutofunmi — Portfolio

A multi-page personal portfolio built with plain HTML, CSS, and vanilla
JavaScript — no frameworks, no build step. Open `index.html` in a browser,
or use VS Code's "Live Server" extension, and it works.

## Structure

```
portfolio/
├── index.html          Home
├── about.html           About
├── skills.html          Skills
├── projects.html        Projects (with filtering)
├── experience.html      Experience
├── services.html        Services
├── contact.html         Contact (with form validation)
├── css/style.css        All styling — one file, organized by section
├── js/script.js         All interactivity — one file, organized by section
└── images/
    ├── favicon.svg
    ├── profile-placeholder.svg
    └── projects/*.svg   Placeholder thumbnails for each project
```

Every page shares the same `<nav>` and `<footer>` markup (copy-pasted
across files, since this isn't using a framework), so editing the nav or
footer means editing it in all seven files. It also shares one CSS file and
one JS file, so a style or behavior change in either only has to happen
once.

## What to personalize before you publish

The site runs as-is, but these are placeholders you should replace:

- **Photo** — `images/profile-placeholder.svg` is used on the Home and
  About pages. Replace it with a real photo (update the two `<img src="...">`
  references in `index.html` and `about.html`).
- **Email** — `contact.html` has `your.email@example.com`. Also update the
  `mailto:` behavior if you want the form's "Send Message" button to
  actually deliver mail (see below).
- **GitHub / LinkedIn links** — every page's footer, plus the Contact page
  and each project card, use `href="#"` placeholders for GitHub and
  LinkedIn. Search each file for `href="#"` and swap in your real URLs.
- **Project GitHub / Live Demo links** — same as above, in `projects.html`
  and the featured cards on `index.html`.
- **Stats on the Home page** — "Years Learning" is left as `[X]+`
  intentionally. Fill in the real number.
- **Experience page** — the "Industrial Training / SIWES" and "Graphic
  Design Experience" sections are left as bracketed placeholders
  (`[Add your SIWES placement organization]`, etc.) since I didn't have
  those specifics. Fill them in with real details.
- **Timeline years** — the About page's journey timeline uses `[Year]`
  placeholders since exact dates weren't specified.

## The contact form doesn't send email yet

There's no backend, so `contact.html` only validates the form fields in
the browser and shows a "message sent" confirmation — it doesn't actually
deliver anything anywhere. To make it functional, the simplest options are:

1. **Formspree** or a similar form-backend service — point the form's
   `action` at their endpoint and let them handle delivery.
2. **EmailJS** — sends email straight from JavaScript using a service you
   configure.
3. Your own backend endpoint, if you build one later.

The validation logic in `js/script.js` (see `initContactForm`) will keep
working either way — you're just replacing the "simulate success" block
with a real request.

## Notes on the design

- **Fonts**: Fraunces (headings), Manrope (body text), and JetBrains Mono
  (small technical labels) are loaded from Google Fonts in each page's
  `<head>`. That means an internet connection is needed the first time a
  page loads, even though the site itself runs locally.
- **Theme toggle**: dark is the default; the light/dark choice is saved to
  the browser's `localStorage` so it persists across pages and visits. If
  local storage is unavailable for any reason, the toggle still works for
  the current visit — it just won't be remembered.
- **Reduced motion**: anyone with "reduce motion" turned on at the OS
  level will see the site without the scroll-reveal, particle, and blob
  animations.
- **Project thumbnails**: the SVGs in `images/projects/` are original
  placeholder graphics (icon + gradient), not real screenshots. Swap them
  for real project screenshots whenever you're ready — same file names, or
  update the `<img src>` paths in `projects.html` and `index.html`.

## Editing the design system

Nearly every color, font, spacing value, and radius used across the whole
site is defined once at the top of `css/style.css`, under
`:root { ... }`. Changing a value there updates it everywhere it's used —
that's the fastest way to re-theme the site without hunting through every
rule.

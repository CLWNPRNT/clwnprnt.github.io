# CLWNPRNT — Creative Portfolio

Responsive website based on the supplied black-and-orange portfolio design. Plain HTML, CSS, and JavaScript. Walang installation, npm, framework, o build step na kailangan.

## I-upload sa GitHub Pages

1. I-extract ang website ZIP. I-upload ang **contents** nito sa root ng GitHub repository mo: `index.html`, `styles.css`, `script.js`, `site-config.js`, `.nojekyll`, at ang buong `assets` folder. Huwag ang ZIP file mismo.
2. Sa repository, pumunta sa **Settings → Pages → Build and deployment**. Piliin ang **Deploy from a branch**, branch **main**, folder **/(root)**, tapos **Save**.
3. Kapag tapos na ang deployment, pindutin ang **Visit site** sa Pages settings.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

All paths are relative, so the website also works at a project URL like `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`. No custom domain is required.

## Buksan locally

Double-click `index.html` after extracting the entire folder. Keep `assets` beside it. All fonts and images are included locally, and there are no external scripts or CDNs.

The separate `CLWNPRNT-standalone.html` download embeds the images, fonts, styling, and JavaScript in one file. You can open that file directly without any folders. For GitHub Pages, rename it to `index.html`; for easier editing and faster initial loading, use this multi-file package instead.

## I-edit ang website

| Gusto mong palitan | File |
| --- | --- |
| Brand, headline, paragraphs, section copy, gallery labels | `index.html` |
| Colors, font sizes, spacing, mobile layout | `styles.css` |
| Contact email and optional social links | `site-config.js` |
| Project viewer titles, descriptions, categories | `script.js`, inside `projects` |
| Images | `assets/images/` |
| Favicon | `assets/favicon.svg` |

The orange accent is `--orange: #ff8000` in `styles.css`.

## Contact email

No email address was supplied, so the form currently downloads a real `.txt` project brief. It does not submit information to a server or pretend to send an email.

To enable email drafts, put your real address into `site-config.js`:

```js
window.CLWNPRNT_CONFIG = {
  email: "YOUR_REAL_EMAIL_ADDRESS",
  socialLinks: [
    // { label: "Behance", url: "https://www.behance.net/YOUR_USERNAME" }
  ]
};
```

With a valid address, the button changes to **Create email draft** and opens the visitor's email app with their inquiry filled in. The visitor still sends the email. The address becomes visible on your public site. Use a business/contact address you want visitors to see.

The email draft option requires the visitor to have an email app configured. A server-side form or form service is not included.

## What's working

- Anchor navigation and full-screen menu with Escape and keyboard support.
- Responsive desktop, tablet, and phone layouts.
- Swipeable discipline strip on smaller screens, with previous/next buttons.
- Six gallery filters and an All work reset.
- Full-size project dialog with previous/next, arrow keys, and Escape.
- Service disclosures.
- Project-to-contact service selection.
- Required-field validation and downloadable project brief.
- Optional email drafts and optional HTTPS social links.
- Reduced-motion preference, visible keyboard focus, alt text, and skip link.

## Images and fonts

- Seven generated images: one studio hero and six individual discipline artworks. These are newly generated interpretations of the supplied design, not extracted production assets.
- Hero original: **1672 × 941 PNG**. Six artwork originals: **1536 × 1024 PNG** each. Full-size optimized WebP versions are in this website package; original PNGs are in the separate high-resolution-assets ZIP.
- Smaller 480px/960px artwork variants and a 1280px hero keep responsive image downloads smaller. No upscaling is used.
- Saira, Barlow, and Caveat are bundled as WOFF fonts. Their SIL Open Font License notices are included in `assets/fonts/`.
- Gallery items are labeled as concept studies. Motion/video entries are still images, not playable media or claimed client work. Replace them and their descriptions with your actual projects when ready.

For social previews after publishing, set `og:image` in `index.html` to the final absolute HTTPS URL of `assets/images/studio-hero.webp`. This site does not guess your GitHub username or repository name.

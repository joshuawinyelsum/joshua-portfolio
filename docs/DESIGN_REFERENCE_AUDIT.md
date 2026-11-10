# Design Reference Audit

Every image in `UIUX design reference/` was opened and measured before any
implementation. Measurements are in pixels of the reference image (all are
1280 px wide unless noted) and are converted to proportions so they can be
applied at real UI sizes.

Brand colours are fixed by the brief and override the slightly different
tints that appear in the JPEGs:

| Role | Value |
| --- | --- |
| Warm Cream | `#F9E5A2` |
| Vibrant Lavender | `#9B7BF7` |
| Deep Onyx | `#050507` |
| Main canvas | `#FAF9F5` |
| Supporting surface | `#FFFFFF` |

---

## 1. `bottom 1.jpeg` — signature button (selected as canonical)

| Aspect | Observation |
| --- | --- |
| Component | Primary call-to-action button |
| Shape | Rectangle with rounded corners. Face 994 x 228 (4.36 : 1). Corner radius about 58 = **25 % of height**. Not a pill (a pill would be 50 %). |
| Colours | Onyx face, white label and arrow, lavender and cream backing layers, canvas background |
| Layers | Two separate shapes behind the face. **Lavender** is anchored to the top-left: it rises 35 px above the face at the left edge (**15 % of height**) and its top edge slopes down to meet the face at roughly the horizontal centre. **Cream** mirrors it on the top-right, rising about 32 px and overhanging the right edge by about 3 px. Nothing shows below or beside the face. Both keep the same rounded outer corner as the face. Slope of each top edge is about 4 degrees. |
| Typography | Geometric grotesk, weight 500, sentence case, size about 22 % of button height, left aligned |
| Spacing | Label inset about 0.43 x height from the left; arrow inset about 0.42 x height from the right |
| Shadow | Soft, tight drop shadow directly under the face |
| Icon | Thin long arrow (stroke about 1.75) pointing right. No other decoration. |
| Reusable component | `Button` (`src/components/ui/Button.tsx`) |

Implementation notes: the backing shapes are separate elements. Their rise is
a fixed token per button size (15 % of height) so the layer thickness is
identical on a 130 px button and a 340 px button; a plain CSS rotation would
make the rise grow with width.

## 2. `bottom idea 2.jpeg` — alternative button study (not selected)

| Aspect | Observation |
| --- | --- |
| Component | Same button, taller fanned stack |
| Shape | Face 750 x 268, radius about 70 (26 % of height) |
| Layers | Cream then lavender, both the full width of the face, fanned upward by 100 px and 170 px |
| Decision | `bottom 1` is the stronger version: its layer construction is the one repeated on the cards and contact panels in the other references, and it stays compact inside layouts. This file confirms the radius ratio, label weight and arrow. |

## 3. `WhatsApp Image … 1.35.38 PM (1).jpeg` — colour and stacking origin

| Aspect | Observation |
| --- | --- |
| Component | Icon study: cream, lavender and black sheets stacked with sloped edges |
| Use | Source of the three-colour layered language and the sloped layer edges. It is an icon, not a UI component. The logo is not being redesigned and the checkmark is not reused anywhere. |

## 4. `WhatsApp Image … 5.34.59 PM (1).jpeg` — layered text boxes

Nine cards. Constructions observed:

| Card | Face | Backing | Notes |
| --- | --- | --- | --- |
| About me | Onyx, radius about 24 on a 350 px card | Lavender top-left rise 14, cream top-right rise 10 | Eyebrow: cream dot + lavender uppercase label. White headline, grey body, lavender text link with arrow |
| Research & Strategy | Off-white | Same lavender + cream top layers | Lavender index "01.", bold title, grey body, lavender "Read more" link, arrow at far right |
| Let's work together | Onyx | Same top layers | Icon tile, title, body, cream action link |
| Open for opportunities | Onyx | Same top layers | Green status dot, title, body |
| Testimonial / Download resume | Lavender | Cream sheet offset down-right about 10 | |
| Quick-response style | Onyx | Lavender sheet offset down-right | (also in the contact reference) |
| Product design / Fast & reliable | Cream / white | Lavender strip under the bottom edge | |

Shared rules: no outlines or strokes on any card; depth comes from the
backing sheets and a soft low shadow; radius is constant; padding about 38 px;
title weight 600-700; body grey; action is a text link with a thin arrow.

Decision: the top-layer construction ("crown") appears on four of nine cards
and on the button, so it is the canonical layered information box. The
bottom-strip variant is not implemented. Following the refinement brief, the
crown is used selectively (see "Where each pattern is used" below) rather
than on every card.

Reusable component: `LayeredSurface` (`src/components/ui/LayeredSurface.tsx`).

## 5. `WhatsApp Image … 5.34.59 PM (2).jpeg` — featured project

| Aspect | Observation |
| --- | --- |
| Component | Single featured project panel |
| Shape | Off-white panel 1145 x 590, radius about 28, soft shadow, no outline |
| Left column | Eyebrow (lavender dot + uppercase label), project name about 40 px bold, two-line grey description, tech-stack row, onyx button "Live Preview" with diagonal arrow (118 x 42, small radius) and a lavender text link "Case Study" with arrow |
| Screenshot | Browser window: onyx title bar with red / yellow / green dots, rounded top corners, screenshot shown uncropped in its own ratio, large soft shadow |
| Backing shapes | Lavender rounded sheet offset up-left of the window, cream rounded sheet offset down-right; both about the size of the window, edges slightly sloped |
| Reusable components | `FeaturedProject`, `ProjectPreview` (the two sheets), `DeviceFrame`, `LivePreview` |

## 6. `WhatsApp Image … 5.35.00 PM.jpeg` — project grid

| Aspect | Observation |
| --- | --- |
| Header | Eyebrow "SELECTED WORK" with dot; two-line bold headline with the last word in lavender; onyx button at the right |
| Card | Three-column grid, off-white card, radius about 14, soft shadow, no outline |
| Screenshot | Browser window with onyx title bar and three dots, inset about 12 px from the card edges, image cropped from the top |
| Backing shape | One coloured sheet behind the window, visible as a wedge above the top-left of the window and a strip down its left side; alternates lavender / cream from card to card |
| Text | Bold project name followed by a small coloured dot, two-line grey description |
| Tags | Three small labels, the first tinted with the card's colour, the others neutral |
| Action | Lavender text link with arrow at the bottom-right |
| Reusable component | `ProjectCard` |

## 7. `WhatsApp Image … 6.04.48 PM.jpeg` — contact

| Aspect | Observation |
| --- | --- |
| Layout | Three columns: intro, Contact Details panel, Send a Message panel |
| Intro | Eyebrow "GET IN TOUCH"; three-line bold headline with one lavender word and a cream full stop; grey paragraph |
| Quick Response | Onyx card, lavender sheet offset down-right, lavender icon tile, white title, grey text |
| Panels | Onyx header tab carrying the panel title, with a sloped top edge; one accent layer behind its top-right (cream on Contact Details, lavender on Send a Message); white body card overlapping the tab; no outline |
| Contact rows | 52 px icon tile (radius about 8; lavender, cream, lavender), bold label, grey value |
| Social links | Two-column grid. Each is a white rounded rectangle (radius about 8) with a 1 px dark outline, an outlined platform glyph in lavender or cream, the platform name, and a small coloured triangle in the bottom-right corner. Colours alternate. |
| Form | Label above each field; fields are rounded rectangles (radius about 8) with a 1 px light edge and a slightly sunken fill; textarea with resize handle |
| Submit | Onyx rectangle, centred label, diagonal arrow; lock icon and reassurance line under it |
| Reusable components | `ContactForm`, `SocialLinks`, `SocialIcon`, `TextField`, `TextAreaField` |

Deviations: the reference submit button has a cream sheet under it rather
than the signature top layers. The brief requires one canonical button
everywhere, so the form uses the same `Button` as the rest of the site. The
refinement brief then asked for an editorial contact layout with one plain
form and frameless social icons, so the tabbed panels, icon tiles, outlined
social buttons, Quick Response card and arrow doodle from this reference are
not used; its field labels, field shapes and glyph style are.

---

## Shared visual rules extracted

| Topic | Rule |
| --- | --- |
| Colour distribution | Canvas dominates. Onyx carries primary actions, panel headers and one emphasis card per group. Lavender is the accent for links, eyebrows, indices and one backing layer. Cream is the second backing layer and a tile tint. No gradients. |
| Backgrounds | Flat canvas. No grids, patterns or glows. |
| Typography | One grotesk sans family. Headlines 700 with tight tracking; body regular grey; eyebrows uppercase 12 px with a dot; button labels 500. The site keeps Inter, which the original portfolio and its wordmark already use. |
| Radii | Tags about 6, controls and tiles about 10, buttons 25 % of height, cards about 22, featured panel about 28 |
| Shadows | Soft, low and wide; never a hard edge. No outline strokes on cards. |
| Spacing | Card padding 28-38 px; 20-24 px gaps in grids; generous section spacing |
| Hover | Text links move their arrow. Layered objects should feel like stacked sheets. |
| Navigation | No navigation appears in any reference, so the original navigation structure is kept and only its tokens change. |
| Footer / bottom navigation | No reference shows a replacement, so both keep their original appearance and behaviour. |

---

## Refinement pass: where each pattern is used

The refinement brief asked for the layered geometry to be an identity mark
used selectively, with a purpose-built pattern for each kind of content.

| Pattern | Used for | Not used for |
| --- | --- | --- |
| Signature button (crown layers) | Every primary and secondary action, on every page | Nothing else imitates it |
| Crown information box | One emphasis box per page at most: About facts, Featured Research, the case-study closing statement | Lists, timelines, forms, grids of items |
| Two offset sheets | The hero terminal, the featured project device, the case-study cover | Gallery cards |
| Device frame (MacBook style) | Any project with a live deployment or a genuine screenshot | Projects with nothing real to show; they become compact text cards |
| Live embedded preview | Deployments that permit framing. Sandboxed, no referrer, loads on approach, ignores input until clicked | Anything that is only a screenshot (those are labelled "Screenshot") |
| Timeline | My Story: one line, small markers, lavender on the first and current milestones, cream label on "Today". Horizontal from 1024 px, vertical below | |
| Structured rows | Currently Building, Experience, Research areas, Credentials, Technical Progression, case-study architecture | |
| Plain surface | The contact form, project cards, the CV sheet | |
| Frameless icon | Social profiles: one outlined glyph per platform on a shared 24 px grid | |

### Live preview status (checked 2026-11-10)

| Project | Shown as | Why |
| --- | --- | --- |
| Coach Prosper's World | Live embed of coachprospersworld.org | Response has no `X-Frame-Options` and no CSP `frame-ancestors`; confirmed loading inside the frame |
| Community Field Survey System | Genuine screenshot | Not publicly deployed. Captures come from the project's own recorded walkthrough |
| MasteryOS | Text card | No public deployment and no capture available yet |
| AgriChem Data Research | Text card | A data pipeline with no interface; its register data is not published |

### Design-system guidance consulted

Apple's Human Interface Guidelines and Material Design 3 pages are rendered by
script and returned no readable text when fetched, so their widely published
principles were applied from prior knowledge rather than from a fresh reading.
Microsoft Fluent 2's motion guidance was read directly and is reflected in the
motion tokens: motion is functional and brief, larger travel gets more time,
ease-out for entrances, nothing loops, and reduced-motion is honoured.

---

## Third pass: credentials, story flow, minimal project screens

| Area | What changed | Rule going forward |
| --- | --- | --- |
| Project screens | The two coloured sheets, the white panel around the featured project and the card surfaces are gone. A project is a MacBook-style screen (thin bezel, neutral browser chrome, slim base, light shadow) with its name, up to three short lines, a one-line technology summary and one action. | No backing shapes, deep shadows or decorative cards under or around project screens. The address field shows a real host or the product name, never an invented URL. |
| Gallery | Three per row once every project has an authentic capture. Until then, projects without one are listed as text beside the captured ones. | Missing captures: MasteryOS (needs a screenshot of the running app) and AgriChem (a pipeline with no interface). |
| My Story | A vertical rail that fills in lavender as the reader scrolls. Markers and dates respond as progress reaches them; text settles in once, in sequence. The first and current milestones are set larger; "Today" carries the cream label. The headline stays in view beside the rail on wide screens. | Content never hides again after it appears. With reduced motion the rail is shown complete. |
| Credentials | A dedicated "Certifications & Credentials" section of editorial rows: issuer, title, credential type, date, programme, and one headline fact (result or distinction). | A verification link and a certificate image appear only when `verifyUrl` / `image` are set in `src/data/education.ts`. None are set yet because no genuine link or image was available. |

---

## Fourth pass: flat browser window, certificates, UNICEF StartUp Lab

| Area | Rule |
| --- | --- |
| Project frame | One component, `BrowserWindow`: a flat macOS-style window with the three traffic-light controls (red `#FF5F57`, yellow `#FEBC2E`, green `#28C840`) at the upper-left, a minimal title bar, a subtle radius and a hairline edge. No laptop hardware, perspective, heavy shadow or shapes behind it. This replaces the MacBook-style screen. |
| Screenshot proportions | The window takes each screenshot's own aspect ratio (16:10, 16:9, ...), so nothing is stretched. |
| Motion | The screenshot eases in once after its window; the window lifts 3 px on hover. The controls never animate. |
| MABIA AI | Shown in Selected Work with a genuine screenshot of its deployed sign-in screen and a link to the live application. It has no case-study page because no verified technical detail was available; its description is the application's own. |
| Certificates | Each credential accepts `image` (the supplied certificate image) and `pdfUrl` (the supplied PDF). With an image the row shows it, opens it full-size, and offers "Download Certificate". Nothing is shown in their place until the real files are supplied. |

---

## Fifth pass: evidence-based experience and the credential gallery

| Area | Rule |
| --- | --- |
| `MacBrowserFrame` | The project frame, renamed and extended: the address sits in a shallow notch that is part of the bar. Where a project is publicly deployed the address is a link to it with a small external-link mark; otherwise it shows the product name and is not a link. |
| `ProjectEvidenceSection` | For team projects. It states the organisation and programme, the role exactly as documented, the product, what the team built (labelled as team work), the team, the verified stack and the real interface, and names its source. Data lives in `src/data/projectEvidence.ts`. |
| MABIA AI | Role, team, stack and capabilities come from the project README. The only image is a genuine capture of the public sign-in screen; no authenticated screen is shown and no demo credentials appear anywhere. |
| `CredentialGallery`, `CertificateCard`, `CertificateLightbox` | Certificates are shown as issued: the first page of each original PDF rendered at 2400 px, never cropped. Details are those printed on the certificate. The lightbox is a native dialog (focus trap, Escape, focus return), with arrow keys between certificates and a full-resolution mode that scrolls. |
| Certificate files | Originals stay in `Workspace/Personal/Certifications`. Copies are served from `public/certificates/`, previews from `public/images/credentials/`. |

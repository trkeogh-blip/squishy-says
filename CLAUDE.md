# CLAUDE.md — Squishy Says website

## Mission
A credible brand site at **www.squishysays.com** that retailers, distributors and
suppliers can check to confirm Squishy Says is a real, active brand. Not a store
yet: no prices, no cart, no checkout until the owners decide to sell.

Success right now = the site is live on the custom domain over HTTPS, loads fast on
a phone, presents the product and the founders' story, and gives vendors one clear
way to get in touch.

## How this project is run
- **Owners:** a mother-daughter founding team. Tim is the executive reviewer.
- Tim reviews **what the site looks like** (screenshots, the live URL), not diffs.
- Every change ships with something human-checkable: a screenshot at phone and
  desktop width, or the live preview link.
- `PLAN.md` holds the phased plan and launch checklist. Update its checkboxes as
  work completes.

## Stack (Phase 1 — free)
- Plain static site: `index.html`, `assets/css/site.css`, `assets/js/site.js`,
  images in `assets/img/`. No build step, no framework, no dependencies.
- Hosted on **GitHub Pages** from the `main` branch root (repo must be public on
  a free GitHub account).
- `CNAME` file holds `www.squishysays.com`. Domain is registered at **Network
  Solutions**; DNS records are in `PLAN.md`.

## Rules for any agent working here
1. **Selling is switched off until the owners say go.** Pages: `index.html`
   (home), `shop.html` (direct purchase), `wholesale.html` (trade inquiries).
   The Shop page's Buy button reads "Coming soon" until `SHOP.paymentLink` and
   `SHOP.price` are set at the top of `assets/js/site.js`. Never fill those in,
   or invent a price, without the owners' explicit go-ahead.
2. **Brand voice:** playful, bright, kid-safe. Bubble-letter logo; palette pink,
   aqua, yellow, purple on a soft blush ground; Fredoka (display) + Nunito (body).
3. **The answer key lives in one place:** the `ANSWERS` array in
   `assets/js/site.js`. It must match the back of the box. Open issue: the fortune
   board graphic pairs colors differently — the owners must confirm one mapping.
4. **No invented facts.** No made-up stats, reviews, retailer logos, prices or
   launch dates. Missing facts stay out until the owners supply them.
5. **Safety and claims:** don't claim testing, certifications or safety compliance
   until the owners have the supplier's test reports in hand.
6. **Accessibility:** real buttons and links, alt text on every image, text
   contrast at least 4.5:1, works at 360px wide, respects reduced motion.
7. **Images:** current product images are rendered mockups. Replace with real
   product photography when prototypes arrive; keep files web-sized (≤ ~400 KB).
8. Keep it dependency-free. If something truly needs a tool, propose it first.

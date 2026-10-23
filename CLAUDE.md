# CLAUDE.md — Squishy Says website

## Mission
A credible brand site at **www.squishysays.com** that retailers, distributors and
suppliers can check to confirm Squishy Says is a real, active brand — and, once the
owners say go, a simple direct-to-consumer store on that same site.

- **Phase 1 (brand site):** live on the custom domain over HTTPS, fast on a phone,
  presents the product and the founders' story, one clear way to get in touch.
- **Phase 2 (store):** customers can buy on squishysays.com, pay securely through
  Stripe, and receive the order by mail. See `PLAN.md` for the gated build.

## How this project is run
- **Owners:** a mother-daughter founding team. The business is a sole
  proprietorship doing business as "Squishy Says" (EIN on file with the owner —
  never in this repo). Tim is the executive reviewer.
- Tim reviews **what the site looks like and what a customer experiences**
  (screenshots, the live URL, a test checkout), not diffs.
- Every change ships with something human-checkable: a screenshot at phone and
  desktop width, the live preview link, or a Stripe test-mode receipt.
- `PLAN.md` holds the phased plan, gates and checklists. Update its checkboxes as
  work completes. Do not start a gate until the gate before it is closed, unless
  the task is marked "can start early".

## Stack
- Plain static site: `index.html`, `shop.html`, `wholesale.html`,
  `assets/css/site.css`, `assets/js/site.js`, images in `assets/img/`. No build
  step, no framework, no dependencies.
- Hosted free on **GitHub Pages** from the `main` branch root. The repo is
  **public**.
- `CNAME` holds `www.squishysays.com`. Domain registered at **Network Solutions**;
  DNS records are in `PLAN.md`. The domain stays there.
- **Payments: Stripe, on our own site. Not Shopify.** The owners decided against a
  hosted store platform. Checkout is Stripe-hosted (Payment Links / Checkout), so
  card data never touches this site and no server is needed at launch.
- **Shipping:** self-fulfilled from home at launch; labels bought through a label
  service (Pirate Ship or Shippo). Shipping address and shipping charge are
  collected in Stripe Checkout.
- **Wholesale billing:** Stripe Invoicing, sent from the Stripe Dashboard. Not
  wired into the site.

## Rules for any agent working here
1. **Selling is switched off until the owners say go.** The Shop page's Buy button
   reads "Coming soon" until the `SHOP` settings at the top of
   `assets/js/site.js` are filled in. Never fill those in, never invent a price,
   and never publish a live (non-test) Payment Link without the owners' explicit
   go-ahead recorded in `PLAN.md` (Gate 5).
2. **Secrets never enter this repo.** It is public. Never commit a Stripe secret
   key (`sk_live_…`, `sk_test_…`), restricted key (`rk_…`), webhook signing
   secret (`whsec_…`), label-service API key, bank details, EIN, SSN or home
   address. Safe to commit: Payment Link URLs (`https://buy.stripe.com/…`) and
   publishable keys (`pk_…`). If a secret is ever committed, stop and tell Tim —
   the key must be rolled in Stripe, not just deleted from git.
3. **No server code without approval.** Phase 2 launches with zero backend. If a
   task truly needs one (e.g. a Stripe webhook), propose it first — the default
   proposal is a single free-tier serverless function kept in `/worker`, with
   secrets in that platform's secret store.
4. **Test mode first, always.** Every checkout change is proven with a Stripe
   test-mode Payment Link and a test card before a live link touches the site.
   Never put a test link (`buy.stripe.com/test_…`) on `main`.
5. **Brand voice:** playful, bright, kid-safe. Bubble-letter logo; palette pink,
   aqua, yellow, purple on a soft blush ground; Fredoka (display) + Nunito (body).
   Policy pages may be plainer, but stay friendly and readable.
6. **The answer key lives in one place:** the `ANSWERS` array in
   `assets/js/site.js`. It must match the back of the box. Open issue: the fortune
   board graphic and the product brief pair colors/wording differently — the
   owners must confirm one mapping before it appears in a product listing.
7. **No invented facts.** No made-up stats, reviews, retailer logos, prices,
   shipping times, launch dates or policy terms. Policy pages are built from terms
   the owners supply; anything missing is marked `[OWNER TO CONFIRM]` and the page
   is not linked publicly until those markers are gone.
8. **Safety and claims:** don't claim testing, certifications or safety compliance
   until the owners have the supplier's test reports and Children's Product
   Certificate in hand. Selling is blocked until they are (Gate 0).
9. **Accessibility:** real buttons and links, alt text on every image, text
   contrast at least 4.5:1, works at 360px wide, respects reduced motion.
10. **Images:** current product images are rendered mockups. Replace with real
    product photography when prototypes arrive; keep files web-sized (≤ ~400 KB).
11. Keep it dependency-free. If something truly needs a tool, propose it first.

# PLAN.md — Squishy Says website

## Phases

| Phase | Goal | Cost | Status |
|---|---|---|---|
| **1 — Brand site** | Vendors can verify the brand is real and get in touch | Free (GitHub Pages) | In progress |
| **2 — Store** | Sell on squishysays.com with Stripe checkout; ship from home | No monthly fee; Stripe 2.9% + 30¢ per card sale; postage | Planned — gated below |

---

## Phase 1 — Launch checklist

### Repo & hosting
- [x] Static site built: homepage, fortune demo, answer key, story, wholesale, contact
- [x] Split into three pages: Home, Shop (Buy button "Coming soon"), Wholesale (inquiry form → pre-filled email)
- [x] Create empty **public** GitHub repo `trkeogh-blip/squishy-says` (no README)
- [x] Push this code to `main`
- [x] Settings → Pages → Source: *Deploy from a branch*, `main` / root
- [x] Confirm the preview at `https://trkeogh-blip.github.io/squishy-says/`

### Domain (Network Solutions → Advanced DNS)
- [x] A record `@` → `185.199.108.153`
- [x] A record `@` → `185.199.109.153`
- [x] A record `@` → `185.199.110.153`
- [x] A record `@` → `185.199.111.153`
- [x] CNAME `www` → `trkeogh-blip.github.io`
- [x] Remove any other A/AAAA records on `@` and any old `www` record (parking page)
- [x] Leave MX (email) records alone
- [ ] GitHub Settings → Pages → Custom domain `www.squishysays.com`; tick **Enforce HTTPS** once the certificate issues
- [ ] Optional: verify the domain in GitHub account settings (blocks takeover)
- [ ] Domain auto-renew ON and transfer lock ON at Network Solutions

### Email
- [ ] Set up `info@squishysays.com` (Google Workspace, or a free forwarder to a personal inbox). The site's contact buttons already point to it — **until it works, vendor emails bounce.**

- [ ] **Activate the wholesale form:** submit one test inquiry on the live site, then click "Activate Form" in the FormSubmit email that arrives at info@. Until then, inquiries are held, not delivered.

### Content the owners must confirm
- [ ] Color → answer key: box back vs. fortune board disagree. Site uses the box back.
- [ ] Founders' story wording (first names? photo?) — founder photo now in the home page story section (`founder-olive-square.jpg`); banner version unused so far
- [ ] Any launch timing to state publicly (site says "Coming soon to stores")
- [ ] Replace rendered mockups with real product photos when prototypes arrive

### Before saying anything about safety
- [ ] Supplier test reports (ASTM F963 / CPSIA) and Children's Product Certificate on file
- [ ] Final warning-label wording

---


## Phase 2 — Store (Stripe on our own site, ship from home)

**Decision (2026-10-23):** no Shopify. Payments run through Stripe on
squishysays.com; the site stays static on GitHub Pages; checkout is Stripe-hosted.
Revisit only if order volume outgrows home fulfillment.

### How it fits together
```
squishysays.com/shop.html  ──Buy──▶  Stripe Payment Link (Stripe-hosted page)
   (GitHub Pages, static)              • card / Apple Pay / Google Pay
                                       • collects shipping address
                                       • adds shipping charge (+ MA sales tax)
                                       • emails the customer a receipt
                                              │
                         redirects back ◀─────┤
              squishysays.com/thanks.html      ▼
                                       Stripe Dashboard: new order
                                              │  (Phase 2b: webhook automates this)
                                              ▼
                                Label service (Pirate Ship / Shippo)
                                → buy USPS label → pack → drop off
                                → tracking emailed to customer
```

**Who does what:** `[Owner]` = the business owner (account holder, legal and money
decisions) · `[Tim]` = executive review and sign-off · `[Agent]` = Claude Code in
this repo. **✔ Proof** = the artifact that closes the task.

---

### Gate 0 — Go / no-go prerequisites (blocks taking any money)
- [ ] `[Owner]` Supplier test reports (ASTM F963 / CPSIA, incl. small-parts review of the inner balls), Children's Product Certificate, and tracking label on the product/packaging. ✔ PDFs on file (not in this repo).
- [ ] `[Owner]` Confirm the color → answer key (box back vs. fortune board vs. brief wording). ✔ Note in this file; `ANSWERS` updated if it changes.
- [ ] `[Owner]` Landed unit cost known (product + freight + duty + packaging) and retail price(s) set — single and any multi-pack. ✔ Prices written here.
- [ ] `[Owner]` Register with MassTaxConnect to collect MA sales tax (6.25%). ✔ Registration confirmation.
- [ ] `[Owner]` Business checking account in the DBA name (keep it separate from every other entity). ✔ Account open.
- [ ] `[Owner]` `info@squishysays.com` working (Phase 1 email item) — Stripe receipts and customer replies depend on it. ✔ Test email received.
- [ ] `[Owner]` Real product photos from prototypes. ✔ Images in `assets/img/`.
- [ ] `[Tim]` Go / no-go sign-off for Gate 0. ✔ Date + initials here.

### Gate 1 — Stripe account `[Owner]` (can start early)
Sign up at stripe.com as the business owner. Have ready:
- [ ] Business type: **Individual / sole proprietorship**; legal name = owner's name; public/DBA name "Squishy Says"
- [ ] EIN, business address, phone, industry (toys & games), product description
- [ ] Owner identity: name, date of birth, SSN, photo ID if asked
- [ ] Payout bank account (the DBA business account from Gate 0)
- [ ] Website: `https://www.squishysays.com` (Stripe reviews it — Gate 2 must be live before activation completes)
- [ ] Statement descriptor: `SQUISHYSAYS` (what shows on card statements)
- [ ] Customer support email `info@squishysays.com`; turn on emailed receipts
- [ ] Turn on 2-step login; add Tim as a team member (Analyst or Developer role — not Administrator)
- [ ] ✔ Proof: Dashboard shows the account activated with payouts enabled.

### Gate 2 — Site ready for Stripe review `[Agent]` (can start early, drafts only)
Stripe requires the site to show what's sold, the price, how to reach the business,
and its refund/shipping policies. Build these from owner-supplied terms; anything
unknown is marked `[OWNER TO CONFIRM]` and the page stays unlinked until cleared.
- [ ] `shipping.html` — where we ship (US only at launch?), processing time, carrier, rates, lost/damaged parcels. ✔ Screenshot phone + desktop.
- [ ] `returns.html` — return window, condition, who pays return postage, refund timing, how to start a return. ✔ Screenshot.
- [ ] `privacy.html` — what we collect (name, email, shipping address), that Stripe processes payment, no selling of data, contact. ✔ Screenshot.
- [ ] `terms.html` — terms of sale (pricing errors, sales tax, age 6+ / adult purchaser, governing law MA). ✔ Screenshot.
- [ ] `thanks.html` — order-confirmed page Stripe redirects to (what happens next, ship time, contact). `noindex`. ✔ Screenshot.
- [ ] Footer on every page: Shipping · Returns · Privacy · Terms · Contact. ✔ Screenshot.
- [ ] Extend `SHOP` in `assets/js/site.js` to hold multiple offers (e.g. Single, 3-Pack), each with `label`, `price`, `paymentLink`; Shop page renders a button per offer; any empty link stays "Coming soon". Remove the old Shopify wording from the comment. ✔ Screenshot with dummy values on a local preview only — never committed filled in.
- [ ] Shop page: real product description, what's in the box, age 6+ and choking-hazard warning text as approved by the owner. ✔ Screenshot.
- [ ] `[Tim]` Review all pages; owner clears every `[OWNER TO CONFIRM]`. ✔ Sign-off here.

### Gate 3 — Products, shipping rates and test checkout (Stripe test mode)
- [ ] `[Owner/Agent]` In **test mode**, create the product(s) and prices matching Gate 0.
- [ ] `[Owner/Agent]` Create shipping rates (see Shipping plan below) and attach them per Payment Link.
- [ ] `[Owner/Agent]` Create one test Payment Link per offer: collect shipping address (US only), phone optional, allow quantity adjustment, enable promo codes (optional), after-payment redirect → `https://www.squishysays.com/thanks.html`.
- [ ] `[Owner]` Sales tax: either (a) Stripe Tax on, registered in MA only (≈0.5% per transaction), or (b) a manual MA tax rate. Decide and record here. ✔ Test receipt shows tax on an MA address, none on an out-of-state address.
- [ ] `[Agent]` Run test purchases with Stripe's test card (4242…) for each offer, one MA and one non-MA address. ✔ Test receipts + screenshots of each step on a phone.
- [ ] `[Tim]` Walk through a test checkout on his own phone. ✔ Sign-off here.

### Gate 4 — Shipping operations `[Owner]`
- [ ] Order packaging: padded mailers or small boxes sized for the 6 cm cube (plus a few for multi-packs), tape, packing slips/thank-you cards. ✔ Supplies on hand.
- [ ] Weigh a fully packed single and 3-pack on a postal scale; record weights and dimensions here. ✔ Numbers written here.
- [ ] Open a free label account (Pirate Ship recommended to start; Shippo if we want an API later). Use a return address the owners are comfortable printing on every label (consider a PO box). ✔ Account live.
- [ ] Price a USPS Ground Advantage label for each packed weight to 3 far-away ZIPs; set the Stripe shipping rates so they cover postage + packaging. ✔ Rate table below filled in.
- [ ] Dry run: turn a Gate 3 test order into a real label workflow (CSV export from Stripe → label service import) without buying postage. ✔ Screenshot of imported order.
- [ ] Decide insurance threshold and how lost/damaged parcels are handled; matches `shipping.html`. ✔ Noted here.

### Gate 5 — Go live
- [ ] `[Tim + Owner]` Written go-ahead to sell, recorded here with date. **No live link goes on the site before this box is ticked.**
- [ ] `[Owner/Agent]` Recreate products, rates and Payment Links in **live** mode (test objects don't carry over).
- [ ] `[Agent]` Put live Payment Links and prices into `SHOP`; link the policy pages in the footer; push to `main`. ✔ Live site screenshot.
- [ ] `[Owner]` Make one real purchase with a personal card to a real address, ship it through the full workflow, then refund it. ✔ Order, label, tracking email, refund all confirmed.
- [ ] `[Owner]` Daily routine set: check Stripe for new orders → buy labels → pack → drop off → mark shipped.

### Phase 2b — After launch (optional, only when volume justifies it)
- [ ] Stripe webhook → new-order email/text to the owners. Needs a tiny serverless function (`/worker`, free tier) — propose before building (CLAUDE.md rule 3).
- [ ] Same webhook pushes orders into Shippo (API) so labels are one click; tracking flows back to the customer.
- [ ] Simple inventory count (Payment Link deactivates or shows "Sold out" at zero).
- [ ] Wholesale orders invoiced through Stripe Invoicing (net terms optional); freight via UPS/FedEx through the label service.
- [ ] Revisit a 3PL once packing at home takes more than about an hour a day.

---

## Shipping plan (fill in during Gate 4)

| Item | Decision |
|---|---|
| Ship-to area at launch | US only — `[OWNER TO CONFIRM]` |
| Carrier / service | USPS Ground Advantage (under 1 lb) |
| Label tool | Pirate Ship to start; Shippo when automating |
| Processing time promise | `[OWNER TO CONFIRM]` (e.g. ships in 2 business days) |
| Packed weight — single | `[weigh]` |
| Packed weight — 3-pack | `[weigh]` |
| Customer shipping charge — single | `[set after pricing labels]` (flat rate) |
| Customer shipping charge — 3-pack | `[set after pricing labels]` (consider free, to push multi-packs) |
| Return address on labels | `[OWNER TO CONFIRM]` (home vs. PO box) |
| Lost / damaged policy | `[OWNER TO CONFIRM]` |

Stripe Payment Links can't do "free shipping over $X" automatically, so the
incentive is built into the offers instead: each offer (Single, 3-Pack) gets its
own Payment Link with its own shipping rate.

## Decisions log
- 2026-10-23 — Store runs on Stripe on our own site, not Shopify. Site stays on GitHub Pages; domain stays at Network Solutions. Ship from home via USPS with a label service.
- 2026-10-29 — Owner's website punch list (handwritten): answer key centered 3×2 (no 4+2 wrap); founders' story centered; contact line reworded; TikTok @squishysayssquish added; retail price **$14** (owner-set; shown on Shop page, Buy button still "Coming soon"); wholesale specs corrected — unit packaging is a gift box with a clear PVC window (not a clear cube), item number removed, "Age grade" → "Age", "It's giftable" copy fixed. Still open from that list: new Shop photos, Faire shop link, Stripe setup and test.

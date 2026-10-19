# PLAN.md — Squishy Says website

## Phases

| Phase | Goal | Cost | Status |
|---|---|---|---|
| **1 — Brand site** | Vendors can verify the brand is real and get in touch | Free (GitHub Pages) | In progress |
| **2 — Store** | Sell online (Shopify, theme in GitHub) | ~$39/mo + card fees | Not started — owners' decision |

---

## Phase 1 — Launch checklist

### Repo & hosting
- [x] Static site built: homepage, fortune demo, answer key, story, wholesale, contact
- [x] Split into three pages: Home, Shop (Buy button "Coming soon"), Wholesale (inquiry form → pre-filled email)
- [x] Create empty **public** GitHub repo `trkeogh-blip/squishy-says` (no README)
- [x] Push this code to `main`
- [ ] Settings → Pages → Source: *Deploy from a branch*, `main` / root
- [ ] Confirm the preview at `https://trkeogh-blip.github.io/squishy-says/`

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

### Content the owners must confirm
- [ ] Color → answer key: box back vs. fortune board disagree. Site uses the box back.
- [ ] Founders' story wording (first names? photo?)
- [ ] Any launch timing to state publicly (site says "Coming soon to stores")
- [ ] Replace rendered mockups with real product photos when prototypes arrive

### Before saying anything about safety
- [ ] Supplier test reports (ASTM F963 / CPSIA) and Children's Product Certificate on file
- [ ] Final warning-label wording

---

## Phase 2 — Start selling (when the owners say go)
Cheapest path, no monthly fee: **Stripe Payment Link**
- [ ] Create a Stripe account; add the product, price, shipping and sales tax settings
- [ ] Create a Payment Link (allow quantity adjustment; collect shipping address)
- [ ] Paste the link and price into `SHOP` at the top of `assets/js/site.js` → the Buy button goes live
- [ ] Add shipping/returns and privacy pages

Upgrade path if volume grows: Shopify plan; theme repo connected via Shopify's GitHub integration
- Point DNS from GitHub Pages to Shopify (A `@` → Shopify IP, CNAME `www` → `shops.myshopify.com.`)
- Product page, shipping/returns, privacy policy, wholesale form

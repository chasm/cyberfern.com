# Phase 1: Architecture and Content

Transform the single-page startup site into a multi-page, multi-audience site per the brief in `docs/index.md`.

## Batch 1.1: Test Infrastructure

Set up Playwright, axe-core, and pa11y. Write baseline tests for the existing site so we have a safety net before changing anything.

### Steps

1. Install Playwright, `@axe-core/playwright`, and `pa11y` as dev dependencies
2. Configure Playwright for Astro (playwright.config.ts)
3. Write baseline e2e tests for the existing home page:
   - Page loads with 200 status
   - H1 exists and contains expected text
   - All images load (no broken src)
   - All internal links resolve
   - All external links have `rel="external"`
   - axe-core accessibility scan passes (WCAG AAA where testable)
   - pa11y scan passes at WCAG2AAA level
4. Write baseline tests for privacy-policy and terms-of-use pages (load, headings, noindex meta)
5. Write unit test for `collapseWhitespace` utility (vitest or similar — 100% coverage on our JS/TS)
6. Add test scripts to package.json (`test:e2e`, `test:unit`, `test`)

### Definition of Done

- `pnpm test` runs all tests and passes
- Unit test coverage is 100% on `src/utilities/`
- E2e tests cover all 3 existing pages
- Accessibility scans run against WCAG 2.2 AAA
- `pnpm fmt && pnpm lint && pnpm build` all pass

---

## Batch 1.2: Layout and Navigation Scaffold

Expand the layout and navigation to support the new multi-page structure. No new page content yet — just the skeleton.

### Steps

1. Update the header nav in `src/layouts/index.astro` to include new links: Startups, Small Businesses, Workshops, Champions, About
2. Add active-page highlighting (aria-current="page") for all nav items
3. Design responsive nav behavior for the expanded menu (mobile: hamburger or collapsible — CSS-only, no JS framework)
4. Create placeholder pages (return 200 with a heading) at:
   - `/startups/`
   - `/small-businesses/`
   - `/workshops/`
   - `/champions/`
   - `/about/`
   - `/contact/`
5. Update sitemap config if needed (exclude placeholder pages until populated)
6. Add e2e tests for each new placeholder page (loads, heading present, nav renders)

### Definition of Done

- All 9 pages load without error (6 new + 3 existing)
- Nav renders on every page with correct active state
- Nav is usable at all breakpoints (desktop through 27rem mobile)
- All tests pass, lint/fmt/build pass

---

## Batch 1.3: Homepage Redesign

Transform the homepage from a startup-only landing page into a hub that introduces CyberFern and routes visitors to four audience-specific sections.

### Steps

1. Rewrite the hero section: general CyberFern value proposition (not startup-specific)
2. Create a "Who We Help" section with 4 cards linking to the 4 audience pages:
   - Startups
   - Small Businesses
   - Workshops & Training
   - Security Champions Programme
3. Keep existing testimonials section (move to below the 4 cards)
4. Keep "Why Choose Us" section
5. Remove the startup-specific CTA from the hero (each audience page gets its own CTA)
6. Update meta description and title
7. Update e2e tests for new homepage content

### Definition of Done

- Homepage serves as a hub with clear paths to all 4 audiences
- No startup-specific language in the hero
- All 4 audience cards link to their respective pages
- Testimonials and "Why Choose Us" still present
- All tests pass, lint/fmt/build pass

---

## Batch 1.4: Startups Page

Move the existing startup content into its own page.

### Steps

1. Create `/startups/index.astro` with the current hero text, "What We Do" cards, and startup-specific CTA (Calendly link)
2. Include Anna's startup background (from the brief)
3. Add the "what to expect from the free consultation" content
4. Set meta title/description
5. Add e2e tests (content, CTA link, images, accessibility)

### Definition of Done

- `/startups/` contains all startup-focused content previously on the homepage
- Calendly CTA present and working
- All tests pass, lint/fmt/build pass

---

## Batch 1.5: Small Businesses Page

New page targeting non-technical small business owners.

### Steps

1. Create `/small-businesses/index.astro`
2. Write plain-language content addressing common misconceptions (from the brief):
   - "We're too small"
   - "We outsource IT"
   - "We're not digital"
   - "We'll deal with it later"
3. Include the free 1-hour consultation offer with CTA
4. Keep language jargon-free — no "cyber risk frameworks"
5. Set meta title/description
6. Add e2e tests

### Definition of Done

- `/small-businesses/` loads with plain-language content
- No technical jargon
- CTA for free consultation present
- All tests pass, lint/fmt/build pass

---

## Batch 1.6: Workshops Page

All 6 training workshops on a single page.

### Steps

1. Create `/workshops/index.astro`
2. Add all 6 workshop descriptions from `docs/Cybersecurity Training Workshops.docx`:
   - Quantifying Cyber Risk
   - Presenting Cybersecurity to the Board
   - Building Your Security Roadmap
   - Optimizing Cybersecurity Investment
   - Bridging Business and Technology
   - Cyber Risk Management Fundamentals
3. Include target audience for each workshop
4. Add workshop logistics (duration, format, group size)
5. Add booking CTA (info@cyberfern.com — single contact email for the whole site)
6. Set meta title/description
7. Add e2e tests

### Definition of Done

- `/workshops/` displays all 6 workshops with descriptions
- Each workshop shows its target audience
- Logistics section present
- Booking CTA present
- All tests pass, lint/fmt/build pass

---

## Batch 1.7: Security Champions Programme Page

Dedicated page for the highest-touch offering.

### Steps

1. Create `/champions/index.astro`
2. Combine content from the 3 pitch docs:
   - Value proposition (accelerate delivery, reduce risk)
   - Programme structure (from `Programme example.docx`)
   - Case studies (Swiss Post / Log4Shell, NIST cost-of-defects)
3. Position as distinct from workshops — this is a programme, not a session
4. Add contact CTA
5. Set meta title/description
6. Add e2e tests

### Definition of Done

- `/champions/` clearly describes the programme, who it's for, and what's included
- Case studies present
- CTA present
- Distinct in tone from the workshops page
- All tests pass, lint/fmt/build pass

---

## Batch 1.8: About Anna Page

Dedicated page for Anna's background and credentials.

### Steps

1. Create `/about/index.astro`
2. Use the full facilitator bio from the workshops doc as a starting point:
   - Technical background (full-stack, DevSecOps)
   - Academic credentials (MBA, Sociology, ML/AI diploma)
   - The "bridging boardrooms and server rooms" positioning
3. Add LinkedIn link
4. Set meta title/description
5. Add e2e tests

### Definition of Done

- `/about/` presents Anna's full credentials and approach
- LinkedIn link present
- All tests pass, lint/fmt/build pass

---

## Batch 1.9: Contact Page

Simple contact page.

### Steps

1. Create `/contact/index.astro`
2. Decide on contact approach: email display, or a simple form (vanilla HTML `<form>` + Vercel serverless function)
3. Display primary contact email
4. If form: implement server-side handler, add client-side validation (vanilla JS — test at 100% coverage)
5. Set meta title/description
6. Add e2e tests

### Definition of Done

- `/contact/` provides a clear way to reach Anna
- If form exists, it validates and submits correctly
- All tests pass, lint/fmt/build pass

---

## Batch 1.10: Phase 1 Review

Final sweep before moving to Phase 2.

### Steps

1. Run full test suite
2. Run accessibility scans on all pages
3. Verify all internal links work across all pages
4. Verify all images load on all pages
5. Check responsive rendering at all 4 breakpoints
6. Remove any placeholder content that slipped through
7. Confirm sitemap includes all public pages and excludes legal pages

### Definition of Done

- All tests green
- All accessibility scans pass at WCAG 2.2 AAA (automated criteria)
- No broken links or images
- Sitemap correct
- `pnpm fmt && pnpm lint && pnpm build` all pass

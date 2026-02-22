# Phase 3: Technical Polish and SEO

Address SEO gaps, fix remaining HTML issues, optimize performance, and produce the manual accessibility checklist.

## Batch 3.1: OpenGraph and Social Meta Tags

### Steps

1. Add OG meta tags to the layout (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name`)
2. Add Twitter Card meta tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
3. Pass OG-specific props through the layout's `meta` interface (each page may need a unique image/description)
4. Create or designate a default social sharing image (1200x630px recommended)
5. Add e2e tests that verify OG and Twitter meta tags exist on every page
6. Test with a social sharing debugger (manual step — note in checklist)

### Definition of Done

- Every page has complete OG and Twitter Card meta tags
- Default sharing image exists and is referenced
- E2e tests verify meta tag presence
- `pnpm fmt && pnpm lint && pnpm build` all pass

---

## Batch 3.2: Structured Data (Schema.org JSON-LD)

### Steps

1. Add `Organization` schema to the layout (name, url, logo, contact)
2. Add `Service` schema to the startups, small businesses, and champions pages
3. Add `Course` schema to the workshops page (one per workshop)
4. Add `Person` schema to the about page (Anna's credentials)
5. Validate all JSON-LD with Google's Rich Results Test (manual step)
6. Add e2e tests that verify JSON-LD script tags exist and contain valid JSON

### Definition of Done

- JSON-LD present on all pages
- Schemas are valid (automated JSON parse test + manual Google validation)
- All tests pass, lint/fmt/build pass

---

## Batch 3.3: HTML Fixes

### Steps

1. Fix nested `<p>` tags in testimonials section (index.astro lines 229-253)
2. Audit all pages for HTML validation issues
3. Add `loading="lazy"` to all below-fold images
4. Add meaningful `alt` text to images that convey content (not decorative)
5. Verify all external links have appropriate `rel` attributes
6. Add e2e tests for lazy loading attributes and alt text presence

### Definition of Done

- No invalid HTML nesting
- All below-fold images are lazy loaded
- All content images have descriptive alt text
- All tests pass, lint/fmt/build pass

---

## Batch 3.4: Image Optimization

### Steps

1. Audit all images in `/public/images/` — identify which `-big` variants are actually used
2. Remove any unused image variants
3. Verify responsive image usage: are `<picture>` elements using the `-big` variants for large screens via `media` attributes? If not, either add responsive srcsets or remove the big variants.
4. Check image file sizes — compress any JPG fallbacks over 500KB
5. Verify all image references resolve (no broken src after cleanup)
6. Update e2e tests if image paths changed

### Definition of Done

- No unused images in `/public/images/`
- All images properly sized for their use case
- No image fallback over 500KB
- All image references valid
- All tests pass, lint/fmt/build pass

---

## Batch 3.5: Performance and Lighthouse CI

### Steps

1. Install and configure Lighthouse CI (or use `unlighthouse` for multi-page scanning)
2. Run Lighthouse on all pages — capture baseline scores
3. Address any performance, SEO, or best-practices issues flagged
4. Set up Lighthouse score thresholds (e.g., performance > 90, accessibility > 95, SEO > 95)
5. Add Lighthouse CI to the test pipeline (optional: as a separate npm script `test:lighthouse`)

### Definition of Done

- Lighthouse scores meet thresholds on all pages
- No critical performance or SEO issues
- Lighthouse can be run via npm script
- All tests pass, lint/fmt/build pass

---

## Batch 3.6: WCAG 2.2 AAA Contrast Audit

### Steps

1. Check all color combinations against WCAG AAA contrast ratios:
   - Normal text: 7:1 minimum
   - Large text (18pt+ or 14pt+ bold): 4.5:1 minimum
2. Test the following combinations:
   - `--color-light` (#f8f6e3) on `--color-dark` (#134e31)
   - `--color-dark` on `--color-light`
   - `--color-dark` on `--color-middle`
   - `--color-dark` on `--color-shaded`
   - `--color-highlight` (#ffe900) on `--color-dark` (used for CTA buttons)
   - `--color-link` on light backgrounds
   - `--color-link-visited` on light backgrounds
   - White/light text on `--color-dark` (header, footer)
3. Adjust any colors that fail AAA thresholds
4. Document final contrast ratios

### Definition of Done

- All text/background combinations meet WCAG 2.2 AAA contrast ratios
- Any color adjustments documented
- All tests pass, lint/fmt/build pass

---

## Batch 3.7: Manual Accessibility Checklist

### Steps

1. Review all WCAG 2.2 AAA success criteria
2. Identify every criterion that cannot be tested by axe-core or pa11y
3. Write `docs/manual-accessibility-checklist.md` with:
   - Each untestable criterion listed
   - What it requires
   - How to manually verify it
   - Current status for this site (pass / not applicable / needs review)
4. Examples of criteria that require manual review:
   - 1.2.6 Sign Language (Prerecorded) — if video content is added
   - 1.2.8 Media Alternative (Prerecorded)
   - 2.4.9 Link Purpose (Link Only)
   - 3.1.5 Reading Level
   - 3.1.6 Pronunciation
   - 3.2.5 Change on Request
   - 3.3.5 Help
   - 3.3.6 Error Prevention (All)

### Definition of Done

- `docs/manual-accessibility-checklist.md` exists and is comprehensive
- Every WCAG 2.2 AAA criterion that cannot be automated is listed
- Each entry has verification instructions and current status

---

## Batch 3.8: Final Cleanup and Phase 3 Review

### Steps

1. Remove unused CSS selectors (any left over from the old single-page layout)
2. Verify `archive/` folder is in `.gitignore` or has been dealt with
3. Run full test suite (unit, e2e, accessibility, Lighthouse)
4. Run `pnpm fmt && pnpm lint && pnpm build`
5. Final manual review of all pages
6. Verify sitemap is complete and correct
7. Verify robots.txt is correct (legal pages excluded, all content pages allowed)

### Definition of Done

- All tests green
- No unused code or assets
- Sitemap and robots.txt correct
- All automated accessibility scans pass
- Manual accessibility checklist complete
- `pnpm fmt && pnpm lint && pnpm build` all pass
- Site is ready for content review by Anna (Phase 4)

# Phase 4: Contrast fix and test coverage

## Part A: Fix AAA colour contrast

### Problem

The link colour `--color-link: oklch(45% 0.157 247deg)` renders as `#0057a6` against the light background `--color-light: hsl(55, 67%, 96%)` (`#fcfbf0`). The contrast ratio is 6.93:1 — passes WCAG AA (4.5:1) but fails AAA enhanced (7:1).

The visited link colour `--color-link-visited: oklch(47.1% 0.157 296deg)` renders as `#6541a7` with a contrast ratio of 7.02:1 — technically passes but has no safety margin.

Both are excluded via `KNOWN_VIOLATIONS = ["color-contrast-enhanced"]` in every test file.

### Recommended colour change

Darken both link colours by reducing the oklch lightness value. The hue and chroma stay the same — only lightness changes.

**File:** `src/layouts/styles/global.css`, lines 7-8

| Variable | Current | New | Hex change | Contrast ratio |
|---|---|---|---|---|
| `--color-link` | `oklch(45% 0.157 247deg)` | `oklch(44% 0.157 247deg)` | `#0057a6` to `#0054a3` | 6.93:1 to 7.23:1 |
| `--color-link-visited` | `oklch(47.1% 0.157 296deg)` | `oklch(46.5% 0.157 296deg)` | `#6541a7` to `#6340a5` | 7.02:1 to 7.20:1 |

Both pass AAA enhanced (7:1) with comfortable margin. The visual difference is barely perceptible — 1 percentage point darker for the blue, 0.6 for the purple.

### Steps

1. Edit `src/layouts/styles/global.css` line 7: change `oklch(45% 0.157 247deg)` to `oklch(44% 0.157 247deg)`
2. Edit `src/layouts/styles/global.css` line 8: change `oklch(47.1% 0.157 296deg)` to `oklch(46.5% 0.157 296deg)`
3. Remove `KNOWN_VIOLATIONS` and `disableRules(KNOWN_VIOLATIONS)` from every test file that has them (9 files)
4. Remove `KNOWN_VIOLATIONS` from `accessibility.spec.ts` (pa11y doesn't use it — but verify pa11y passes too)
5. Build and run all tests to confirm zero accessibility violations

---

## Part B: Add missing test coverage

### B1. Add cookie-policy spec

**New file:** `tests/e2e/cookie-policy.spec.ts`

Tests to include (matching the pattern of `privacy-policy.spec.ts` and `terms-of-use.spec.ts`):

- Loads with 200 status
- H1 contains "Cookie Policy"
- Has `noindex` meta tag
- Links to privacy policy and that link resolves
- axe-core WCAG AAA scan passes (no exclusions, since contrast will be fixed)

### B2. Add 404 page spec

**New file:** `tests/e2e/404.spec.ts`

Tests to include:

- Requesting a non-existent path returns 404 status
- Page contains "Page not found" heading
- Lists helpful links (Home, Startups, etc.) and all resolve
- Has "GET IN TOUCH" CTA with correct mailto link
- axe-core WCAG AAA scan passes

### B3. Add cookie-policy to cross-cutting specs

Three files currently iterate over a page list but omit `/cookie-policy/`:

1. **`navigation.spec.ts`** — add `{ path: "/cookie-policy/", label: "Cookie Policy" }` to the `PAGES` array
2. **`social-meta.spec.ts`** — add `"/cookie-policy/"` to the `pages` array
3. **`accessibility.spec.ts`** — add `{ name: "Cookie Policy", path: "/cookie-policy/" }` to the `pages` array; also fix the trailing slashes on `Privacy Policy` and `Terms of Use` paths (currently `/privacy-policy` and `/terms-of-use` — should be `/privacy-policy/` and `/terms-of-use/`)

### B4. Add external link validation to all page specs

Currently only `home.spec.ts` checks that external links have `rel="external"`. Add this test to every page spec that has external links:

- `startups.spec.ts` (Calendly links)
- `small-businesses.spec.ts` (Calendly links)
- `about.spec.ts` (LinkedIn link)
- `contact.spec.ts` (LinkedIn link)
- `champions.spec.ts` (no external links — skip)
- `workshops.spec.ts` (no external links — skip)

### B5. Strengthen privacy-policy and terms-of-use specs

Both currently have only 4 tests. Add the standard checks that every other page spec has:

- All images load (no broken src)
- All internal links resolve
- Content verification specific to the page (e.g., privacy policy mentions "personal information", "TLS", "Privacy by Design"; terms of use mentions "CyberFern, Limited", copyright year, "revisions")

### B6. Add JSON-LD schema validation

**New file:** `tests/e2e/schema.spec.ts`

For every page, verify:

- At least one `<script type="application/ld+json">` element exists
- Organization schema is present on every page (name "CyberFern", type "Organization")
- BreadcrumbList schema is present on non-home pages
- Service schema is present on startups, small-businesses, workshops, champions pages
- Person schema is present on the about page
- Each schema block is valid JSON (no parse errors)

### B7. Add canonical URL test

Add to `social-meta.spec.ts` (or a new spec):

- Every page has a `<link rel="canonical">` tag
- The canonical URL starts with `https://cyberfern.com/`
- The canonical URL path matches the page path

---

## Execution order

1. **A** — Fix contrast colours and remove `KNOWN_VIOLATIONS` exclusions
2. **B3** — Fix cross-cutting specs (add cookie-policy, fix trailing slashes)
3. **B1** — Add cookie-policy spec
4. **B2** — Add 404 spec
5. **B4** — Add external link checks to remaining page specs
6. **B5** — Strengthen privacy-policy and terms-of-use specs
7. **B6** — Add JSON-LD schema validation
8. **B7** — Add canonical URL test
9. Run full suite, verify all pass

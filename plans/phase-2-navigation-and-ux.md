# Phase 2: Navigation and UX

Refine the navigation, calls-to-action, and overall user experience across all pages.

## Batch 2.1: Navigation Polish

### Steps

1. Review nav at all breakpoints — ensure the expanded menu (now 5+ items) works well on mobile
2. If a hamburger/collapsible was added in Phase 1, refine its animation and behavior (CSS-only)
3. Add a "skip to main content" link for keyboard/screen reader users (WCAG AAA)
4. Ensure consistent `aria-current="page"` on all nav items across all pages
5. Verify tab order is logical on every page
6. Add e2e tests for skip link, keyboard navigation

### Definition of Done

- Nav is usable and attractive at all 4 breakpoints
- Skip link present and functional
- Tab order logical on all pages
- All tests pass, lint/fmt/build pass

---

## Batch 2.2: Repeated CTAs

### Steps

1. Audit each page for CTA placement — every page should end with a clear next action
2. Add CTAs after key sections:
   - Homepage: after "Who We Help" cards and after testimonials
   - Startups: after "What We Do" and after "Why Choose Us"
   - Small Businesses: after misconceptions section
   - Workshops: after workshop list and after logistics
   - Champions: after programme description and after case studies
3. CTAs should be contextual (not all identical):
   - Startups/Small Businesses: "Book your free consultation" (Calendly)
   - Workshops: "Discuss your training needs" (info@cyberfern.com)
   - Champions: "Talk to Anna about your programme" (info@cyberfern.com)
4. Style CTAs consistently using existing `.button` class
5. Add e2e tests verifying CTA presence and href on each page

### Definition of Done

- Every page has at least 2 CTAs (one mid-page, one at end)
- CTAs are contextual to the audience
- CTA links are correct
- All tests pass, lint/fmt/build pass

---

## Batch 2.3: Footer Enhancement

### Steps

1. Expand footer contact section — use info@cyberfern.com as the single contact email site-wide (confirmed by Anna)
2. Add footer nav links to all main pages (not just Privacy/Terms)
3. Consider a brief tagline or one-liner about CyberFern in the footer
4. Ensure footer is consistent across all pages
5. Update e2e tests for footer content

### Definition of Done

- Footer has complete navigation
- Contact information is clear and consistent
- Footer renders correctly at all breakpoints
- All tests pass, lint/fmt/build pass

---

## Batch 2.4: Visual Consistency and Spacing

### Steps

1. Audit all new pages for visual consistency with existing design:
   - Heading sizes and weights
   - Section spacing (padding/margin)
   - Card styling
   - Color usage
2. Ensure new pages use the same CSS layer structure and variables
3. Check that no page introduces inline styles or one-off CSS that should be in global.css
4. Verify image sizing and aspect ratios are consistent across pages
5. Test at all 4 responsive breakpoints

### Definition of Done

- All pages share a consistent visual language
- No inline styles or orphaned CSS
- All breakpoints render correctly
- All tests pass, lint/fmt/build pass

---

## Batch 2.5: Phase 2 Review

### Steps

1. Run full test suite
2. Run accessibility scans on all pages
3. Manual review of all pages in a browser at each breakpoint
4. Verify all CTAs point to correct destinations
5. Check that every page has a logical reading flow (heading hierarchy, content order)
6. Confirm no regressions from Phase 1

### Definition of Done

- All tests green
- All accessibility scans pass at WCAG 2.2 AAA (automated criteria)
- Visual review complete at all breakpoints
- No regressions
- `pnpm fmt && pnpm lint && pnpm build` all pass

import { test, expect } from "@playwright/test"

const PAGES = [
	{ path: "/", label: "Home" },
	{ path: "/startups/", label: "Startups" },
	{ path: "/small-businesses/", label: "Small Businesses" },
	{ path: "/workshops/", label: "Workshops" },
	{ path: "/champions/", label: "Champions" },
	{ path: "/about/", label: "About" },
	{ path: "/contact/", label: "Contact" },
	{ path: "/privacy-policy/", label: "Privacy Policy" },
	{ path: "/terms-of-use/", label: "Terms of Use" },
]

test.describe("Navigation", () => {
	test("skip link is present on every page", async ({ page }) => {
		for (const { path } of PAGES) {
			await page.goto(path)
			const skipLink = page.locator("a.skip-link")
			await expect(skipLink).toHaveAttribute("href", "#main-content")
			await expect(skipLink).toHaveText("Skip to main content")
		}
	})

	test("skip link becomes visible on focus", async ({ page }) => {
		await page.goto("/")
		const skipLink = page.locator("a.skip-link")

		// Before focus: positioned off-screen
		const boxBefore = await skipLink.boundingBox()
		expect(boxBefore).not.toBeNull()
		expect(boxBefore!.x).toBeLessThan(0)

		// Tab to focus the skip link
		await page.keyboard.press("Tab")
		await expect(skipLink).toBeFocused()

		// After focus: visible on-screen
		const boxAfter = await skipLink.boundingBox()
		expect(boxAfter).not.toBeNull()
		expect(boxAfter!.x).toBeGreaterThanOrEqual(0)
	})

	test("skip link navigates to main content", async ({ page }) => {
		await page.goto("/")
		const skipLink = page.locator("a.skip-link")

		await page.keyboard.press("Tab")
		await expect(skipLink).toBeFocused()
		await page.keyboard.press("Enter")

		// The URL hash should now be #main-content
		expect(page.url()).toContain("#main-content")
	})

	test("main-content id exists on every page", async ({ page }) => {
		for (const { path } of PAGES) {
			await page.goto(path)
			const main = page.locator("main#main-content")
			await expect(
				main,
				`Page "${path}" should have <main id="main-content">`,
			).toHaveCount(1)
		}
	})

	test("aria-current='page' marks the active nav item", async ({ page }) => {
		const navPages = PAGES.filter(
			(p) =>
				p.path !== "/" &&
				p.path !== "/privacy-policy/" &&
				p.path !== "/terms-of-use/",
		)

		for (const { path, label } of navPages) {
			await page.goto(path)
			// Desktop and mobile nav both mark the current page (2 elements)
			const current = page.locator(
				'nav[aria-label="Main navigation"] .nav-list [aria-current="page"]',
			)
			await expect(
				current,
				`Page "${path}" should mark "${label}" as current`,
			).toHaveCount(1)
			const text = await current.textContent()
			expect(text?.trim()).toBe(label)
		}
	})

	test("home page has no aria-current in main nav", async ({ page }) => {
		await page.goto("/")
		const current = page.locator(
			'nav[aria-label="Main navigation"] [aria-current="page"]',
		)
		await expect(current).toHaveCount(0)
	})

	test("footer uses aria-current='page' on legal pages", async ({ page }) => {
		await page.goto("/privacy-policy/")
		const privacyCurrent = page.locator(
			'nav[aria-label="Legal"] [aria-current="page"]',
		)
		await expect(privacyCurrent).toHaveCount(1)
		const privacyText = await privacyCurrent.textContent()
		expect(privacyText?.trim()).toBe("Privacy")

		await page.goto("/terms-of-use/")
		const termsCurrent = page.locator(
			'nav[aria-label="Legal"] [aria-current="page"]',
		)
		await expect(termsCurrent).toHaveCount(1)
		const termsText = await termsCurrent.textContent()
		expect(termsText?.trim()).toBe("Terms")
	})

	test("tab order starts with skip link then header links", async ({
		page,
	}) => {
		await page.goto("/startups/")

		// First tab: skip link
		await page.keyboard.press("Tab")
		const skipLink = page.locator("a.skip-link")
		await expect(skipLink).toBeFocused()

		// Second tab: logo link (CyberFern → /)
		await page.keyboard.press("Tab")
		const logo = page.locator('header a[href="/"]')
		await expect(logo).toBeFocused()

		// Subsequent tabs: nav items (skipping current page which is a span)
		const expectedNavHrefs = [
			"/small-businesses/",
			"/workshops/",
			"/champions/",
			"/about/",
			"/contact/",
		]

		for (const href of expectedNavHrefs) {
			await page.keyboard.press("Tab")
			const link = page.locator(`header nav a[href="${href}"]`).first()
			await expect(link).toBeFocused()
		}
	})

	test("footer tagline is present on every page", async ({ page }) => {
		for (const { path } of PAGES) {
			await page.goto(path)
			const tagline = page.locator("footer .footer-tagline")
			await expect(tagline).toBeVisible()
			await expect(tagline).toContainText(
				"Cybersecurity made practical, proportionate, and human.",
			)
		}
	})

	test("footer has navigation links to all main pages", async ({ page }) => {
		await page.goto("/")

		const footerNav = page.locator('footer nav[aria-label="Footer navigation"]')
		await expect(footerNav).toBeVisible()

		const expectedLinks = [
			{ label: "Startups", href: "/startups/" },
			{ label: "Small Businesses", href: "/small-businesses/" },
			{ label: "Workshops", href: "/workshops/" },
			{ label: "Champions", href: "/champions/" },
			{ label: "About", href: "/about/" },
			{ label: "Contact", href: "/contact/" },
		]

		for (const { label, href } of expectedLinks) {
			const link = footerNav.locator("a", { hasText: label })
			await expect(link, `Footer nav should have "${label}" link`).toBeVisible()
			await expect(link).toHaveAttribute("href", href)
		}
	})

	test("footer contact email is present on every page", async ({ page }) => {
		for (const { path } of PAGES) {
			await page.goto(path)
			const email = page.locator(
				'footer .contact-info a[href="mailto:info@cyberfern.com"]',
			)
			await expect(
				email,
				`Page "${path}" should have contact email in footer`,
			).toBeVisible()
		}
	})

	test("mobile menu is keyboard accessible", async ({ page }) => {
		await page.setViewportSize({ width: 480, height: 800 })
		await page.goto("/")

		// Tab to skip link, then logo (no logo on home), then menu summary
		await page.keyboard.press("Tab") // skip link
		await page.keyboard.press("Tab") // menu summary

		const summary = page.locator(".nav-mobile summary")
		await expect(summary).toBeFocused()

		// Enter opens the menu
		await page.keyboard.press("Enter")
		const details = page.locator(".nav-mobile")
		await expect(details).toHaveAttribute("open", "")

		// Tab into the menu items
		await page.keyboard.press("Tab")
		const firstLink = page.locator(".nav-mobile a").first()
		await expect(firstLink).toBeFocused()
	})
})

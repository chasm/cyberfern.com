import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

const BASE = "http://localhost:4321"


test.describe("Home page", () => {
	test("loads with 200 status", async ({ page }) => {
		const response = await page.goto("/")
		expect(response?.status()).toBe(200)
	})

	test("H1 exists and contains expected text", async ({ page }) => {
		await page.goto("/")
		const h1 = page.locator("h1")
		await expect(h1).toBeVisible()
		const text = await h1.textContent()
		expect(text).toContain("Cybersecurity made practical")
		expect(text).toContain("proportionate, and human")
	})

	test("has Who We Help section with 4 audience cards", async ({ page }) => {
		await page.goto("/")

		const h2 = page.locator("h2", { hasText: "Who We Help" })
		await expect(h2).toBeVisible()

		const cards = page.locator(".what .card")
		await expect(cards).toHaveCount(4)
	})

	test("audience cards link to correct pages", async ({ page }) => {
		await page.goto("/")

		const expectedLinks = [
			{ text: "Startups", href: "/startups/" },
			{ text: "Small Businesses", href: "/small-businesses/" },
			{ text: "Workshops & Training", href: "/workshops/" },
			{ text: "Security Champions", href: "/champions/" },
		]

		for (const { text, href } of expectedLinks) {
			const link = page.locator(".what .card a", { hasText: text })
			await expect(link, `Card "${text}" should exist`).toBeVisible()
			await expect(link).toHaveAttribute("href", href)
		}
	})

	test("all audience card links resolve", async ({ page }) => {
		await page.goto("/")

		const cardLinks = page.locator(".what .card a")
		const count = await cardLinks.count()
		expect(count).toBe(4)

		for (let i = 0; i < count; i++) {
			const href = await cardLinks.nth(i).getAttribute("href")
			const url = new URL(href!, BASE)
			const response = await page.request.get(url.toString())
			expect(response.status(), `Card link "${href}" should resolve`).toBe(200)
		}
	})

	test("has CTAs after audience cards and after testimonials", async ({
		page,
	}) => {
		await page.goto("/")

		// Calendly CTA after audience cards
		const calendlyCta = page.locator('.what a[href*="calendly.com"].button')
		await expect(calendlyCta).toHaveCount(1)

		// Email CTA after testimonials
		const emailCta = page.locator(
			'.testimonials a[href="mailto:info@cyberfern.com"].button',
		)
		await expect(emailCta).toHaveCount(1)
	})

	test("all images load (no broken src)", async ({ page }) => {
		await page.goto("/")
		await page.waitForLoadState("networkidle")

		const images = page.locator("img")
		const count = await images.count()
		expect(count).toBeGreaterThan(0)

		for (let i = 0; i < count; i++) {
			const img = images.nth(i)
			const naturalWidth = await img.evaluate(
				(el) => (el as HTMLImageElement).naturalWidth,
			)
			const src = await img.getAttribute("src")
			expect(naturalWidth, `Image "${src}" should have loaded`).toBeGreaterThan(
				0,
			)
		}
	})

	test("all internal links resolve", async ({ page }) => {
		await page.goto("/")

		const links = page.locator('a[href^="/"], a[href^="#"], a[href^="/#"]')
		const count = await links.count()
		expect(count).toBeGreaterThan(0)

		const hrefs = new Set<string>()
		for (let i = 0; i < count; i++) {
			const href = await links.nth(i).getAttribute("href")
			if (href) {
				hrefs.add(href)
			}
		}

		for (const href of hrefs) {
			if (href.startsWith("#") || href.startsWith("/#")) {
				// Fragment-only links: check the target element exists on the current page
				const fragment = href.replace(/^\/?#/, "")
				if (fragment) {
					const target = page.locator(`[id="${fragment}"]`)
					await expect(
						target,
						`Fragment target "#${fragment}" should exist`,
					).toHaveCount(1)
				}
			} else {
				// Path links: fetch and check status
				const url = new URL(href, BASE)
				const response = await page.request.get(url.toString())
				expect(
					response.status(),
					`Internal link "${href}" should resolve`,
				).toBe(200)
			}
		}
	})

	test('all external links have rel="external"', async ({ page }) => {
		await page.goto("/")

		const externalLinks = page.locator(
			'a[href^="http://"], a[href^="https://"]',
		)
		const count = await externalLinks.count()
		expect(count).toBeGreaterThan(0)

		for (let i = 0; i < count; i++) {
			const link = externalLinks.nth(i)
			const href = await link.getAttribute("href")
			const rel = await link.getAttribute("rel")
			expect(rel, `External link "${href}" should have rel="external"`).toBe(
				"external",
			)
		}
	})

	test("axe-core accessibility scan passes (WCAG AAA)", async ({ page }) => {
		await page.goto("/")
		await page.waitForLoadState("networkidle")

		const results = await new AxeBuilder({ page })
			.withTags([
				"wcag2a",
				"wcag2aa",
				"wcag2aaa",
				"wcag21a",
				"wcag21aa",
				"wcag22aa",
			])
			.analyze()

		expect(
			results.violations,
			`Accessibility violations found:\n${JSON.stringify(results.violations, null, 2)}`,
		).toEqual([])
	})
})

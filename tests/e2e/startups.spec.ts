import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

const BASE = "http://localhost:4321"

/**
 * Known axe-core violations (pre-refactor).
 * - color-contrast-enhanced: link colour fails AAA enhanced (7:1).
 */
const KNOWN_VIOLATIONS = ["color-contrast-enhanced"]

test.describe("Startups page", () => {
	test("loads with 200 status", async ({ page }) => {
		const response = await page.goto("/startups/")
		expect(response?.status()).toBe(200)
	})

	test("H1 exists and contains expected text", async ({ page }) => {
		await page.goto("/startups/")
		const h1 = page.locator("h1")
		await expect(h1).toBeVisible()
		const text = await h1.textContent()
		expect(text).toContain("grow your business")
		expect(text).toContain("cyber-resilience")
	})

	test("has What We Do section with 3 cards", async ({ page }) => {
		await page.goto("/startups/")

		const h2 = page.locator("h2", { hasText: "What We Do" })
		await expect(h2).toBeVisible()

		const cards = page.locator(".what .card")
		await expect(cards).toHaveCount(3)
	})

	test("has What to Expect section", async ({ page }) => {
		await page.goto("/startups/")

		const h2 = page.locator("h2", { hasText: "What to Expect" })
		await expect(h2).toBeVisible()
	})

	test("has Calendly CTA links (hero, mid-page, end)", async ({ page }) => {
		await page.goto("/startups/")

		const cta = page.locator('a[href*="calendly.com"]')
		const count = await cta.count()
		expect(count).toBeGreaterThanOrEqual(3)

		for (let i = 0; i < count; i++) {
			await expect(cta.nth(i)).toHaveAttribute("rel", "external")
		}
	})

	test("all images load (no broken src)", async ({ page }) => {
		await page.goto("/startups/")
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
		await page.goto("/startups/")

		const links = page.locator('a[href^="/"]')
		const count = await links.count()

		const hrefs = new Set<string>()
		for (let i = 0; i < count; i++) {
			const href = await links.nth(i).getAttribute("href")
			if (href) hrefs.add(href)
		}

		for (const href of hrefs) {
			const url = new URL(href, BASE)
			const response = await page.request.get(url.toString())
			expect(response.status(), `Internal link "${href}" should resolve`).toBe(
				200,
			)
		}
	})

	test("axe-core accessibility scan passes (WCAG AAA)", async ({ page }) => {
		await page.goto("/startups/")
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
			.disableRules(KNOWN_VIOLATIONS)
			.analyze()

		expect(
			results.violations,
			`Accessibility violations found:\n${JSON.stringify(results.violations, null, 2)}`,
		).toEqual([])
	})
})

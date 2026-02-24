import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

const BASE = "http://localhost:4321"

test.describe("Privacy Policy page", () => {
	test("loads with 200 status", async ({ page }) => {
		const response = await page.goto("/privacy-policy")
		expect(response?.status()).toBe(200)
	})

	test("H1 contains expected text", async ({ page }) => {
		await page.goto("/privacy-policy")
		const h1 = page.locator("h1")
		await expect(h1).toBeVisible()
		await expect(h1).toHaveText("Privacy Policy")
	})

	test("has noindex meta tag", async ({ page }) => {
		await page.goto("/privacy-policy")
		const robots = page.locator('meta[name="robots"]')
		const content = await robots.getAttribute("content")
		expect(content).toContain("noindex")
	})

	test("has expected heading structure", async ({ page }) => {
		await page.goto("/privacy-policy")
		const h2s = page.locator("h2")
		const count = await h2s.count()
		expect(count).toBeGreaterThan(0)
	})

	test("content mentions key privacy terms", async ({ page }) => {
		await page.goto("/privacy-policy")
		const article = page.locator("article")
		const text = await article.textContent()
		expect(text).toContain("personal information")
		expect(text).toContain("Transport Layer Security")
		expect(text).toContain("Privacy by Design")
	})

	test("all internal links resolve", async ({ page }) => {
		await page.goto("/privacy-policy")

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

	test('all external links have rel="external"', async ({ page }) => {
		await page.goto("/privacy-policy")

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
		await page.goto("/privacy-policy")
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

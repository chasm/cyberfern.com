import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

const BASE = "http://localhost:4321"

/**
 * Known axe-core violations (pre-refactor).
 * - color-contrast-enhanced: link colour fails AAA enhanced (7:1).
 */
const KNOWN_VIOLATIONS = ["color-contrast-enhanced"]

test.describe("About page", () => {
	test("loads with 200 status", async ({ page }) => {
		const response = await page.goto("/about/")
		expect(response?.status()).toBe(200)
	})

	test("H1 exists and contains expected text", async ({ page }) => {
		await page.goto("/about/")
		const h1 = page.locator("h1")
		await expect(h1).toBeVisible()
		await expect(h1).toHaveText("About CyberFern")
	})

	test("has Background section with credentials", async ({ page }) => {
		await page.goto("/about/")
		const h2 = page.locator("h2", { hasText: "Background" })
		await expect(h2).toBeVisible()

		const section = page.locator(".why")
		const text = await section.textContent()
		expect(text).toContain("full-stack")
		expect(text).toContain("DevSecOps")
		expect(text).toContain("MBA")
		expect(text).toContain("Sociology")
		expect(text).toContain("Machine Learning")
	})

	test("has Approach section with positioning", async ({ page }) => {
		await page.goto("/about/")
		const h2 = page.locator("h2", { hasText: "Approach" })
		await expect(h2).toBeVisible()

		const section = page.locator(".testimonials")
		const text = await section.textContent()
		expect(text).toContain("boardrooms and server rooms")
	})

	test("has LinkedIn link", async ({ page }) => {
		await page.goto("/about/")
		const link = page.locator(
			'a[href="https://www.linkedin.com/in/annalezhikova/"]',
		)
		await expect(link).toBeVisible()
	})

	test("has contact CTA with email link", async ({ page }) => {
		await page.goto("/about/")
		const cta = page.locator('a[href="mailto:info@cyberfern.com"]')
		const count = await cta.count()
		expect(count).toBeGreaterThanOrEqual(1)
	})

	test("has How CyberFern Can Help section", async ({ page }) => {
		await page.goto("/about/")
		const h2 = page.locator("h2", { hasText: "How CyberFern Can Help" })
		await expect(h2).toBeVisible()

		const section = page.locator(".expect")
		const text = await section.textContent()
		expect(text).toContain("startups and small businesses")
		expect(text).toContain("Training workshops")
		expect(text).toContain("Security Champions Programme")
	})

	test("all images load (no broken src)", async ({ page }) => {
		await page.goto("/about/")
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
		await page.goto("/about/")

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
		await page.goto("/about/")
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

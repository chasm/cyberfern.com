import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

const BASE = "http://localhost:4321"


test.describe("Champions page", () => {
	test("loads with 200 status", async ({ page }) => {
		const response = await page.goto("/champions/")
		expect(response?.status()).toBe(200)
	})

	test("H1 exists and contains expected text", async ({ page }) => {
		await page.goto("/champions/")
		const h1 = page.locator("h1")
		await expect(h1).toBeVisible()
		await expect(h1).toHaveText("Security Champions Programme")
	})

	test("has The Challenge section", async ({ page }) => {
		await page.goto("/champions/")
		const h2 = page.locator("h2", { hasText: "The Challenge" })
		await expect(h2).toBeVisible()
	})

	test("has How It Works section with programme phases", async ({ page }) => {
		await page.goto("/champions/")
		const h2 = page.locator("h2", { hasText: "How It Works" })
		await expect(h2).toBeVisible()

		const section = page.locator(".section-light")
		const text = await section.textContent()
		expect(text).toContain("Discovery and planning")
		expect(text).toContain("Team selection and kickoff")
		expect(text).toContain("Goal setting")
		expect(text).toContain("Execution")
		expect(text).toContain("Measurement and iteration")
	})

	test("has Proven Results with case studies", async ({ page }) => {
		await page.goto("/champions/")
		const h2 = page.locator("h2", { hasText: "Proven Results" })
		await expect(h2).toBeVisible()

		const section = page.locator("section.section-shaded").last()
		const text = await section.textContent()
		expect(text).toContain("Swiss Post")
		expect(text).toContain("Log4Shell")
		expect(text).toContain("Standards and Technology")
	})

	test("has contact CTAs with email link (hero, mid-page, end)", async ({
		page,
	}) => {
		await page.goto("/champions/")
		const cta = page.locator('a[href="mailto:info@cyberfern.com"]')
		const count = await cta.count()
		expect(count).toBeGreaterThanOrEqual(3)
	})

	test("positions as programme, not workshop session", async ({ page }) => {
		await page.goto("/champions/")
		const text = await page.textContent("main")
		expect(text).toContain("programme")
	})

	test("all images load (no broken src)", async ({ page }) => {
		await page.goto("/champions/")
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
		await page.goto("/champions/")

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
		await page.goto("/champions/")
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

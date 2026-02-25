import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

const BASE = "http://localhost:4321"


const WORKSHOP_TITLES = [
	"Quantifying Cyber Risk",
	"Presenting Cybersecurity to the Board",
	"Building Your Security Roadmap",
	"Optimising Cybersecurity Investment",
	"Bridging Business and Technology",
	"Cyber Risk Management Fundamentals",
]

test.describe("Workshops page", () => {
	test("loads with 200 status", async ({ page }) => {
		const response = await page.goto("/workshops/")
		expect(response?.status()).toBe(200)
	})

	test("H1 exists and contains expected text", async ({ page }) => {
		await page.goto("/workshops/")
		const h1 = page.locator("h1")
		await expect(h1).toBeVisible()
		await expect(h1).toHaveText("Cybersecurity Training Workshops")
	})

	test("lists all 6 workshops", async ({ page }) => {
		await page.goto("/workshops/")

		const h2 = page.locator("h2", { hasText: "Our Workshops" })
		await expect(h2).toBeVisible()

		const headings = page.locator(".workshop-list h3")
		await expect(headings).toHaveCount(6)

		for (const title of WORKSHOP_TITLES) {
			const heading = page.locator("h3", { hasText: title })
			await expect(heading, `Workshop "${title}" should exist`).toHaveCount(1)
		}
	})

	test("each workshop shows target audience", async ({ page }) => {
		await page.goto("/workshops/")

		const audienceMarkers = page.locator(".workshop-list p strong", {
			hasText: "For:",
		})
		await expect(audienceMarkers).toHaveCount(6)
	})

	test("has Workshop Details section", async ({ page }) => {
		await page.goto("/workshops/")

		const h2 = page.locator("h2", { hasText: "Workshop Details" })
		await expect(h2).toBeVisible()
	})

	test("shows logistics info", async ({ page }) => {
		await page.goto("/workshops/")

		const section = page.locator(".section-shaded")
		const text = await section.textContent()
		expect(text).toContain("two hours")
		expect(text).toContain("in-person or online")
		expect(text).toContain("2–15 participants")
	})

	test("has booking CTAs with email link (hero, mid-page, end)", async ({
		page,
	}) => {
		await page.goto("/workshops/")

		const cta = page.locator('a[href="mailto:info@cyberfern.com"]')
		const count = await cta.count()
		expect(count).toBeGreaterThanOrEqual(3)
	})

	test("all images load (no broken src)", async ({ page }) => {
		await page.goto("/workshops/")
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
		await page.goto("/workshops/")

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
		await page.goto("/workshops/")
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

import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test.describe("Offline page", () => {
	test("loads with 200 status", async ({ page }) => {
		const response = await page.goto("/offline/")
		expect(response?.status()).toBe(200)
	})

	test("has 'You're offline' heading", async ({ page }) => {
		await page.goto("/offline/")
		const h1 = page.locator("h1")
		await expect(h1).toBeVisible()
		await expect(h1).toHaveText("You're offline")
	})

	test("has a link back to home", async ({ page }) => {
		await page.goto("/offline/")
		const link = page.locator('main a[href="/"]')
		await expect(link).toBeVisible()
	})

	test("has noindex meta tag", async ({ page }) => {
		await page.goto("/offline/")
		const robots = page.locator('meta[name="robots"]')
		const content = await robots.getAttribute("content")
		expect(content).toContain("noindex")
	})

	test("axe-core accessibility scan passes (WCAG AAA)", async ({ page }) => {
		await page.goto("/offline/")
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

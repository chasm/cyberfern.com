import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test.describe("Cookie Policy page", () => {
	test("loads with 200 status", async ({ page }) => {
		const response = await page.goto("/cookie-policy")
		expect(response?.status()).toBe(200)
	})

	test("H1 contains expected text", async ({ page }) => {
		await page.goto("/cookie-policy")
		const h1 = page.locator("h1")
		await expect(h1).toBeVisible()
		await expect(h1).toHaveText("Cookie Policy")
	})

	test("has noindex meta tag", async ({ page }) => {
		await page.goto("/cookie-policy")
		const robots = page.locator('meta[name="robots"]')
		const content = await robots.getAttribute("content")
		expect(content).toContain("noindex")
	})

	test("links to privacy policy and it resolves", async ({ page }) => {
		await page.goto("/cookie-policy")
		const privacyLink = page.locator('main a[href="/privacy-policy/"]')
		await expect(privacyLink).toBeVisible()

		const response = await page.goto("/privacy-policy/")
		expect(response?.status()).toBe(200)
	})

	test("axe-core accessibility scan passes (WCAG AAA)", async ({ page }) => {
		await page.goto("/cookie-policy")
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

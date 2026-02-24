import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test.describe("404 page", () => {
	test("returns 404 status for non-existent path", async ({ page }) => {
		const response = await page.goto("/this-page-does-not-exist/")
		expect(response?.status()).toBe(404)
	})

	test("has 'Page not found' heading", async ({ page }) => {
		await page.goto("/this-page-does-not-exist/")
		const h1 = page.locator("h1")
		await expect(h1).toBeVisible()
		await expect(h1).toHaveText("Page not found")
	})

	test("lists helpful links and all resolve", async ({ page }) => {
		await page.goto("/this-page-does-not-exist/")

		const expectedLinks = [
			{ href: "/", text: "Home" },
			{ href: "/startups/", text: "Cybersecurity for Startups" },
			{ href: "/small-businesses/", text: "Cybersecurity for Small Businesses" },
			{ href: "/workshops/", text: "Training Workshops" },
			{ href: "/champions/", text: "Security Champions Programme" },
			{ href: "/about/", text: "About CyberFern" },
		]

		const list = page.locator("main ul")
		const items = list.locator("li")
		await expect(items).toHaveCount(expectedLinks.length)

		for (const { href, text } of expectedLinks) {
			const link = list.locator(`a[href="${href}"]`)
			await expect(link).toHaveText(text)

			const response = await page.goto(href)
			expect(response?.status()).toBe(200)
			await page.goto("/this-page-does-not-exist/")
		}
	})

	test("has GET IN TOUCH CTA with mailto link", async ({ page }) => {
		await page.goto("/this-page-does-not-exist/")
		const cta = page.locator('main a.button[href="mailto:info@cyberfern.com"]')
		await expect(cta).toBeVisible()
		await expect(cta).toHaveText("GET IN TOUCH")
	})

	test("axe-core accessibility scan passes (WCAG AAA)", async ({ page }) => {
		await page.goto("/this-page-does-not-exist/")
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

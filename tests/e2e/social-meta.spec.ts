import { test, expect } from "@playwright/test"

const pages = [
	"/",
	"/about/",
	"/champions/",
	"/contact/",
	"/small-businesses/",
	"/startups/",
	"/workshops/",
	"/privacy-policy/",
	"/terms-of-use/",
]

for (const path of pages) {
	test.describe(`Social meta tags on ${path}`, () => {
		test("has all OG tags with non-empty content", async ({ page }) => {
			await page.goto(path)

			const ogTags = [
				"og:title",
				"og:description",
				"og:image",
				"og:url",
				"og:type",
				"og:site_name",
			]

			for (const property of ogTags) {
				const meta = page.locator(`meta[property="${property}"]`)
				await expect(meta, `${property} should exist`).toHaveCount(1)
				const content = await meta.getAttribute("content")
				expect(
					content,
					`${property} should have non-empty content`,
				).toBeTruthy()
			}
		})

		test("has all Twitter Card tags with non-empty content", async ({
			page,
		}) => {
			await page.goto(path)

			const twitterTags = [
				"twitter:card",
				"twitter:title",
				"twitter:description",
				"twitter:image",
			]

			for (const name of twitterTags) {
				const meta = page.locator(`meta[name="${name}"]`)
				await expect(meta, `${name} should exist`).toHaveCount(1)
				const content = await meta.getAttribute("content")
				expect(content, `${name} should have non-empty content`).toBeTruthy()
			}
		})

		test("og:image and twitter:image are absolute URLs", async ({ page }) => {
			await page.goto(path)

			const ogImage = await page
				.locator('meta[property="og:image"]')
				.getAttribute("content")
			expect(ogImage).toMatch(/^https:\/\//)

			const twitterImage = await page
				.locator('meta[name="twitter:image"]')
				.getAttribute("content")
			expect(twitterImage).toMatch(/^https:\/\//)
		})

		test("og:url starts with https://cyberfern.com/", async ({ page }) => {
			await page.goto(path)

			const ogUrl = await page
				.locator('meta[property="og:url"]')
				.getAttribute("content")
			expect(ogUrl).toMatch(/^https:\/\/cyberfern\.com\//)
		})

		test('og:type is "website"', async ({ page }) => {
			await page.goto(path)

			const ogType = await page
				.locator('meta[property="og:type"]')
				.getAttribute("content")
			expect(ogType).toBe("website")
		})

		test("has favicon link tags (SVG, ICO, apple-touch-icon)", async ({
			page,
		}) => {
			await page.goto(path)

			const svgIcon = page.locator('link[rel="icon"][type="image/svg+xml"]')
			await expect(svgIcon).toHaveCount(1)
			await expect(svgIcon).toHaveAttribute("href", "/favicon.svg")

			const icoIcon = page.locator('link[rel="icon"][type="image/x-icon"]')
			await expect(icoIcon).toHaveCount(1)
			await expect(icoIcon).toHaveAttribute("href", "/favicon.ico")

			const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]')
			await expect(appleTouchIcon).toHaveCount(1)
			await expect(appleTouchIcon).toHaveAttribute(
				"href",
				"/apple-touch-icon.png",
			)
		})
	})
}

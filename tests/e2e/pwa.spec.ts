import { test, expect } from "@playwright/test"

const BASE = "http://localhost:4321"

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
	"/cookie-policy/",
]

test.describe("PWA support", () => {
	test("has theme-color meta tag with correct value", async ({ page }) => {
		await page.goto("/")
		const meta = page.locator('meta[name="theme-color"]')
		await expect(meta).toHaveAttribute("content", "#134e31")
	})

	test("has apple-mobile-web-app-capable meta tag", async ({ page }) => {
		await page.goto("/")
		const meta = page.locator('meta[name="apple-mobile-web-app-capable"]')
		await expect(meta).toHaveAttribute("content", "yes")
	})

	test("viewport includes initial-scale=1", async ({ page }) => {
		await page.goto("/")
		const meta = page.locator('meta[name="viewport"]')
		const content = await meta.getAttribute("content")
		expect(content).toContain("initial-scale=1")
	})

	test("has manifest link tag", async ({ page }) => {
		await page.goto("/")
		const link = page.locator('link[rel="manifest"]')
		await expect(link).toHaveCount(1)
	})

	test("manifest file is accessible and contains correct fields", async ({
		page,
	}) => {
		await page.goto("/")
		const link = page.locator('link[rel="manifest"]')
		const href = await link.getAttribute("href")
		expect(href).toBeTruthy()

		const url = new URL(href!, BASE)
		const response = await page.request.get(url.toString())
		expect(response.status()).toBe(200)

		const manifest = await response.json()
		expect(manifest.name).toBe("CyberFern")
		expect(manifest.short_name).toBe("CyberFern")
		expect(manifest.display).toBe("standalone")
		expect(manifest.theme_color).toBe("#134e31")
		expect(manifest.background_color).toBe("#134e31")
		expect(manifest.icons.length).toBeGreaterThanOrEqual(2)
	})

	test("PWA icon 192x192 returns 200 with image/png", async ({ page }) => {
		const response = await page.request.get(`${BASE}/pwa-192x192.png`)
		expect(response.status()).toBe(200)
		expect(response.headers()["content-type"]).toContain("image/png")
	})

	test("PWA icon 512x512 returns 200 with image/png", async ({ page }) => {
		const response = await page.request.get(`${BASE}/pwa-512x512.png`)
		expect(response.status()).toBe(200)
		expect(response.headers()["content-type"]).toContain("image/png")
	})

	for (const path of pages) {
		test(`theme-color meta tag present on ${path}`, async ({ page }) => {
			await page.goto(path)
			const meta = page.locator('meta[name="theme-color"]')
			await expect(meta).toHaveAttribute("content", "#134e31")
		})
	}
})

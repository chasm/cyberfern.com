import { test, expect } from "@playwright/test"

const pages = [
	{ name: "Home", path: "/", hasPageSchema: false, hasBreadcrumb: false },
	{
		name: "Startups",
		path: "/startups/",
		hasPageSchema: true,
		pageSchemaType: "Service",
		hasBreadcrumb: true,
	},
	{
		name: "Small Businesses",
		path: "/small-businesses/",
		hasPageSchema: true,
		pageSchemaType: "Service",
		hasBreadcrumb: true,
	},
	{
		name: "Workshops",
		path: "/workshops/",
		hasPageSchema: true,
		pageSchemaType: "Service",
		hasBreadcrumb: true,
	},
	{
		name: "Champions",
		path: "/champions/",
		hasPageSchema: true,
		pageSchemaType: "Service",
		hasBreadcrumb: true,
	},
	{
		name: "About",
		path: "/about/",
		hasPageSchema: true,
		pageSchemaType: "Person",
		hasBreadcrumb: true,
	},
	{
		name: "Contact",
		path: "/contact/",
		hasPageSchema: false,
		hasBreadcrumb: true,
	},
	{
		name: "Privacy Policy",
		path: "/privacy-policy/",
		hasPageSchema: false,
		hasBreadcrumb: true,
	},
	{
		name: "Terms of Use",
		path: "/terms-of-use/",
		hasPageSchema: false,
		hasBreadcrumb: true,
	},
	{
		name: "Cookie Policy",
		path: "/cookie-policy/",
		hasPageSchema: false,
		hasBreadcrumb: true,
	},
]

for (const pg of pages) {
	test.describe(`JSON-LD schema on ${pg.name}`, () => {
		test("all JSON-LD blocks are valid JSON", async ({ page }) => {
			await page.goto(pg.path)

			const scripts = page.locator('script[type="application/ld+json"]')
			const count = await scripts.count()
			expect(count).toBeGreaterThan(0)

			for (let i = 0; i < count; i++) {
				const raw = await scripts.nth(i).textContent()
				expect(() => JSON.parse(raw!), `JSON-LD block ${i} should be valid JSON`).not.toThrow()
			}
		})

		test("has Organization schema with correct name", async ({ page }) => {
			await page.goto(pg.path)

			const scripts = page.locator('script[type="application/ld+json"]')
			const count = await scripts.count()

			let found = false
			for (let i = 0; i < count; i++) {
				const data = JSON.parse((await scripts.nth(i).textContent())!)
				if (data["@type"] === "Organization" && data.name === "CyberFern") {
					found = true
					break
				}
			}

			expect(found, "Organization schema with name 'CyberFern' should be present").toBe(true)
		})

		if (pg.hasBreadcrumb) {
			test("has BreadcrumbList schema", async ({ page }) => {
				await page.goto(pg.path)

				const scripts = page.locator('script[type="application/ld+json"]')
				const count = await scripts.count()

				let found = false
				for (let i = 0; i < count; i++) {
					const data = JSON.parse((await scripts.nth(i).textContent())!)
					if (data["@type"] === "BreadcrumbList") {
						found = true
						expect(data.itemListElement).toBeTruthy()
						expect(data.itemListElement.length).toBeGreaterThanOrEqual(2)
						break
					}
				}

				expect(found, "BreadcrumbList schema should be present").toBe(true)
			})
		}

		if (pg.hasPageSchema) {
			test(`has ${pg.pageSchemaType} schema`, async ({ page }) => {
				await page.goto(pg.path)

				const scripts = page.locator('script[type="application/ld+json"]')
				const count = await scripts.count()

				let found = false
				for (let i = 0; i < count; i++) {
					const data = JSON.parse((await scripts.nth(i).textContent())!)
					if (data["@type"] === pg.pageSchemaType) {
						found = true
						break
					}
				}

				expect(
					found,
					`${pg.pageSchemaType} schema should be present on ${pg.name}`,
				).toBe(true)
			})
		}
	})
}

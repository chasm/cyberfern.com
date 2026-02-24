import { test, expect } from "@playwright/test"
import { execSync } from "node:child_process"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)

const BASE = "http://localhost:4321"

/**
 * Discover the Chrome binary installed by Playwright so pa11y
 * (which uses Puppeteer internally) can reuse it instead of
 * requiring a separate Puppeteer-managed install.
 */
function playwrightChromePath(): string {
	const raw = execSync("pnpm exec playwright install --dry-run chromium 2>&1", {
		encoding: "utf-8",
	})

	// The dry-run output includes the install location; but we can also just
	// compute it from the known cache structure.  Playwright stores its
	// browsers under $HOME/Library/Caches/ms-playwright on macOS and under
	// $HOME/.cache/ms-playwright on Linux.  We grab the newest chromium-*
	// directory programmatically.
	const { homedir } = require("node:os")
	const { existsSync, readdirSync } = require("node:fs")
	const { join } = require("node:path")

	const cacheRoots = [
		join(homedir(), "Library", "Caches", "ms-playwright"),
		join(homedir(), ".cache", "ms-playwright"),
	]

	for (const root of cacheRoots) {
		if (!existsSync(root)) continue

		const dirs = readdirSync(root)
			.filter((d: string) => d.startsWith("chromium-"))
			.sort()
			.reverse()

		if (dirs.length === 0) continue

		const candidates = [
			// macOS
			join(
				root,
				dirs[0],
				"chrome-mac-arm64",
				"Google Chrome for Testing.app",
				"Contents",
				"MacOS",
				"Google Chrome for Testing",
			),
			join(
				root,
				dirs[0],
				"chrome-mac",
				"Google Chrome for Testing.app",
				"Contents",
				"MacOS",
				"Google Chrome for Testing",
			),
			// Linux
			join(root, dirs[0], "chrome-linux64", "chrome"),
			join(root, dirs[0], "chrome-linux", "chrome"),
		]

		for (const c of candidates) {
			if (existsSync(c)) return c
		}
	}

	// Fall through if raw output contained something useful
	void raw
	throw new Error(
		"Could not find Playwright's Chrome binary. Run: pnpm exec playwright install chromium",
	)
}

const pages = [
	{ name: "Home", path: "/" },
	{ name: "Startups", path: "/startups/" },
	{ name: "Small Businesses", path: "/small-businesses/" },
	{ name: "Workshops", path: "/workshops/" },
	{ name: "Champions", path: "/champions/" },
	{ name: "About", path: "/about/" },
	{ name: "Contact", path: "/contact/" },
	{ name: "Privacy Policy", path: "/privacy-policy/" },
	{ name: "Terms of Use", path: "/terms-of-use/" },
	{ name: "Cookie Policy", path: "/cookie-policy/" },
]

for (const pg of pages) {
	test(`pa11y WCAG2AAA scan passes: ${pg.name}`, async () => {
		// pa11y is CJS and launches its own Puppeteer browser
		const pa11y = require("pa11y")

		const chromePath = playwrightChromePath()

		const results = await pa11y(`${BASE}${pg.path}`, {
			standard: "WCAG2AAA",
			runners: ["htmlcs"],
			chromeLaunchConfig: {
				executablePath: chromePath,
				args: ["--no-sandbox"],
			},
		})

		const errors = results.issues.filter(
			(issue: { type: string }) => issue.type === "error",
		)

		expect(
			errors,
			`pa11y errors on ${pg.name}:\n${JSON.stringify(errors, null, 2)}`,
		).toEqual([])
	})
}

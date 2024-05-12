import mdx from "@astrojs/mdx"
import { defineConfig } from "astro/config"

import sitemap from "@astrojs/sitemap"

const ignore = []

// https://astro.build/config
export default defineConfig({
	devToolbar: {
		enabled: false,
	},
	integrations: [
		mdx(),
		sitemap({
			canonicalURL: "https://cyberfern.com/",
			filter: (page) => !ignore.includes(page),
			lastmod: new Date(),
		}),
	],
	site: "https://cyberfern.com/",
})

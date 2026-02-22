import { defineConfig } from "astro/config"

import sitemap from "@astrojs/sitemap"

const ignore = [
	"https://cyberfern.com/privacy-policy/",
	"https://cyberfern.com/terms-of-use/",
]

// https://astro.build/config
export default defineConfig({
	devToolbar: {
		enabled: false,
	},
	integrations: [
		sitemap({
			canonicalURL: "https://cyberfern.com/",
			filter: (page) => !ignore.includes(page),
			lastmod: new Date(),
		}),
	],
	site: "https://cyberfern.com/",
})

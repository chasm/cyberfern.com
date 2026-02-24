import { defineConfig } from "astro/config"

import sitemap from "@astrojs/sitemap"
import AstroPWA from "@vite-pwa/astro"

const ignore = [
	"https://cyberfern.com/cookie-policy/",
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
		}),
		AstroPWA({
			registerType: "autoUpdate",
			manifest: {
				name: "CyberFern",
				short_name: "CyberFern",
				description:
					"Cybersecurity made practical, proportionate, and human.",
				theme_color: "#134e31",
				background_color: "#134e31",
				display: "standalone",
				start_url: "/",
				icons: [
					{
						src: "/pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "/pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
					{
						src: "/favicon.svg",
						sizes: "any",
						type: "image/svg+xml",
					},
				],
			},
			workbox: {
				globPatterns: [
					"**/*.{html,css,js,svg,png,webp,avif,ico,woff2}",
				],
				navigateFallback: "/404.html",
				navigateFallbackDenylist: [/^\/api\//, /^\/auth\//],
			},
			devOptions: {
				enabled: true,
				suppressWarnings: true,
			},
		}),
	],
	site: "https://cyberfern.com/",
})

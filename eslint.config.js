import eslintPluginAstro from "eslint-plugin-astro"

export default [
	...eslintPluginAstro.configs.recommended,

	{
		files: ["**/*.astro", "**/*.ts", "**/*.js"],
		rules: {
			semi: "off",
		},
	},
]

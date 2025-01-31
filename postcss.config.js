import postcssCssVariables from "postcss-css-variables"
import cssnano from "cssnano"

export default {
	plugins: [
		postcssCssVariables({
			/* options */
		}),
		cssnano({ preset: "default" }),
	],
}

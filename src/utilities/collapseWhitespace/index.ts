export default function collapseWhitespace(text = "") {
	return text.replace(/\s+/g, " ").trim()
}

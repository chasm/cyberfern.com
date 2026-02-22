import { describe, it, expect } from "vitest"
import collapseWhitespace from "../../src/utilities/collapseWhitespace/index.ts"

describe("collapseWhitespace", () => {
	it("returns empty string when called with no arguments", () => {
		expect(collapseWhitespace()).toBe("")
	})

	it("returns empty string for empty input", () => {
		expect(collapseWhitespace("")).toBe("")
	})

	it("trims leading and trailing whitespace", () => {
		expect(collapseWhitespace("  hello  ")).toBe("hello")
	})

	it("collapses multiple spaces into a single space", () => {
		expect(collapseWhitespace("hello    world")).toBe("hello world")
	})

	it("collapses tabs into a single space", () => {
		expect(collapseWhitespace("hello\t\tworld")).toBe("hello world")
	})

	it("collapses newlines into a single space", () => {
		expect(collapseWhitespace("hello\n\nworld")).toBe("hello world")
	})

	it("collapses mixed whitespace into a single space", () => {
		expect(collapseWhitespace("  hello \t\n  world  ")).toBe("hello world")
	})

	it("handles a multiline template literal", () => {
		const input = `
			This is a
			multiline   string
			with   extra   spaces
		`
		expect(collapseWhitespace(input)).toBe(
			"This is a multiline string with extra spaces",
		)
	})

	it("returns a single word unchanged", () => {
		expect(collapseWhitespace("hello")).toBe("hello")
	})

	it("handles whitespace-only input", () => {
		expect(collapseWhitespace("   \t\n   ")).toBe("")
	})
})

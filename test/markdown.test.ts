import assert from "node:assert";
import { afterEach, describe, it } from "node:test";
import { Markdown } from "../src/render/markdown.js";
import { resetCapabilitiesCache, setCapabilities } from "../src/render/hyperlinks.js";
import { themeFromJson } from "../src/render/theme.js";

const theme = themeFromJson({
	heading: ["bold", "cyan"],
	link: ["blue", "underline"],
	linkUrl: ["dim"],
	code: ["yellow"],
	codeBlock: ["green"],
	codeBlockBorder: ["dim"],
	quote: ["italic"],
	quoteBorder: ["dim"],
	hr: ["dim"],
	listBullet: ["cyan"],
	bold: ["bold"],
	italic: ["italic"],
	strikethrough: ["strikethrough"],
	underline: ["underline"],
});

function stripAnsi(line: string): string {
	return line.replace(/\x1b\[[0-9;]*m/g, "");
}

describe("catmd markdown renderer", () => {
	describe("Lists", () => {
		it("should render simple nested list", () => {
			const markdown = new Markdown(
				`- Item 1
  - Nested 1.1
  - Nested 1.2
- Item 2`,
				0,
				0,
				theme,
			);

			const plainLines = markdown.render(80).map(stripAnsi);

			assert.ok(plainLines.some((line) => line.includes("- Item 1")));
			assert.ok(plainLines.some((line) => line.includes("    - Nested 1.1")));
			assert.ok(plainLines.some((line) => line.includes("- Item 2")));
		});

		it("should render task list markers", () => {
			const markdown = new Markdown("- [ ] beep\n- [x] boop", 0, 0, theme);
			const lines = markdown.render(80).map((line) => stripAnsi(line).trimEnd());
			assert.deepStrictEqual(lines, ["- [ ] beep", "- [x] boop"]);
		});

		it("should indent wrapped unordered list lines", () => {
			const markdown = new Markdown("- alpha beta gamma delta epsilon", 0, 0, theme);
			const lines = markdown.render(20).map((line) => stripAnsi(line).trimEnd());
			assert.deepStrictEqual(lines, ["- alpha beta gamma", "  delta epsilon"]);
		});
	});

	describe("Tables", () => {
		it("should render simple table", () => {
			const markdown = new Markdown(
				`| Name | Age |
| --- | --- |
| Alice | 30 |
| Bob | 25 |`,
				0,
				0,
				theme,
			);

			const plainLines = markdown.render(80).map(stripAnsi);
			assert.ok(plainLines.some((line) => line.includes("Name")));
			assert.ok(plainLines.some((line) => line.includes("Alice")));
			assert.ok(plainLines.some((line) => line.includes("│")));
		});
	});

	describe("Strikethrough", () => {
		it("should render ~~text~~ as strikethrough", () => {
			const markdown = new Markdown("Use ~~strikethrough~~ here", 0, 0, theme);
			const joinedOutput = markdown.render(80).join("\n");
			const joinedPlain = markdown
				.render(80)
				.map(stripAnsi)
				.join(" ");

			assert.ok(joinedOutput.includes("\x1b[9m"));
			assert.ok(joinedPlain.includes("strikethrough"));
			assert.ok(!joinedPlain.includes("~~strikethrough~~"));
		});
	});

	describe("Links", () => {
		afterEach(() => {
			resetCapabilitiesCache();
		});

		it("should show URL in parentheses when hyperlinks are not supported", () => {
			setCapabilities({ hyperlinks: false });
			const markdown = new Markdown("[click here](https://example.com)", 0, 0, theme);
			const joinedPlain = markdown
				.render(80)
				.map(stripAnsi)
				.join(" ");

			assert.ok(joinedPlain.includes("click here"));
			assert.ok(joinedPlain.includes("(https://example.com)"));
		});

		it("should emit OSC 8 when hyperlinks are supported", () => {
			setCapabilities({ hyperlinks: true });
			const markdown = new Markdown("[click here](https://example.com)", 0, 0, theme);
			const joined = markdown.render(80).join("");
			assert.ok(joined.includes("\x1b]8;;https://example.com\x1b\\"));
		});
	});
});

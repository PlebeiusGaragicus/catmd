import assert from "node:assert";
import { afterEach, describe, it } from "node:test";
import { Markdown } from "../src/render/markdown.js";
import { resetCapabilitiesCache, setCapabilities } from "../src/render/hyperlinks.js";
import { themeFromJson } from "../src/render/theme.js";

const theme = themeFromJson({
	heading: ["bold", "cyan", "underline"],
	heading1: ["bold", "cyan", "underline"],
	heading2: ["bold", "cyan", "underline"],
	heading3: ["bold", "cyan", "underline"],
	heading4: ["bold", "underline"],
	heading5: ["bold", "dim", "underline"],
	heading6: ["dim", "underline"],
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

	describe("Headings", () => {
		it("should render all levels without # prefix", () => {
			const markdown = new Markdown(
				`# One
## Two
### Three`,
				0,
				0,
				theme,
			);
			const lines = markdown.render(80).map(stripAnsi);

			assert.ok(lines.some((line) => line === "One"));
			assert.ok(lines.some((line) => line === "Two"));
			assert.ok(lines.some((line) => line === "Three"));
			assert.ok(!lines.some((line) => line.includes("#")));
		});

		it("should draw a setext rule under H1 and H2", () => {
			const markdown = new Markdown("# Title\n\n## Section", 0, 0, theme);
			const lines = markdown.render(80).map(stripAnsi);

			const titleIdx = lines.indexOf("Title");
			assert.ok(titleIdx >= 0);
			assert.strictEqual(lines[titleIdx + 1], "─────");

			const sectionIdx = lines.indexOf("Section");
			assert.ok(sectionIdx >= 0);
			assert.strictEqual(lines[sectionIdx + 1], "───────");
		});

		it("should not draw a setext rule under H3+", () => {
			const markdown = new Markdown("### Subsection\n\nBody", 0, 0, theme);
			const lines = markdown.render(80).map(stripAnsi);

			const idx = lines.indexOf("Subsection");
			assert.ok(idx >= 0);
			assert.notStrictEqual(lines[idx + 1], "──────────");
		});

		it("should underline H3+ via theme (no setext rule)", () => {
			const markdown = new Markdown("### Subsection", 0, 0, theme);
			const output = markdown.render(80).join("\n");
			assert.ok(output.includes("\x1b[4m"));
			assert.ok(!output.includes("──────────"));
		});

		it("should apply heading style to inline code inside headings", () => {
			const markdown = new Markdown("## Hello `world`", 0, 0, theme);
			const output = markdown.render(80).join("\n");
			assert.ok(output.includes("\x1b[4m")); // underline from heading style
			assert.ok(!stripAnsi(output).includes("#"));
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

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { MarkdownTheme } from "./markdown.js";

const RESET = "\x1b[0m";

const STYLE_CODES: Record<string, string> = {
	bold: "\x1b[1m",
	italic: "\x1b[3m",
	underline: "\x1b[4m",
	dim: "\x1b[2m",
	strikethrough: "\x1b[9m",
	black: "\x1b[30m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
	white: "\x1b[37m",
	gray: "\x1b[90m",
};

/**
 * Default ANSI style stacks per markdown heading depth (1–6).
 * Every level is underlined; color and weight taper for deeper headings.
 */
export const DEFAULT_HEADING_STYLES: Record<number, string[]> = {
	1: ["bold", "cyan", "underline"],
	2: ["bold", "cyan", "underline"],
	3: ["bold", "cyan", "underline"],
	4: ["bold", "underline"],
	5: ["bold", "dim", "underline"],
	6: ["dim", "underline"],
};

export interface ThemeJson {
	heading?: string[];
	heading1?: string[];
	heading2?: string[];
	heading3?: string[];
	heading4?: string[];
	heading5?: string[];
	heading6?: string[];
	link?: string[];
	linkUrl?: string[];
	code?: string[];
	codeBlock?: string[];
	codeBlockBorder?: string[];
	quote?: string[];
	quoteBorder?: string[];
	hr?: string[];
	listBullet?: string[];
	bold?: string[];
	italic?: string[];
	strikethrough?: string[];
	underline?: string[];
	codeBlockIndent?: string;
}

function styleFn(keys: string[]): (text: string) => string {
	const prefix = keys.map((key) => STYLE_CODES[key] ?? "").join("");
	return (text: string) => (prefix ? prefix + text + RESET : text);
}

function headingStyleKeys(json: ThemeJson, level: number): string[] {
	const levelKey = `heading${level}` as keyof ThemeJson;
	const levelStyles = json[levelKey];
	if (Array.isArray(levelStyles)) {
		return levelStyles;
	}
	return DEFAULT_HEADING_STYLES[level] ?? json.heading ?? ["bold", "cyan", "underline"];
}

export function themeFromJson(json: ThemeJson): MarkdownTheme {
	const baseHeading = styleFn(json.heading ?? ["bold", "cyan"]);
	const styleHeading = (level: number, text: string): string => {
		const clamped = Math.min(6, Math.max(1, level));
		return styleFn(headingStyleKeys(json, clamped))(text);
	};

	return {
		heading: baseHeading,
		styleHeading,
		link: styleFn(json.link ?? ["blue", "underline"]),
		linkUrl: styleFn(json.linkUrl ?? ["dim"]),
		code: styleFn(json.code ?? ["yellow"]),
		codeBlock: styleFn(json.codeBlock ?? ["green"]),
		codeBlockBorder: styleFn(json.codeBlockBorder ?? ["dim"]),
		quote: styleFn(json.quote ?? ["italic"]),
		quoteBorder: styleFn(json.quoteBorder ?? ["dim"]),
		hr: styleFn(json.hr ?? ["dim"]),
		listBullet: styleFn(json.listBullet ?? ["cyan"]),
		bold: styleFn(json.bold ?? ["bold"]),
		italic: styleFn(json.italic ?? ["italic"]),
		strikethrough: styleFn(json.strikethrough ?? ["strikethrough"]),
		underline: styleFn(json.underline ?? ["underline"]),
		codeBlockIndent: json.codeBlockIndent ?? "  ",
	};
}

const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

export function defaultThemePath(): string {
	return path.join(packageRoot, "..", "theme.json");
}

export function loadTheme(themePath?: string): MarkdownTheme {
	const resolved = themePath ?? process.env.CATMD_THEME ?? defaultThemePath();
	const raw = fs.readFileSync(resolved, "utf8");
	const json = JSON.parse(raw) as ThemeJson;
	return themeFromJson(json);
}

export const noopTheme: MarkdownTheme = {
	heading: (text) => text,
	styleHeading: (_level, text) => text,
	link: (text) => text,
	linkUrl: (text) => text,
	code: (text) => text,
	codeBlock: (text) => text,
	codeBlockBorder: (text) => text,
	quote: (text) => text,
	quoteBorder: (text) => text,
	hr: (text) => text,
	listBullet: (text) => text,
	bold: (text) => text,
	italic: (text) => text,
	strikethrough: (text) => text,
	underline: (text) => text,
	codeBlockIndent: "  ",
};

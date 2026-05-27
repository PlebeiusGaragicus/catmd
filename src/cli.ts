#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { renderMarkdown } from "./render/markdown.js";
import { loadTheme, noopTheme } from "./render/theme.js";

function usage(): never {
	console.error(`usage: catmd [--width N] [--no-color] [--no-hyperlinks] [--theme PATH] [file ...]

Read markdown from files or stdin (-).`);
	process.exit(1);
}

function parseArgs(argv: string[]): {
	paths: string[];
	width?: number;
	noColor: boolean;
	noHyperlinks: boolean;
	themePath?: string;
} {
	const paths: string[] = [];
	let width: number | undefined;
	let noColor = false;
	let noHyperlinks = false;
	let themePath: string | undefined;

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg === "--") {
			paths.push(...argv.slice(i + 1));
			break;
		}
		if (arg === "-h" || arg === "--help") {
			usage();
		}
		if (arg === "--no-color") {
			noColor = true;
			continue;
		}
		if (arg === "--no-hyperlinks") {
			noHyperlinks = true;
			continue;
		}
		if (arg === "--width") {
			const next = argv[++i];
			if (!next) usage();
			width = Number.parseInt(next, 10);
			if (!Number.isFinite(width) || width < 1) {
				console.error("catmd: --width requires a positive integer");
				process.exit(1);
			}
			continue;
		}
		if (arg === "--theme") {
			const next = argv[++i];
			if (!next) usage();
			themePath = path.resolve(next);
			continue;
		}
		if (arg.startsWith("-") && arg !== "-") {
			console.error(`catmd: unknown option ${arg}`);
			usage();
		}
		paths.push(arg);
	}

	return { paths, width, noColor, noHyperlinks, themePath };
}

function readInput(paths: string[]): string {
	if (paths.length === 0 || (paths.length === 1 && paths[0] === "-")) {
		return fs.readFileSync(0, "utf8");
	}

	const parts: string[] = [];
	for (const filePath of paths) {
		if (filePath === "-") {
			parts.push(fs.readFileSync(0, "utf8"));
		} else {
			parts.push(fs.readFileSync(filePath, "utf8"));
		}
	}
	return parts.join("\n");
}

function main(): void {
	const args = parseArgs(process.argv.slice(2));
	const termWidth = args.width ?? process.stdout.columns ?? 80;
	const useColor = !args.noColor && !process.env.NO_COLOR;

	let theme;
	try {
		theme = useColor ? loadTheme(args.themePath) : noopTheme;
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		console.error(`catmd: failed to load theme: ${message}`);
		process.exit(1);
	}

	let source: string;
	try {
		source = readInput(args.paths);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		console.error(`catmd: ${message}`);
		process.exit(1);
	}

	const lines = renderMarkdown(source, termWidth, theme, {
		hyperlinks: args.noHyperlinks ? false : undefined,
	});

	for (const line of lines) {
		console.log(line);
	}
}

main();

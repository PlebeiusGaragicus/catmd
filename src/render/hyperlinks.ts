export interface TerminalCapabilities {
	hyperlinks: boolean;
}

let cachedCapabilities: TerminalCapabilities | null = null;
let overrideCapabilities: TerminalCapabilities | null = null;

export function detectCapabilities(): TerminalCapabilities {
	const termProgram = process.env.TERM_PROGRAM?.toLowerCase() || "";
	const term = process.env.TERM?.toLowerCase() || "";
	const colorTerm = process.env.COLORTERM?.toLowerCase() || "";

	const inTmuxOrScreen = !!process.env.TMUX || term.startsWith("tmux") || term.startsWith("screen");
	if (inTmuxOrScreen) {
		return { hyperlinks: false };
	}

	if (process.env.KITTY_WINDOW_ID || termProgram === "kitty") {
		return { hyperlinks: true };
	}

	if (termProgram === "ghostty" || term.includes("ghostty") || process.env.GHOSTTY_RESOURCES_DIR) {
		return { hyperlinks: true };
	}

	if (process.env.WEZTERM_PANE || termProgram === "wezterm") {
		return { hyperlinks: true };
	}

	if (process.env.ITERM_SESSION_ID || termProgram === "iterm.app") {
		return { hyperlinks: true };
	}

	if (termProgram === "vscode") {
		return { hyperlinks: true };
	}

	if (termProgram === "alacritty") {
		return { hyperlinks: true };
	}

	if (colorTerm === "truecolor" || colorTerm === "24bit") {
		return { hyperlinks: false };
	}

	return { hyperlinks: false };
}

export function getCapabilities(): TerminalCapabilities {
	if (overrideCapabilities) {
		return overrideCapabilities;
	}
	if (!cachedCapabilities) {
		cachedCapabilities = detectCapabilities();
	}
	return cachedCapabilities;
}

export function setCapabilities(caps: TerminalCapabilities): void {
	overrideCapabilities = caps;
}

export function resetCapabilitiesCache(): void {
	cachedCapabilities = null;
	overrideCapabilities = null;
}

export function hyperlink(text: string, url: string): string {
	return `\x1b]8;;${url}\x1b\\${text}\x1b]8;;\x1b\\`;
}

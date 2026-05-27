# catmd

`cat` for Markdown — render `.md` files in the terminal with colors, underlined headings, tables, and clickable links.

Inspired by the [pi](https://github.com/badlogic/pi-mono) coding agent’s markdown display.

## Usage

```bash
catmd README.md
catmd notes.md docs/guide.md
echo "# Hello" | catmd
```

Options:

- `--no-color` — plain output
- `--no-hyperlinks` — no OSC 8 terminal links
- `--theme PATH` — custom `theme.json` (default: bundled theme; override with `CATMD_THEME`)

Try the showcase file:

```bash
catmd EXAMPLE.md
```

## Install with Homebrew

Installed from GitHub via [PlebeiusGaragicus/tap](https://github.com/PlebeiusGaragicus/homebrew-tap). No npm package registry.

```bash
brew tap PlebeiusGaragicus/tap
brew install catmd
```

Update:

```bash
brew update
brew upgrade catmd
```

Requires [Homebrew](https://brew.sh) and Node.js 22+ (installed automatically by the formula).

## Developing

See [AGENTS.md](AGENTS.md) for releases (git tags + tap formula) and how to verify with `brew upgrade catmd`.

## Version

Current release: **0.1.0** — see [`VERSION`](VERSION) and [tags](https://github.com/PlebeiusGaragicus/catmd/tags).

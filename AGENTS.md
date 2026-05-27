# Agent instructions

## How we install and run catmd

**Do not install catmd locally for day-to-day use or verification.**

Avoid:

- `npm link` / `npm install -g .`
- `npm run catmd` or `node dist/cli.js` to test changes on the CLI
- `brew install` from a local path or formula file in this repo
- Any workflow that puts a dev build on `PATH` instead of the Homebrew install

**Use the same path as end users:** GitHub → Homebrew tap → `catmd` on `PATH`.

## Development workflow

1. Edit code in this repo (`src/`, `theme.json`, etc.).
2. Run tests in the repo if needed: `npm install` (once), `npm test` — this is only for the test runner, not for running `catmd`.
3. Commit and **push to `main`** on `github.com/PlebeiusGaragicus/catmd`.
4. Refresh the installed CLI:

   ```bash
   brew update
   brew reinstall catmd --HEAD
   ```

5. Verify like a user:

   ```bash
   catmd EXAMPLE.md
   ```

If behavior does not match expectations, fix the code, push again, and repeat `brew update` / `brew reinstall catmd --HEAD`. Do not fall back to a local `npm run catmd` shortcut.

## Homebrew tap

The formula lives in the separate **`homebrew-tap`** repo (`PlebeiusGaragicus/homebrew-tap`). The `--HEAD` install builds from `catmd` `main` on each reinstall.

Only change the tap when install steps change (new dependency, new files to install, env vars). Ordinary code changes only require a push to `catmd` and `brew reinstall catmd --HEAD`.

## Version

Bump [`VERSION`](VERSION) (and keep it in sync with `package.json` if you change version there) when making a release-worthy change worth noting.

## Summary

| Task | Command |
|------|---------|
| Test renderer | `npm test` (in repo) |
| Ship + verify CLI | `git push` → `brew update` → `brew reinstall catmd --HEAD` → `catmd …` |
| Do not use | `npm run catmd`, `npm link`, local `brew install ./…` |

# Agent instructions

## How we install and run catmd

**Do not install catmd locally for day-to-day use or verification.**

Avoid:

- `npm link` / `npm install -g .`
- `npm run catmd` or `node dist/cli.js` to test the CLI
- `brew install` from a local path or formula file in this repo
- `brew install catmd --HEAD` (we ship versioned releases, not HEAD-only)

**Use the same path as end users:** git tag → Homebrew tap formula → `brew install catmd` / `brew upgrade catmd`.

## Repos

| Repo | Purpose |
|------|---------|
| `PlebeiusGaragicus/catmd` | Source, tests, `VERSION`, git tags |
| `PlebeiusGaragicus/homebrew-tap` | `Formula/catmd.rb` — `url` + `sha256` per release |

The [`homebrew-tap/`](homebrew-tap/) folder in this repo is the **template** for the tap. After changing the formula for a release, copy it to the tap repo and push.

## Day-to-day development

1. Edit code (`src/`, `theme.json`, etc.).
2. Run tests in this repo (not the installed CLI):

   ```bash
   npm install   # once
   npm test
   ```

3. Commit and push to `main`.

Pushing `main` alone does **not** update what users get from Homebrew. Users install **tagged versions** only.

## Releasing a new version

Do this when a change should be installable via `brew install` / `brew upgrade`.

### 1. Bump version

Update both:

- [`VERSION`](VERSION) — e.g. `0.1.1`
- [`package.json`](package.json) `"version"` — same value

Commit on `main` and push.

### 2. Tag the release

Tag must match `VERSION` with a `v` prefix:

```bash
git tag -a v0.1.1 -m "v0.1.1"
git push origin main
git push origin v0.1.1
```

### 3. Compute the tarball checksum

After the tag exists on GitHub:

```bash
curl -sL "https://github.com/PlebeiusGaragicus/catmd/archive/refs/tags/v0.1.1.tar.gz" | shasum -a 256
```

Or from a clean local tree (before pushing tag):

```bash
git archive --format=tar.gz --prefix=catmd-0.1.1/ v0.1.1 | shasum -a 256
```

### 4. Update the Homebrew formula

In [`homebrew-tap/Formula/catmd.rb`](homebrew-tap/Formula/catmd.rb) (then sync to `PlebeiusGaragicus/homebrew-tap`):

```ruby
url "https://github.com/PlebeiusGaragicus/catmd/archive/refs/tags/v0.1.1.tar.gz"
sha256 "<checksum from step 3>"
```

Copy the file to the tap repo, commit, and push:

```bash
cp homebrew-tap/Formula/catmd.rb /path/to/homebrew-tap/Formula/catmd.rb
cd /path/to/homebrew-tap && git add Formula/catmd.rb && git commit -m "catmd 0.1.1" && git push
```

### 5. Install or upgrade like a user

```bash
brew update
brew upgrade catmd
# first-time install:
# brew tap PlebeiusGaragicus/tap && brew install catmd
```

### 6. Verify

```bash
catmd EXAMPLE.md
```

Do not use `npm run catmd` to verify releases.

## First release (v0.1.0) checklist

Do this once to move off HEAD-only installs:

1. **Commit and push** all changes on `catmd` `main` (including `homebrew-tap/Formula/catmd.rb` template in this repo).
2. **Tag** that commit: `git tag -a v0.1.0 -m "v0.1.0"` → `git push origin v0.1.0`.
3. **Checksum** (tag must exist on GitHub):

   ```bash
   curl -sL "https://github.com/PlebeiusGaragicus/catmd/archive/refs/tags/v0.1.0.tar.gz" | shasum -a 256
   ```

4. Put the `url` and `sha256` into [`homebrew-tap/Formula/catmd.rb`](homebrew-tap/Formula/catmd.rb), **copy** to `PlebeiusGaragicus/homebrew-tap`, commit, and push (replaces any HEAD-only formula).
5. **Install:** `brew update && brew install catmd` (no `--HEAD`).

The `sha256` in the template may not match until steps 1–3 are done on the same commit — always recompute after tagging.

## When to change the formula vs only the tag

| Change | Action |
|--------|--------|
| Code, theme, docs | New tag + bump `url`/`sha256` in formula |
| New npm dependency, install paths, `node` version | Same, and edit formula `install` block |
| Typo in README only | No release required unless you want to |

## Summary

| Task | Command |
|------|---------|
| Test | `npm test` |
| Ship | bump `VERSION` → push `main` → `git tag vX.Y.Z` → push tag → update formula `url`/`sha256` → push tap → `brew update && brew upgrade catmd` |
| Verify | `catmd EXAMPLE.md` |
| Do not use | `npm run catmd`, `npm link`, `brew install --HEAD catmd` |

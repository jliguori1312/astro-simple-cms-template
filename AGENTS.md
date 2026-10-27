> **Keep this file accurate.** If a change makes anything here stale — a command, a
> pinned version, a default, an installed dependency, a policy setting — update this
> file in that same change. A stale `AGENTS.md` actively misleads; delete an outdated
> claim rather than leaving it in place.

## Starting Work

`main` is protected by a ruleset requiring pull requests, so direct pushes to it are
rejected. Every piece of work starts the same way:

1. **Confirm the tree is clean** — `git status --short`. If anything is modified, staged,
   or untracked, **stop and ask**. Do not stash it, discard it, commit it, or work around
   it. Uncommitted work belongs to the user, not to the current task.
2. **Confirm the branch fits the work.** If already on a feature branch for this task,
   keep using it.
3. **Otherwise branch off a fresh `main`:** `git switch main && git pull --ff-only`, then
   create the branch as `<type>/<short-slug>`, reusing the Conventional Commit type
   (`feat/hero-video`, `fix/nav-scroll`, `chore/dependabot-config`).

Then proceed, leaving commits alone until asked. Uncommitted changes on a feature branch
are the normal resting state — they become a PR when requested.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Project

Static site template for use with simple-cms (https://github.com/jliguori1312/simple-cms). [Replace with specific project details.] No CMS runtime, no dynamic rendering.

- **Astro 7** — `output: 'static'` only. Never introduce SSR or server endpoints.
- **Tailwind CSS 4** via `@tailwindcss/vite`. Not `@astrojs/tailwind` — do not add it.
- **Starwind UI v3** for any UI primitive. Installed: `button`, `dialog`.
- **Cloudflare Workers** for hosting (`@astrojs/cloudflare`, `mode: 'static'`), wired at
  deploy time.
- Node 26, pnpm 12. Both pinned in `package.json` (`engines`, `packageManager`).
  Always `latest` for dependencies.

## Commands

- `pnpm dev` — dev server on :4321. Use `astro dev --background` for background runs.
- `pnpm build` — **the** gate: `astro check && astro build`, output to `dist/`. Must pass
  before any commit. Typecheck runs first so it fails fast and skips the build.
- `pnpm check` — `astro check` alone.
- `pnpm preview` — serve the built output.
- `pnpm install --frozen-lockfile` — what CI runs. Verify with this, not plain install.

Package manager is **pnpm only**. Never run `npm` or `yarn`; never commit a foreign
lockfile. `pnpm-workspace.yaml` is the settings file — pnpm 12 ignores a `pnpm` field in
`package.json`.

Do not run `pnpm up --latest`. Dependency updates are Dependabot's job (see below); a
manual `--latest` bump skips review and can cross several majors at once.

## Dependencies & Supply Chain

`pnpm-workspace.yaml` holds the policy. Every setting in it is load-bearing.

- `minimumReleaseAge: 4320` — 3 days, matching Dependabot's default cooldown so both
  layers agree on what is old enough. Do not lower it.
  **Raising it invalidates existing lockfile entries.** pnpm then refuses to install
  (`ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`). Fix by re-resolving, not by excluding:
  `pnpm clean --lockfile && pnpm install`, then commit the new lockfile.
- `trustPolicy: no-downgrade` — rejects a package whose publisher trust regressed, which
  is the pattern behind maintainer-account-phishing attacks. Do not add
  `trustPolicyExclude` entries without a specific reason.
- `allowBuilds` — every entry is a package allowed to run code at install time. Keep it
  minimal. Adding one is a security decision, not a convenience; evaluate the package
  before allowlisting.

Toolchain is pinned: Node `26.12.1` in `.nvmrc` and `.node-version`, pnpm `12.16.0` in
`packageManager`. Cloudflare's build image preinstalls only Node 22 and 24, so `.nvmrc`
is what makes Node 26 work in CI. Bump those files and `engines` together.

## Maintenance Automation

Dependabot handles dependency updates. There are no GitHub Actions workflows, and none
should be added solely for dependency management.

`.github/dependabot.yml` runs monthly on npm only:

- `patch` group — auto-merge eligible.
- `minor` group — one PR per month, reviewed before merging.
- majors — ungrouped, arrive individually, always human-reviewed.
- Cooldown is not configured: 3 days is Dependabot's default for version updates.
- Security updates ignore the schedule and the groups, so CVEs are never delayed by it.

Auto-merge is **native and per-PR** — there is no workflow. It relies entirely on the
Workers Builds status check being a *required* check on `main`. If that requirement is
removed, auto-merge will merge broken PRs. Never enable auto-merge on a patch PR unless
that required check is in place.

Only patches may be auto-merged. Minors and majors get reviewed, because `pnpm build`
catches type errors but not visual regressions — and visual correctness is this project's
real risk.

When a workflow is eventually added, add the `github-actions` ecosystem to
`dependabot.yml` so pinned action SHAs stay current.

## Code Conventions

**No semicolons** unless one is genuinely required (a line starting with `(`, `[`, `` ` ``,
`/`, `+`, or `-` where automatic semicolon insertion would break). Exception:
`src/components/starwind/**` is generated Starwind source — leave its formatting
untouched so `starwind update --diff` stays readable.

- Indentation: match the file. `.astro` uses tabs, TypeScript uses 2 spaces.
- **Do not declare types that inference already provides, or that already exist.** No
  redundant interfaces, no hand-written types for data a library already types, no
  `any`. Let `Astro.props`, imports, and `as const` do the work.
- **Do not reimplement what Starwind, Astro, or Tailwind already give you.** Reach for an
  existing component, utility, or variant before writing markup or logic.
- **DRY.** Repeated markup becomes a component; repeated values become one source of
  truth. Do not abstract a thing used once.
- Prefer plain `<script>` inside `.astro` components for interactivity. Only add a
  framework island (Vue) if the interaction genuinely cannot be done without it.
- Comments explain *why*, never *what*. Delete the comment if the code already says it.
  Never narrate change history ("now", "previously") or address a reviewer.

## Styling

Everything routes through Tailwind utilities and Starwind components. No CSS files
beyond `src/styles/starwind.css`, no inline `style` attributes to fake layout.

- Design values live in the design, not in this file. Mirror them as `--color-*`,
  `--font-*`, and spacing tokens in the `@theme` block of `src/styles/starwind.css`,
  then use the generated utilities.
- Change a global value once, in the token — never patch it per component.
- Compose Starwind variants (`variant`, `size`) before writing appearance overrides.
  Overrides passed via `class` are merged by `tailwind-merge`, so they do win.
- Do not add visual effects (blur, shadow, animation) the design has not specified.

## Design Fidelity

The Penpot design is the spec. Reproduce its spacing, type scale, colors, and layer
order exactly.

- Deviate only where following the design literally would break the build, break
  semantics, or be non-responsive — and only when the deviation is visually
  indistinguishable. State the deviation and why.
- Never transcribe design values (hex codes, font sizes, paddings, copy) into this file
  or into a component. Read them from the design and express them as tokens/utilities.
- Keep decorative layers decorative: scrims and background media are `aria-hidden`.
- Background video must be `muted autoplay loop playsinline` with a `poster` fallback.

## Content

All copy and asset paths live in `src/content/site.json`, typed by
`src/data/content.ts`. Components read from that typed export and never hardcode copy.

This file is the CMS seam. simple-cms will eventually write it (or replace the import
with a build-time fetch). Keep the swap contained to `src/data/content.ts` — a content
integration must never require edits to a component.

Static assets go in `public/` and are referenced by root-relative path.

## Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

```
<type>(<optional scope>): <subject>
```

- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`,
  `chore`, `revert`.
- Subject: lowercase, imperative mood, no trailing period, ≤ 72 chars total.
- Scope when it clarifies: `feat(hero): add looping background video`.
- Breaking changes: `!` after the type/scope (`feat(api)!: ...`) and a
  `BREAKING CHANGE:` footer.
- One logical change per commit. Do not mix a dependency bump with a feature.
- Never commit unless explicitly asked to.
- The commit lands on the task branch from **Starting Work**, never on `main`. Push and
  open the PR against `main` only when asked.

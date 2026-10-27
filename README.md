# astro-simple-cms-template

   Astro + Tailwind + Starwind scaffold for a static site, wired to be
   driven by [simple-cms](https://github.com/jliguori1312/simple-cms).

   ## Stack

   - **Astro 7**, `output: 'static'` only — no SSR, no server endpoints
   - **Tailwind CSS 4** via `@tailwindcss/vite`
   - **Starwind UI v3** — `button` and `dialog` preinstalled
   - **Cloudflare Workers** hosting via `@astrojs/cloudflare`
   - Node 26 / pnpm 12, pinned in `.nvmrc`, `.node-version`, `engines`

   ## Commands

   | Command        | Action                                     |
   | :------------- | :----------------------------------------- |
   | `pnpm dev`     | Dev server on :4321                        |
   | `pnpm build`   | `astro check && astro build` → `dist/`     |
   | `pnpm check`   | Typecheck only                             |
   | `pnpm preview` | Serve the built output                     |

   ## The content seam

   All copy lives in `src/content/site.json`. `src/data/content.ts` imports it, types
   it, and resolves image filenames against `src/assets/images/`. Components read the
   typed `site` export and never hardcode copy — so simple-cms can replace
   `src/content/site.json` (or the import) without touching a component.

   ## Using this template

   ```sh
   gh repo create my-site --template jliguori1312/astro-simple-cms-template --private --clone
   cd my-site
   pnpm install --frozen-lockfile
   pnpm build
 ```

 Then edit src/content/site.json and replace the placeholder name in package.json.

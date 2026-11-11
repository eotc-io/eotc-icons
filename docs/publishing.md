# Publishing

The package is released from GitHub Actions; the site is built and deployed
by Cloudflare.

## npm

- Workflow: `.github/workflows/release.yml`

Releases use npm's [staged publishing](https://docs.npmjs.com/staged-publishing):
CI only stages a version, and it goes live when a maintainer approves it with
2FA. No npm token is stored anywhere.

1. Bump `version` in `package.json` and commit.
2. `git tag v<version> && git push origin v<version>`, e.g. `v0.1.1` (the tag must match the
   version). The workflow tests the package and stages it, with provenance.
3. On npmjs.com, open the package's **Staged Packages** tab, review the
   version and **Approve** it (or run `npm stage approve <stage-id>`).

One-time setup (needs 2FA on your npm account and npm 11.15.0 or newer):

1. Stage the first release from your machine: `pnpm test`, then
   `npm stage publish --access public`, and approve it on npmjs.com. This
   creates the package (npm shows a `0.0.0-stage` placeholder until you
   approve).
2. In the package's settings on npmjs.com, add a trusted publisher: GitHub
   Actions, repository `eotc-io/eotc-icons`, workflow `release.yml`, allowed
   to stage only.

## icons.eotc.io

- Config: `wrangler.jsonc`

Cloudflare builds and deploys the site from GitHub on every push to `main`
(Workers Builds): it runs `pnpm site` and serves `site/dist` from a Worker.
No workflow or token lives in this repo.

One-time setup:

1. In Cloudflare, go to **Workers & Pages → Create → Import a repository**,
   connect GitHub and pick `eotc-io/eotc-icons`.
2. Set the **build command** to `pnpm site` and leave the **deploy command**
   as `npx wrangler deploy` (it reads `wrangler.jsonc`). The production
   branch is `main`.
3. In the Worker's **Settings → Domains & Routes**, add the custom domain
   `icons.eotc.io`.

Node comes from `.node-version` and pnpm from `packageManager` in
`package.json`. If the first build log shows another pnpm version or an
install error, set the build command to
`corepack enable && pnpm install --frozen-lockfile && pnpm site`.

To look at the site locally: `pnpm site`, then open `site/dist/index.html`.

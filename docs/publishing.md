# Publishing

Both run from GitHub Actions once set up.

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

- Workflow: `.github/workflows/site.yml`

Every push to `main` builds the site (`pnpm site`) and deploys `site/dist`
to Cloudflare Pages.

One-time setup:

1. In Cloudflare, create a Pages project named `eotc-icons` (Workers & Pages
   → Create → Pages → Direct Upload).
2. Create an API token with the **Cloudflare Pages: Edit** permission, and
   add it to the repo as the Actions secret `CLOUDFLARE_API_TOKEN`; add your
   account ID as `CLOUDFLARE_ACCOUNT_ID`.
3. In the Pages project, add the custom domain `icons.eotc.io`.

To look at the site locally: `pnpm site`, then open `site/dist/index.html`.

## Shared Library
* The shared library contains codes that are used acrossed the microservices.
* The idea behind this was to prevent code duplication.
* The library is published as an npm package to `github package registry`.
* You need to publish this `shared library` to `github package registry` to be able to use it.

### Steps required to publish your package

This package lives inside the single `jobber_app` monorepo (not a separate repo) and is
published from here directly — `npm publish` only looks at this folder's `package.json`
and `files`, so it doesn't matter what else is in the repo around it.

**Publishing happens automatically**: `.github/workflows/publish.yml` builds, lints and
publishes on every push to `main` that touches this folder (using the repo's own
`GITHUB_TOKEN`, not a personal token). A PR touching this folder only runs the build/lint
check, never a publish — publishing fires once that PR is merged to `main`. Every change
here therefore needs `package.json`'s `version` bumped before merging, or the publish step
fails outright (GitHub Packages rejects re-publishing an existing version number):
`npm version patch` (or `minor`/`major`) from this folder, which also commits the bump.

Publish manually only when testing locally, outside CI:

* Create a GitHub **personal access token** (Settings, Developer settings,
  Personal access tokens, Tokens with the `read:packages` and `write:packages`
  scopes. GitHub Packages does not support fine-grained PATs for the npm registry.
* Export it in your shell before publishing or installing (not persisted across terminal
  sessions, so you'll re-run this each time): `export JOBBER_NPM_TOKEN=<your token>`
* `.npmrc` in this folder (already set up):
```sh
@<your-github-username>:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${JOBBER_NPM_TOKEN}
```
  The registry URL has no owner/org path segment — only the `@scope` prefix carries it.
* `package.json`'s `name`, `author` and `repository` already point at this project; update
  them if you fork this package under a different account.
* `cd microservices/9-jobber-shared && npm publish` — same version-bump rule applies; a
  manual publish of a version already live on the registry fails the same way CI's would.

## Build

`npm run build` compiles `src/` to `build/` with plain `tsc` (CommonJS, matching every other
service). There is no separate Babel/ESM build step.

## Import
Whenever you make any change to the shared library folder, make sure to increment the `version` number inside `package.json` file.
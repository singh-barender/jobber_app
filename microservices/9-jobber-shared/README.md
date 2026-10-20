## Shared Library
* The shared library contains codes that are used acrossed the microservices.
* The idea behind this was to prevent code duplication.
* The library is published as an npm package to `github package registry`.
* You need to publish this `shared library` to `github package registry` to be able to use it.

### Steps required to publish your package

This package lives inside the single `jobber_app` monorepo (not a separate repo) and is
published from here directly — `npm publish` only looks at this folder's `package.json`
and `files`, so it doesn't matter what else is in the repo around it.

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
* No GitHub Actions workflow is set up yet in this project — publish manually for now:
  `cd microservices/9-jobber-shared && npm publish`.

## Build

`npm run build` compiles `src/` to `build/` with plain `tsc` (CommonJS, matching every other
service). There is no separate Babel/ESM build step.

## Import
Whenever you make any change to the shared library folder, make sure to increment the `version` number inside `package.json` file.
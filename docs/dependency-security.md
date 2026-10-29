# Dependency security maintenance

Security changes validated on 2026-10-29. Framework versions remain on the
current NestJS 11, Nx 22, Vite 7 and Vitest 4 branches.

## Corrected dependency chains

| Dependency                       | Correction                                                                                    |
| -------------------------------- | --------------------------------------------------------------------------------------------- |
| Docusaurus → tinypool            | Scoped override to 2.1.2, which fixes the worker option prototype-pollution vulnerabilities.  |
| launch-editor → shell-quote      | Updated to 1.12.0; launch-editor updated to 2.14.2.                                           |
| Nx → axios                       | Scoped override reuses the root Axios 1.21.0 dependency.                                      |
| Nx → follow-redirects            | Scoped override to 1.16.2.                                                                    |
| NestJS platform-express → multer | Scoped override to 2.5.0, preserving the Multer 2 API.                                        |
| Express → body-parser            | Body-parser 2.x overridden to 2.4.0; the separate 1.x copy updated to 1.20.9.                 |
| Webpack → serialize-javascript   | Existing override advanced to 7.1.4.                                                          |
| Other transitive dependencies    | Updated fast-uri 3.1.9, ip-address 10.7.5, postcss-selector-parser 6.1.5/7.1.7 and qs 6.16.2. |

These overrides are temporary compatibility measures until the parent packages
adopt the fixed dependencies. Review them when upgrading those parents.

## Local deepmerge correction

[GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4)
has no published fixed release. The version remains pinned to 4.3.1 and
`patches/deepmerge+4.3.1.patch` corrects its source, CommonJS and UMD builds.
Object merging now defines own data properties instead of invoking an inherited
`__proto__` setter. This preserves ordinary values, arrays, symbols and custom
merge callbacks while preventing the reported prototype poisoning.

`npm ci` and `npm install` apply the patch through
`postinstall: patch-package --error-on-fail`. Do not omit install scripts for
the development/build dependencies: they are required for this local fix.
Installation fails if the patch cannot be applied.

The full npm audit still reports **23 low-severity findings**, all originating
from this one published deepmerge advisory and its dependent packages. npm audit
does not inspect the locally patched source. There are **no critical, high or
moderate findings**. No advisory is ignored or filtered out.

When an upstream fixed version becomes available, upgrade it and remove the
deepmerge pin and patch after the regression tests pass without the patch.
Remove patch-package and the postinstall hook if no other patches require them.

## Regression checks

Validation results under Node 22.23.4:

- A clean installation with strict peer and engine checks succeeded and applied
  the deepmerge patch automatically.
- All six dependency regression tests passed after that clean installation.
- Nx lint and production builds succeeded for all six affected projects.
- Docusaurus also built successfully with SSG worker threads enabled and two
  workers, exercising the updated Tinypool integration. This additional check
  used a temporary configuration; the normal site configuration is unchanged.
- The generated Docker application manifests installed cleanly in a separate
  directory. Their audit reports **zero vulnerabilities** across 317 packages;
  deepmerge and patch-package are absent from that runtime dependency tree.
- All 27 application test suites now pass: 62 frontend tests and 153 API tests.
  The App test exercises routing and navigation. Health indicator tests inject
  mock dependencies and cover healthy, unhealthy, missing-status and error
  responses without loading the ESM Kubernetes client or connecting to a cluster.
  CI runs both application test targets as well as the dependency security tests.
- Frontend type checking produces the same 59 diagnostics as before the
  security changes, with identical output.

```sh
npm ci --strict-peer-deps --engine-strict
npm run test:dependency-security
npx nx affected -t lint,build --base=HEAD --parallel=3
npx nx run-many -t test -p velero-ui,velero-ui-api --parallel=2
npm audit
```

The six dependency tests exercise shell quoting, inherited worker filenames,
and both deepmerge distributions, including ordinary merging behavior. CI runs
them after installation. The security assertions were confirmed to fail with
the original vulnerable dependencies.

Nx caches and the daemon retain their normal settings. The 59 frontend
TypeScript diagnostics were established before these security changes and remain
outside the scope of the test-suite fixes. No production code, package version,
security override or dependency patch was changed to fix the three suites.

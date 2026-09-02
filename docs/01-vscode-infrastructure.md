# Phase 1 — Create the VS Code infrastructure

## Goal

Create a TypeScript extension project that can compile, debug, package, and install without implementing skill-management behavior.

## Required files

```text
.vscode/launch.json
.vscode/tasks.json
.vscodeignore
media/personal-skills.svg
src/extension.ts
src/registerSkillsView.ts
skills/clarify-task/SKILL.md
package.json
tsconfig.json
```

## Procedure

1. Confirm Node.js, npm, and the `code` CLI are available.
2. Install the dependencies declared in `package.json` with `npm install`.
3. Compile TypeScript with `npm run compile`.
4. Treat `out/` and `node_modules/` as generated directories. Do not edit their contents manually.
5. Keep the Activity Bar SVG monochrome and centered in a 24 by 24 view box.

## VS Code typings version

The installed editor can be newer than the newest `@types/vscode` package published to npm. Use the newest published typings version that supports the APIs used by the extension, and set `engines.vscode` to the same compatible minimum. Do not assume an editor build number has a matching npm package.

## Pass criteria

- `npm install` creates `package-lock.json`.
- `npm run compile` exits with code 0.
- `out/src/extension.js` and `out/src/registerSkillsView.js` exist.
- No skill creation, editing, or deletion behavior exists.

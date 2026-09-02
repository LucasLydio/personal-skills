# Phase 2 — Make VS Code recognize the extension

## Goal

Give the extension a stable identity and a valid host entry point.

## Identity contract

```text
Publisher: personal
Name: personal-skills
Extension ID: personal.personal-skills
Display name: Personal Skills
Main entry point: ./out/extension.js
```

## Procedure

1. Validate `package.json` as JSON.
2. Keep `engines.vscode` compatible with the contribution points in use.
3. Confirm `main` points to compiled JavaScript, not TypeScript source.
4. Confirm the package contains an `activate` export.
5. Compile after every manifest or entry-point change.

## Pass criteria

- The manifest parses without errors.
- VS Code shows `Personal Skills` in the Extension Development Host.
- The installed identifier is `personal.personal-skills`.

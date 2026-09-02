# Phase 6 — Install into VS Code

## Goal

Package and install the extension into the normal VS Code profile so no Extension Development Host is required.

## Procedure

Run from the repository root:

```powershell
npm run install:local
```

The script performs these operations:

1. `vsce` invokes `vscode:prepublish` and compiles the extension.
2. `vsce` creates `personal-skills.vsix`.
3. The `code` CLI installs the VSIX with `--force` so the command is repeatable.

After installation, return to the existing VS Code window and run:

```text
Developer: Reload Window
```

Do not open another VS Code window for the installed-extension test.

## Troubleshooting

- If `code` is not recognized, run **Shell Command: Install 'code' command in PATH** where supported, or add the VS Code command directory to `PATH`.
- If the old version remains visible, confirm the VSIX version and run the install command again with `--force`.
- If the view is missing after installation, reload the window and ensure the extension is enabled in the active profile.

## Pass criteria

- `personal-skills.vsix` exists.
- The CLI reports a successful installation.
- Personal Skills works in the existing VS Code window after reload.

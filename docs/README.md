# Personal Skills implementation runbook

This folder is the handoff guide for humans and coding agents working on the Personal Skills VS Code extension.

Follow the phases in order:

1. [`01-vscode-infrastructure.md`](01-vscode-infrastructure.md)
2. [`02-extension-recognition.md`](02-extension-recognition.md)
3. [`03-tiny-entrypoint.md`](03-tiny-entrypoint.md)
4. [`04-contributions.md`](04-contributions.md)
5. [`05-f5-test.md`](05-f5-test.md)
6. [`06-local-installation.md`](06-local-installation.md)
7. [`07-verification.md`](07-verification.md)
8. [`08-skill-discovery.md`](08-skill-discovery.md)
9. [`09-skill-management.md`](09-skill-management.md)

Current implementation evidence is recorded in
[`VERIFICATION-STATUS.md`](VERIFICATION-STATUS.md).

## Scope for this milestone

The milestone provides VS Code infrastructure only. It does not create, edit, delete, import, download, or synchronize personal skills.

The file at `skills/example-skill/SKILL.md` is a recognition fixture. It proves that VS Code can discover a skill bundled in the VSIX through `contributes.chatSkills`.

## Architecture invariants

- Keep `src/extension.ts` as a composition root.
- Put extension behavior in focused modules under `src/`.
- Use the native `chatSkills` contribution for bundled agent skills.
- Do not write mutable user data into the installed extension directory.
- Future user-created skills should use a supported personal location such as `~/.agents/skills/`, or another user-selected location recognized by VS Code.
- Preserve the extension ID `personal.personal-skills` unless a deliberate migration is planned.
- Preserve the view ID `personalSkills.skills`; changing it resets view state and can break activation.

## Standard command sequence

```powershell
npm install
npm run compile
npm run package
npm run install:local
```

After local installation, use **Developer: Reload Window** in the existing VS Code window.

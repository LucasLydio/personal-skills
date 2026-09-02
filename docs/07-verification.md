# Phase 7 — Verify the infrastructure

## Automated checks

Run:

```powershell
npm run compile
npm run package
code --list-extensions --show-versions | Select-String "personal.personal-skills"
```

Inspect the VSIX contents when debugging packaging problems:

```powershell
npx vsce ls
```

The packaged files must include:

- `extension/package.json`
- `extension/out/extension.js`
- `extension/out/registerSkillsView.js`
- `extension/media/personal-skills.svg`
- `extension/skills/example-skill/SKILL.md`
- `extension/README.md`

Development-only files such as `src/`, `.vscode/`, `docs/`, and `tsconfig.json` should not be packaged.

## Manual restart check

1. Close all normal VS Code windows.
2. Start VS Code normally.
3. Confirm the Personal Skills Activity Bar icon still exists.
4. Open the Skills view and run the verification command.
5. Confirm `example-skill` remains available in the agent-skill interface.

## Completion checklist

- [ ] Extension compiles
- [ ] Extension packages into `personal-skills.vsix`
- [ ] Extension installs locally
- [ ] VS Code recognizes `personal.personal-skills`
- [ ] VS Code discovers `example-skill`
- [ ] Activity Bar icon exists
- [ ] Skills sidebar opens
- [ ] Extension activates
- [ ] No second VS Code window is required after installation
- [ ] Extension survives a VS Code restart
- [ ] `npm run install:local` works repeatedly

## Handoff rule

Do not mark this phase complete based only on source inspection. Record which automated checks ran and which UI checks still require a human-visible VS Code session.

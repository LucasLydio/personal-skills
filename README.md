# Personal Skills

Personal Skills discovers and displays agent skills in Visual Studio Code.

Version 0.2 provides:

- a **Personal Skills** Activity Bar container;
- read-only discovery from `~/.agents/skills`;
- Personal and Bundled groups organized by category;
- create, edit, and rename forms for personal skills with visible naming rules;
- open, refresh, activate, deactivate, copy, and confirmed-delete actions;
- persistent category and framework context metadata;
- a configurable **Personal Skills: Skills Directory** setting;
- a verification command;
- one example agent skill through VS Code's native `chatSkills` contribution point.

Bundled skills are immutable extension assets. They can be opened, activated,
deactivated, or copied into Personal skills. Personal skills can additionally be
created, edited, and deleted.

## Development

```powershell
npm install
npm test
```

Press `F5` once to test the extension in an Extension Development Host.

## Local installation

```powershell
npm run install:local
```

Run **Developer: Reload Window** in the current VS Code window after installation.

## Documentation

The source checkout includes the implementation and verification runbook at
`docs/README.md`. Development documentation is intentionally excluded from the
installed VSIX.

## License

Personal Skills is available under the PolyForm Noncommercial License 1.0.0.
You may use, copy, modify, and distribute it for noncommercial purposes.
Commercial use requires separate written permission from the copyright holder.

See `LICENSE` for the complete terms.

# Personal Skills

Personal Skills is a minimal Visual Studio Code extension infrastructure for bundling agent skills.

The first version contributes:

- a **Personal Skills** Activity Bar container;
- a read-only **Skills** tree view;
- a verification command;
- one example agent skill through VS Code's native `chatSkills` contribution point.

## Development

```powershell
npm install
npm run compile
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

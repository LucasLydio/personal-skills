# Phase 8 — Discover personal skills

## Goal

Display real personal agent skills without modifying them. The default location
is `~/.agents/skills`, which is also a native VS Code personal-skill location.

## Behavior

- Scan direct child directories of the configured skills directory.
- Follow directory links when their target contains `SKILL.md`.
- Ignore files and directories that do not contain `SKILL.md`.
- Read `name` and `description` from simple YAML frontmatter.
- Fall back to the directory name when frontmatter has no name.
- Sort discovered skills alphabetically.
- Show Personal and Bundled skills in separate tree groups.
- Open a skill's `SKILL.md` when its tree item or open action is selected.
- Reload discovery from the refresh action or after the directory setting
  changes.

## Configuration

The setting is:

```text
personalSkills.skillsDirectory
```

Its default value is:

```text
~/.agents/skills
```

The extension expands a leading `~` using the current user's home directory.
An empty setting falls back to the default. An absolute custom path is also
supported.

## Safety boundary

Version `0.1.0` is read-only. It does not create, edit, rename, move, download,
or delete skills. User-created skill management belongs in a later phase.

## Automated verification

Run:

```powershell
npm test
npm run package
```

The tests use temporary directories and verify discovery, metadata parsing,
sorting, fallback naming, ignored non-skills, and missing-directory behavior.

## Node type-resolution troubleshooting

The discovery module imports Node built-ins with the `node:` prefix. Keep
`@types/node` in `devDependencies`. The single root `tsconfig.json` uses the
modern matching pair `module: "Node16"` and `moduleResolution: "Node16"`, and
explicitly includes `types: ["node", "vscode"]`. It includes both `src/**/*.ts`
and `test/**/*.ts`, so VS Code and the command-line compiler use the same
project. Compiled tests go to `out/test/` and are excluded from the VSIX.

If VS Code still shows a stale diagnostic while `npm run compile` passes, run
**TypeScript: Restart TS Server** from the Command Palette or reload the window.

## Manual verification

1. Put at least one valid skill in `~/.agents/skills/<name>/SKILL.md`.
2. Install version `0.1.0` with `npm run install:local`.
3. Reload the current VS Code window.
4. Open the Personal Skills sidebar.
5. Expand **Personal** and confirm the skill appears.
6. Select the skill and confirm its `SKILL.md` opens.
7. Use the refresh icon and confirm the list reloads.
8. Change **Personal Skills: Skills Directory** to another absolute directory
   and confirm the view follows the setting.

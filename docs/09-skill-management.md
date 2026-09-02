# Phase 9 — Manage categorized skills

## Goal

Provide a safe interface for creating and maintaining personal skills while
keeping bundled extension assets immutable.

## Supported actions

| Source | Add | Edit | Delete | Open | Activate/deactivate |
| --- | --- | --- | --- | --- | --- |
| Personal | Create | Yes | Yes, after confirmation | Yes | Yes |
| Bundled | Copy to Personal | No | No | Yes | Yes |

Bundled skills are installed extension assets and may be replaced during an
extension update. Editing or deleting them in place is intentionally blocked.

## Categories

Skills can be assigned to General, Backend, Frontend, DevOps, CI/CD, Testing,
Data, Mobile, Security, or Other. An optional framework/context value can hold
names such as React, NestJS, Terraform, or GitHub Actions.

The filesystem remains flat and compatible with native agent discovery:

```text
~/.agents/skills/
└── skill-name/
    ├── SKILL.md
    ├── .personal-skills.json
    ├── scripts/
    ├── references/
    └── assets/
```

`.personal-skills.json` stores only extension presentation metadata:

```json
{
  "category": "backend",
  "framework": "NestJS"
}
```

## Persistent activation

A personal skill is active when its instruction file is named `SKILL.md`.
Deactivation renames that file to `SKILL.md.disabled`; activation restores the
standard name. This state is filesystem-backed and survives window closure and
VS Code restarts.

Bundled skill state is stored in a global VS Code configuration value. The
`chatSkills` contribution uses the matching `when` clause, so the native agent
skill is enabled only when that setting is true.

## Editor form

The create/edit form manages:

- the standard skill name;
- description;
- category;
- optional framework/context;
- Markdown instructions;
- activation state.

Names are immutable after creation because the Agent Skills specification
requires the frontmatter name to match its parent directory. Editing preserves
unrelated frontmatter such as `license`, `compatibility`, and `allowed-tools`.

## Safety behavior

- Names must be lowercase kebab-case and at most 64 characters.
- All mutable paths must be direct children of the configured Personal skills
  directory.
- Linked skills are read-only in the manager.
- Deletion always shows a modal confirmation and states that the entire folder
  will be removed.
- Bundled files cannot be edited or deleted.
- The extension never nests skill folders under category folders.

## Verification

Run:

```powershell
npm test
npm run package
```

Then install, reload VS Code, and manually test one skill through the full
create, edit, deactivate, restart, reactivate, and confirmed-delete lifecycle.

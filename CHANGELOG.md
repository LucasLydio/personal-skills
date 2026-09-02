# Changelog

## 0.2.0

- Add a form for creating and editing personal skills.
- Organize Personal and Bundled skills into General, Backend, Frontend, DevOps,
  CI/CD, Testing, Data, Mobile, Security, and Other categories.
- Store category and framework context in a portable per-skill sidecar file.
- Add persistent activate/deactivate controls.
- Add open, copy-to-personal, and confirmed-delete actions.
- Treat linked personal skills as read-only for safe path handling.
- Expand lifecycle and path-safety tests.

## 0.1.1

- Replace legacy Node module resolution with TypeScript's Node16 mode.
- Compile source and tests from one root `tsconfig.json`.
- Exclude compiled test files from the packaged extension.

## 0.1.0

- Discover personal skills from `~/.agents/skills` or a configured directory.
- Group Personal and Bundled skills separately in the sidebar.
- Open a skill's `SKILL.md` directly from the tree.
- Refresh skill discovery from the view title.
- Add automated discovery tests.

## 0.0.1

- Add the initial VS Code extension infrastructure.
- Contribute the Personal Skills Activity Bar container and Skills view.
- Bundle an example skill through the native `chatSkills` contribution.

# Phase 4 — Configure VS Code contributions

## Goal

Register the Activity Bar container, Skills view, verification command, and bundled agent skill declaratively.

## Contribution identifiers

| Purpose | Identifier |
| --- | --- |
| View container | `personalSkills` |
| Skills view | `personalSkills.skills` |
| Verify command | `personalSkills.verifyInstallation` |
| Bundled skill | `skills/example-skill/SKILL.md` |

## Procedure

1. Register `personalSkills` under `contributes.viewsContainers.activitybar`.
2. Register `personalSkills.skills` under `contributes.views.personalSkills`.
3. Register the verification command under `contributes.commands`.
4. Put the command in the Skills view title menu.
5. Register each bundled skill explicitly under `contributes.chatSkills`.
6. For every skill, make the YAML `name` exactly match the skill directory name.
7. Keep contributed skill paths inside the extension root.

## Adding another bundled skill later

Create `skills/<skill-name>/SKILL.md`, then add:

```json
{
  "path": "./skills/<skill-name>/SKILL.md"
}
```

to `contributes.chatSkills`.

Bundled skills are immutable extension assets. They are not the correct destination for skill content created interactively by a user.

## Pass criteria

- The Personal Skills icon appears in the Activity Bar.
- The Skills view opens without a missing-provider error.
- `example-skill` is discoverable in VS Code's agent-skill interface.
- Running **Personal Skills: Verify Installation** shows an active status.

# Phase 5 — Test once with F5

## Goal

Perform the one development-host smoke test before installing the VSIX into the normal VS Code instance.

## Procedure

1. Open the repository root in VS Code.
2. Run `npm install` if dependencies are not installed.
3. Run `npm run compile`.
4. Press `F5` and select **Run Personal Skills Extension** if prompted.
5. In the Extension Development Host, select the Personal Skills Activity Bar icon.
6. Confirm the Skills view displays `example-skill` with the `bundled` description.
7. Select the check icon in the view title or run **Personal Skills: Verify Installation**.
8. Open the Output panel, select **Personal Skills**, and confirm `Personal Skills activated.` appears.
9. Open the agent customization Skills interface or type `/skills` in Chat and locate `example-skill`.
10. Stop the debug session and close the Extension Development Host.

## Expected behavior

F5 opens a second window because VS Code isolates extension debugging in an Extension Development Host. This is expected only for this phase.

## Pass criteria

- No activation error is reported.
- The Activity Bar container and Skills view render.
- The verify command reports version `0.0.1` as active.
- Native agent-skill discovery finds `example-skill`.

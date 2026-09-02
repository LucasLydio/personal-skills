# Phase 3 — Keep `extension.ts` tiny

## Goal

Keep activation easy to understand and move implementation details into focused modules.

## Entrypoint contract

`src/extension.ts` should only import the registrar and call it from `activate`:

```ts
import type { ExtensionContext } from "vscode";
import { registerSkillsView } from "./registerSkillsView";

export function activate(context: ExtensionContext): void {
  registerSkillsView(context);
}
```

## Rules for future agents

- Do not add tree-provider logic directly to `extension.ts`.
- Do not add filesystem scanning directly to `extension.ts`.
- Add a new registrar or service module when a new responsibility is introduced.
- Push disposables into `context.subscriptions`.
- Add `deactivate` only when explicit asynchronous cleanup is genuinely required.

## Pass criteria

- `extension.ts` remains a small composition root.
- Activation delegates successfully.
- Compilation succeeds with strict TypeScript checks.

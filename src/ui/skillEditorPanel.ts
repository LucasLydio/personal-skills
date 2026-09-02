import { randomBytes } from "node:crypto";
import * as vscode from "vscode";
import {
  SKILL_CATEGORIES,
  SKILL_NAME_VALIDATION_MESSAGE,
  categoryLabel,
  isSkillCategory,
  validateSkillForm,
  type SkillCategory,
  type SkillFormValue,
  type SkillRecord
} from "../domain/skill";

export interface SkillEditorOptions {
  readonly mode: "create" | "edit";
  readonly skill?: SkillRecord;
  readonly initialCategory?: SkillCategory;
}

interface EditorMessage {
  readonly type?: unknown;
  readonly value?: unknown;
}

export async function showSkillEditor(
  options: SkillEditorOptions
): Promise<SkillFormValue | undefined> {
  const panel = vscode.window.createWebviewPanel(
    "personalSkills.skillEditor",
    options.mode === "create" ? "Create Personal Skill" : "Edit Personal Skill",
    vscode.ViewColumn.Active,
    { enableScripts: true }
  );
  const initial = initialValue(options);
  panel.webview.html = renderEditor(panel.webview, options, initial);

  return new Promise((resolve) => {
    let completed = false;

    const finish = (value: SkillFormValue | undefined): void => {
      if (completed) {
        return;
      }
      completed = true;
      resolve(value);
    };

    panel.webview.onDidReceiveMessage(async (message: EditorMessage) => {
      if (message.type === "cancel") {
        finish(undefined);
        panel.dispose();
        return;
      }

      if (message.type !== "save") {
        return;
      }

      const value = parseFormValue(message.value);
      if (!value) {
        await vscode.window.showErrorMessage("The skill form is invalid.");
        return;
      }

      const validationError = validateSkillForm(value);
      if (validationError) {
        await vscode.window.showErrorMessage(validationError);
        return;
      }

      finish(value);
      panel.dispose();
    });

    panel.onDidDispose(() => finish(undefined));
  });
}

function initialValue(options: SkillEditorOptions): SkillFormValue {
  if (options.skill) {
    return {
      name: options.skill.directoryName,
      description: options.skill.description,
      category: options.skill.category,
      framework: options.skill.framework,
      instructions: options.skill.instructions,
      enabled: options.skill.enabled
    };
  }

  return {
    name: "",
    description: "",
    category: options.initialCategory ?? "general",
    framework: "",
    instructions: "# Instructions\n\nDescribe when and how an agent should use this skill.",
    enabled: true
  };
}

function parseFormValue(candidate: unknown): SkillFormValue | undefined {
  if (!isRecord(candidate)) {
    return undefined;
  }

  const category = candidate.category;
  if (
    typeof candidate.name !== "string" ||
    typeof candidate.description !== "string" ||
    typeof candidate.instructions !== "string" ||
    typeof candidate.enabled !== "boolean" ||
    !isSkillCategory(category)
  ) {
    return undefined;
  }

  return {
    name: candidate.name.trim(),
    description: candidate.description.trim(),
    category,
    framework:
      typeof candidate.framework === "string"
        ? candidate.framework.trim()
        : undefined,
    instructions: candidate.instructions.trim(),
    enabled: candidate.enabled
  };
}

function renderEditor(
  webview: vscode.Webview,
  options: SkillEditorOptions,
  value: SkillFormValue
): string {
  const nonce = randomBytes(16).toString("base64");
  const isEdit = options.mode === "edit";
  const categoryOptions = SKILL_CATEGORIES.map(
    (category) =>
      `<option value="${category}"${
        category === value.category ? " selected" : ""
      }>${escapeHtml(categoryLabel(category))}</option>`
  ).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <title>${isEdit ? "Edit" : "Create"} Personal Skill</title>
  <style>
    body { padding: 24px; color: var(--vscode-foreground); background: var(--vscode-editor-background); font-family: var(--vscode-font-family); }
    main { max-width: 820px; margin: 0 auto; }
    h1 { font-size: 1.5rem; margin: 0 0 8px; }
    .hint, .help { color: var(--vscode-descriptionForeground); }
    .hint { margin: 0 0 24px; }
    .help { font-size: .9em; line-height: 1.4; margin: 0; }
    .error { color: var(--vscode-inputValidation-errorForeground, var(--vscode-errorForeground)); min-height: 1.4em; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
    .wide { grid-column: 1 / -1; }
    label { font-weight: 600; }
    input, select, textarea { box-sizing: border-box; width: 100%; color: var(--vscode-input-foreground); background: var(--vscode-input-background); border: 1px solid var(--vscode-input-border, transparent); padding: 8px; font: inherit; }
    input:focus, select:focus, textarea:focus { outline: 1px solid var(--vscode-focusBorder); }
    textarea { min-height: 320px; resize: vertical; font-family: var(--vscode-editor-font-family); }
    .check { flex-direction: row; align-items: center; }
    .check input { width: auto; }
    .actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px; }
    button { border: 0; padding: 8px 16px; color: var(--vscode-button-foreground); background: var(--vscode-button-background); cursor: pointer; }
    button:hover { background: var(--vscode-button-hoverBackground); }
    button.secondary { color: var(--vscode-button-secondaryForeground); background: var(--vscode-button-secondaryBackground); }
    @media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <main>
    <h1>${isEdit ? "Edit personal skill" : "Create personal skill"}</h1>
    <p class="hint">Categories organize the sidebar without changing the native <code>skill-name/SKILL.md</code> layout.</p>
    <form id="skill-form">
      <div class="grid">
        <div class="field">
          <label for="name">Name</label>
          <input id="name" name="name" value="${escapeHtml(value.name)}" pattern="[a-z0-9]+(-[a-z0-9]+)*" maxlength="64" aria-describedby="name-rules name-error" required>
          <p class="help" id="name-rules">Use 1-64 lowercase letters or numbers, with one hyphen between words. No spaces, underscores, uppercase letters, or leading, trailing, or repeated hyphens. Example: <code>nodejs-api-review</code>.</p>
          <p class="help error" id="name-error" role="alert"></p>
        </div>
        <div class="field">
          <label for="category">Category</label>
          <select id="category" name="category">${categoryOptions}</select>
        </div>
        <div class="field wide">
          <label for="description">Description</label>
          <input id="description" name="description" value="${escapeHtml(value.description)}" maxlength="1024" required>
        </div>
        <div class="field wide">
          <label for="framework">Framework or context (optional)</label>
          <input id="framework" name="framework" value="${escapeHtml(value.framework ?? "")}" maxlength="100" placeholder="React, NestJS, Terraform, GitHub Actions...">
        </div>
        <div class="field wide">
          <label for="instructions">Instructions (Markdown)</label>
          <textarea id="instructions" name="instructions">${escapeHtml(value.instructions)}</textarea>
        </div>
        <div class="field check wide">
          <input id="enabled" name="enabled" type="checkbox"${value.enabled ? " checked" : ""}>
          <label for="enabled">Active for agents</label>
        </div>
      </div>
      <div class="actions">
        <button class="secondary" id="cancel" type="button">Cancel</button>
        <button type="submit">${isEdit ? "Save changes" : "Create skill"}</button>
      </div>
    </form>
  </main>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const form = document.getElementById('skill-form');
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    const nameValidationMessage = ${JSON.stringify(SKILL_NAME_VALIDATION_MESSAGE)};
    const validName = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    const validateName = () => {
      const name = nameInput.value.trim();
      const message = name.length <= 64 && validName.test(name)
        ? ''
        : nameValidationMessage;
      nameInput.setCustomValidity(message);
      nameError.textContent = message;
      return message.length === 0;
    };

    nameInput.addEventListener('input', validateName);
    nameInput.addEventListener('invalid', validateName);
    document.getElementById('cancel').addEventListener('click', () => vscode.postMessage({ type: 'cancel' }));
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!validateName() || !form.reportValidity()) {
        return;
      }
      vscode.postMessage({
        type: 'save',
        value: {
          name: form.elements.name.value,
          description: form.elements.description.value,
          category: form.elements.category.value,
          framework: form.elements.framework.value,
          instructions: form.elements.instructions.value,
          enabled: form.elements.enabled.checked
        }
      });
    });
  </script>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entities[character];
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

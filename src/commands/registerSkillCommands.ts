import * as vscode from "vscode";
import { COMMANDS } from "../constants";
import type { SkillCategory } from "../domain/skill";
import {
  copyBundledSkill,
  createPersonalSkill,
  deletePersonalSkill,
  setPersonalSkillEnabled,
  updatePersonalSkill
} from "../services/skillFileService";
import { setBundledSkillEnabled } from "../services/bundledSkillState";
import {
  CategoryTreeItem,
  SkillTreeItem,
  type SkillsTreeProvider
} from "../ui/skillsTreeProvider";
import { showSkillEditor } from "../ui/skillEditorPanel";

export function registerSkillCommands(
  provider: SkillsTreeProvider,
  output: vscode.OutputChannel,
  getPersonalDirectory: () => string
): vscode.Disposable[] {
  return [
    vscode.commands.registerCommand(COMMANDS.refresh, () => provider.refresh()),
    vscode.commands.registerCommand(COMMANDS.open, openSkill),
    vscode.commands.registerCommand(COMMANDS.add, async (item?: unknown) => {
      const category = initialCategory(item);
      const value = await showSkillEditor({
        mode: "create",
        initialCategory: category
      });
      if (!value) {
        return;
      }

      await runSkillAction(output, async () => {
        await createPersonalSkill(getPersonalDirectory(), value);
        provider.refresh();
        await vscode.window.showInformationMessage(
          `Created personal skill '${value.name}'.`
        );
      });
    }),
    vscode.commands.registerCommand(
      COMMANDS.edit,
      async (item: SkillTreeItem | undefined) => {
        if (!isPersonalSkillItem(item)) {
          return;
        }

        const value = await showSkillEditor({ mode: "edit", skill: item.skill });
        if (!value) {
          return;
        }

        await runSkillAction(output, async () => {
          await updatePersonalSkill(getPersonalDirectory(), item.skill, value);
          provider.refresh();
          await vscode.window.showInformationMessage(
            `Updated personal skill '${item.skill.name}'.`
          );
        });
      }
    ),
    vscode.commands.registerCommand(
      COMMANDS.delete,
      async (item: SkillTreeItem | undefined) => {
        if (!isPersonalSkillItem(item)) {
          return;
        }

        const confirmation = await vscode.window.showWarningMessage(
          `Delete personal skill '${item.skill.name}'?`,
          {
            modal: true,
            detail: "The entire skill folder and all of its resources will be permanently deleted."
          },
          "Delete"
        );
        if (confirmation !== "Delete") {
          return;
        }

        await runSkillAction(output, async () => {
          await deletePersonalSkill(getPersonalDirectory(), item.skill);
          provider.refresh();
          await vscode.window.showInformationMessage(
            `Deleted personal skill '${item.skill.name}'.`
          );
        });
      }
    ),
    vscode.commands.registerCommand(
      COMMANDS.toggle,
      async (item: SkillTreeItem | undefined) => {
        if (!item) {
          return;
        }

        await runSkillAction(output, async () => {
          const enabled = !item.skill.enabled;
          if (item.skill.source === "personal") {
            await setPersonalSkillEnabled(
              getPersonalDirectory(),
              item.skill,
              enabled
            );
          } else {
            await setBundledSkillEnabled(item.skill.name, enabled);
          }

          provider.refresh();
          await vscode.window.showInformationMessage(
            `${enabled ? "Activated" : "Deactivated"} '${item.skill.name}'.`
          );
        });
      }
    ),
    vscode.commands.registerCommand(
      COMMANDS.copyBundled,
      async (item: SkillTreeItem | undefined) => {
        if (!item || item.skill.source !== "bundled") {
          return;
        }

        await runSkillAction(output, async () => {
          await copyBundledSkill(getPersonalDirectory(), item.skill);
          provider.refresh();
          await vscode.window.showInformationMessage(
            `Copied '${item.skill.name}' to Personal skills.`
          );
        });
      }
    )
  ];
}

async function openSkill(item: SkillTreeItem | undefined): Promise<void> {
  if (!item) {
    return;
  }

  const document = await vscode.workspace.openTextDocument(
    vscode.Uri.file(item.skill.skillFilePath)
  );
  if (document.languageId !== "markdown") {
    await vscode.languages.setTextDocumentLanguage(document, "markdown");
  }
  await vscode.window.showTextDocument(document, { preview: false });
}

function initialCategory(item: unknown): SkillCategory {
  if (item instanceof CategoryTreeItem && item.source === "personal") {
    return item.category;
  }

  return "general";
}

function isPersonalSkillItem(
  item: SkillTreeItem | undefined
): item is SkillTreeItem {
  return Boolean(
    item && item.skill.source === "personal" && !item.skill.linked
  );
}

async function runSkillAction(
  output: vscode.OutputChannel,
  action: () => Promise<void>
): Promise<void> {
  try {
    await action();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    output.appendLine(`Skill action failed: ${message}`);
    await vscode.window.showErrorMessage(`Personal Skills: ${message}`);
  }
}

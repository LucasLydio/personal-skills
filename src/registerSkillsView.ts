import * as vscode from "vscode";
import { registerClarifyTaskTool } from "./ai/clarifyTaskTool";
import { registerPersonalSkillTool } from "./ai/personalSkillTool";
import { registerSkillCommands } from "./commands/registerSkillCommands";
import { COMMANDS, EXTENSION_ID, VIEW_ID } from "./constants";
import { isBundledSkillEnabled } from "./services/bundledSkillState";
import { resolvePersonalSkillsDirectory } from "./services/skillsDirectory";
import { SkillsTreeProvider } from "./ui/skillsTreeProvider";

export function registerSkillsView(context: vscode.ExtensionContext): void {
  const output = vscode.window.createOutputChannel("Personal Skills");
  const provider = new SkillsTreeProvider(
    context.extensionPath,
    output,
    resolvePersonalSkillsDirectory,
    isBundledSkillEnabled
  );
  output.appendLine("Personal Skills activated.");
  void vscode.commands.executeCommand(
    "setContext",
    "personalSkills.filtersActive",
    false
  );

  const verifyInstallation = vscode.commands.registerCommand(
    COMMANDS.verify,
    async () => {
      const extension = vscode.extensions.getExtension(EXTENSION_ID);
      const version = extension?.packageJSON.version as string | undefined;
      const status = extension?.isActive ? "active" : "installed but inactive";
      await vscode.window.showInformationMessage(
        `Personal Skills ${version ?? "unknown version"} is ${status}.`
      );
    }
  );

  const configurationChanged = vscode.workspace.onDidChangeConfiguration(
    (event) => {
      if (event.affectsConfiguration("personalSkills")) {
        provider.refresh();
      }
    }
  );

  context.subscriptions.push(
    output,
    provider,
    verifyInstallation,
    configurationChanged,
    registerClarifyTaskTool(context, resolvePersonalSkillsDirectory),
    registerPersonalSkillTool(context, resolvePersonalSkillsDirectory),
    vscode.window.registerTreeDataProvider(VIEW_ID, provider),
    ...registerSkillCommands(
      provider,
      output,
      resolvePersonalSkillsDirectory
    )
  );
}

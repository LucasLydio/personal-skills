import * as vscode from "vscode";
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
    vscode.window.registerTreeDataProvider(VIEW_ID, provider),
    ...registerSkillCommands(
      provider,
      output,
      resolvePersonalSkillsDirectory
    )
  );
}

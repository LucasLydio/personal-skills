import * as vscode from "vscode";

const EXTENSION_ID = "personal.personal-skills";
const VIEW_ID = "personalSkills.skills";
const VERIFY_COMMAND_ID = "personalSkills.verifyInstallation";

class SkillsTreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private readonly bundledSkills = [
    new vscode.TreeItem("example-skill", vscode.TreeItemCollapsibleState.None)
  ];

  public getTreeItem(item: vscode.TreeItem): vscode.TreeItem {
    return item;
  }

  public getChildren(): vscode.ProviderResult<vscode.TreeItem[]> {
    const item = this.bundledSkills[0];
    item.description = "bundled";
    item.iconPath = new vscode.ThemeIcon("sparkle");
    item.tooltip = "Bundled recognition skill: skills/example-skill/SKILL.md";
    return this.bundledSkills;
  }
}

export function registerSkillsView(context: vscode.ExtensionContext): void {
  const output = vscode.window.createOutputChannel("Personal Skills");
  output.appendLine("Personal Skills activated.");

  const verifyInstallation = vscode.commands.registerCommand(
    VERIFY_COMMAND_ID,
    async () => {
      const extension = vscode.extensions.getExtension(EXTENSION_ID);
      const version = extension?.packageJSON.version as string | undefined;
      const status = extension?.isActive ? "active" : "installed but inactive";

      await vscode.window.showInformationMessage(
        `Personal Skills ${version ?? "unknown version"} is ${status}.`
      );
    }
  );

  context.subscriptions.push(
    output,
    verifyInstallation,
    vscode.window.registerTreeDataProvider(VIEW_ID, new SkillsTreeProvider())
  );
}

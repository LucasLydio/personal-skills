import * as path from "node:path";
import * as vscode from "vscode";
import { COMMANDS } from "../constants";
import {
  SKILL_CATEGORIES,
  categoryLabel,
  type SkillCategory,
  type SkillRecord,
  type SkillSource
} from "../domain/skill";
import { discoverSkills } from "../services/skillFileService";

export type SkillsTreeNode =
  | SourceTreeItem
  | CategoryTreeItem
  | SkillTreeItem
  | MessageTreeItem;

export class SourceTreeItem extends vscode.TreeItem {
  public constructor(
    label: string,
    public readonly source: SkillSource,
    public readonly skills: readonly SkillRecord[]
  ) {
    super(label, vscode.TreeItemCollapsibleState.Expanded);
    this.description = `${skills.length}`;
    this.contextValue = `personalSkills.source.${source}`;
    this.iconPath = new vscode.ThemeIcon(
      source === "personal" ? "person" : "package"
    );
  }
}

export class CategoryTreeItem extends vscode.TreeItem {
  public constructor(
    public readonly source: SkillSource,
    public readonly category: SkillCategory,
    public readonly skills: readonly SkillRecord[]
  ) {
    super(categoryLabel(category), vscode.TreeItemCollapsibleState.Expanded);
    this.description = `${skills.length}`;
    this.contextValue = `personalSkills.category.${source}`;
    this.iconPath = new vscode.ThemeIcon(categoryIcon(category));
  }
}

export class SkillTreeItem extends vscode.TreeItem {
  public constructor(public readonly skill: SkillRecord) {
    super(skill.name, vscode.TreeItemCollapsibleState.None);
    const state = skill.enabled ? "active" : "inactive";
    this.description = skill.framework
      ? `${skill.framework} • ${state}`
      : state;
    this.contextValue = skillContextValue(skill);
    this.iconPath = new vscode.ThemeIcon(
      skill.enabled ? "pass-filled" : "circle-slash"
    );
    this.tooltip = [
      skill.description,
      `Category: ${categoryLabel(skill.category)}`,
      skill.framework ? `Framework: ${skill.framework}` : undefined,
      `Source: ${skill.source}`,
      `State: ${state}`,
      skill.linked ? "Linked skill (read-only)" : undefined,
      skill.skillFilePath
    ]
      .filter((value): value is string => Boolean(value))
      .join("\n\n");
    this.command = {
      command: COMMANDS.open,
      title: "Open Skill",
      arguments: [this]
    };
  }
}

class MessageTreeItem extends vscode.TreeItem {
  public constructor(label: string) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.contextValue = "personalSkills.message";
    this.iconPath = new vscode.ThemeIcon("info");
  }
}

export class SkillsTreeProvider
  implements vscode.TreeDataProvider<SkillsTreeNode>, vscode.Disposable
{
  private readonly changed = new vscode.EventEmitter<
    SkillsTreeNode | undefined
  >();
  public readonly onDidChangeTreeData = this.changed.event;

  public constructor(
    private readonly extensionPath: string,
    private readonly output: vscode.OutputChannel,
    private readonly getPersonalDirectory: () => string,
    private readonly isBundledEnabled: (name: string) => boolean
  ) {}

  public dispose(): void {
    this.changed.dispose();
  }

  public refresh(): void {
    this.changed.fire(undefined);
  }

  public getTreeItem(item: SkillsTreeNode): vscode.TreeItem {
    return item;
  }

  public async getChildren(element?: SkillsTreeNode): Promise<SkillsTreeNode[]> {
    if (element instanceof SourceTreeItem) {
      return createCategoryItems(element);
    }

    if (element instanceof CategoryTreeItem) {
      return element.skills.map((skill) => new SkillTreeItem(skill));
    }

    if (element) {
      return [];
    }

    return this.loadSources();
  }

  private async loadSources(): Promise<SkillsTreeNode[]> {
    const personalDirectory = this.getPersonalDirectory();
    const bundledDirectory = path.join(this.extensionPath, "skills");

    try {
      const [personalSkills, discoveredBundled] = await Promise.all([
        discoverSkills(personalDirectory, "personal"),
        discoverSkills(bundledDirectory, "bundled")
      ]);
      const bundledSkills = discoveredBundled.map((skill) => ({
        ...skill,
        enabled: this.isBundledEnabled(skill.name)
      }));

      this.output.appendLine(
        `Discovered ${personalSkills.length} personal and ${bundledSkills.length} bundled skill(s).`
      );
      this.output.appendLine(`Personal skills directory: ${personalDirectory}`);

      return [
        new SourceTreeItem("Personal", "personal", personalSkills),
        new SourceTreeItem("Bundled", "bundled", bundledSkills)
      ];
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.output.appendLine(`Skill discovery failed: ${message}`);
      return [new MessageTreeItem(`Unable to load skills: ${message}`)];
    }
  }
}

function createCategoryItems(source: SourceTreeItem): SkillsTreeNode[] {
  if (source.skills.length === 0) {
    return [
      new MessageTreeItem(
        source.source === "personal"
          ? "No personal skills. Use + to create one."
          : "No bundled skills found."
      )
    ];
  }

  return SKILL_CATEGORIES.flatMap((category) => {
    const skills = source.skills.filter((skill) => skill.category === category);
    return skills.length
      ? [new CategoryTreeItem(source.source, category, skills)]
      : [];
  });
}

function skillContextValue(skill: SkillRecord): string {
  if (skill.source === "bundled") {
    return "personalSkills.skill.bundled";
  }

  return skill.linked
    ? "personalSkills.skill.personalReadOnly"
    : "personalSkills.skill.personal";
}

function categoryIcon(category: SkillCategory): string {
  const icons: Record<SkillCategory, string> = {
    general: "symbol-misc",
    backend: "server-process",
    frontend: "browser",
    devops: "server-environment",
    "ci-cd": "git-merge",
    testing: "beaker",
    data: "database",
    mobile: "device-mobile",
    security: "shield",
    other: "folder"
  };
  return icons[category];
}

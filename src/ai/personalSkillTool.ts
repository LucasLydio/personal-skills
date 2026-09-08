import * as vscode from "vscode";
import { PERSONAL_SKILLS_TOOL_NAME } from "../constants";
import {
  findSkillContent,
  type SkillLookupResult,
  type SkillSummary
} from "../services/skillContentService";
import { isBundledSkillEnabled } from "../services/bundledSkillState";

interface PersonalSkillToolInput {
  readonly query: string;
}

export function registerPersonalSkillTool(
  context: vscode.ExtensionContext,
  getPersonalDirectory: () => string
): vscode.Disposable {
  return vscode.lm.registerTool(
    PERSONAL_SKILLS_TOOL_NAME,
    new PersonalSkillTool(context.extensionPath, getPersonalDirectory)
  );
}

class PersonalSkillTool implements vscode.LanguageModelTool<PersonalSkillToolInput> {
  public constructor(
    private readonly extensionPath: string,
    private readonly getPersonalDirectory: () => string
  ) {}

  public async invoke(
    options: vscode.LanguageModelToolInvocationOptions<PersonalSkillToolInput>,
    _token: vscode.CancellationToken
  ): Promise<vscode.LanguageModelToolResult> {
    const result = await findSkillContent(
      this.extensionPath,
      this.getPersonalDirectory(),
      options.input.query,
      isBundledSkillEnabled
    );

    return new vscode.LanguageModelToolResult([
      new vscode.LanguageModelTextPart(formatLookupResult(result))
    ]);
  }

  public prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<PersonalSkillToolInput>
  ): vscode.PreparedToolInvocation {
    return {
      invocationMessage: `Loading personal skill for "${options.input.query}"`
    };
  }
}

function formatLookupResult(result: SkillLookupResult): string {
  if (result.kind === "found") {
    return [
      `Use the following ${result.skill.source} skill instructions.`,
      `Skill: ${result.skill.name}`,
      `Path: ${result.skill.skillFilePath}`,
      "",
      result.skill.content
    ].join("\n");
  }

  if (result.kind === "ambiguous") {
    return [
      "Multiple enabled skills match the query. Ask the user to choose one, or call this tool again with the exact skill name.",
      "",
      ...result.matches.map(formatSkillSummary)
    ].join("\n");
  }

  return [
    "No enabled skill matched the query. Ask for a more specific skill name, category, framework, or task.",
    "",
    "Available enabled skills:",
    ...result.available.slice(0, 10).map(formatSkillSummary)
  ].join("\n");
}

function formatSkillSummary(skill: SkillSummary): string {
  const context = [skill.source, skill.category, skill.framework]
    .filter(Boolean)
    .join(", ");
  return `- ${skill.name} (${context}): ${skill.description}`;
}

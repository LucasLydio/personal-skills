import * as vscode from "vscode";
import { CLARIFY_TASK_TOOL_NAME } from "../constants";
import { loadClarifyTaskSkillContent } from "../services/skillContentService";

interface ClarifyTaskToolInput {
  readonly request?: string;
}

export function registerClarifyTaskTool(
  context: vscode.ExtensionContext,
  getPersonalDirectory: () => string
): vscode.Disposable {
  return vscode.lm.registerTool(
    CLARIFY_TASK_TOOL_NAME,
    new ClarifyTaskTool(context.extensionPath, getPersonalDirectory)
  );
}

class ClarifyTaskTool implements vscode.LanguageModelTool<ClarifyTaskToolInput> {
  public constructor(
    private readonly extensionPath: string,
    private readonly getPersonalDirectory: () => string
  ) {}

  public async invoke(
    _options: vscode.LanguageModelToolInvocationOptions<ClarifyTaskToolInput>,
    _token: vscode.CancellationToken
  ): Promise<vscode.LanguageModelToolResult> {
    const skill = await loadClarifyTaskSkillContent(
      this.extensionPath,
      this.getPersonalDirectory()
    );

    return new vscode.LanguageModelToolResult([
      new vscode.LanguageModelTextPart(
        [
          `Use the following ${skill.source} skill instructions.`,
          `Skill: ${skill.name}`,
          `Path: ${skill.skillFilePath}`,
          "",
          skill.content
        ].join("\n")
      )
    ]);
  }

  public prepareInvocation(): vscode.PreparedToolInvocation {
    return {
      invocationMessage: "Loading clarify-task instructions"
    };
  }
}

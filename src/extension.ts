import type { ExtensionContext } from "vscode";
import { registerSkillsView } from "./registerSkillsView";

export function activate(context: ExtensionContext): void {
  registerSkillsView(context);
}

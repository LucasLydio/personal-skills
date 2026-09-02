import * as vscode from "vscode";
import { BUNDLED_ENABLEMENT_SETTINGS } from "../constants";

export function isBundledSkillEnabled(name: string): boolean {
  const setting = getBundledSetting(name);
  return setting
    ? vscode.workspace.getConfiguration("personalSkills").get(setting, true)
    : true;
}

export async function setBundledSkillEnabled(
  name: string,
  enabled: boolean
): Promise<void> {
  const setting = getBundledSetting(name);
  if (!setting) {
    throw new Error(`Bundled skill '${name}' has no enablement setting.`);
  }

  await vscode.workspace
    .getConfiguration("personalSkills")
    .update(setting, enabled, vscode.ConfigurationTarget.Global);
}

function getBundledSetting(name: string): string | undefined {
  return BUNDLED_ENABLEMENT_SETTINGS[name];
}

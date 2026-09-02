import * as os from "node:os";
import * as path from "node:path";
import * as vscode from "vscode";
import { DEFAULT_SKILLS_DIRECTORY } from "../constants";

export function resolvePersonalSkillsDirectory(): string {
  const configuredValue = vscode.workspace
    .getConfiguration("personalSkills")
    .get<string>("skillsDirectory", DEFAULT_SKILLS_DIRECTORY)
    .trim();
  const configured = configuredValue || DEFAULT_SKILLS_DIRECTORY;

  if (configured === "~") {
    return os.homedir();
  }

  if (configured.startsWith("~/") || configured.startsWith("~\\")) {
    return path.join(os.homedir(), configured.slice(2));
  }

  return path.resolve(configured);
}

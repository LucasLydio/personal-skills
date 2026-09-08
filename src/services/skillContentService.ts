import { readFile } from "node:fs/promises";
import * as path from "node:path";
import { CLARIFY_TASK_SKILL_NAME } from "../constants";
import type { SkillSource } from "../domain/skill";
import { discoverSkills } from "./skillFileService";

export interface SkillContent {
  readonly name: string;
  readonly source: SkillSource;
  readonly skillFilePath: string;
  readonly content: string;
}

export async function loadClarifyTaskSkillContent(
  extensionPath: string,
  personalDirectory: string
): Promise<SkillContent> {
  const [personalSkills, bundledSkills] = await Promise.all([
    discoverSkills(personalDirectory, "personal"),
    discoverSkills(path.join(extensionPath, "skills"), "bundled")
  ]);
  const skill =
    personalSkills.find(
      ({ name, enabled }) => name === CLARIFY_TASK_SKILL_NAME && enabled
    ) ??
    bundledSkills.find(({ name }) => name === CLARIFY_TASK_SKILL_NAME);

  if (!skill) {
    throw new Error("The clarify-task skill was not found.");
  }

  return {
    name: skill.name,
    source: skill.source,
    skillFilePath: skill.skillFilePath,
    content: await readFile(skill.skillFilePath, "utf8")
  };
}

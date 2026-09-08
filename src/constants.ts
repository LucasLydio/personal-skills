export const EXTENSION_ID = "personal.personal-skills";
export const VIEW_ID = "personalSkills.skills";
export const DEFAULT_SKILLS_DIRECTORY = "~/.agents/skills";
export const CLARIFY_TASK_SKILL_NAME = "clarify-task";
export const CLARIFY_TASK_TOOL_NAME = "personal_skills_get_clarify_task";

export const COMMANDS = {
  verify: "personalSkills.verifyInstallation",
  refresh: "personalSkills.refresh",
  search: "personalSkills.searchSkills",
  filter: "personalSkills.filterSkills",
  clearFilters: "personalSkills.clearSkillFilters",
  open: "personalSkills.openSkill",
  add: "personalSkills.addSkill",
  edit: "personalSkills.editSkill",
  delete: "personalSkills.deleteSkill",
  toggle: "personalSkills.toggleSkill",
  copyBundled: "personalSkills.copyBundledSkill"
} as const;

export const BUNDLED_ENABLEMENT_SETTINGS: Readonly<Record<string, string>> = {
  "clarify-task": "bundled.clarifyTask.enabled"
};

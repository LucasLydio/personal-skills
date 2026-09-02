export const EXTENSION_ID = "personal.personal-skills";
export const VIEW_ID = "personalSkills.skills";
export const DEFAULT_SKILLS_DIRECTORY = "~/.agents/skills";

export const COMMANDS = {
  verify: "personalSkills.verifyInstallation",
  refresh: "personalSkills.refresh",
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

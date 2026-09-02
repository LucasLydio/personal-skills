export const SKILL_CATEGORIES = [
  "general",
  "backend",
  "frontend",
  "devops",
  "ci-cd",
  "testing",
  "data",
  "mobile",
  "security",
  "other"
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];
export type SkillSource = "personal" | "bundled";

export interface SkillMetadata {
  readonly category: SkillCategory;
  readonly framework?: string;
}

export interface SkillRecord extends SkillMetadata {
  readonly name: string;
  readonly description: string;
  readonly directoryName: string;
  readonly directoryPath: string;
  readonly skillFilePath: string;
  readonly content: string;
  readonly instructions: string;
  readonly source: SkillSource;
  readonly enabled: boolean;
  readonly linked: boolean;
}

export interface SkillFormValue {
  readonly name: string;
  readonly description: string;
  readonly category: SkillCategory;
  readonly framework?: string;
  readonly instructions: string;
  readonly enabled: boolean;
}

export interface SkillDocument {
  readonly name?: string;
  readonly description?: string;
  readonly instructions: string;
}

export const SKILL_NAME_VALIDATION_MESSAGE =
  "Name must use 1-64 characters: lowercase letters (a-z), numbers (0-9), " +
  "and single hyphens (-) between words. Do not use spaces, underscores, " +
  "uppercase letters, or leading, trailing, or repeated hyphens. " +
  "Example: nodejs-api-review.";

export function isSkillCategory(value: unknown): value is SkillCategory {
  return (
    typeof value === "string" &&
    (SKILL_CATEGORIES as readonly string[]).includes(value)
  );
}

export function categoryLabel(category: SkillCategory): string {
  if (category === "ci-cd") {
    return "CI/CD";
  }

  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function validateSkillForm(value: SkillFormValue): string | undefined {
  if (
    value.name.length > 64 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.name)
  ) {
    return SKILL_NAME_VALIDATION_MESSAGE;
  }

  if (!value.description.trim()) {
    return "Description is required.";
  }

  if (value.description.length > 1024) {
    return "Description must be at most 1024 characters.";
  }

  if (!isSkillCategory(value.category)) {
    return "Select a valid category.";
  }

  if ((value.framework?.length ?? 0) > 100) {
    return "Framework must be at most 100 characters.";
  }

  return undefined;
}

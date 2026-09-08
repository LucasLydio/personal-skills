import { categoryLabel, type SkillRecord, type SkillSource } from "./skill";

export type SkillStateFilter = "all" | "active" | "inactive";
export type SkillSourceFilter = "all" | SkillSource;

export interface SkillFilterState {
  readonly query: string;
  readonly state: SkillStateFilter;
  readonly source: SkillSourceFilter;
}

export const DEFAULT_SKILL_FILTERS: SkillFilterState = {
  query: "",
  state: "all",
  source: "all"
};

export function applySkillFilters(
  skills: readonly SkillRecord[],
  filters: SkillFilterState
): SkillRecord[] {
  const query = normalize(filters.query);

  return skills.filter((skill) => {
    if (filters.source !== "all" && skill.source !== filters.source) {
      return false;
    }

    if (filters.state === "active" && !skill.enabled) {
      return false;
    }

    if (filters.state === "inactive" && skill.enabled) {
      return false;
    }

    if (!query) {
      return true;
    }

    return searchableText(skill).includes(query);
  });
}

export function hasActiveSkillFilters(filters: SkillFilterState): boolean {
  return (
    filters.query.trim().length > 0 ||
    filters.state !== DEFAULT_SKILL_FILTERS.state ||
    filters.source !== DEFAULT_SKILL_FILTERS.source
  );
}

export function describeSkillFilters(filters: SkillFilterState): string {
  const parts = [
    filters.query.trim() ? `search: ${filters.query.trim()}` : undefined,
    filters.state !== "all" ? filters.state : undefined,
    filters.source !== "all" ? filters.source : undefined
  ].filter((value): value is string => Boolean(value));

  return parts.length ? parts.join(", ") : "none";
}

function searchableText(skill: SkillRecord): string {
  return normalize(
    [
      skill.name,
      skill.description,
      skill.framework,
      skill.category,
      categoryLabel(skill.category)
    ].join(" ")
  );
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase();
}

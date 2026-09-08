import assert from "node:assert/strict";
import test from "node:test";
import { applySkillFilters, hasActiveSkillFilters } from "../src/domain/skillFilters";
import type { SkillRecord } from "../src/domain/skill";

const skills: readonly SkillRecord[] = [
  createSkill({
    name: "api-review",
    description: "Review backend routes",
    category: "backend",
    framework: "NestJS",
    source: "personal",
    enabled: true
  }),
  createSkill({
    name: "react-cleanup",
    description: "Refactor frontend components",
    category: "frontend",
    framework: "React",
    source: "personal",
    enabled: false
  }),
  createSkill({
    name: "clarify-task",
    description: "Improve ambiguous prompts",
    category: "general",
    source: "bundled",
    enabled: true
  })
];

test("searches by name, description, framework, and category", () => {
  assert.deepEqual(namesFor("api"), ["api-review"]);
  assert.deepEqual(namesFor("ambiguous"), ["clarify-task"]);
  assert.deepEqual(namesFor("react"), ["react-cleanup"]);
  assert.deepEqual(namesFor("backend"), ["api-review"]);
});

test("filters by active, inactive, personal, and bundled", () => {
  assert.deepEqual(
    applySkillFilters(skills, {
      query: "",
      state: "active",
      source: "all"
    }).map((skill) => skill.name),
    ["api-review", "clarify-task"]
  );
  assert.deepEqual(
    applySkillFilters(skills, {
      query: "",
      state: "inactive",
      source: "all"
    }).map((skill) => skill.name),
    ["react-cleanup"]
  );
  assert.deepEqual(
    applySkillFilters(skills, {
      query: "",
      state: "all",
      source: "personal"
    }).map((skill) => skill.name),
    ["api-review", "react-cleanup"]
  );
  assert.deepEqual(
    applySkillFilters(skills, {
      query: "",
      state: "all",
      source: "bundled"
    }).map((skill) => skill.name),
    ["clarify-task"]
  );
});

test("detects active filter state", () => {
  assert.equal(
    hasActiveSkillFilters({ query: "", state: "all", source: "all" }),
    false
  );
  assert.equal(
    hasActiveSkillFilters({ query: "react", state: "all", source: "all" }),
    true
  );
});

function namesFor(query: string): string[] {
  return applySkillFilters(skills, {
    query,
    state: "all",
    source: "all"
  }).map((skill) => skill.name);
}

function createSkill(
  value: Pick<
    SkillRecord,
    "name" | "description" | "category" | "framework" | "source" | "enabled"
  >
): SkillRecord {
  return {
    directoryName: value.name,
    directoryPath: `/skills/${value.name}`,
    skillFilePath: `/skills/${value.name}/SKILL.md`,
    content: "",
    instructions: "",
    linked: false,
    ...value
  };
}

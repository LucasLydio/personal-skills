import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import test from "node:test";
import {
  findSkillContent,
  loadClarifyTaskSkillContent
} from "../src/services/skillContentService";

test("loads active personal clarify-task before bundled fallback", async (context) => {
  const extensionRoot = await temporaryDirectory(context);
  const personalRoot = await temporaryDirectory(context);
  await writeSkill(path.join(extensionRoot, "skills"), "clarify-task", "Bundled");
  await writeSkill(personalRoot, "clarify-task", "Personal");

  const skill = await loadClarifyTaskSkillContent(extensionRoot, personalRoot);

  assert.equal(skill.source, "personal");
  assert.match(skill.content, /description: Personal/);
});

test("loads bundled clarify-task when personal copy is inactive", async (context) => {
  const extensionRoot = await temporaryDirectory(context);
  const personalRoot = await temporaryDirectory(context);
  await writeSkill(path.join(extensionRoot, "skills"), "clarify-task", "Bundled");
  await writeSkill(personalRoot, "clarify-task", "Personal", false);

  const skill = await loadClarifyTaskSkillContent(extensionRoot, personalRoot);

  assert.equal(skill.source, "bundled");
  assert.match(skill.content, /description: Bundled/);
});

test("finds an enabled personal skill by exact name", async (context) => {
  const extensionRoot = await temporaryDirectory(context);
  const personalRoot = await temporaryDirectory(context);
  await writeSkill(personalRoot, "angular-review", "Review Angular code");

  const result = await findSkillContent(
    extensionRoot,
    personalRoot,
    "angular-review"
  );

  assert.equal(result.kind, "found");
  assert.equal(result.kind === "found" && result.skill.name, "angular-review");
});

test("finds a skill by framework metadata", async (context) => {
  const extensionRoot = await temporaryDirectory(context);
  const personalRoot = await temporaryDirectory(context);
  await writeSkill(personalRoot, "api-design", "Design APIs", true, {
    category: "backend",
    framework: "NestJS"
  });

  const result = await findSkillContent(extensionRoot, personalRoot, "nestjs");

  assert.equal(result.kind, "found");
  assert.equal(result.kind === "found" && result.skill.name, "api-design");
});

test("returns candidate skills for ambiguous matches", async (context) => {
  const extensionRoot = await temporaryDirectory(context);
  const personalRoot = await temporaryDirectory(context);
  await writeSkill(personalRoot, "node-api", "Review backend APIs", true, {
    category: "backend"
  });
  await writeSkill(personalRoot, "nestjs-api", "Review backend services", true, {
    category: "backend"
  });

  const result = await findSkillContent(extensionRoot, personalRoot, "backend");

  assert.equal(result.kind, "ambiguous");
  assert.deepEqual(
    result.kind === "ambiguous"
      ? result.matches.map((skill) => skill.name)
      : [],
    ["nestjs-api", "node-api"]
  );
});

test("does not return inactive personal skills", async (context) => {
  const extensionRoot = await temporaryDirectory(context);
  const personalRoot = await temporaryDirectory(context);
  await writeSkill(personalRoot, "disabled-skill", "Hidden skill", false);

  const result = await findSkillContent(
    extensionRoot,
    personalRoot,
    "disabled-skill"
  );

  assert.equal(result.kind, "notFound");
});

async function temporaryDirectory(
  context: { after(callback: () => Promise<void>): void }
): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "personal-skills-test-"));
  context.after(async () => rm(root, { recursive: true, force: true }));
  return root;
}

async function writeSkill(
  root: string,
  name: string,
  description: string,
  enabled = true,
  metadata?: { readonly category?: string; readonly framework?: string }
): Promise<void> {
  const directory = path.join(root, name);
  await mkdir(directory, { recursive: true });
  const fileName = enabled ? "SKILL.md" : "SKILL.md.disabled";
  await writeFile(
    path.join(directory, fileName),
    ["---", `name: ${name}`, `description: ${description}`, "---", ""].join("\n"),
    "utf8"
  );
  if (metadata) {
    await writeFile(
      path.join(directory, ".personal-skills.json"),
      `${JSON.stringify({ category: "general", ...metadata }, null, 2)}\n`,
      "utf8"
    );
  }
}

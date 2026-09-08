import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import test from "node:test";
import { loadClarifyTaskSkillContent } from "../src/services/skillContentService";

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
  enabled = true
): Promise<void> {
  const directory = path.join(root, name);
  await mkdir(directory, { recursive: true });
  const fileName = enabled ? "SKILL.md" : "SKILL.md.disabled";
  await writeFile(
    path.join(directory, fileName),
    ["---", `name: ${name}`, `description: ${description}`, "---", ""].join("\n"),
    "utf8"
  );
}

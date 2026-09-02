import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import test from "node:test";
import { BUNDLED_ENABLEMENT_SETTINGS } from "../src/constants";
import type { SkillFormValue } from "../src/domain/skill";
import {
  copyBundledSkill,
  createPersonalSkill,
  deletePersonalSkill,
  discoverSkills,
  setPersonalSkillEnabled,
  updatePersonalSkill
} from "../src/services/skillFileService";

test("discovers sorted skills and their category metadata", async (context) => {
  const root = await temporaryDirectory(context);
  await writeSkill(root, "zeta", "Last skill");
  await writeSkill(root, "alpha", "First skill");
  await writeFile(
    path.join(root, "alpha", ".personal-skills.json"),
    '{"category":"frontend","framework":"React"}\n',
    "utf8"
  );
  await mkdir(path.join(root, "not-a-skill"));

  const skills = await discoverSkills(root, "personal");

  assert.deepEqual(
    skills.map(({ name, description, category, framework }) => ({
      name,
      description,
      category,
      framework
    })),
    [
      {
        name: "alpha",
        description: "First skill",
        category: "frontend",
        framework: "React"
      },
      {
        name: "zeta",
        description: "Last skill",
        category: "general",
        framework: undefined
      }
    ]
  );
});

test("creates, edits, disables, enables, and deletes a skill", async (context) => {
  const root = await temporaryDirectory(context);
  const created: SkillFormValue = {
    name: "api-review",
    description: "Review backend APIs",
    category: "backend",
    framework: "NestJS",
    instructions: "# Review\n\nCheck the API contract.",
    enabled: true
  };

  await createPersonalSkill(root, created);
  await mkdir(path.join(root, created.name, "references"));
  await writeFile(
    path.join(root, created.name, "references", "guide.md"),
    "Keep this resource.",
    "utf8"
  );
  let [skill] = await discoverSkills(root, "personal");
  assert.equal(skill.enabled, true);
  assert.equal(skill.framework, "NestJS");

  await updatePersonalSkill(root, skill, {
    ...created,
    name: "api-contract-review",
    description: "Review backend APIs and DTOs",
    category: "testing",
    framework: "Fastify",
    instructions: "# Review\n\nCheck contracts and DTOs.",
    enabled: false
  });
  [skill] = await discoverSkills(root, "personal");
  assert.equal(skill.name, "api-contract-review");
  assert.equal(skill.directoryName, "api-contract-review");
  assert.equal(skill.enabled, false);
  assert.equal(path.basename(skill.skillFilePath), "SKILL.md.disabled");
  assert.equal(skill.category, "testing");
  assert.match(skill.content, /Review backend APIs and DTOs/);
  assert.match(skill.content, /^name: "api-contract-review"$/m);
  assert.equal(
    await readFile(path.join(skill.directoryPath, "references", "guide.md"), "utf8"),
    "Keep this resource."
  );

  await setPersonalSkillEnabled(root, skill, true);
  [skill] = await discoverSkills(root, "personal");
  assert.equal(skill.enabled, true);
  assert.equal(path.basename(skill.skillFilePath), "SKILL.md");

  await deletePersonalSkill(root, skill);
  assert.deepEqual(await discoverSkills(root, "personal"), []);
});

test("preserves unrelated frontmatter when editing", async (context) => {
  const root = await temporaryDirectory(context);
  await writeSkill(root, "licensed-skill", "Old description", "license: MIT");
  const [skill] = await discoverSkills(root, "personal");

  await updatePersonalSkill(root, skill, {
    name: "licensed-skill",
    description: "New description",
    category: "general",
    instructions: "# Updated",
    enabled: true
  });

  const updated = await readFile(skill.skillFilePath, "utf8");
  assert.match(updated, /^license: MIT$/m);
  assert.match(updated, /^description: "New description"$/m);
});

test("copies a bundled skill into the personal directory", async (context) => {
  const root = await temporaryDirectory(context);
  const bundledRoot = await temporaryDirectory(context);
  await writeSkill(bundledRoot, "shared-skill", "Shared skill");
  const [bundled] = await discoverSkills(bundledRoot, "bundled");

  await copyBundledSkill(root, bundled);

  const [personal] = await discoverSkills(root, "personal");
  assert.equal(personal.name, "shared-skill");
  assert.equal(personal.enabled, true);
});

test("returns an empty list for a missing directory", async () => {
  const missing = path.join(
    os.tmpdir(),
    `personal-skills-missing-${Date.now()}-${process.pid}`
  );
  assert.deepEqual(await discoverSkills(missing, "personal"), []);
});

test("keeps the bundled skill contribution and enablement setting aligned", async () => {
  const bundled = await discoverSkills(
    path.join(process.cwd(), "skills"),
    "bundled"
  );
  const skill = bundled.find(({ name }) => name === "clarify-task");
  assert.ok(skill);
  assert.equal(skill.name, "clarify-task");
  assert.equal(
    bundled.some(({ name }) => name === "example-skill"),
    false
  );

  const manifest = JSON.parse(
    await readFile(path.join(process.cwd(), "package.json"), "utf8")
  ) as ExtensionManifest;
  const contribution = manifest.contributes.chatSkills.find(
    ({ path: skillPath }) => skillPath === "./skills/clarify-task/SKILL.md"
  );
  const setting = BUNDLED_ENABLEMENT_SETTINGS[skill.name];

  assert.ok(contribution);
  assert.equal(contribution.when, `config.personalSkills.${setting}`);
  assert.ok(
    Object.hasOwn(
      manifest.contributes.configuration.properties,
      `personalSkills.${setting}`
    )
  );
});

test("rejects a skill name that could escape the root", async (context) => {
  const root = await temporaryDirectory(context);
  const invalid = {
    name: "../escape",
    description: "Invalid",
    category: "general",
    instructions: "Invalid",
    enabled: true
  } as SkillFormValue;

  await assert.rejects(
    createPersonalSkill(root, invalid),
    /lowercase letters \(a-z\).*single hyphens/
  );
});

test("rejects renaming a skill over an existing skill", async (context) => {
  const root = await temporaryDirectory(context);
  const value: SkillFormValue = {
    name: "first-skill",
    description: "First",
    category: "general",
    instructions: "# First",
    enabled: true
  };
  await createPersonalSkill(root, value);
  await createPersonalSkill(root, {
    ...value,
    name: "existing-skill",
    description: "Existing"
  });
  const discovered = await discoverSkills(root, "personal");
  const first = discovered.find((skill) => skill.name === "first-skill");
  assert.ok(first);

  await assert.rejects(
    updatePersonalSkill(root, first, { ...value, name: "existing-skill" }),
    /already exists/
  );

  const skills = await discoverSkills(root, "personal");
  assert.deepEqual(
    skills.map((skill) => skill.name),
    ["existing-skill", "first-skill"]
  );
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
  extraFrontmatter = ""
): Promise<void> {
  const directory = path.join(root, name);
  await mkdir(directory);
  const lines = [
    "---",
    `name: ${name}`,
    `description: ${description}`,
    extraFrontmatter,
    "---",
    "",
    `# ${name}`,
    ""
  ].filter((line) => line !== "");
  await writeFile(path.join(directory, "SKILL.md"), lines.join("\n"), "utf8");
}

interface ExtensionManifest {
  readonly contributes: {
    readonly chatSkills: readonly {
      readonly path: string;
      readonly when?: string;
    }[];
    readonly configuration: {
      readonly properties: Readonly<Record<string, unknown>>;
    };
  };
}

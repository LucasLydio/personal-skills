import {
  cp,
  lstat,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile
} from "node:fs/promises";
import * as path from "node:path";
import {
  isSkillCategory,
  validateSkillForm,
  type SkillFormValue,
  type SkillMetadata,
  type SkillRecord,
  type SkillSource
} from "../domain/skill";
import {
  createSkillDocument,
  parseSkillDocument,
  updateSkillDocument
} from "../domain/skillDocument";

const ACTIVE_FILE = "SKILL.md";
const DISABLED_FILE = "SKILL.md.disabled";
const METADATA_FILE = ".personal-skills.json";

export async function discoverSkills(
  skillsDirectory: string,
  source: SkillSource
): Promise<SkillRecord[]> {
  let entries;

  try {
    entries = await readdir(skillsDirectory, { withFileTypes: true });
  } catch (error) {
    if (isMissingError(error)) {
      return [];
    }
    throw error;
  }

  const candidates = entries
    .filter((entry) => entry.isDirectory() || entry.isSymbolicLink())
    .map(async (entry): Promise<SkillRecord | undefined> => {
      const directoryPath = path.join(skillsDirectory, entry.name);
      const activePath = path.join(directoryPath, ACTIVE_FILE);
      const disabledPath = path.join(directoryPath, DISABLED_FILE);
      const activeContents = await readOptionalFile(activePath);
      const enabled = activeContents !== undefined;
      const content = activeContents ?? (await readOptionalFile(disabledPath));

      if (content === undefined) {
        return undefined;
      }

      const document = parseSkillDocument(content);
      const metadata = await readMetadata(directoryPath);

      return {
        name: entry.name,
        description: document.description ?? "No description",
        directoryName: entry.name,
        directoryPath,
        skillFilePath: enabled ? activePath : disabledPath,
        content,
        instructions: document.instructions,
        source,
        enabled: source === "bundled" ? true : enabled,
        linked: entry.isSymbolicLink(),
        ...metadata
      };
    });

  const skills = (await Promise.all(candidates)).filter(
    (skill): skill is SkillRecord => skill !== undefined
  );

  return skills.sort((left, right) =>
    left.name.localeCompare(right.name, undefined, { sensitivity: "base" })
  );
}

export async function createPersonalSkill(
  rootDirectory: string,
  value: SkillFormValue
): Promise<void> {
  assertValidForm(value);
  const directoryPath = resolveSkillDirectory(rootDirectory, value.name);
  await mkdir(path.resolve(rootDirectory), { recursive: true });

  try {
    await mkdir(directoryPath);
  } catch (error) {
    if (isAlreadyExistsError(error)) {
      throw new Error(`A skill named '${value.name}' already exists.`);
    }
    throw error;
  }

  try {
    const fileName = value.enabled ? ACTIVE_FILE : DISABLED_FILE;
    await writeFile(
      path.join(directoryPath, fileName),
      createSkillDocument(value.name, value.description, value.instructions),
      { encoding: "utf8", flag: "wx" }
    );
    await writeMetadata(directoryPath, value);
  } catch (error) {
    await rm(directoryPath, { recursive: true, force: true });
    throw error;
  }
}

export async function updatePersonalSkill(
  rootDirectory: string,
  skill: SkillRecord,
  value: SkillFormValue
): Promise<void> {
  assertMutablePersonalSkill(rootDirectory, skill);
  assertValidForm(value);
  const renamedDirectory = resolveSkillDirectory(rootDirectory, value.name);
  const isRenamed = value.name !== skill.directoryName;

  if (isRenamed && (await pathExists(renamedDirectory))) {
    throw new Error(`A skill named '${value.name}' already exists.`);
  }

  const updated = updateSkillDocument(
    skill.content,
    value.name,
    value.description,
    value.instructions
  );

  if (isRenamed) {
    await rename(skill.directoryPath, renamedDirectory);
  }

  const directoryPath = isRenamed ? renamedDirectory : skill.directoryPath;
  const currentSkillFilePath = path.join(
    directoryPath,
    path.basename(skill.skillFilePath)
  );

  await writeFile(currentSkillFilePath, updated, "utf8");
  await writeMetadata(directoryPath, value);

  if (value.enabled !== skill.enabled) {
    await rename(
      currentSkillFilePath,
      path.join(directoryPath, value.enabled ? ACTIVE_FILE : DISABLED_FILE)
    );
  }
}

export async function setPersonalSkillEnabled(
  rootDirectory: string,
  skill: SkillRecord,
  enabled: boolean
): Promise<void> {
  assertMutablePersonalSkill(rootDirectory, skill);
  if (skill.enabled === enabled) {
    return;
  }

  const target = path.join(
    skill.directoryPath,
    enabled ? ACTIVE_FILE : DISABLED_FILE
  );
  await rename(skill.skillFilePath, target);
}

export async function deletePersonalSkill(
  rootDirectory: string,
  skill: SkillRecord
): Promise<void> {
  assertMutablePersonalSkill(rootDirectory, skill);
  await rm(skill.directoryPath, { recursive: true, force: false });
}

export async function copyBundledSkill(
  rootDirectory: string,
  skill: SkillRecord
): Promise<void> {
  if (skill.source !== "bundled") {
    throw new Error("Only bundled skills can be copied.");
  }

  const target = resolveSkillDirectory(rootDirectory, skill.directoryName);
  await mkdir(path.resolve(rootDirectory), { recursive: true });

  try {
    await cp(skill.directoryPath, target, {
      recursive: true,
      errorOnExist: true,
      force: false
    });
  } catch (error) {
    if (isAlreadyExistsError(error)) {
      throw new Error(`A personal skill named '${skill.name}' already exists.`);
    }
    throw error;
  }
}

function resolveSkillDirectory(rootDirectory: string, name: string): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    throw new Error("Invalid skill directory name.");
  }

  const root = path.resolve(rootDirectory);
  const candidate = path.resolve(root, name);
  if (path.dirname(candidate) !== root) {
    throw new Error("Skill path escapes the configured skills directory.");
  }

  return candidate;
}

function assertMutablePersonalSkill(
  rootDirectory: string,
  skill: SkillRecord
): void {
  if (skill.source !== "personal") {
    throw new Error("Bundled skills cannot be modified.");
  }

  if (skill.linked) {
    throw new Error("Linked skills are read-only. Edit the link target directly.");
  }

  const expected = resolveSkillDirectory(rootDirectory, skill.directoryName);
  if (path.resolve(skill.directoryPath) !== expected) {
    throw new Error("Skill path does not match the configured skills directory.");
  }
}

async function readMetadata(directoryPath: string): Promise<SkillMetadata> {
  const content = await readOptionalFile(path.join(directoryPath, METADATA_FILE));
  if (!content) {
    return { category: "general" };
  }

  try {
    const parsed: unknown = JSON.parse(content);
    if (!isRecord(parsed)) {
      return { category: "general" };
    }

    const category = isSkillCategory(parsed.category)
      ? parsed.category
      : "general";
    const framework =
      typeof parsed.framework === "string" && parsed.framework.trim()
        ? parsed.framework.trim()
        : undefined;
    return { category, framework };
  } catch {
    return { category: "general" };
  }
}

async function writeMetadata(
  directoryPath: string,
  value: Pick<SkillFormValue, "category" | "framework">
): Promise<void> {
  const metadata: SkillMetadata = {
    category: value.category,
    framework: value.framework?.trim() || undefined
  };
  await writeFile(
    path.join(directoryPath, METADATA_FILE),
    `${JSON.stringify(metadata, null, 2)}\n`,
    "utf8"
  );
}

async function readOptionalFile(filePath: string): Promise<string | undefined> {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingError(error)) {
      return undefined;
    }
    throw error;
  }
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await lstat(filePath);
    return true;
  } catch (error) {
    if (isMissingError(error)) {
      return false;
    }
    throw error;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMissingError(error: unknown): boolean {
  return hasErrorCode(error, "ENOENT");
}

function isAlreadyExistsError(error: unknown): boolean {
  return hasErrorCode(error, "EEXIST") || hasErrorCode(error, "ERR_FS_CP_EEXIST");
}

function hasErrorCode(error: unknown, code: string): boolean {
  return error instanceof Error && "code" in error && error.code === code;
}

function assertValidForm(value: SkillFormValue): void {
  const validationError = validateSkillForm(value);
  if (validationError) {
    throw new Error(validationError);
  }
}

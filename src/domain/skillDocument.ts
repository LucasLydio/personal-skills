import type { SkillDocument } from "./skill";

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

export function parseSkillDocument(contents: string): SkillDocument {
  const normalized = contents.replace(/^\uFEFF/, "");
  const match = FRONTMATTER_PATTERN.exec(normalized);

  if (!match) {
    return { instructions: normalized.trim() };
  }

  const fields = parseTopLevelFields(match[1]);
  return {
    name: fields.get("name"),
    description: fields.get("description"),
    instructions: normalized.slice(match[0].length).trim()
  };
}

export function createSkillDocument(
  name: string,
  description: string,
  instructions: string
): string {
  return [
    "---",
    `name: ${serializeYamlString(name)}`,
    `description: ${serializeYamlString(description.trim())}`,
    "---",
    "",
    instructions.trim(),
    ""
  ].join("\n");
}

export function updateSkillDocument(
  existing: string,
  name: string,
  description: string,
  instructions: string
): string {
  const normalized = existing.replace(/^\uFEFF/, "");
  const match = FRONTMATTER_PATTERN.exec(normalized);

  if (!match) {
    return createSkillDocument(name, description, instructions);
  }

  const lines = match[1].split(/\r?\n/);
  upsertTopLevelField(lines, "name", serializeYamlString(name));
  upsertTopLevelField(
    lines,
    "description",
    serializeYamlString(description.trim())
  );

  return ["---", ...lines, "---", "", instructions.trim(), ""].join("\n");
}

function parseTopLevelFields(frontmatter: string): Map<string, string> {
  const fields = new Map<string, string>();

  for (const line of frontmatter.split(/\r?\n/)) {
    if (/^\s/.test(line)) {
      continue;
    }

    const separator = line.indexOf(":");
    if (separator < 1) {
      continue;
    }

    const key = line.slice(0, separator).trim();
    const value = parseYamlString(line.slice(separator + 1).trim());
    if (value) {
      fields.set(key, value);
    }
  }

  return fields;
}

function upsertTopLevelField(
  lines: string[],
  field: string,
  value: string
): void {
  const index = lines.findIndex((line) =>
    new RegExp(`^${field}\\s*:`).test(line)
  );
  const replacement = `${field}: ${value}`;

  if (index >= 0) {
    lines[index] = replacement;
    return;
  }

  lines.unshift(replacement);
}

function serializeYamlString(value: string): string {
  return JSON.stringify(value);
}

function parseYamlString(value: string): string {
  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      const parsed: unknown = JSON.parse(value);
      return typeof parsed === "string" ? parsed : value;
    } catch {
      return value.slice(1, -1);
    }
  }

  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/''/g, "'");
  }

  return value;
}

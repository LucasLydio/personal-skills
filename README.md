# Personal Skills

Personal Skills is a Visual Studio Code extension for creating, organizing, and
loading reusable agent skills from your editor.

It stores skills in the standard `skill-name/SKILL.md` format. By default,
Personal skills are saved in `~/.agents/skills`, which is a common location for
compatible coding agents such as Codex.

## Features

- Create Personal skills from a guided form.
- Organize skills by category and optional framework/context.
- Search by name, description, framework, or category.
- Filter the sidebar by Active, Inactive, Personal, or Bundled.
- Open, edit, rename, activate, deactivate, and delete Personal skills.
- Copy Bundled skills into your Personal skills directory.
- Keep activation state and metadata across VS Code restarts.
- Expose `clarify-task` through the native `chatSkills` contribution.
- Expose lazy read-only language model tools:
  - `personal_skills_get_clarify_task`
  - `personal_skills_get_skill`

## Requirements

- Visual Studio Code `1.134.0` or newer.
- A compatible AI/chat agent if you want skills or language model tools to
  affect agent behavior.

The sidebar and skill editor work without an agent. Agent behavior depends on
the agent supporting the selected skills directory, VS Code chat skills, or VS
Code language model tools.

## Install from a release

The latest release should include an asset named exactly
`personal-skills.vsix`.

Windows PowerShell:

```powershell
curl.exe -fL "https://github.com/LucasLydio/personal-skills/releases/latest/download/personal-skills.vsix" -o "personal-skills.vsix"
code --install-extension ".\personal-skills.vsix" --force
```

macOS or Linux:

```bash
curl -fL "https://github.com/LucasLydio/personal-skills/releases/latest/download/personal-skills.vsix" -o "personal-skills.vsix"
code --install-extension "./personal-skills.vsix" --force
```

After installation, run **Developer: Reload Window** in VS Code.

### Manual install

1. Open the [latest GitHub Release](https://github.com/LucasLydio/personal-skills/releases/latest).
2. Download `personal-skills.vsix`.
3. Open the **Extensions** view in VS Code.
4. Select the `...` menu.
5. Select **Install from VSIX...**.
6. Choose the downloaded file.
7. Reload VS Code.

## First use

1. Open the **Personal Skills** activity bar icon.
2. Expand **Personal** to see skills from your configured Personal skills
   directory.
3. Expand **Bundled** to see skills shipped with the extension.
4. Use **Create Personal Skill** to create a new skill.
5. Use **Copy to Personal Skills** on a Bundled skill if you want an editable
   Personal copy.

Bundled skills are read-only because extension updates can replace their files.
Personal skills are editable and live in your configured skills directory.

## Skill actions

Use the sidebar title actions to:

- create a Personal skill;
- search visible skills;
- filter by Active, Inactive, Personal, or Bundled;
- clear active filters;
- refresh the tree;
- verify the extension installation.

Use a skill item action to:

- open its `SKILL.md`;
- edit a Personal skill;
- activate or deactivate a skill;
- delete a Personal skill after confirmation;
- copy a Bundled skill to Personal.

Renaming a skill updates both its folder name and `SKILL.md` frontmatter.
Resources inside `scripts`, `references`, and `assets` move with the skill.

## Skill-name rules

A skill name must:

- contain 1-64 characters;
- use lowercase letters (`a-z`) and numbers (`0-9`);
- use single hyphens between words;
- not contain spaces, underscores, or uppercase letters;
- not begin or end with a hyphen;
- not contain repeated hyphens.

Valid example:

```text
nodejs-api-review
```

## Categories and files

Categories organize the VS Code sidebar only. They do not create category
folders, so the layout remains compatible with agent skill discovery:

```text
~/.agents/skills/
`-- skill-name/
    |-- SKILL.md
    |-- .personal-skills.json
    |-- scripts/
    |-- references/
    `-- assets/
```

`.personal-skills.json` stores extension presentation metadata:

```json
{
  "category": "backend",
  "framework": "NestJS"
}
```

## Activation

An active Personal skill uses:

```text
SKILL.md
```

An inactive Personal skill uses:

```text
SKILL.md.disabled
```

Because activation state is stored on disk, it survives VS Code restarts.

Bundled skill activation is stored in VS Code settings. Currently the bundled
skill is:

```text
clarify-task
```

## Lazy language model tools

The extension contributes two read-only language model tools. They are lazy:
compatible agents see a small tool definition first and only receive full
`SKILL.md` content when they call the tool.

### `personal_skills_get_clarify_task`

Loads the `clarify-task` skill when a request should be clarified, refined, or
turned into a better task prompt.

Manual reference name:

```text
#clarifyTask
```

The tool loads the active Personal `clarify-task` first. If that is missing or
inactive, it falls back to the Bundled `clarify-task`.

### `personal_skills_get_skill`

Loads any enabled Personal or Bundled skill on demand.

Manual reference name:

```text
#personalSkill
```

The tool searches by:

- exact skill name;
- description;
- framework/context;
- category;
- plain-English task query.

If one clear match is found, it returns the full `SKILL.md`. If multiple skills
match equally, it returns a short candidate list so the agent can ask which one
to use.

Examples:

```text
#personalSkill angular
```

```text
Please use my backend skill to review this API design.
```

Only enabled skills are exposed:

- Active Personal skills are loadable.
- Inactive Personal skills are ignored.
- Enabled Bundled skills are loadable.
- Disabled Bundled skills are ignored.
- Active Personal skills win over Bundled skills with the same name.

## Configure settings

Open VS Code Settings and search for **Personal Skills**.

Available settings:

- **Skills Directory:** where Personal skills are stored. Default:
  `~/.agents/skills`.
- **Bundled: Clarify Task Enabled:** enables the Bundled `clarify-task` skill.
- **Language Tools: Clarify Task Enabled:** exposes
  `personal_skills_get_clarify_task`.
- **Language Tools: Personal Skill Enabled:** exposes
  `personal_skills_get_skill`.

## Troubleshooting

### The icon does not appear

Run **Developer: Reload Window**, then run **Personal Skills: Verify
Installation** from the Command Palette.

### A skill appears in the sidebar but not in Codex

- Confirm it appears under **Personal** or is available through a language
  model tool.
- Confirm a Personal skill is active and uses `SKILL.md`, not
  `SKILL.md.disabled`.
- Confirm the configured directory is `~/.agents/skills` or another directory
  your agent scans.
- Start a new chat or restart the agent so it rescans skills.
- Invoke the exact skill with `$skill-name`, select it through `/skills`, or use
  `#personalSkill` if your chat UI supports tool references.

### The curl command returns HTTP 404

The repository has no published release yet, or the latest release does not
include an asset named exactly `personal-skills.vsix`.

Create a release on GitHub and attach the packaged VSIX with that filename.

## Development

Install dependencies:

```powershell
npm install
```

Run tests:

```powershell
npm test
```

Package the extension:

```powershell
npm run package
```

Package the release asset into `release/personal-skills.vsix`:

```powershell
npm run package:release
```

Install the local package into VS Code:

```powershell
npm run install:local
```

Press `F5` in VS Code to run the extension in an Extension Development Host.

## Publish a GitHub release

The repository includes a GitHub Actions workflow that publishes the VSIX
automatically when you push a version tag like `v0.2.0`.

Before publishing, run the checks locally:

```powershell
npm test
npm run package:release
```

Commit and push the code:

```powershell
git add .
git commit -m "feat: add lazy personal skill loader"
git push origin main
```

Create and push a version tag:

```powershell
git tag v0.2.0
git push origin v0.2.0
```

GitHub Actions will then:

- install dependencies;
- run the test suite;
- build `release/personal-skills.vsix`;
- create a GitHub Release for the tag;
- upload the VSIX as the release asset.

After the workflow finishes, this URL will work:

```text
https://github.com/LucasLydio/personal-skills/releases/latest/download/personal-skills.vsix
```

The release asset name is `personal-skills.vsix`, which is why the curl install
command can download it from `/releases/latest/download/personal-skills.vsix`.

## License

Personal Skills is available under the PolyForm Noncommercial License 1.0.0.
You may use, copy, modify, and distribute it for noncommercial purposes.
Commercial use requires separate written permission from the copyright holder.

See [`LICENSE`](LICENSE) for the complete terms.

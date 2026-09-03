# Personal Skills

Personal Skills is a Visual Studio Code extension for creating, organizing, and
managing reusable agent skills without editing their files manually.

Skills are stored in the standard `skill-name/SKILL.md` format. By default,
personal skills are saved in `~/.agents/skills`, where compatible coding agents
such as Codex can discover them.

## What you can do

- Create personal skills from a guided form.
- Organize skills by category and optional framework or context.
- Open, edit, and rename existing personal skills.
- Activate or deactivate skills with one action.
- Delete personal skills after an explicit confirmation.
- Install bundled skills into your Personal skills directory.
- Keep skill state and metadata across VS Code restarts.
- Change the Personal skills directory from VS Code settings.

<!-- Add the real screenshots when they are available:

![Personal Skills sidebar](docs/images/personal-skills-sidebar.png)

![Create and edit skill form](docs/images/skill-editor.png)

![Installing the bundled clarify-task skill](docs/images/install-clarify-task.png)
-->

## Requirements

- Visual Studio Code `1.134.0` or newer.
- A compatible agent if you want the created skills to affect agent behavior.

The sidebar and skill editor work independently of an agent. Agent discovery
depends on the agent supporting the selected skills directory.

## Install without cloning the repository

### Download with curl

The command below downloads the `personal-skills.vsix` asset from the latest
GitHub Release.

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

This URL works when the latest GitHub Release contains an asset named exactly
`personal-skills.vsix`.

### Install manually

1. Open the [latest GitHub Release](https://github.com/LucasLydio/personal-skills/releases/latest).
2. Download `personal-skills.vsix`.
3. Open the **Extensions** view in VS Code.
4. Select the **Views and More Actions** (`...`) menu.
5. Select **Install from VSIX...**.
6. Choose the downloaded file.
7. Run **Developer: Reload Window** from the Command Palette.

## First use

1. Select the **Personal Skills** icon in the VS Code Activity Bar.
2. Expand **Personal** to see skills already installed in your configured
   Personal skills directory.
3. Expand **Bundled** to see skills supplied by the extension.
4. Use the **Copy to Personal Skills** action on `clarify-task` so Codex can
   discover it from `~/.agents/skills`.
5. Start a new agent chat if the skill does not appear immediately.

Bundled skills remain read-only because extension updates can replace their
files. Copying a bundled skill creates an editable Personal version.

To invoke the bundled skill after copying it, use its actual skill name:

```text
$clarify-task Help me improve this request: I want a plan to improve security.
```

In Codex, you can also run `/skills` and select the skill. Writing “use the
Personal Skills extension” does not invoke a specific skill because the
extension name and skill name are different.

## Create a personal skill

1. Open the **Personal Skills** sidebar.
2. Select the **Create Personal Skill** (`+`) button.
3. Complete the form:

   - **Name:** The agent-facing skill name.
   - **Category:** General, Backend, Frontend, DevOps, CI/CD, Testing, Data,
     Mobile, Security, or Other.
   - **Description:** Explain what the skill does and when the agent should use
     it.
   - **Framework or context:** An optional value such as Angular, NestJS,
     Terraform, or GitHub Actions.
   - **Instructions:** The Markdown workflow the agent should follow.
   - **Active for agents:** Controls whether the standard `SKILL.md` file is
     discoverable.

4. Select **Create skill**.

### Skill-name rules

A skill name must:

- contain 1–64 characters;
- use lowercase letters (`a-z`) and numbers (`0-9`);
- use only one hyphen between words;
- not contain spaces, underscores, or uppercase letters;
- not begin or end with a hyphen;
- not contain repeated hyphens.

Valid example: `nodejs-api-review`.

## Manage skills

Select or right-click a skill to use the available actions:

- **Open:** Open the skill instructions as Markdown.
- **Edit:** Change its name, description, category, context, instructions, or
  activation state.
- **Activate/Deactivate:** Make the skill discoverable or hide it from agents.
- **Delete:** Permanently remove a Personal skill after confirmation.
- **Copy to Personal Skills:** Install an editable copy of a Bundled skill.
- **Refresh:** Reload skills from the filesystem.

Renaming a skill updates its folder and its `SKILL.md` frontmatter together.
Resources inside `scripts`, `references`, and `assets` move with the skill.

## Categories and filesystem layout

Categories organize the sidebar but do not add category folders. The layout
remains compatible with native skill discovery:

```text
~/.agents/skills/
└── skill-name/
    ├── SKILL.md
    ├── .personal-skills.json
    ├── scripts/
    ├── references/
    └── assets/
```

`.personal-skills.json` contains only presentation metadata such as category
and framework context.

## Activation and persistence

An active Personal skill uses `SKILL.md`. Deactivation renames it to
`SKILL.md.disabled`, and activation restores the standard filename. Because the
state is stored on disk, it survives VS Code restarts.

If a newly created or activated skill is missing from an existing agent chat,
start a new chat or restart the agent so it rescans the skills directory.

## Configure the skills directory

The default directory is:

```text
~/.agents/skills
```

To change it:

1. Open VS Code Settings.
2. Search for **Personal Skills: Skills Directory**.
3. Enter the desired path.
4. Return to the sidebar and select **Refresh**.

Use a directory supported by your agent. A custom directory can appear in the
extension while remaining invisible to an agent that does not scan that path.

## Troubleshooting

### The extension is installed but its icon is missing

Run **Developer: Reload Window**, then search for **Personal Skills: Verify
Installation** in the Command Palette.

### A skill appears in the sidebar but not in Codex

- Confirm it appears under **Personal**, not only under **Bundled**.
- Confirm its file is named `SKILL.md`, not `SKILL.md.disabled`.
- Confirm the configured directory is `~/.agents/skills` or another location
  supported by the agent.
- Start a new chat or restart Codex.
- Invoke the exact name with `$skill-name` or select it through `/skills`.

### The curl command returns HTTP 404

The repository does not yet have a published release, or the latest release
does not contain an asset named `personal-skills.vsix`. Download the asset from
the [Releases page](https://github.com/LucasLydio/personal-skills/releases) or
ask the maintainer to publish it using that filename.

## Development

```powershell
npm install
npm test
```

Press `F5` to test the extension in an Extension Development Host.

To package and install the development version locally:

```powershell
npm run install:local
```

Development and verification documentation is available in
[`docs/README.md`](docs/README.md).

## License

Personal Skills is available under the PolyForm Noncommercial License 1.0.0.
You may use, copy, modify, and distribute it for noncommercial purposes.
Commercial use requires separate written permission from the copyright holder.

See [`LICENSE`](LICENSE) for the complete terms.

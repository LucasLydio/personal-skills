---
name: "css-design-tokens-and-global-styles"
description: "Standardized guidelines for AI agents to generate CSS using design tokens (--space, --font, --border, --shadow, --radius, --bg), dark theme support, and global styling patterns to minimize LLM token consumption."
---

# Agent Skill: CSS Design Tokens & Global Styling Architecture

## Executive Overview

This skill instruction set governs how AI coding agents construct, format, and apply CSS. The architecture revolves around two fundamental principles:

1. **Design System Standardization**: Enforcing strict, deterministic CSS Custom Properties (Design Tokens) across typography, spacing, borders, shadows, radii, and backgrounds.
2. **Context Window Token Efficiency**: Utilizing global stylesheet definitions, semantic HTML elements, and standardized CSS utility patterns to minimize code output length. By avoiding repetitive inline styles, verbose Tailwind strings, or repeated raw CSS rule blocks, agents drastically lower prompt generation costs and execution latency.

---

## 1. Core Token Registry & Naming Conventions

Agents must strictly adhere to the standardized token naming taxonomy outlined below. Custom properties are categorized by system domain using predictable suffix scales (`xsm`, `sm`, `md`, `lg`, `xlg`).

### 1.1 Spacing Tokens (`--space-*`)
Controls padding, margins, gaps, and structural layouts. Standard baseline unit is derived from an $8\text{px}$ spatial grid (or $0.5\text{rem}$ equivalents).

| Token Variable | Rem Value | Pixel Equivalent | Typical Usage |
| :--- | :--- | :--- | :--- |
| `--space-xsm` | `0.25rem` | $4\text{px}$ | Micro gaps, icon padding, tight badge margins |
| `--space-sm` | `0.5rem` | $8\text{px}$ | Button padding (Y), tight flex gaps, list item padding |
| `--space-md` | `1rem` | $16\text{px}$ | Standard component padding, card gaps, form fields |
| `--space-lg` | `1.5rem` | $24\text{px}$ | Container padding, section spacing, modal guts |
| `--space-xlg` | `2.5rem` | $40\text{px}$ | Page hero margins, section dividers, layout gutters |

### 1.2 Typography Tokens (`--font-*`)
Scale factors for element font sizing using responsive baseline calculations.

| Token Variable | Value | Equivalent | Target Elements |
| :--- | :--- | :--- | :--- |
| `--font-xsm` | `0.75rem` | $12\text{px}$ | Captions, tooltips, sub-labels, metadata |
| `--font-sm` | `0.875rem` | $14\text{px}$ | Secondary body text, form inputs, table content |
| `--font-md` | `1rem` | $16\text{px}$ | Default body text, primary buttons, navigation items |
| `--font-lg` | `1.25rem` | $20\text{px}$ | Subtitles, H3 headers, card titles, section leads |
| `--font-xlg` | `1.75rem` | $28\text{px}$ | H1/H2 main headings, hero titles |

### 1.3 Border Width Tokens (`--border-sm/md/lg/xlg`)

| Token Variable | Value | Recommended Usage |
| :--- | :--- | :--- |
| `--border-sm` | `1px` | Subtle dividers, default input fields, standard card outlines |
| `--border-md` | `2px` | Hover states, active buttons, focused form elements |
| `--border-lg` | `3px` | Selected card states, highlighted callouts |
| `--border-xlg` | `4px` | Accent bars, active tab indicators, heavy framing |

### 1.4 Border Color Tokens (`--border-lighter/light/medium/dark`)
Dynamic color tokens that automatically adjust depending on theme state.

| Token Variable | Light Mode Color | Dark Mode Color | Intended Use |
| :--- | :--- | :--- | :--- |
| `--border-lighter` | `hsla(210, 15%, 92%, 1)` | `hsla(210, 15%, 20%, 1)` | Very subtle dividers, inactive tabs |
| `--border-light` | `hsla(210, 15%, 85%, 1)` | `hsla(210, 15%, 28%, 1)` | Standard component borders, card edges |
| `--border-medium` | `hsla(210, 15%, 65%, 1)` | `hsla(210, 15%, 45%, 1)` | Form inputs, dropdown outlines |
| `--border-dark` | `hsla(210, 15%, 35%, 1)` | `hsla(210, 15%, 75%, 1)` | High-contrast borders, focus rings, active states |

### 1.5 Box Shadow Tokens (`--shadow-*`)

| Token Variable | Value | Application |
| :--- | :--- | :--- |
| `--shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Buttons, small badges, inline elements |
| `--shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` | Standard cards, dropdown menus |
| `--shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` | Popovers, flyout panels, sticky headers |
| `--shadow-xlg` | `0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` | Modals, lightboxes, major overlays |

### 1.6 Border Radius Tokens (`--radius-*`)

| Token Variable | Value | Target UI Elements |
| :--- | :--- | :--- |
| `--radius-sm` | `4px` | Chips, tags, small action buttons, table rows |
| `--radius-md` | `8px` | Standard buttons, input boxes, select dropdowns |
| `--radius-lg` | `12px` | Content cards, container boxes, dialog bodies |
| `--radius-xlg` | `24px` | Large feature cards, hero containers, floating action bars |

### 1.7 Background Color Tokens (`--bg-lighter/light/medium/dark`)

| Token Variable | Light Theme Base | Dark Theme Base | Role |
| :--- | :--- | :--- | :--- |
| `--bg-lighter` | `hsl(0, 0%, 100%)` | `hsl(220, 18%, 16%)` | Elevated surface (Modals, Popovers, Tooltips) |
| `--bg-light` | `hsl(210, 20%, 98%)` | `hsl(220, 18%, 12%)` | Card backgrounds, panel surfaces |
| `--bg-medium` | `hsl(210, 15%, 93%)` | `hsl(220, 18%, 8%)` | Page canvas, main view background |
| `--bg-dark` | `hsl(210, 15%, 85%)` | `hsl(220, 18%, 4%)` | Inverted surfaces, dark accent blocks, sidebars |

---

## 2. LLM Context Window Token Reduction Strategy

When writing CSS or HTML, AI agents must prioritize global styles over inline or verbose repeated utility styles. This strategy decreases output token generation costs by up to $70\%$ while producing cleaner code.

### 2.1 Context Token Optimization Principles

1. **Single Source of Truth**: Define the tokens once in a global `:root` stylesheet block.
2. **Avoid Inline Style Attributes**: Never output `style="padding: 16px; border-radius: 8px;"`. Use semantic classes (`.card`, `.btn`) or direct element styling.
3. **Avoid Repetitive Micro-Utilities**: Prefer semantic global components over writing massive multi-line utility classes repeatedly across JSX/HTML files.
4. **Leverage CSS Cascade & Inheritance**: Set font sizes, line heights, colors, and border defaults on parent wrappers or base elements (`body`, `main`, `form`).

### 2.2 LLM Efficiency Comparison Example

#### Bad Practice: Verbose Inline Utility Approach (High Token Expenditure)
```html
<!-- High token usage: 146 tokens generated per instance -->
<div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
  <h3 style="font-size: 1.25rem; margin-bottom: 8px; color: #1a202c;">Card Title</h3>
  <p style="font-size: 0.875rem; color: #4a5568; line-height: 1.5;">This is a description written with inline styles that wastes prompt tokens.</p>
  <button style="margin-top: 16px; padding: 8px 16px; background-color: #3182ce; border-radius: 8px; border: none; color: white;">Action</button>
</div>
```

#### Best Practice: Tokenized Global Architecture (Low Token Expenditure)
```html
<!-- Low token usage: Only 28 tokens generated per instance -->
<div class="card">
  <h3>Card Title</h3>
  <p>This is a description using global styles and tokens efficiently.</p>
  <button class="btn btn-primary">Action</button>
</div>
```

---

## 3. Dark Theme Implementation Standard

Dark mode must be handled using CSS custom property rebindings rather than duplicating selector logic. Agents must implement theme switching via the `data-theme` attribute on the root html element, with fallback support for system preferences.

### 3.1 Structural CSS Variable Architecture

```css
/* Core Light Theme (Default) */
:root {
  /* System Mode Indicator */
  color-scheme: light;

  /* Spacing Scale */
  --space-xsm: 0.25rem;
  --space-sm:  0.5rem;
  --space-md:  1rem;
  --space-lg:  1.5rem;
  --space-xlg: 2.5rem;

  /* Typography Scale */
  --font-xsm: 0.75rem;
  --font-sm:  0.875rem;
  --font-md:  1rem;
  --font-lg:  1.25rem;
  --font-xlg: 1.75rem;

  /* Border Dimensions */
  --border-sm:  1px;
  --border-md:  2px;
  --border-lg:  3px;
  --border-xlg: 4px;

  /* Border Color Palette */
  --border-lighter: hsla(210, 15%, 92%, 1);
  --border-light:   hsla(210, 15%, 85%, 1);
  --border-medium:  hsla(210, 15%, 65%, 1);
  --border-dark:    hsla(210, 15%, 35%, 1);

  /* Elevation & Shadows */
  --shadow-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xlg: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  /* Corner Radii */
  --radius-sm:  4px;
  --radius-md:  8px;
  --radius-lg:  12px;
  --radius-xlg: 24px;

  /* Surface Background Colors */
  --bg-lighter: hsl(0, 0%, 100%);
  --bg-light:   hsl(210, 20%, 98%);
  --bg-medium:  hsl(210, 15%, 93%);
  --bg-dark:    hsl(210, 15%, 85%);

  /* Base Text Colors */
  --text-main:       hsl(220, 20%, 10%);
  --text-muted:      hsl(220, 10%, 40%);
  --text-interactive: hsl(215, 90%, 50%);
}

/* Explicit Dark Theme Rebindings */
[data-theme="dark"] {
  color-scheme: dark;

  /* Inverted Background Surface Colors */
  --bg-lighter: hsl(220, 18%, 16%);
  --bg-light:   hsl(220, 18%, 12%);
  --bg-medium:  hsl(220, 18%, 8%);
  --bg-dark:    hsl(220, 18%, 4%);

  /* Inverted Border Palette */
  --border-lighter: hsla(210, 15%, 20%, 1);
  --border-light:   hsla(210, 15%, 28%, 1);
  --border-medium:  hsla(210, 15%, 45%, 1);
  --border-dark:    hsla(210, 15%, 75%, 1);

  /* Adjusted Dark Mode Elevation Shadows */
  --shadow-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4);
  --shadow-xlg: 0 20px 25px -5px rgba(0, 0, 0, 0.8), 0 10px 10px -5px rgba(0, 0, 0, 0.6);

  /* Inverted Text Colors */
  --text-main:       hsl(0, 0%, 95%);
  --text-muted:      hsl(220, 10%, 65%);
  --text-interactive: hsl(215, 100%, 65%);
}

/* Automatic OS Preference Support */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;

    --bg-lighter: hsl(220, 18%, 16%);
    --bg-light:   hsl(220, 18%, 12%);
    --bg-medium:  hsl(220, 18%, 8%);
    --bg-dark:    hsl(220, 18%, 4%);

    --border-lighter: hsla(210, 15%, 20%, 1);
    --border-light:   hsla(210, 15%, 28%, 1);
    --border-medium:  hsla(210, 15%, 45%, 1);
    --border-dark:    hsla(210, 15%, 75%, 1);

    --shadow-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.4);
    --shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.5);
    --shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.6);
    --shadow-xlg: 0 20px 25px -5px rgba(0, 0, 0, 0.8);

    --text-main:       hsl(0, 0%, 95%);
    --text-muted:      hsl(220, 10%, 65%);
    --text-interactive: hsl(215, 100%, 65%);
  }
}
```

---

## 4. Master Global CSS Foundation Specification

AI Agents should reference or generate this compact master global CSS block (`global.css`) at project initialization to avoid writing redundant CSS code later.

```css
/* ==========================================================================
   GLOBAL BASE & UTILITIES STYLESHEET (TOKEN-OPTIMIZED)
   ========================================================================== */

/* 1. Reset & Root Setup */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-medium);
  color: var(--text-main);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: var(--font-md);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

/* 2. Global Typography Defaults */
h1 { font-size: var(--font-xlg); font-weight: 700; margin-bottom: var(--space-md); }
h2 { font-size: var(--font-lg);  font-weight: 600; margin-bottom: var(--space-sm); }
h3 { font-size: var(--font-lg);  font-weight: 500; margin-bottom: var(--space-sm); }
small, .text-sm { font-size: var(--font-sm); }
.text-xsm { font-size: var(--font-xsm); }
.text-muted { color: var(--text-muted); }

/* 3. Reusable Layout Utilities */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-md);
}

.flex-row { display: flex; align-items: center; gap: var(--space-md); }
.flex-col { display: flex; flex-direction: column; gap: var(--space-md); }
.grid-auto { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-md); }

/* Spacing Helpers */
.gap-xsm { gap: var(--space-xsm); }
.gap-sm  { gap: var(--space-sm); }
.gap-md  { gap: var(--space-md); }
.gap-lg  { gap: var(--space-lg); }
.gap-xlg { gap: var(--space-xlg); }

.p-sm  { padding: var(--space-sm); }
.p-md  { padding: var(--space-md); }
.p-lg  { padding: var(--space-lg); }
.p-xlg { padding: var(--space-xlg); }

/* 4. Core UI Components */

/* Cards */
.card {
  background-color: var(--bg-light);
  border: var(--border-sm) solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.card-elevated {
  background-color: var(--bg-lighter);
  border: var(--border-sm) solid var(--border-lighter);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-lg);
}

/* Interactive Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-md);
  font-weight: 500;
  border-radius: var(--radius-md);
  border: var(--border-sm) solid transparent;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  text-decoration: none;
}

.btn-primary {
  background-color: var(--text-interactive);
  color: #ffffff;
  border-color: transparent;
}

.btn-primary:hover {
  opacity: 0.9;
  box-shadow: var(--shadow-sm);
}

.btn-secondary {
  background-color: var(--bg-lighter);
  color: var(--text-main);
  border: var(--border-sm) solid var(--border-medium);
}

.btn-secondary:hover {
  background-color: var(--bg-medium);
  border-color: var(--border-dark);
}

/* Form Controls */
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xsm);
  margin-bottom: var(--space-md);
}

.form-label {
  font-size: var(--font-sm);
  font-weight: 600;
  color: var(--text-main);
}

.input-text, .select-input {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-md);
  background-color: var(--bg-lighter);
  color: var(--text-main);
  border: var(--border-sm) solid var(--border-medium);
  border-radius: var(--radius-md);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-text:focus, .select-input:focus {
  border-color: var(--text-interactive);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

/* Badges & Tags */
.badge {
  display: inline-block;
  padding: var(--space-xsm) var(--space-sm);
  font-size: var(--font-xsm);
  font-weight: 600;
  border-radius: var(--radius-sm);
  background-color: var(--bg-dark);
  color: var(--text-main);
  border: var(--border-sm) solid var(--border-light);
}

/* Modals & Dialog Overlays */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  z-index: 1000;
}

.modal-content {
  background-color: var(--bg-lighter);
  border: var(--border-sm) solid var(--border-lighter);
  border-radius: var(--radius-xlg);
  padding: var(--space-xlg);
  box-shadow: var(--shadow-xlg);
  max-width: 500px;
  width: 100%;
}
```

---

## 5. UI Component Implementation Templates

When building components in React, Vue, HTML, or Svelte, agents must utilize the predefined tokens and classes rather than authoring custom element styles.

### 5.1 User Profile Card Component Example

#### Target Output Code (Concise & Clean)
```html
<article class="card flex-col gap-md">
  <div class="flex-row gap-md">
    <img src="avatar.jpg" alt="User Avatar" style="width: 48px; height: 48px; border-radius: var(--radius-xlg);" />
    <div>
      <h3>Alex Rivera</h3>
      <p class="text-sm text-muted">Senior Frontend Engineer</p>
    </div>
    <span class="badge" style="margin-left: auto;">PRO</span>
  </div>
  
  <p class="text-sm">
    Architecting scalable web interfaces using modular tokenized design systems and lightweight stylesheets.
  </p>

  <footer class="flex-row gap-sm" style="margin-top: var(--space-sm);">
    <button class="btn btn-primary">Connect</button>
    <button class="btn btn-secondary">View Profile</button>
  </footer>
</article>
```

### 5.2 Responsive Settings Form Example

```html
<form class="card-elevated flex-col gap-lg">
  <div>
    <h2>Account Settings</h2>
    <p class="text-sm text-muted">Manage your personal details and theme preferences.</p>
  </div>

  <div class="form-group">
    <label class="form-label" for="username">Username</label>
    <input id="username" type="text" class="input-text" value="alex_rivera" />
  </div>

  <div class="form-group">
    <label class="form-label" for="theme-select">Interface Theme</label>
    <select id="theme-select" class="select-input">
      <option value="system">System Default</option>
      <option value="light">Light Theme</option>
      <option value="dark">Dark Theme</option>
    </select>
  </div>

  <div class="flex-row gap-md" style="justify-content: flex-end;">
    <button type="button" class="btn btn-secondary">Cancel</button>
    <button type="submit" class="btn btn-primary">Save Changes</button>
  </div>
</form>
```

---

## 6. AI Agent Execution Directives & Rules

Agents generating code must follow this checklist:

### Rule 1: Always Reference Custom Tokens
Never hardcode structural values ($16\text{px}$, $8\text{px}$, `#ffffff`, `#121212`) directly into component style declarations. Always use `var(--token-name)`.

### Rule 2: Enforce Suffix Scalability
When scaling element proportions, step strictly through the scale keys:
* Spacing: `--space-xsm` → `--space-sm` → `--space-md` → `--space-lg` → `--space-xlg`
* Typography: `--font-xsm` → `--font-sm` → `--font-md` → `--font-lg` → `--font-xlg`
* Radii: `--radius-sm` → `--radius-md` → `--radius-lg` → `--radius-xlg`
* Borders: `--border-sm` → `--border-md` → `--border-lg` → `--border-xlg`
* Backgrounds: `--bg-lighter` → `--bg-light` → `--bg-medium` → `--bg-dark`
* Border Colors: `--border-lighter` → `--border-light` → `--border-medium` → `--border-dark`

### Rule 3: Dark Mode Handling
Do **NOT** write custom media queries inside individual component styles. Design components using `--bg-*`, `--border-*`, and `--text-*` variables. Theme changes are automatically handled by the parent container attribute `[data-theme="dark"]` or `:root`.

### Rule 4: Context Window Token Preservation
1. Avoid verbose inline utility framework markup if a global rule (`.btn`, `.card`, `.form-group`) can be referenced.
2. Group CSS rules logically.
3. Keep component templates lean and semantic.

---

## 7. Token Mapping & Reference Guide

```
+-----------------------------------------------------------------------------------+
|                            CSS DESIGN TOKEN TAXONOMY                              |
+-------------------+--------------------+--------------------+---------------------+
| Domain            | Scale Suffix       | CSS Property       | Example Usage       |
+-------------------+--------------------+--------------------+---------------------+
| Spacing           | xsm, sm, md, lg,   | padding, margin,   | gap: var(--space-md)|
|                   | xlg                | gap, inset         |                     |
+-------------------+--------------------+--------------------+---------------------+
| Typography        | xsm, sm, md, lg,   | font-size          | font-size:          |
|                   | xlg                |                    | var(--font-lg)      |
+-------------------+--------------------+--------------------+---------------------+
| Border Width      | sm, md, lg, xlg    | border-width       | border-width:       |
|                   |                    |                    | var(--border-sm)    |
+-------------------+--------------------+--------------------+---------------------+
| Border Color      | lighter, light,    | border-color       | border-color:       |
|                   | medium, dark       |                    | var(--border-light) |
+-------------------+--------------------+--------------------+---------------------+
| Box Shadow        | sm, md, lg, xlg    | box-shadow         | box-shadow:         |
|                   |                    |                    | var(--shadow-md)    |
+-------------------+--------------------+--------------------+---------------------+
| Border Radius     | sm, md, lg, xlg    | border-radius      | border-radius:      |
|                   |                    |                    | var(--radius-md)    |
+-------------------+--------------------+--------------------+---------------------+
| Background Surface| lighter, light,    | background-color   | background-color:   |
|                   | medium, dark       |                    | var(--bg-light)     |
+-------------------+--------------------+--------------------+---------------------+
```

---

## 8. Summary Checklist for Code Reviews

Before returning generated code, verify:
- [ ] Are all spacing values represented by `--space-*` tokens?
- [ ] Are font sizes driven by `--font-*` variables?
- [ ] Are borders using both width (`--border-sm/md/lg/xlg`) and color (`--border-lighter/light/medium/dark`) tokens?
- [ ] Is dark mode supported seamlessly without inline overrides?
- [ ] Is HTML component markup concise to preserve LLM token usage?

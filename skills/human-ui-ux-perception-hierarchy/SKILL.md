---
name: "human-ui-ux-perception-hierarchy"
description: "Comprehensive UI/UX architecture skill governing human cognitive perception, visual scanning patterns, 60-30-10 color disposition, typographic scale, and structural hierarchy across e-commerce shops, data forms, landing pages, and web applications."
---

## name: human-ui-ux-perception-hierarchy
description: Comprehensive UI/UX architecture skill governing human cognitive perception, visual scanning patterns, 60-30-10 color disposition, typographic scale, and structural hierarchy across e-commerce shops, data forms, landing pages, and web applications.
version: 1.0.0
category: UI/UX Design & Human Factors Engineering
author: Senior UI/UX Architect

# Agent Skill: Human Perception, Color Disposition & Visual Hierarchy

## Executive Overview

This skill instruction set governs how AI coding agents design, lay out, and structure user interfaces based on human visual cognitive ergonomics. Humans do not read interfaces line-by-line; they scan visually based on contrast, spatial grouping, optical weight, and color distribution.

When generating HTML, CSS, React components, or full web interfaces, agents must apply the perception laws, color distribution ratios, and layout blueprints defined in this specification to ensure low cognitive friction and high user conversion.

---

## 1. Principles of Human Visual Perception & Ergonomics

### 1.1 Gestalt Laws of Visual Grouping

Human visual processing instantly groups layout elements based on spatial and structural relationships before interpreting content.

| Gestalt Principle | Perception Mechanism | UI Implementation Rule |
| :--- | :--- | :--- |
| **Proximity** | Elements placed near each other are perceived as a related group. | Items within a card must have smaller gap (`--space-sm`) than the spacing between cards (`--space-lg`). |
| **Similarity** | Elements sharing visual traits (color, shape, size) are perceived as having identical functions. | All primary call-to-action (CTA) buttons must share the exact same background accent color and corner radius. |
| **Continuity** | The eye naturally follows lines, edges, and aligned paths. | Align form labels, inputs, and primary action buttons along a single vertical axis. |
| **Closure** | The mind completes incomplete shapes or off-screen elements. | Use horizontal scroll cards with $20\%$ of the next card exposed past the container edge to signal overflow. |
| **Common Region** | Elements enclosed within a shared boundary belong together. | Wrap product details, pricing, and buy controls within a defined border (`--border-light`) or background card surface (`--bg-light`). |
| **Figure/Ground** | The eye separates front objects (figure) from back environments (ground). | Modals and dropdowns must use ambient drop shadows (`--shadow-xlg`) and darkened backdrop scrims to pull forward from the page canvas. |

---

### 1.2 Cognitive Efficiency Laws

Agents must design interfaces that minimize mental processing overhead (cognitive load).

#### Hick-Hyman Law (Decision Speed)
The time $T$ required to make a decision increases logarithmically with the number $n$ of presented options:

$$T = b \cdot \log_2(n + 1)$$

* **Rule:** Never present more than $5 \text{ to } 7$ choices simultaneously without visual grouping. Use accordion filters on e-commerce sites and progressive multi-step flows for complex forms.

#### Fitts's Law (Target Acquisition)
The time $MT$ required to rapidly move to a target area is a function of the ratio between the distance $D$ to the target and the width $W$ of the target:

$$MT = a + b \cdot \log_2\left(\frac{2D}{W}\right)$$

* **Rule:** Interactive elements (buttons, inputs, links) must have adequate hit areas ($W \ge 44\text{px} \times 44\text{px}$ for touch/mobile). Primary actions must be positioned near natural thumb zones or at the end of a form's visual scanning path.

#### Miller's Law (Chunking Capacity)
The average human working memory can hold approximately $7 \pm 2$ information chunks at one time.

* **Rule:** Group long content lists, form fields, and navigation links into distinct visual clusters containing no more than $4 \text{ to } 6$ items per block.

---

### 1.3 Natural Visual Scanning Patterns

Users process layouts according to predetermined scanning trajectories. Agents must align visual elements along these natural focal lines.

```
F-PATTERN (Text / Content-Heavy Pages)       Z-PATTERN (Landing Pages & Shops)
+-----------------------------------+        +-----------------------------------+
| 1=============>================== |        | [Logo] 1=====================> [CTA]|
| ||                                |        |      \                            |
| 2=========>                       |        |       \ [Hero Tagline]            |
| ||                                |        |        \                          |
| 3===>                             |        |         2=====================>   |
| ||                                |        |         [Primary CTA Button]      |
+-----------------------------------+        +-----------------------------------+
```

1. **F-Pattern**: Dominates blogs, documentation, search results, and text feeds.
   * Place vital keywords and subheadings on the left edge.
   * Keep paragraph widths restricted to $45 \text{ to } 75$ characters per line.

2. **Z-Pattern**: Dominates landing pages, shop homepages, and visual promotional banners.
   * **Top-Left**: Brand identity / logo.
   * **Top-Right**: Primary action / navigation menu.
   * **Center**: Hero headline and visual illustration.
   * **Bottom-Right**: Main conversion action (e.g., "Get Started", "Shop Now").

---

## 2. Color Disposition & Chromatic Strategy

Color must not be distributed arbitrarily. It serves a functional hierarchy where luminance, saturation, and area ratio direct human attention.

```
       +-------------------------------------------------------+
       |                                                       |
       |                   60% CANVAS BASE                     |
       |                (--bg-medium / --bg-light)             |
       |                                                       |
       |         +-----------------------------------+         |
       |         |          30% STRUCTURE            |         |
       |         |       (--text-main / --border)    |         |
       |         |                                   |         |
       |         |         +-------------------+     |         |
       |         |         |  10% ACCENT (CTA) |     |         |
       |         |         |  (--shop-accent)  |     |         |
       |         |         +-------------------+     |         |
       |         +-----------------------------------+         |
       +-------------------------------------------------------+
```

### 2.1 The 60-30-10 Spatial Rule

To avoid visual fatigue and maintain clear focus, agents must structure color usage according to strict spatial proportions:

1. **$60\%$ Dominant Base (Canvas & Neutral Surfaces)**
   * **Tokens**: `--bg-medium`, `--bg-light`, `--bg-lighter`
   * **Function**: Background canvas, structural card surfaces, modal backdrop areas. Must remain low saturation to eliminate visual noise.

2. **$30\%$ Structural Secondary (Typography, Framing, Borders)**
   * **Tokens**: `--text-main`, `--text-muted`, `--border-medium`, `--border-light`
   * **Function**: Typography, layout dividers, iconography, passive UI borders, form outlines. Establishes structural contrast and legibility.

3. **$10\%$ Focal Accent (Action Triggers & High-Priority Badges)**
   * **Tokens**: `--shop-accent-azure`, `--color-primary-cta`
   * **Function**: Primary action buttons ("Add to Cart", "Submit"), active tab indicators, high-priority notifications, unread badges. Must be high contrast relative to the $60\%$ base.

---

### 2.2 Contrast Ratios & WCAG 2.1 Standards

All text and critical UI indicators must comply with Web Content Accessibility Guidelines (WCAG) contrast requirements:

$$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$

Where $L_1$ is the relative luminance of the lighter color and $L_2$ is the relative luminance of the darker color.

| UI Element Type | Minimum WCAG AA | Target WCAG AAA | Design Standard |
| :--- | :--- | :--- | :--- |
| **Normal Body Text** ($< 18\text{pt}$) | $4.5:1$ | $7.0:1$ | Primary text on canvas |
| **Large Headings** ($\ge 18\text{pt}$ or $14\text{pt}$ bold) | $3.0:1$ | $4.5:1$ | Section titles, H1/H2 elements |
| **UI Controls & Icons** | $3.0:1$ | $4.5:1$ | Input borders, radio buttons, icons |
| **Disabled Elements** | Exempt | Exempt | Reduced opacity ($40\% \text{ to } 50\%$) |

---

### 2.3 Semantic Color System Architecture

Colors carry pre-attentive mental associations. Agents must map system colors deterministically:

```css
:root {
  /* Surface & Canvas System (60%) */
  --color-canvas-base:       #1e232a;
  --color-surface-card:      #262c35;
  --color-surface-elevated:  #303743;

  /* Typography & Structure (30%) */
  --color-text-primary:      #f8fafc;
  --color-text-secondary:    #94a3b8;
  --color-border-subtle:     #334155;

  /* Conversion Accent (10%) */
  --color-accent-action:     #7ca9f4;
  --color-accent-hover:      #6093e9;

  /* Functional Status Indicators */
  --color-status-success:    #10b981;
  --color-status-warning:    #f59e0b;
  --color-status-danger:     #ef4444;
  --color-status-info:       #3b82f6;
}
```

---

## 3. Visual Hierarchy & Optical Weight

Visual hierarchy dictates the exact sequence in which a user notices content. Agents must manipulate size, weight, space, elevation, and contrast to establish explicit optical order.

### 3.1 Typographic Hierarchy Scale

Typography must strictly follow a modular geometric scale (e.g., Major Third $1.250$ or Perfect Fourth $1.333$).

```
LEVEL 1: Hero Heading (H1)  ----------------------> font-size: 2.25rem (36px) | weight: 700
  LEVEL 2: Section Title (H2) --------------------> font-size: 1.75rem (28px) | weight: 600
    LEVEL 3: Component Header (H3) ---------------> font-size: 1.25rem (20px) | weight: 600
      LEVEL 4: Body Primary Text -----------------> font-size: 1.00rem (16px) | weight: 400
        LEVEL 5: Secondary / Caption -------------> font-size: 0.75rem (12px) | weight: 400
```

#### Typographic Rules
1. **Never skip hierarchy levels**: Do not place an `H3` immediately under an `H1` without an `H2` context.
2. **Line Height Scaling**: Smaller text requires larger proportional line height.
   * Body text ($16\text{px}$): `line-height: 1.5` ($24\text{px}$).
   * Display Headings ($36\text{px}$): `line-height: 1.2` ($43.2\text{px}$).
3. **Weight Contrast**: Maintain at least a $200$-unit font-weight difference between adjacent hierarchical elements (e.g., Bold `700` headline with Regular `400` body text).

---

### 3.2 Elevation & Spatial Layering

Spatial depth communicates interactive priority. Higher surfaces represent closer proximity to the user and demand immediate attention.

```
+-----------------------------------------------------------------------+
| LEVEL 0: Canvas Base (--bg-medium)                                    |
|                                                                       |
|   +---------------------------------------------------------------+   |
|   | LEVEL 1: Resting Cards (--bg-light + --shadow-sm)             |   |
|   |                                                               |   |
|   |   +-------------------------------------------------------+   |   |
|   |   | LEVEL 2: Hover / Active (--bg-lighter + --shadow-md)  |   |   |
|   |   +-------------------------------------------------------+   |   |
|   +---------------------------------------------------------------+   |
|                                                                       |
|   +---------------------------------------------------------------+   |
|   | LEVEL 3: Floating Modals & Tooltips (--shadow-xlg)            |   |
|   +---------------------------------------------------------------+   |
+-----------------------------------------------------------------------+
```

| Depth Level | Visual Cue | CSS Elevation Specification | UI Target |
| :--- | :--- | :--- | :--- |
| **Level 0 (Flat)** | No shadow, base background | `background-color: var(--bg-medium);` | Page background canvas |
| **Level 1 (Raised)** | Minimal subtle drop shadow | `box-shadow: var(--shadow-sm); border: var(--border-sm) solid var(--border-light);` | Product cards, list containers |
| **Level 2 (Hovered)**| Mid shadow, elevated background | `box-shadow: var(--shadow-md); transform: translateY(-2px);` | Active cards, focused inputs |
| **Level 3 (Overlay)**| Heavy drop shadow + scrim | `box-shadow: var(--shadow-xlg); z-index: 1000;` | Popovers, modals, dropdown menus |

---

## 4. Layout Blueprint: E-Commerce & Shop Systems

E-commerce UI must minimize friction between product discovery and checkout execution.

### 4.1 Product Detail Page (PDP) Layout Architecture

```
+-----------------------------------------------------------------------+
| [Header / Nav Bar - Sticky / High Visibility]                         |
+----------------------------------+------------------------------------+
|                                  |                                    |
|  PRIMARY PRODUCT GALLERY         |  PRODUCT BUY BOX (Focal Target)    |
|  (Left Column - 60% Width)       |  (Right Column - 40% Width)        |
|                                  |                                    |
|  +----------------------------+  |  Category / Brand (Small Caption)  |
|  |                            |  |  --------------------------------  |
|  |                            |  |  Product Title (H1 - Bold)         |
|  |  Main Image Display        |  |  Star Rating + Review Count        |
|  |                            |  |  --------------------------------  |
|  |                            |  |  Price Tag (H2 - Accent Highlight) |
|  +----------------------------+  |  Variants: Color / Size Selector   |
|  | Thumbnail | Thumb | Thumb |  |  --------------------------------  |
|                                  |  [ ADD TO CART - PRIMARY 10% CTA ]  |
|                                  |  [ BUY NOW - SECONDARY ACTION   ]  |
|                                  |  --------------------------------  |
|                                  |  Trust Badges: Shipping/Returns    |
+----------------------------------+------------------------------------+
```

#### PDP Hierarchy Rules
1. **The Buy Box Anchor**: Keep the buy box fixed or immediately visible above the fold on desktop.
2. **Price & CTA Contrast**: The "Add to Cart" button must be the single highest-contrast element in the right column. Use `--color-accent-action`.
3. **Micro-Trust Indicators**: Place secure payment icons, stock status ("In Stock - Ships Today"), and money-back guarantees immediately under the primary CTA button to relieve purchase anxiety.

---

### 4.2 Product Listing Page (PLP) Grid Architecture

```
+-----------------------------------------------------------------------+
| Filters Bar (Horizontal or Left Column) | Sort By Dropdown            |
+-----------------------------------------------------------------------+
| +-----------------------+  +-----------------------+  +-------------+ |
| | [ Product Image ]     |  | [ Product Image ]     |  | ...         | |
| |                       |  |                       |  |             | |
| | Brand Name (Small)    |  | Brand Name (Small)    |  |             | |
| | Product Name (Bold)   |  | Product Name (Bold)   |  |             | |
| | $99.00 (High Contrast)|  | $149.00 (High Contrast|  |             | |
| | [ Quick Add Button ]  |  | [ Quick Add Button ]  |  |             | |
| +-----------------------+  +-----------------------+  +-------------+ |
+-----------------------------------------------------------------------+
```

* **Grid Spacing**: Use `--space-lg` ($24\text{px}$) gap between grid items to prevent optical clutter.
* **Image Ratio Aspect Isolation**: Maintain consistent aspect ratios ($1:1$ square or $4:5$ vertical portrait) to maintain horizontal scanning alignment across cards.

---

## 5. Layout Blueprint: Data Input & Form Architecture

Forms generate high cognitive friction. Layout decisions must focus on single-direction visual motion and immediate input validation.

### 5.1 Field Alignment & Layout Structure

```
RECOMMENDED (Single-Column Flow)             AVOID (Multi-Column Scannability Friction)
+---------------------------------+          +-----------------+ +-----------------+
| First Name                      |          | First Name      | | Last Name       |
| [ Input Field                 ] |          | [ Input       ] | | [ Input       ] |
|                                 |          +-----------------+ +-----------------+
| Last Name                       |          +-----------------+ +-----------------+
| [ Input Field                 ] |          | Email           | | Phone           |
|                                 |          | [ Input       ] | | [ Input       ] |
| Email Address                   |          +-----------------+ +-----------------+
| [ Input Field                 ] |          (Eye zig-zags, increasing completion time)
+---------------------------------+
```

#### Form Layout Standards
1. **Single-Column Standard**: Always stack form fields vertically. Multi-column forms disrupt downward eye-tracking and increase completion drop-off rates by up to $20\%$.
   * *Exception*: Short, naturally paired inputs like `City`, `State`, and `Zip Code` or `Card Expiration` and `CVC`.
2. **Top-Aligned Labels**: Place labels strictly above their corresponding input fields. Top-aligned labels require only 1 eye movement per field, whereas left-aligned labels require 2 eye movements.
3. **Spacing Ratios**:
   * Distance between Label and Input: `--space-xsm` ($4\text{px}$).
   * Distance between Field Groups: `--space-md` ($16\text{px}$).

---

### 5.2 Input Field Visual States

Agents must implement clear visual distinction for every interactive state:

```css
/* Default State */
.input-field {
  background-color: var(--bg-lighter);
  border: var(--border-sm) solid var(--border-medium);
  border-radius: var(--radius-md);
  color: var(--text-main);
  padding: var(--space-sm) var(--space-md);
  transition: all 0.2s ease-in-out;
}

/* Focus State (High Focus Ring Visibility) */
.input-field:focus {
  border-color: var(--color-accent-action);
  box-shadow: 0 0 0 3px rgba(124, 169, 244, 0.35);
  outline: none;
}

/* Error State (Immediate Attention) */
.input-field.error {
  border-color: var(--color-status-danger);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

/* Success State */
.input-field.success {
  border-color: var(--color-status-success);
}
```

---

### 5.3 Form Action Hierarchy

Primary submit controls must be optically distinct from secondary destructive or cancel options.

```
+-----------------------------------------------------------------------+
|                                                                       |
|  [ Cancel / Back ]                     [ SUBMIT FORM - PRIMARY CTA ]  |
|  (Subdued Secondary Style)             (High Contrast Accent Button)  |
|                                                                       |
+-----------------------------------------------------------------------+
```

* **Primary Action**: Aligned right (forward momentum), filled background using `--color-accent-action`.
* **Secondary Action**: Aligned left, subtle outline or text-only style using `--text-muted`.

---

## 6. Layout Blueprint: Landing Pages & SaaS Funnels

Landing pages must capture attention within $3$ seconds through strong hero focal points and structured value blocks.

### 6.1 Above-The-Fold Hero Composition

```
+-----------------------------------------------------------------------+
| [Logo]                           Navigation Links        [Sign In]    |
+-----------------------------------------------------------------------+
|                                                                       |
|   TAGLINE BADGE (Small Caps, Highlight Background)                     |
|                                                                       |
|   Main Value Proposition Headline (H1 - Extra Bold)                   |
|   Sub-headline explaining the exact benefit clearly (Max 2 lines).    |
|                                                                       |
|   +---------------------------+   +-------------------------------+   |
|   | [ START FREE TRIAL ]      |   | [ Watch Demo Video ]          |   |
|   | (Primary 10% Accent CTA)  |   | (Secondary Ghost Button)      |   |
|   +---------------------------+   +-------------------------------+   |
|                                                                       |
|   Social Proof Text: "Trusted by 10,000+ teams"                       |
|   [ Logo 1 ]   [ Logo 2 ]   [ Logo 3 ]   [ Logo 4 ]                  |
|                                                                       |
+-----------------------------------------------------------------------+
```

---

### 6.2 Feature Matrix & Card Grid Layouts

When displaying platform capabilities or product features, organize content in balanced card grids with visual entry anchors.

```
+-----------------------------------------------------------------------+
|                     FEATURES & CAPABILITIES                           |
|         H2 Heading - Focused on Solution Benefits                     |
+-----------------------------------------------------------------------+
| +---------------------------------+ +-------------------------------+ |
| | [ Icon: 32px Accent Color ]     | | [ Icon: 32px Accent Color ]   | |
| | Feature Name (H3)               | | Feature Name (H3)             | |
| | Description text limited to three| | Description text limited to three| |
| | lines maximum for balance.      | | lines maximum for balance.    | |
| +---------------------------------+ +-------------------------------+ |
| +---------------------------------+ +-------------------------------+ |
| | [ Icon: 32px Accent Color ]     | | [ Icon: 32px Accent Color ]   | |
| | Feature Name (H3)               | | Feature Name (H3)             | |
| | Description text limited to three| | Description text limited to three| |
| | lines maximum for balance.      | | lines maximum for balance.    | |
| +---------------------------------+ +-------------------------------+ |
+-----------------------------------------------------------------------+
```

---

## 7. AI Agent UI Audit & Generation Checklist

Before generating or finalizing any user interface code, agents must evaluate their markup against this 15-point checklist:

### Color & Contrast Validation
* [ ] Is the $60\text{-}30\text{-}10$ color distribution ratio maintained across the page?
* [ ] Is there only **one** dominant primary CTA accent color per view?
* [ ] Do all text elements meet WCAG AA minimum contrast ($4.5:1$ for body, $3:1$ for large headings)?
* [ ] Are background surfaces properly layered using depth tokens (`--bg-medium` canvas $\rightarrow$ `--bg-light` surface $\rightarrow$ `--bg-lighter` overlay)?

### Visual Hierarchy Validation
* [ ] Is there a clear, single `H1` headline establishing the top visual anchor?
* [ ] Do font weights scale logically (e.g., Heavy `700` headings down to Regular `400` body text)?
* [ ] Are section headers visually separated from preceding content with wider margins (`--space-xlg`) than following content (`--space-sm`)?

### Spatial Ergonomics & Layout
* [ ] Does the page layout follow an established visual scan path (Z-pattern for landing pages, F-pattern for text content)?
* [ ] Are input forms structured in a clean, single-column vertical orientation?
* [ ] Are interactive click/touch targets sized to at least $44\text{px} \times 44\text{px}$?
* [ ] Is white space used effectively around major focal elements to prevent cognitive overload?

### Functional Component Polish
* [ ] Do form fields feature distinct `:focus` halo outlines for keyboard navigation?
* [ ] Are product prices and primary purchasing triggers clear and un-obscured above the fold?
* [ ] Are micro-trust badges positioned directly beneath primary high-friction conversion buttons?
* [ ] Are error states visually distinct using standard semantic warning/danger colors?

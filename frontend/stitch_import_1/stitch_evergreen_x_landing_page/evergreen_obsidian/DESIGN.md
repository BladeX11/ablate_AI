# Design System Specification: The Ethereal Intelligence Framework

## 1. Overview & Creative North Star: "The Digital Curator"
This design system moves away from the rigid, boxed-in layouts of traditional enterprise SaaS. Our North Star is **The Digital Curator**: an interface that feels like a high-end editorial gallery—authoritative, breathable, and deeply sophisticated.

We reject "template" aesthetics. By leveraging intentional asymmetry, expansive negative space, and tonal depth, we create an environment where AI insights aren't just displayed—they are staged. The vibe is professional and quiet; it doesn't shout for attention but earns it through precision.

---

## 2. Colors & Surface Philosophy
The palette is rooted in deep obsidian tones, punctuated by high-frequency accents that mimic the "glow" of neural activity.

### The Palette (Material Logic)
*   **Neutral Foundation:** `background: #131313`, `surface: #131313`.
*   **Primary Accent (The Pulse):** `primary: #c0c1ff` (Indigo-tinted light).
*   **Secondary Accent (The Flow):** `secondary: #4cd7f6` (Cyan-tinted light).
*   **Functional:** `error: #ffb4ab`, `tertiary (Success): #4edea3`.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. Traditional borders create visual noise that traps the eye. Instead, define boundaries through:
1.  **Background Shifts:** Place a `surface_container_low` card against a `surface` background.
2.  **Tonal Transitions:** Use the natural contrast between `surface_container_highest` and `surface_dim` to imply edge.

### Surface Hierarchy & Nesting
Think of the UI as layers of fine, dark paper. Use the container tokens to create "nested" importance:
*   **Level 0 (Base):** `surface` (#131313)
*   **Level 1 (Sections):** `surface_container_low` (#1C1B1B)
*   **Level 2 (Active Cards):** `surface_container_high` (#2A2A2A)
*   **Level 3 (Pop-overs/Modals):** `surface_container_highest` (#353534)

### Signature Textures (The Glass & Gradient Rule)
Main CTAs and hero elements must avoid flat fills. Apply a subtle linear gradient transitioning from `primary` to `primary_container` at a 135-degree angle. For floating navigation or sidebars, use **Glassmorphism**: `surface_variant` at 60% opacity with a `24px` backdrop-blur.

---

## 3. Typography: Editorial Authority
We use **Inter** as our typeface, but we treat it with editorial weight.

*   **Display (lg/md/sm):** Used for "Big Picture" AI data points or hero headlines. Tracking: -0.02em.
*   **Headline & Title:** Use `headline-lg` for section starts. Ensure significant vertical breathing room (minimum `spacing-16` above).
*   **Body (lg/md):** High-readability weights. Use `on_surface_variant` (#c7c4d7) for secondary body text to reduce visual vibration.
*   **Labels:** For technical metadata, use `label-sm` in all-caps with +0.05em tracking to evoke a "pro-tool" feel.

---

## 4. Elevation & Depth: Tonal Layering
We do not use structural lines. Depth is a product of light and stacking.

*   **The Layering Principle:** Place a `surface_container_lowest` (#0E0E0E) element inside a `surface_container` to create a "recessed" input area. Place a `surface_container_highest` element on top to create "lift."
*   **Ambient Shadows:** For floating elements (modals), use a shadow with `blur: 40px`, `y: 20px`, and an opacity of 6% using the `on_surface` color. It should feel like a soft glow, not a dark smudge.
*   **The Ghost Border:** If a border is required for accessibility, use `outline_variant` at **15% opacity**. A 100% opaque border is a failure of the system.

---

## 5. Components

### Buttons & Chips
*   **Primary Button:** Gradient fill (`primary` to `primary_container`), `rounded-md` (12px), white text.
*   **Secondary Button:** Ghost style. No background, `outline_variant` at 20% opacity.
*   **Chips:** Use `surface_container_highest` for the background. For active states, use a `primary` glow (2px outer blur).

### Input Fields
*   **Text Inputs:** Forgo the 4-sided box. Use a `surface_container_low` background with a `rounded-sm` (4px) bottom-only accent in `primary` when focused. 
*   **Error States:** Use `error` (#ffb4ab) for the label and a subtle `error_container` glow behind the input.

### Cards & Lists
*   **Rule:** No dividers. Separate list items using `spacing-4` vertical gaps.
*   **The "Evergreen" Layout:** Use asymmetrical padding (e.g., `padding-left: 24px`, `padding-right: 32px`) in cards to create a custom, high-end feel.

### Specialized AI Components
*   **The "Thought Stream":** For AI chat/logs, use `surface_container_lowest` for the user and `surface` for the AI, separated by a `spacing-12` vertical void. 
*   **Inference Chips:** Small, high-contrast labels using `secondary_fixed` to highlight AI confidence scores.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use `spacing-24` and `spacing-16` for outer margins to let the interface "breathe."
*   **Do** use "Glassmorphism" for any element that sits over a data visualization.
*   **Do** use `primary_fixed_dim` for icons to keep them sophisticated and muted.

### Don’t
*   **Don't** use `#000000` or `#FFFFFF`. Stay within the defined tonal tokens to maintain the "premium dark" vibe.
*   **Don't** use 1px solid lines to separate content. If you feel the need for a line, increase your whitespace instead.
*   **Don't** use sharp 0px corners. Every interactive element must adhere to the `rounded-md` (12px) or `rounded-lg` (16px) standard.
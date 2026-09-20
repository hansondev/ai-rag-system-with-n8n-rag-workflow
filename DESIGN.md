# Design System

## 1. Purpose

This is the implemented visual system for the Agentic Coding Boilerplate. It follows an **adapted Vercel-inspired** direction: near-neutral surfaces, fine border-led hierarchy, compact actions, restrained elevation, and purposeful motion without copying Vercel code, assets, or content. Use the semantic tokens, Tailwind utilities, and shared components in `src/components/ui/` to preserve consistency across light and dark themes.

## 2. Design Principles

- **Semantic first:** use `bg-background`, `text-foreground`, `border-border`, and related tokens instead of hard-coded colors.
- **Near-neutral, border-led hierarchy:** distinguish surfaces with semantic neutrals and thin borders before adding shadows or decorative fills.
- **Compact, clear actions:** favor the existing 32–40px button scale and direct labels.
- **Reuse before custom UI:** use the shadcn/Radix-based primitives and `cn()` from `@/lib/utils`.
- **Editorial responsiveness:** begin with one-column reading order; stack rows and grids cleanly before introducing `md:` or `lg:` columns.
- **Functional motion:** animate feedback, entry, and state changes only when it clarifies an interaction.
- **Accessible interaction:** retain semantic HTML, visible focus, labels, and disabled states.

## 3. Foundations

### Colors

All color tokens are semantic `oklch` CSS custom properties in `src/app/globals.css`, exposed to Tailwind by `@theme inline`. The low-chroma neutral palette keeps surfaces restrained; indigo-hued primary, accent, and ring tokens provide the interactive emphasis.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `background` | `oklch(1 0 0)` | `oklch(0.141 0.005 285.823)` | Page background |
| `foreground` | `oklch(0.141 0.005 285.823)` | `oklch(0.985 0 0)` | Primary text |
| `card` / `card-foreground` | `oklch(1 0 0)` / `oklch(0.141 0.005 285.823)` | `oklch(0.21 0.006 285.885)` / `oklch(0.985 0 0)` | Card surfaces |
| `popover` / `popover-foreground` | `oklch(1 0 0)` / `oklch(0.141 0.005 285.823)` | `oklch(0.21 0.006 285.885)` / `oklch(0.985 0 0)` | Menus and toasts |
| `primary` / `primary-foreground` | `oklch(0.21 0.034 270)` / `oklch(0.985 0 0)` | `oklch(0.92 0.02 270)` / `oklch(0.21 0.006 285.885)` | Primary actions and links |
| `secondary` / `secondary-foreground` | `oklch(0.967 0.001 286.375)` / `oklch(0.21 0.006 285.885)` | `oklch(0.274 0.006 286.033)` / `oklch(0.985 0 0)` | Secondary actions |
| `muted` / `muted-foreground` | `oklch(0.967 0.001 286.375)` / `oklch(0.552 0.016 285.938)` | `oklch(0.274 0.006 286.033)` / `oklch(0.705 0.015 286.067)` | Subdued surfaces and copy |
| `accent` / `accent-foreground` | `oklch(0.96 0.012 270)` / `oklch(0.21 0.006 285.885)` | `oklch(0.28 0.018 270)` / `oklch(0.985 0 0)` | Hover and highlight surfaces |
| `destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` | Errors and destructive actions |
| `border` / `input` | `oklch(0.92 0.004 286.32)` | `oklch(1 0 0 / 10%)` / `oklch(1 0 0 / 15%)` | Dividers and input borders |
| `ring` | `oklch(0.705 0.06 270)` | `oklch(0.552 0.05 270)` | Focus treatment |

`chart-1` through `chart-5` and the semantic `sidebar-*` token family are also implemented. Use their semantic Tailwind mappings rather than re-creating theme-specific values.

### Typography

- **Fonts:** Geist (`--font-geist-sans`) for UI text and Geist Mono (`--font-geist-mono`) for code, loaded with `next/font/google`.
- **Body:** `antialiased` with `font-feature-settings: "rlig" 1, "calt" 1`.
- **Scale:** `text-xs` 12px, `text-sm` 14px, `text-base` 16px, `text-lg` 18px, `text-xl` 20px, `text-2xl` 24px, `text-3xl` 30px, `text-4xl` 36px, `text-5xl` 48px.
- **Weights:** `font-medium` for controls and labels, `font-semibold` for section/card titles, and `font-bold` for page and hero titles.
- **Rhythm:** use the existing `leading-none` for titles, `leading-5` for code, `leading-6` for lists, `leading-7` for paragraphs, and `tracking-tight` for hero text.

### Spacing

Use the recurring `p-1`, `p-2`, `p-3`, `p-4`, and `p-6` scale. Vertical groups use `space-y-1` through `space-y-8`; use `gap-4` and `gap-6` for responsive editorial rows and grids. Standard containers use `container mx-auto px-4` and existing content limits range from `max-w-sm` for forms to `max-w-4xl` for primary content.

### Radius

`--radius` is `0.625rem` (10px). Use `rounded-md` (8px) for controls, `rounded-lg` (10px) for cards and dialogs, `rounded-xl` (14px) for larger feature treatments, and `rounded-full` for badges and avatars.

### Shadows

Borders establish default separation. Use Tailwind defaults sparingly: `shadow-xs` for outlined controls, `shadow-sm` for cards, `shadow-md` for interactive cards and menus, and `shadow-lg` for dialogs and submenus.

### Breakpoints

- **Base:** mobile-first, single-column reading order.
- **`sm` (640px):** compact padding and dialog-width refinements.
- **`md` (768px):** two-column rows/grids and compact control typography.
- **`lg` (1024px):** wider editorial grids and footer padding.

## 4. Layout

### Page Structure

Use the established full-height flex-column shell with a header, `main`, footer, and top-right toast region. Keep primary content inside a centered max-width wrapper; use bordered sections or cards to establish local hierarchy instead of excessive nested surfaces.

### Grid Rules

Start at `grid-cols-1`, then use implemented patterns where appropriate: `md:grid-cols-2` for paired content, `md:grid-cols-3` for concise statistics, and `lg:grid-cols-4` for feature overviews. Maintain `gap-4` or `gap-6` and preserve source reading order when stacked.

### Responsive Rules

Keep content full width inside its max-width wrapper. Stack action rows on small screens and place them inline from `sm` when space permits. Prefer clean grid-to-stack transitions over compressed multi-column layouts.

## 5. Components

### Buttons

`Button` supports `default`, `secondary`, `outline`, `ghost`, `destructive`, and `link`; sizes are `sm` (h-8 / 32px), default (h-9 / 36px), `lg` (h-10 / 40px), and `icon` (size-9 / 36px). It supports `asChild` for semantic links. Disabled buttons use `disabled:pointer-events-none disabled:opacity-50`.

### Inputs

`Input` is h-9 and `Textarea` has `min-h-16`; both use `rounded-md`, `border-input`, `shadow-xs`, `text-base md:text-sm`, muted placeholders, and `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`. Pair each field with the shared `Label`.

### Cards

`Card` provides a `rounded-lg border bg-card text-card-foreground shadow-sm` surface with `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter`. Use `.card-interactive` only for interactive cards; it adds a 200ms ease-out transition, `shadow-md`, and `-translate-y-0.5` on hover.

### Navigation

`SiteHeader` provides the primary site navigation, theme control, and visible-on-focus skip link. `DropdownMenu` provides compact menu content with a `min-w-[8rem] rounded-md border p-1 shadow-md` popover. `Avatar` is a size-8 circular image with muted fallback, and `Separator` is a 1px `bg-border` divider.

### Modals

`Dialog` is Radix-based with a `bg-black/50` overlay, fade/zoom animation, and `rounded-lg border p-6 shadow-lg` content. Its responsive width is `max-w-[calc(100%-2rem)]`, increasing to `sm:max-w-lg`; use a local override only when content requires it.

### Tables

No shared table primitive exists. When tabular data is needed, use semantic HTML (`table`, `thead`, `tbody`, `th`, `td`), semantic background/foreground/border tokens, and responsive overflow or an intentional stacked presentation. Do not introduce a table abstraction without a demonstrated reuse need.

### Feedback Components

- `Badge`: `default`, `secondary`, `destructive`, and `outline` variants; compact rounded-full labels.
- `Spinner`: Lucide `Loader2` at `sm` (h-4), `md` (h-6), or `lg` (h-8), using `animate-spin`.
- `Skeleton`: pulsing `bg-accent rounded-md` loading placeholder.
- `Toaster`: Sonner notifications themed from popover, border, and radius tokens.

## 6. Interaction States

- Keyboard focus uses `outline-2 outline-offset-2 outline-ring`; controls may add the implemented 3px indigo ring.
- Invalid buttons, inputs, and textareas use `aria-invalid:border-destructive` and a destructive ring.
- Links use primary color and an underline or opacity/color hover treatment.
- Dialogs and menus use `tw-animate-css` fade, zoom, and directional-slide classes. Custom entry utilities are `animate-fade-in` (0.3s), `animate-fade-up` (0.4s from 8px below), and `animate-scale-in` (0.2s from 0.97 scale), all ease-out.
- Theme selection is class-based through `next-themes`, defaults to system, and disables transitions during theme changes.

## 7. Forms and Validation

Use `<form>`, associated `Label`/`htmlFor` pairs, native required fields, and `space-y-2` field groups within a `space-y-4 max-w-sm` form. Disable fields and submit actions while pending. Render known validation errors beneath the relevant field or action as `text-sm text-destructive`; preserve native semantics and `aria-invalid`.

## 8. Empty, Loading, and Error States

- **Empty:** use concise muted copy that explains the absence and, when an action exists, the next useful step.
- **Loading:** use content-shaped `Skeleton` placeholders for loading surfaces and `Spinner` with an action-state label for active work.
- **Errors:** use `text-destructive`, a concise explanation, and a clear recovery action when the surrounding feature supports one. Do not rely on a toast as the sole error treatment.

## 9. Accessibility

- Use semantic header, nav, main, and footer landmarks; preserve the skip link and the root `lang` value.
- Preserve `aria-label` values and visually hidden names for icon-only controls.
- Pair labels and IDs, use native input types and `required`, and apply `aria-invalid` with visible error text when a field is invalid.
- Do not suppress keyboard focus; retain the global focus outline and component focus rings.
- Dialog, menu, label, and avatar behavior is based on Radix primitives. External links use `rel="noopener noreferrer"`.
- Support light, dark, and system appearance through semantic tokens, not fixed foreground/background values.

## 10. Content and Microcopy

- Use direct, action-led, sentence-case labels such as “Create account,” “Try again,” and “Clear chat.”
- State the next step after a successful action where useful.
- Keep errors plain and specific; do not invent technical detail.
- Use placeholders as examples, never as the only field label.
- Keep dense controls concise enough for the compact 32–40px action scale.

## 11. Implementation Guidelines

- Styling is Tailwind CSS v4 with CSS-first configuration in `src/app/globals.css`; there is no `tailwind.config.ts`.
- Import `cn()` from `@/lib/utils` for composed class names. Shared primitives expose `className`; do not duplicate their base styles without a local need.
- Use Lucide React for icons and hide decorative icons from assistive technology when appropriate.
- Use semantic color and radius tokens that adapt under `.dark`; preserve the `@theme inline` bridge.
- Preserve `auth-bg` and `card-interactive` when their existing treatments are needed. Prefer thin semantic borders and restrained shadow over new decorative effects.

## 12. Do / Don't Examples

| Do | Don't |
| --- | --- |
| Use `<Button asChild><Link … /></Button>` for button-styled internal navigation. | Wrap a button in a link when `asChild` is available. |
| Use `bg-muted text-muted-foreground` and `border-border` for secondary hierarchy. | Hard-code a light-only gray surface or add shadow to every container. |
| Pair each input with a `Label`, ID, native type, and required state where applicable. | Rely only on placeholders to identify fields. |
| Use `text-destructive` and `aria-invalid` for validation and errors. | Hide an error in a toast alone. |
| Use `Skeleton` for loading shapes and `Spinner` for active work. | Replace loading with unrelated generic decoration. |
| Stack grids and action rows before their content becomes cramped. | Preserve desktop columns on small screens. |

## 13. Changelog

### 2026-09-20

- Regenerated the document using the 13-section template and approved adapted Vercel-inspired direction.
- Preserved implemented semantic oklch light/dark tokens, indigo accent/ring, Geist fonts, 10px radius, Tailwind v4, and shadcn/Radix primitives.
- Added table guidance and documented border-led hierarchy, compact actions, restrained elevation, functional motion, and responsive editorial stacking.

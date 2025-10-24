# Storefront Styleguide (shadcn-aligned)

This project follows shadcn/ui conventions for consistent theming and easy theme replacement.

## Theme Tokens

Use Tailwind classes that map to CSS variables defined in `src/styles/globals.css`:

- Colors: `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-muted`, `border-border`, `ring-ring`
- Elevation: `shadow-sm|md|lg` as needed
- Focus: rely on component focus styles; avoid custom outlines

Avoid raw color utilities like `zinc-*`, `neutral-*`, `gray-*` unless communicating semantic states (e.g., `bg-green-100`).

## Layout

- Use `Container` as the max-width wrapper; avoid setting explicit `max-w-*` on each section.
- Sticky headers: `bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60`.

### Container

- Default is constrained to `max-w-7xl` with horizontal padding.
- Variants are legacy-named but simplified; prefer default with `className` for spacing.
- `asChild` is supported (Radix `Slot`); classes are forwarded to the child.

## Components

- Prefer primitives in `src/components/ui/*` (shadcn-derived):
  - Buttons, Cards, Inputs, Labels, Tabs, Select, Dialogs, Sheets, Skeleton, ScrollArea, etc.
- Dialogs/Sheets: use responsive primitives from `packages/ui` where available for consistency across apps.
- Carousels: use `src/components/ui/product-carousel.tsx` to avoid bespoke Embla wiring.

### Inputs — using InputWithLabel (project wrapper)

This template ships a thin wrapper `InputWithLabel` that composes shadcn `Label` + `Input` and standardizes helper/error text.

- Path: `src/components/ui/InputWithLabel.tsx`
- Usage:
  - Provide `label`, `id`, and any native input props.
  - Use `helperText` and `hasError` for validation messages.
  - It already uses shadcn tokens (`text-muted-foreground`, `text-destructive`) under the hood.

Example:

```
<InputWithLabel
  label="Email"
  id="email"
  type="email"
  placeholder="Enter your email"
  helperText={errors.email?.message}
  hasError={!!errors.email}
  {...register('email')}
/>
```

## Patterns

- Replace custom input wrappers with `<Label /> + <Input />`.
- Use `<Skeleton />` from `ui` (remove bespoke skeleton components).
- No inline styles for typography; rely on Tailwind sizes and section spacing.

## File Organization

- `src/components/ui`: base primitives only (no business logic)
- `src/components/<feature>`: feature building blocks (cart, product, header)
- `src/app/[locationId]/components`: page-specific composition layers

## Adding shadcn Components

Use the shadcn CLI to add new components and keep them colocated in `src/components/ui` with consistent aliases as configured in `components.json`.

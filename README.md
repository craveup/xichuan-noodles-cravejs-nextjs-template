Xixhuan Noodles Storefront Template (Next.js)
===========================================

An organization storefront template for multi-location brands. Built with Next.js (App Router), TypeScript, SWR, Tailwind, and shadcn/ui. This is intentionally in lockstep with the default CraveUp storefront template so external developers can jump between codebases without surprises.

Quickstart
----------
- Copy `.env.example` to `.env.local` and provide real values.
- Install deps with `pnpm install`.
- Start the dev server using `pnpm dev` (runs on port 3003 by default).
- Open `http://localhost:3003`.

Environment
-----------
- `NEXT_PUBLIC_CRAVEUP_API_KEY` — Storefront API key (required).
- `NEXT_PUBLIC_ORG_SLUG` — merchant slug whose locations should be listed.
- `NEXT_PUBLIC_API_URL` — optional override for the Storefront API base.
- `NEXT_PUBLIC_STOREFRONT_URL` — optional canonical URL used in metadata.
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — required for delivery address autocomplete/map embeds.
- Leave `NEXT_PUBLIC_DEFAULT_LOCATION_ID` unset to keep the landing page showing the location grid. (Set it only if you want to adopt single-location behaviour.)

Project Structure
-----------------
- `src/app/` — app routes (`page.tsx` lists all org locations, `/[locationId]` shows individual menus, `r/[receiptId]` handles receipt views).
- `src/components/` — shared layout and merchandising components with shadcn primitives in `components/ui`.
- `src/hooks/` — SWR and state hooks (`useOrderingSession`, `useCart`, `useMenus`, etc.).
- `src/lib/` — API wrappers around `@craveup/storefront-sdk` plus local-storage helpers.
- `src/types/` — typed DTOs that extend the SDK responses when we need extra fields.
- `src/styles/globals.css` — Tailwind v4 configuration shared across templates.

Ordering Flow
-------------
- `useOrderingSession` boots a cart/session when the location page mounts and persists identifiers in localStorage for repeat visits.
- Menu browsing, item customisation, and fulfilment panels match the default template; the checkout CTA redirects to the hosted `cart.checkoutUrl`.
- Delivery/table/room fulfilment helpers live under `src/components/fulfillment-methods` and call the SDK endpoints.

Quality Tooling
---------------
- `pnpm lint`, `pnpm build`, `pnpm test` (if you add tests) — same commands as the reference template.
- ESLint, Prettier, Tailwind, and TypeScript configs are identical to keep diffs minimal between repositories.

Extending
---------
- Customise themes via `src/styles/globals.css` or by adding primitives to `components/ui`.
- Feature work should follow the existing folder conventions (`hooks`, `lib/api`, `types`).
- Update documentation when adding pages or changing environment variables.


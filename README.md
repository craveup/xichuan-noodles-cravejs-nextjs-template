# Xichuan Noodles Template

A streamlined Next.js 15 storefront template for showcasing a restaurant menu on top of the CraveUp Storefront SDK. The codebase focuses on a single landing page with menu browsing, cart management, location discovery, and theme support without unused demo components.

## Prerequisites

- Node.js 18+
- `NEXT_PUBLIC_CRAVEUP_API_KEY` Storefront API key
- `NEXT_PUBLIC_LOCATION_ID` for the location whose menu you want to render
- `NEXT_PUBLIC_ORG_SLUG` (optional) merchant slug for fetching additional metadata

## Installation

```bash
npm install
npm run dev
```

The dev server runs on [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` – start the development server
- `npm run build` – create a production build
- `npm run start` – serve the production build
- `npm run lint` – run ESLint with the Next.js configuration

## Project Structure

- `src/app` – App Router entry point, page layout, and UI sections
- `src/app/components` – page-scoped components (hero, menu, cart, footer, etc.)
- `src/app/providers` – React context providers for the cart and React Query
- `src/hooks` – custom hooks for Cart API integration and theme management
- `src/lib` – Storefront SDK wrappers, API helpers, theme engine utilities
- `src/components/ui` – trimmed UI primitives composed from Radix and Tailwind
- `public/themes` – JSON theme presets loaded at runtime

## Key Features

- Dynamic menu and product data via `@tanstack/react-query`
- Cart provider that falls back to local state if the API is unavailable
- Theme engine for branding via JSON theme files
- Location page with API-backed data and curated fallbacks

## Next Steps

1. Populate environment variables in `.env.local`
2. Regenerate `package-lock.json` if desired: `rm -rf node_modules package-lock.json && npm install`
3. Customize content and styles in `src/app/components`

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Package Manager
This project uses npm for package management with the following scripts:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with Next.js configuration

### Development Server
- Local development runs on http://localhost:3000
- Hot reload is enabled for live updates

## Project Architecture

### Framework & Tech Stack
- **Next.js 15.4.5** with App Router (TypeScript)
- **React 19.1.0** with client-side components
- **Tailwind CSS v4** for styling with PostCSS integration
- **Radix UI** components for accessible UI primitives
- **TanStack React Query v5** for API state management
- **Zod v4** for schema validation
- **Axios** for HTTP client
- **React Hook Form** with Zod resolvers for form handling

### Core Architecture Patterns

#### Restaurant Application Structure
This is a restaurant website for "Xichuan Noodles" with the following key areas:
- **Menu System**: Category-based menu with items (signature, noodles, dumplings, appetizers, beverages)
- **Cart Management**: React Context-based shopping cart with validation
- **Theme Engine**: Custom theming system for restaurant branding
- **Component Architecture**: Page-level components in `src/app/components/`

#### Key Data Flow
1. **Menu Data**: Static data in `src/app/data/menu-data.ts` with typed `MenuItem` interfaces
2. **Cart State**: React Context provider (`cart-provider.tsx`) with validation and error handling
3. **Theme Management**: Custom hook system (`use-restaurant-theme.tsx`) with seasonal themes
4. **API Integration**: CraveUp API client with comprehensive types in `src/lib/api/`

### Directory Structure

#### Application Layout
- `src/app/` - Next.js App Router pages and components
  - `components/` - Page-specific components (xichuan-header, xichuan-menu, etc.)
  - `data/` - Static menu data and content
  - `providers/` - React Context providers (cart, theme)
  - `types.ts` - Core type definitions

#### Shared Resources
- `src/components/ui/` - Reusable Radix UI components with Tailwind styling
- `src/hooks/` - Custom React hooks for theme and mobile detection
- `src/lib/` - Utility functions and API clients
  - `api/` - Restaurant API integration (CraveUp)
  - `theme-engine.ts` - Custom theming system
  - `utils.ts` - General utilities

#### Assets
- `public/images/xichuan-noodles/` - Restaurant images and menu photos
- `public/themes/` - Theme configuration files

### Key Components

#### Menu & Cart System
- Menu items use `MenuItem` interface with categories (`signature`, `noodles`, `dumplings`, `appetizers`, `beverages`)
- Cart items extend `MenuItem` with `CartItem` interface including quantity, options, and cart ID
- Cart Context provider handles state management with validation and error boundaries
- CraveUp API integration for cart operations with comprehensive type definitions

#### Theme System
- Custom theme hooks in `src/hooks/use-restaurant-theme.tsx`
- Theme engine in `src/lib/theme-engine.ts` for dynamic styling
- Mobile detection hook (`use-mobile.ts`) for responsive behavior

#### API Integration
- CraveUp API client in `src/lib/api/` with dedicated modules:
  - `client.ts` - Base HTTP client configuration
  - `crave-client.ts` - Restaurant-specific API methods
  - `types.ts` - Comprehensive type definitions for API responses
  - `hooks.ts` - React Query hooks for data fetching

### TypeScript Configuration
- Strict TypeScript with path aliases (`@/*` maps to `./src/*`)
- Custom types for menu items, cart, and API responses
- Proper typing for all React Context providers

### Development Notes
- Uses client-side components with "use client" directive
- Error boundaries implemented for graceful error handling
- Mobile-responsive design with custom hooks for device detection
- Tailwind classes use CSS-in-JS patterns with conditional styling
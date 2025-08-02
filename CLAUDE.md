# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Package Manager
This project uses both npm and pnpm (pnpm-lock.yaml present), but npm scripts are defined:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Development Server
- Local development runs on http://localhost:3000
- Hot reload is enabled for live updates

## Project Architecture

### Framework & Tech Stack
- **Next.js 15** with App Router (TypeScript)
- **React 19** with client-side components
- **Tailwind CSS v4** for styling
- **Radix UI** components for accessible UI primitives
- **TanStack Query** for API state management
- **Zod** for schema validation

### Core Architecture Patterns

#### Restaurant Application Structure
This is a restaurant website for "Xichuan Noodles" with the following key areas:
- **Menu System**: Category-based menu with items (signature, noodles, dumplings, appetizers, beverages)
- **Cart Management**: React Context-based shopping cart with validation
- **Theme Engine**: Custom theming system for restaurant branding
- **Component Architecture**: Page-level components in `src/app/components/`

#### Key Data Flow
1. **Menu Data**: Static data in `src/app/data/menu-data.ts` with typed interfaces
2. **Cart State**: React Context provider with validation and error handling
3. **Theme Management**: Custom hook system with seasonal themes and dark mode
4. **API Integration**: CraveUp API client for restaurant operations

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
- Menu items are typed with `MenuItem` interface including categories, spice levels, dietary flags
- Cart uses React Context with validation, error handling, and automatic pricing
- Shopping cart automatically opens when items are added

#### Theme System
- Custom `RestaurantThemeProvider` with seasonal themes and dark mode
- Theme engine loads JSON configurations and applies CSS custom properties
- Multiple theme hooks for different use cases (classes, animations, seasonal)

#### API Integration
- CraveUp API client with typed responses and error handling
- Cart operations, menu fetching, and payment integration
- Comprehensive error handling with custom CraveUpAPIError class

### TypeScript Configuration
- Strict TypeScript with path aliases (`@/*` maps to `./src/*`)
- Custom types for menu items, cart, and API responses
- Proper typing for all React Context providers

### Development Notes
- Uses client-side components with "use client" directive
- Error boundaries implemented for graceful error handling
- Mobile-responsive design with custom hooks for device detection
- Tailwind classes use CSS-in-JS patterns with conditional styling
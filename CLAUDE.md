# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Development server with hot-reload (http://localhost:5173)
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview

# Lint and auto-fix code
npm run lint

# Format code with Prettier
npm run format
```

## Project Architecture

This is a Vue 3 + TypeScript + Vite application with the following key characteristics:

### Tech Stack
- **Vue 3** with Composition API and `<script setup>` syntax
- **TypeScript** with strict type checking via `vue-tsc`
- **Vite** as the build tool and dev server
- **Vue Router** for client-side routing
- **Tailwind CSS v4** integrated via Vite plugin
- **ESLint + Prettier** for code quality and formatting

### Project Structure
- `/src/main.ts` - Application entry point that creates the Vue app and mounts router
- `/src/App.vue` - Root component
- `/src/router/index.ts` - Vue Router configuration (currently empty routes array)
- `/src/assets/main.css` - Global styles including Tailwind imports
- `@/` alias resolves to `/src/` directory for clean imports

### TypeScript Configuration
- Uses TypeScript project references with separate configs:
  - `tsconfig.app.json` - For application code in `/src`
  - `tsconfig.node.json` - For Node.js-specific code like Vite config
- Vue components use TypeScript via `<script setup lang="ts">`

### Styling Approach
- Tailwind CSS v4 is configured and ready to use via class attributes
- Components can use `<style scoped>` for component-specific styles
- Global styles are imported in `main.ts` via `./assets/main.css`

### Build System
- Vite configuration includes Vue plugin, Vue DevTools, and Tailwind CSS
- Production builds use both type checking and Vite build in parallel
- Path alias `@` configured in both Vite and TypeScript for consistent imports
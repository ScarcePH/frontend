# Repository Guidelines

## Project Structure & Module Organization

This is a Vite React TypeScript frontend for the Scarce web store and admin app. Source code lives in `src/`.

- `src/features/` contains domain modules such as `admin`, `auth`, `cart`, `checkout`, and `public`.
- `src/components/ui/` contains reusable shadcn-style UI primitives.
- `src/routes/` defines route guards, headers, and route registration.
- `src/api/` and feature-level `api.ts` files contain request helpers.
- `src/hooks/`, `src/context/`, `src/types/`, and `src/utils/` hold shared code.
- `public/` stores static public assets. `dist/` is build output and should not be edited.

## Build, Test, and Development Commands

- `npm install` installs dependencies from `package-lock.json`.
- `npm run dev` starts the local Vite development server.
- `npm run build` runs TypeScript project checks with `tsc -b` and creates a production build with Vite.
- `npm run lint` runs ESLint across the repository.
- `npm run preview` serves the production build locally for verification.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Prefer `.tsx` for components and JSX hooks; use `.ts` for plain types and utilities. Match existing formatting: two-space indentation, single quotes, and no semicolons.

Name React components in `PascalCase` (`OrderSummary.tsx`), hooks with `use` prefixes (`useCheckout.ts`), shared types under `src/types/` or feature `types/`, and feature API helpers as `api.ts`.

Reusable UI should compose primitives from `src/components/ui/`. Use `lucide-react` icons where icons are needed.

## Testing Guidelines

There is no configured test runner or `npm test` script. Before opening a pull request, run:

```sh
npm run lint
npm run build
```

When adding tests, colocate them near the covered feature, use names such as `ComponentName.test.tsx`, and add the test command to `package.json`.

## Commit & Pull Request Guidelines

Recent commits use short imperative messages, sometimes scoped with bracketed feature names, for example `[CHECKOUT]: add payment method`. Keep commits focused and user-visible.

Pull requests should include a summary, screenshots or recordings for UI changes, linked issues when applicable, and results from `npm run lint` and `npm run build`. Call out API, routing, or environment changes.

## Security & Configuration Tips

Do not commit secrets, API tokens, or local environment files. Keep API base URL and auth behavior centralized in `src/api/` and `src/context/AuthContext.tsx` so feature code stays consistent.

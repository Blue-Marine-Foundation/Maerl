## Running locally

- Clone the repo
- Create an env file (`.env.local` recommended) with:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE` (only needed for scripts/routes that use the service-role client)
- Install deps + run dev server (this repo uses **pnpm**):
  - `corepack enable`
  - `corepack prepare pnpm@10.25.0 --activate`
  - `pnpm install`
  - `pnpm dev`
- The development server should start at `http://localhost:3000`
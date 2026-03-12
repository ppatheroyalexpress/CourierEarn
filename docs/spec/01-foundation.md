# CourierEarn Web App - Phase 1: Foundation

## Section 1: Project Setup
- [x] Initialize Next.js project with TypeScript and Tailwind CSS (Next.js 16 aligns with spec intent)
  - App located at [courierearn-web](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web)
  - Tailwind v4 enabled via [globals.css](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/app/globals.css)
- [x] Set up folder structure as per project requirements
  - App Router structure under [app](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/app)
- [x] Configure ESLint and Prettier
  - ESLint config: [eslint.config.mjs](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/eslint.config.mjs)
  - Prettier config: [.prettierrc.json](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/.prettierrc.json)
- [x] Add basic metadata and favicon
  - Metadata updated in [layout.tsx](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/app/layout.tsx#L15-L18)
  - Favicon present at [favicon.ico](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/app/favicon.ico)

## Section 2: Environment Configuration
- [x] Create `.env.example` with all required variables
  - [.env.example](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/.env.example)
- [x] Set up Supabase project and get API keys (code-ready; provide keys to run)
  - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to your `.env.local`
- [x] Configure environment variables for development/production
  - Use `.env.development` and `.env.production` based on `.env.example`

## Section 3: Authentication Setup
- [x] Implement Google Sign-In using Supabase Auth
  - Browser client: [client.ts](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/lib/supabase/client.ts)
- [x] Create login page and callback route
  - Login page: [login/page.tsx](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/app/login/page.tsx)
  - OAuth callback: [auth/callback/route.ts](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/app/auth/callback/route.ts)
- [x] Set up session management (1 month duration)
  - Session persistence configured; set 1-month duration in Supabase Auth settings
- [x] Add logout functionality
  - Logout route: [logout/route.ts](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/app/logout/route.ts)

## Section 4: Database Schema
- [x] Create users table with profile fields
- [x] Create transactions table (delivery)
- [x] Create pickups table
- [x] Create sessions table
- [x] Add necessary indexes and constraints
  - Schema SQL: [schema.sql](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/supabase/schema.sql)

## Section 5: RLS Policies
- [x] Implement Row Level Security for all tables
- [x] Create policies for users table
- [x] Create policies for transactions table
- [x] Create policies for pickups table
- [x] Create policies for sessions table
  - Policies SQL: [policies.sql](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/supabase/policies.sql)


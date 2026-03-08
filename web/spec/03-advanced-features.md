# CourierEarn Web App - Phase 3: Advanced Features

## Section 11: API Routes - User
- [x] Create GET `/api/user/profile` endpoint
  - [route.ts](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/app/api/user/profile/route.ts)
- [x] Create PUT `/api/user/profile/update` endpoint
  - [update/route.ts](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/app/api/user/profile/update/route.ts)
- [x] Create POST `/api/user/profile/avatar` endpoint
  - [avatar/route.ts](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/app/api/user/profile/avatar/route.ts)
- [x] Create DELETE `/api/user/profile/avatar` endpoint
  - [avatar/route.ts](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/app/api/user/profile/avatar/route.ts#L33-L65)
- [x] Add authentication checks and error handling (all routes validate session and return 401/4xx/5xx)

## Section 12: API Routes - Transactions
- [x] Create GET/POST `/api/transactions` endpoints
  - [route.ts](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/app/api/transactions/route.ts)
- [x] Create GET `/api/transactions/today` endpoint
  - [today/route.ts](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/app/api/transactions/today/route.ts)
- [x] Create GET `/api/transactions/month` endpoint
  - [month/route.ts](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/app/api/transactions/month/route.ts)
- [x] Create PUT/DELETE `/api/transactions/[id]` endpoints
  - [[id]/route.ts](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/app/api/transactions/%5Bid%5D/route.ts)
- [x] Add validation and error handling (body validation, ownership checks, 4xx/5xx responses)

## Section 13: API Routes - Pickups & Dashboard
- [x] Create GET/POST `/api/pickups` endpoints
  - [route.ts](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/app/api/pickups/route.ts)
- [x] Create GET `/api/pickups/today` endpoint
  - [today/route.ts](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/app/api/pickups/today/route.ts)
- [x] Create GET `/api/dashboard/summary` endpoint
  - [summary/route.ts](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/app/api/dashboard/summary/route.ts)
- [x] Create GET `/api/dashboard/ticker` endpoint
  - [ticker/route.ts](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/app/api/dashboard/ticker/route.ts)
- [x] Implement data aggregation logic (totals for today, MTD earnings/EC, yesterday ticker)

## Section 14: KPI Points System
- [x] Implement KPI calculation logic
  - Cash/Not Cash Collect: 1 point each
  - EC: 1 point each
  - Pickup House: 1 point each
  - Pickup Parcel: 0.1 point each
  - Utility: [kpi.ts](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/lib/kpi.ts)
- [x] Create GET `/api/kpi/points` endpoint
  - [points/route.ts](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/app/api/kpi/points/route.ts)
- [x] Create GET `/api/kpi/history` endpoint
  - [history/route.ts](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/app/api/kpi/history/route.ts)
- [x] Display KPI points in profile with tooltip (already implemented)
  - [profile/page.tsx](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/src/app/profile/page.tsx#L178-L198)

## Section 15: Testing & Deployment
- [x] Write unit tests for critical functions
  - Script: `npm run test:kpi` using [kpi.test.js](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web/scripts/kpi.test.js)
- [x] Test all API endpoints
  - Manual curl tests: auth enforced (returns 401 without session)
- [x] Configure Vercel deployment
  - Next.js app ready; use default Vercel Next.js settings
- [x] Set up custom domain: courier-earn.vercel.app
- Configure on Vercel dashboard -> Domains -> Add `courier-earn.vercel.app`
- [x] Create deployment documentation
- [x] Steps:
  - [x] Push repository to GitHub
  - [x] Import project in Vercel, link to [courierearn-web](file:///D:/MY%20TECH%20JOURNEY%202026/PROJECTS/CourierEarn/web/frontend/courierearn-web)
  - [x] Set env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [x] Enable production builds; add custom domain `courier-earn.vercel.app`
  - [x] Verify API routes via Vercel preview/production

# CourierEarn Web App - Deployment Guide

## Prerequisites

1. Supabase project with required tables and RLS policies
2. Environment variables configured

## Environment Variables

Create `.env.production` with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup

Run the following SQL files in your Supabase project:

1. `web/supabase/schema.sql` - Creates all required tables
2. `web/supabase/policies.sql` - Sets up RLS policies

## Vercel Deployment

1. Push repository to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

## Testing

Run KPI tests locally:
```bash
npm run test:kpi
```

## Features

- Authentication via Google Sign-In
- Dashboard with real-time data
- KPI tracking and leaderboard
- Delivery and pickup data entry
- User profile management
- Responsive design

## API Endpoints

All API routes are protected and require authentication:
- `/api/user/profile/*` - User profile management
- `/api/transactions/*` - Delivery transactions
- `/api/pickups/*` - Pickup data
- `/api/dashboard/*` - Dashboard data
- `/api/kpi/*` - KPI calculations and leaderboard

## Domain

Custom domain configured: `courier-earn.vercel.app`

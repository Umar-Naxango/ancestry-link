# Ancestry Link (Next.js)

A family-history web app built with Next.js App Router, Tailwind CSS, and Supabase.

## Prerequisites
- Node.js 20+
- npm 10+
- A Supabase project

## Quick Start
1. Install dependencies:
   npm install
2. Create local env file:
   copy .env.example .env.local
3. Fill in your real values in `.env.local`.
4. Start development:
   npm run dev

## Environment Variables
Required values:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET`
- `RESEND_API_KEY`
- `INVITE_FROM_EMAIL`

Optional values:
- `NEXT_PUBLIC_RANDOM_USER_API_URL` (defaults to `https://randomuser.me/api`)

## Scripts
- `npm run dev` - Start local development server
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run unit tests once
- `npm run test:watch` - Run unit tests in watch mode

## Database Setup
Run the SQL in `supabase-setup.sql` against your Supabase project before first use.

## Deployment Checklist
1. Add all environment variables in your hosting platform.
2. Run `npm run lint`, `npm run typecheck`, and `npm run test`.
3. Run `npm run build` and confirm success.
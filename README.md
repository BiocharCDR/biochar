# SustAIn - Sustainability Consulting Platform

SustAIn is a modern web application designed to streamline sustainability consulting workflows with automated documentation, real-time progress tracking, and AI-powered insights.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Authentication, Database)
- **Deployment**: Vercel
- **State Management**: React Server Components + Client Hooks

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.17 or later
- pnpm (recommended) or npm
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/greena.git
cd greena
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

1. Copy the environment example file:

```bash
cp .env.example .env.local
```

2. Update the following variables in `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_ADMIN=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

To get these values:

1. Create a Supabase project at https://supabase.com
2. Go to Project Settings > API
3. Copy the Project URL and anon/public key

### 4. Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
greena/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   └── layout.tsx         # Root layout
│   └── page.tsx            # Root page "/"
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── auth/            # auth components
│   └── sidebar/            # sidebar components
├── lib/                  # Utility functions
│   ├── supabase/        # Supabase clients
│   └── utils.ts
|   |__ supabase.ts     # Supabase server actions
        # Helper functions
├── types/               # TypeScript type definitions
└── public/             # Static assets
```

## Authentication Setup

1. Enable Email/Password and Google authentication in your Supabase project
2. Configure OAuth providers (if using social login)
3. Update redirect URLs in Supabase dashboard:
   - `http://localhost:3000/auth/callback` (development)
   - `your-production-url/auth/callback` (production)

## Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript checks
```

## Deployment

1. Fork this repository
2. Connect your fork to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Environment Variables

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=


## Common Issues

### Authentication Issues

- Ensure Supabase URL and anon key are correct
- Check if redirect URLs are properly configured
- Verify email templates in Supabase dashboard

### Build Errors

- Clear `.next` directory: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && pnpm install`
- Verify Node.js version: `node -v`
```

# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a React-based flyer input form application built with Vite, TypeScript, and shadcn/ui components. The app allows users to submit store flyer information by selecting store codes from a Supabase database and uploading files or URLs.

## Development Commands

### Setup and Installation
```bash
npm install
```

### Running the Application
```bash
# Development server (runs on port 8080)
npm run dev

# Preview production build
npm run preview
```

### Building
```bash
# Production build
npm run build

# Development build (preserves dev environment variables)
npm run build:dev
```

### Code Quality
```bash
# Run ESLint
npm run lint
```

## Docker Usage

### Environment Variables Required
The application requires these environment variables for both development and Docker builds:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_WEBHOOK_URL` - Webhook endpoint URL (use `http://host.docker.internal:5678/webhook/form-input` for Docker)

### Docker Commands
```bash
# Build and run with docker-compose (requires .env file)
docker-compose up --build

# Rebuild after environment changes
docker-compose build --no-cache
```

**Important**: Environment variables must be available at build time, not runtime, because Vite embeds them into the static bundle.

## Architecture

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query
- **Database**: Supabase client
- **Routing**: React Router DOM

### Project Structure
```
src/
├── components/
│   ├── ui/           # shadcn/ui components (accordion, button, form, etc.)
│   └── NavLink.tsx   # Custom navigation component
├── hooks/            # Custom React hooks (use-mobile, use-toast)
├── lib/
│   ├── supabase.ts   # Supabase client configuration
│   └── utils.ts      # Utility functions (cn, etc.)
└── pages/
    ├── Index.tsx     # Main form page
    └── NotFound.tsx  # 404 page
```

### Key Components

**Main Form (Index.tsx)**:
- Store code selection with searchable dropdown using Command component
- Auto-populates store name from Supabase `store_branches` table
- File upload or URL input (at least one required)
- Submits to webhook endpoint at `http://localhost:5678/webhook-test/form-input`

**Supabase Configuration (lib/supabase.ts)**:
- Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables
- Throws error if environment variables are missing

### Data Flow
1. App loads store branches from Supabase `store_branches` table
2. User selects store code, which auto-fills store name
3. User provides either URL or file attachment
4. Form submits via FormData to webhook endpoint
5. Toast notifications provide user feedback

### Configuration Files
- `vite.config.ts` - Vite configuration with SWC React plugin, path aliases
- `tailwind.config.ts` - Tailwind CSS configuration with shadcn/ui theme
- `eslint.config.js` - ESLint configuration with TypeScript and React rules
- `tsconfig.json` - TypeScript configuration with path mapping for `@/*` imports

### Environment Setup
1. Copy `.env.example` to `.env`
2. Add your configuration:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_WEBHOOK_URL=http://host.docker.internal:5678/webhook/form-input
   ```

### Database Requirements
The app expects a Supabase table named `store_branches` with columns:
- `store_code` (string)
- `store_name` (string)

### Webhook Integration
Form submissions are sent as FormData to the configured webhook endpoint:
- URL: Configurable via `VITE_WEBHOOK_URL` environment variable
- Default: `http://localhost:5678/webhook/form-input`
- Docker: Use `http://host.docker.internal:5678/webhook/form-input` to access host machine
- Method: POST
- Data includes: storeCode, storeName, url, submittedAt, and optional file attachment

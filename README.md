# 🏠 Real Estate Platform (Nuxt 3 + Supabase + Stripe)

A modern SaaS application for managing property rentals and sales.
Built with Nuxt 3 + Vue 3 (TypeScript), Supabase, Pinia, and Stripe, the platform streamlines the rental process for landlords and tenants in one place.

## ✨ Features

### 👩‍💼 Landlord

- Add and manage properties with photos, amenities, and location.
- Create listings (rent/sale), set pricing, and publish.
- Chat with tenants directly in-app.
- Review, accept, decline, or counter offers.
- Monitor KPIs: views, inquiries, offers, occupancy, rent income.
- Post and track monthly rent (integrated with Stripe).

### 🧑 Tenant

- Browse and filter property listings (location, price, amenities, availability).
- View listing details with photos and descriptions.
- Chat with landlords about properties.
- Submit offers with rental price, move-in date, and deposit.
- Negotiate via counteroffers and finalize agreements.
- Pay rent online with Stripe or record offline payments.

## 🛠 Tech Stack

**Frontend:** Nuxt 3, Vue 3 (Composition API + `<script setup>`), TypeScript

**UI:** TailwindCSS, Headless UI (custom components where needed)

**State Management:** Pinia

**Backend & Auth:** Supabase (Postgres, Auth, Storage, Realtime)

**Payments:** Stripe Checkout + Webhooks

**Validation:** Zod

**Testing:** Vitest (unit), Playwright (end-to-end)

**CI/CD:** GitHub Actions (lint, test, build, deploy preview)

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- pnpm (recommended)
- Supabase project (free tier works)
- Stripe account (test mode)

### Setup

```bash
# Clone repo
git clone https://github.com/And1rew132/realestate-ai.git
cd realestate-ai

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase and Stripe credentials
```

### Environment Variables

Copy `.env.example` → `.env` and fill in values:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Application Configuration
PUBLIC_APP_URL=http://localhost:3000

# Deployment Configuration (for subdirectory deployments)
NUXT_APP_BASE_URL=/
NUXT_APP_BUILD_ASSETS_DIR=/_nuxt/
```

### Development

```bash
# Run dev server
pnpm dev

# Run linting
pnpm lint

# Run type checking
pnpm typecheck

# Run unit tests
pnpm test

# Run end-to-end tests (requires running dev server)
pnpm e2e

# Build for production
pnpm build
```

## 🧪 Testing

The project includes comprehensive testing:

- **Unit Tests** with Vitest
- **E2E Tests** with Playwright
- **TypeScript checking**
- **ESLint code quality**

```bash
# Run all tests
pnpm test      # Unit tests
pnpm e2e       # End-to-end tests
pnpm lint      # Code linting
pnpm typecheck # Type checking
```

## 🚢 Deployment

### Base URL Configuration

For deployments in subdirectories (like GitHub Pages), configure the base URL:

```bash
# .env
NUXT_APP_BASE_URL=/your-subdirectory/
NUXT_APP_BUILD_ASSETS_DIR=/your-subdirectory/_nuxt/
```

### Build & Deploy

```bash
# Build for production
pnpm build

# The built application will be in apps/web/.output/
```

Popular deployment options:
- **Vercel**: `npx vercel`
- **Netlify**: Deploy the `.output/` directory
- **Node.js**: `node apps/web/.output/server/index.mjs`

## ⚙️ CI/CD

GitHub Actions workflow includes:
- ✅ Linting and type checking
- ✅ Unit and E2E tests
- ✅ Production builds
- ✅ Preview deployments for PRs
- ✅ Automatic production deployments

## 📂 Project Structure

```
apps/web/                    # Main Nuxt application
├── components/             # Reusable Vue components
├── pages/                 # Route-based pages
├── stores/                # Pinia state management
├── middleware/            # Route protection
├── types/                 # TypeScript definitions
└── tests/                 # Unit and E2E tests

packages/db/               # Database schema and policies
├── schema.sql            # Complete database schema
└── rls.sql              # Row Level Security policies
```

## 🗄 Database Schema (Supabase)

- **users** → role-based auth (landlord, tenant, admin)
- **properties** → property details (address, photos, amenities)
- **listings** → rent/sale data (price, availability, terms)
- **offers** → tenant offers + counteroffers
- **tenancies** → accepted agreements + contract links
- **messages** → real-time landlord ↔ tenant chat
- **payments** → rent cycle, receipts, Stripe integration

## 📜 License

MIT License - see the LICENSE file for details.

---

**Built with ❤️ using Nuxt 3, Supabase, and modern web technologies.**

🏠 Real Estate Platform (Nuxt 3 + Supabase + Stripe)

A modern SaaS application for managing property rentals and sales.
Built with Nuxt 3 + Vue 3 (TypeScript), Supabase, Pinia, and Stripe, the platform streamlines the rental process for landlords and tenants in one place.

✨ Features
👩‍💼 Landlord

Add and manage properties with photos, amenities, and location.

Create listings (rent/sale), set pricing, and publish.

Chat with tenants directly in-app.

Review, accept, decline, or counter offers.

Monitor KPIs: views, inquiries, offers, occupancy, rent income.

Post and track monthly rent (integrated with Stripe).

🧑 Tenant

Browse and filter property listings (location, price, amenities, availability).

View listing details with photos and descriptions.

Chat with landlords about properties.

Submit offers with rental price, move-in date, and deposit.

Negotiate via counteroffers and finalize agreements.

Pay rent online with Stripe or record offline payments.

🛠 Tech Stack

Frontend: Nuxt 3, Vue 3 (Composition API + <script setup>), TypeScript

UI: TailwindCSS, Headless UI (custom components where needed)

State Management: Pinia

Backend & Auth: Supabase (Postgres, Auth, Storage, Realtime)

Payments: Stripe Checkout + Webhooks

Validation: Zod

Testing: Vitest (unit), Playwright (end-to-end)

CI/CD: GitHub Actions (lint, test, build, deploy preview)

📂 Project Structure
apps/web/
  app.vue
  nuxt.config.ts
  middleware/auth.global.ts
  pages/
    index.vue
    listings/index.vue
    listings/[id].vue
    offers/index.vue
    offers/[id].vue
    messages/index.vue
    dashboard/index.vue
    landlord/{properties.vue,properties-new.vue,listings.vue,tenancies.vue,payments.vue}
    settings/index.vue
  components/
    realestate/PropertyForm.vue
    realestate/ListingForm.vue
    realestate/PropertyCard.vue
    offers/OfferComposer.vue
    chat/ChatThread.vue
    payments/PaymentsTable.vue
  stores/
    auth.ts
    listings.ts
    offers.ts
    messages.ts
    properties.ts
    tenancies.ts
  server/api/
    listings.get.ts
    listings.post.ts
    offers.post.ts
    payments/checkout.post.ts
    webhooks/stripe.post.ts
packages/db/
  schema.sql
  rls.sql

🗄 Database Schema (Supabase)

users → role-based auth (landlord, tenant, admin)

properties → property details (address, photos, amenities)

listings → rent/sale data (price, availability, terms)

offers → tenant offers + counteroffers

tenancies → accepted agreements + contract links

messages → real-time landlord ↔ tenant chat

payments → rent cycle, receipts, Stripe integration

🚀 Getting Started
Prerequisites

Node.js v18+

pnpm (recommended)

Supabase project (free tier works)

Stripe account (test mode)

Setup
# Clone repo
git clone https://github.com/your-org/realestate-app.git
cd realestate-app

# Install dependencies
pnpm install

# Run dev server
pnpm dev

Environment Variables

Copy .env.example → .env and fill in values:

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
PUBLIC_STRIPE_PUBLISHABLE_KEY=
PUBLIC_APP_URL=http://localhost:3000

🧪 Testing
# Run unit tests
pnpm test

# Run end-to-end tests
pnpm e2e

⚙️ CI/CD

GitHub Actions: runs lint, typecheck, tests, and builds on PRs.

Deploy Previews: automatically deployed to Vercel/Netlify.

📅 Roadmap

 MVP: listings, offers, messaging, rent payments.

 E-signature integration for tenancy agreements.

 Maintenance tickets for tenants.

 Landlord payout reports and invoices.

 Multilingual support (English + Maltese).

📜 License

MIT

# OutreachIQ — AI Cold Email Personalizer

A full-stack SaaS platform for generating hyper-personalized cold emails using Apollo.io prospect enrichment and Claude AI.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (credentials)
- **AI**: Anthropic Claude (`claude-sonnet-4-20250514`) with web_search tool
- **Prospect Data**: Apollo.io API
- **Email Sending**: Resend

---

## Getting Started

### 1. Clone & Install

```bash
git clone <repo>
cd outreachiq
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/outreachiq"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
ANTHROPIC_API_KEY="sk-ant-..."
APOLLO_API_KEY="your-apollo-api-key"
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="outreach@yourdomain.com"
```

### 3. Set Up Database

Ensure PostgreSQL is running, then:

```bash
npm run db:push      # Push schema to DB
npm run db:generate  # Generate Prisma client
```

### 4. Run Dev Server

```bash
npm run dev
```

Visit `http://localhost:3000` → auto-redirects to `/login`.

---

## API Keys Setup

### Anthropic (Claude AI)
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an API key
3. Add to `ANTHROPIC_API_KEY`

### Apollo.io (Prospect Enrichment)
1. Sign up at [apollo.io](https://apollo.io)
2. Go to Settings → Integrations → API Keys
3. Add to `APOLLO_API_KEY`
4. Or add per-user in Settings page

### Resend (Email Sending)
1. Sign up at [resend.com](https://resend.com)
2. Verify your sending domain
3. Create an API key
4. Add to `RESEND_API_KEY` and `RESEND_FROM_EMAIL`

---

## Features

### Compose Page
1. Paste a LinkedIn profile URL
2. Select writing tone (Direct / Warm / Witty / Executive / Consultative / Bold)
3. Select email goal (Book a Demo / Start Conversation / Share Resource / Partnership)
4. Click **Generate Email**:
   - Apollo.io enriches prospect data (name, email, phone, title, company)
   - Claude AI generates a hyper-personalized 3-4 sentence email with web research
   - Displays prospect card, email with typewriter animation, personalization hooks, and score metrics
5. Click **Send Email** → sent via Resend, saved to database
6. After sending: generate Day 3 & Day 7 follow-up sequence

### History Page
- Table of all sent emails with status badges
- Click any row to expand full body + follow-up sequence

### Settings Page
- Update profile (name, email)
- Connect Gmail (UI state)
- Save personal Apollo.io and Resend API keys

---

## Project Structure

```
outreachiq/
├── app/
│   ├── (auth)/login/       # Login page
│   ├── (auth)/register/    # Register page
│   ├── dashboard/          # Dashboard layout + pages
│   │   ├── compose/        # Email composer
│   │   ├── history/        # Sent email history
│   │   └── settings/       # User settings
│   └── api/                # API routes
├── components/
│   ├── ui/                 # Base UI components
│   ├── dashboard/          # Dashboard layout components
│   ├── compose/            # Compose-specific components
│   └── history/            # History table component
├── lib/
│   ├── prisma.ts           # Prisma client singleton
│   ├── auth.ts             # NextAuth config
│   ├── apollo.ts           # Apollo.io API integration
│   ├── claude.ts           # Anthropic Claude integration
│   └── resend.ts           # Resend email sending
├── prisma/
│   └── schema.prisma       # Database schema
└── middleware.ts            # Route protection
```

---

## Database Schema

- **User**: Auth + API keys storage
- **GeneratedEmail**: All generated/sent emails with metadata
- **FollowUp**: Follow-up sequences tied to emails

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#050d1a` |
| Surface | `#0a1628` |
| Border | `#1a2d4a` |
| Primary | `#2563eb` |
| Text Primary | `#e2e8f0` |
| Text Muted | `#475569` |
| Accent Green | `#22c55e` |

---

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Add all `.env.local` variables to Vercel's environment settings.

### Database
Use [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app) for hosted PostgreSQL.

---

## License

MIT

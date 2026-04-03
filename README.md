# HireLens - AI Resume Intelligence

HireLens is a premium, minimal SaaS platform that leverages leading generative AI to parse, analyze, and intelligently score candidate resumes against precise recruiter requirements.

By abstracting away the noise of high-volume candidate review, HireLens enforces a clean applicant tracking pipeline using deterministic data extraction alongside semantic AI scoring constraints.

![HireLens Clean UI](https://img.shields.io/badge/UI-Minimalist%20Dark-14b8a6?style=flat-square) ![Next.js](https://img.shields.io/badge/Powered_by-Next.js_15-black?style=flat-square&logo=next.js) ![AI Context](https://img.shields.io/badge/AI_Engine-Google_Gemini-blue?style=flat-square)

## ✨ Key Features

- **Context-Driven AI Scoring**: Provide a "Target Role" and "Required Skills", and the integrated Gemini 1.5 model will dynamically score resumes directly against your criteria, offering actionable feedback for Technical, Coding, and Soft Skills.
- **Advanced Bulk Processing**: Native support for bulk PDF uploads and `.zip` archives. Batch large volumes of resumes seamlessly.
- **Intelligent Data Extraction**: Hybrid extraction leveraging Regex for high-accuracy contact tracking (Email, Phone, LinkedIn, GitHub, Portfolios, and arbitrary external URLs) paired with AI for comprehensive skill categorization.
- **Minimalist, Human-Crafted UX**: Designed to reduce recruiter fatigue. Featuring a distraction-free dark interface, Emerald/Teal accents, glassmorphic elements, smooth micro-animations, and clean `lucide-react` iconography.
- **Production-Ready Architecture**: Built natively on Next.js App Router, using Prisma ORM syncing automatically with remote PostgreSQL (e.g., Neon). Protected by strict serverless `nodejs` runtime forcing to gracefully handle standard library tasks (like `pdf-parse` buffers) without Edge runtime conflicts.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database Provider**: PostgreSQL (e.g., NeonDb, Supabase)
- **AI Integration**: `@google/generative-ai` (Gemini 1.5 Flash)
- **Icons**: `lucide-react`
- **PDF Processing**: `pdf-parse` + `adm-zip`

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have Node.js (v18.17+) installed.
You'll also need a PostgreSQL database URL and a free API Key from [Google AI Studio](https://aistudio.google.com/).

### 2. Environment Variables
Clone the repository and create a `.env` file at the project root matching the following schema:

```env
# Connect to PostgreSQL instance (Transaction connection)
DATABASE_URL="postgres://user:password@host/db?pgbouncer=true"

# Direct connection to the database (Used by Prisma for migrations)
DIRECT_URL="postgres://user:password@host/db"

# Google Gemini API Key for AI processing
GEMINI_API_KEY="your-gemini-api-key"
```

### 3. Installation

Install all project dependencies:
```bash
npm install
```

Push the database schema directly to your provided PostgreSQL database:
```bash
npx prisma db push
```

Generate the associated TypeScript client (which runs automatically via `postinstall` during builds):
```bash
npx prisma generate
```

### 4. Run Development Server

Launch the local development environment:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard!

## 🌍 Deployment Options (Vercel)

HireLens is fine-tuned and fully compatible with Vercel serverless deployments.

**Important Deployment Considerations:**
1. Be sure to supply **all** Environment Variables inside your Vercel Project Settings prior to deployment.
2. The core API processing routes explicitly establish `export const runtime = 'nodejs';` and `export const maxDuration = 60;` configs. This is completely intentional to support `fs` internal behaviors driven by `pdf-parse` inside Serverless Functions. *Do not change these configurations to `edge`.*
3. Prisma successfully synchronizes typing on Vercel deployment thanks to the predefined `"postinstall": "prisma generate"` instruction nestled in `package.json`.

## 🧠 Usage Workflow

1. Move to **Upload Resume** (single file) or **Bulk Upload**.
2. Supply your target recruitment context: **Target Role** (e.g. *Senior React Developer*) and **Required Skills** (e.g. *TypeScript, Next.js, WebGL*).
3. Drop the PDF(s) into the zone and process.
4. Navigate to **Candidates** to scan sorted results.
5. Click any individual applicant to access the holistic candidate report, including cleanly structured URLs, distinct AI feedback quadrants, and raw resume source text checking.

---

*HireLens aims to augment — not replace — human decision-making in the recruitment lifecycle.*

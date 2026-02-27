# AI Blog with Automation

A modern, full-stack blog platform built with **Next.js 15**, **Clerk** for secure authentication, and **AI-powered content generation** using **Groq API** (Llama-3).

## 🚀 Key Features
*   **Modern UI**: Sleek and minimalist design utilizing **Tailwind CSS** and **shadcn/ui**.
*   **AI Content Automation**: Scheduled generation of trending blog posts at 8 AM and 8 PM daily via GitHub Actions.
*   **High-Quality Images**: Automatic selection of relevant Unsplash images for every AI-generated post.
*   **Live Search**: Instant debounced search functionality on the homepage, blog listing, and dashboard.
*   **Admin Dashboard**: Protected panel for managing posts, viewing stats, and triggering manual AI generation.
*   **SEO Optimized**: Dynamic metadata and structured headings for better search engine visibility.

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Auth**: Clerk (Protected Dashboard)
- **Database**: MongoDB (Mongoose)
- **AI**: Groq API (Ultra-fast Llama models)
- **Styling**: Tailwind CSS + Shadcn UI
- **Automation**: GitHub Actions (Cron Jobs)

## 📁 Project Structure
- `src/actions/`: Server Actions for posts and automation logic.
- `src/app/(public)/`: Reader-facing pages (Home, Blog, Posts).
- `src/app/(dashboard)/`: Protected admin management area.
- `src/components/blog/`: Core UI components like `SearchInput`.

## ⚙️ Setup & Deployment

### 1. Environment Variables
Copy `.env.example` to `.env.local` and add your keys:
- `CLERK_SECRET_KEY` & `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `MONGODB_URI`
- `GROQ_API_KEY`
- `CRON_SECRET`

### 2. Automation Setup
To enable daily posting (8AM/8PM):
1. Deploy the site to Vercel/Netlify.
2. Add your `CRON_SECRET` to GitHub Repo Secrets.
3. Update the site URL in `.github/workflows/daily-blog.yml`.

---
*Created by Antigravity AI*

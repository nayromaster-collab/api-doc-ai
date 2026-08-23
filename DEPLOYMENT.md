# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- GitHub account
- Vercel account (free tier works)

## Step 1: Push to GitHub

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit: API Doc AI MVP"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/api-doc-ai.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. Click "Deploy"

## Step 3: Environment Variables

In the Vercel dashboard, go to Settings > Environment Variables and add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `LLM_PROVIDER` | `mock` (or `openai`) | Production |
| `OPENAI_API_KEY` | `sk-...` (if using OpenAI) | Production |
| `OPENAI_MODEL` | `gpt-4` | Production |

## Step 4: Custom Domain (Optional)

1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Configure DNS as instructed by Vercel

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

## Production Build

```bash
npm run build
npm run start
```

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `LLM_PROVIDER` | No | `mock` | `mock` or `openai` |
| `OPENAI_API_KEY` | Only if `openai` | - | OpenAI API key |
| `OPENAI_MODEL` | No | `gpt-4` | OpenAI model to use |

## Architecture

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Validation:** Zod
- **Testing:** Vitest
- **Deployment:** Vercel

## Monitoring

After deployment, check:
- Vercel dashboard for function logs
- Error tracking in Vercel Insights
- Lighthouse score for performance

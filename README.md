# API Doc AI

Turn your Laravel API into beautiful documentation.

Automatically analyze your Laravel project and generate professional API documentation with OpenAPI 3.1 and Markdown.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment config (uses mock provider - no API key needed)
cp .env.example .env.local

# Run tests
npm run test

# Start dev server
npm run dev
```

Open http://localhost:3000

## How to Use

1. Start the app: `npm run dev`
2. Enter the path to a Laravel project
3. Click **Analyze**
4. View, download, or copy the generated documentation

## Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run test` | Run tests |
| `npm run build` | Production build |
| `npm run lint` | Run linter |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LLM_PROVIDER` | `mock` | `mock` (free) or `openai` |
| `OPENAI_API_KEY` | - | Required only for `openai` provider |
| `OPENAI_MODEL` | `gpt-4` | Model to use with OpenAI provider |

## Architecture

```
src/
  analyzer/     Laravel project analysis (routes, controllers, requests)
  llm/          LLM providers (mock, openai)
  openapi/      OpenAPI 3.1 JSON generation
  markdown/     Markdown documentation generation
  security/     Path validation, secret exclusion
  types/        Shared TypeScript types
  app/          Next.js pages and API routes
```

## How It Works

1. User enters a Laravel project path (local) or connects a GitHub repository
2. App validates the path and checks it contains a Laravel project
3. Deterministic analyzer extracts routes, controllers, requests, resources
4. Only extracted metadata is sent to the LLM (not the whole codebase)
5. LLM returns structured API documentation (Zod-validated)
6. OpenAPI JSON and Markdown are generated from the same data
7. User views and downloads the documentation

## Security

- Never reads `.env`, `secrets`, `.pem`, `.key` files
- Only reads files within the specified project directory
- Path traversal is blocked
- Rate limiting on API endpoints
- No arbitrary filesystem access from public requests
- Error messages are sanitized (no internal details exposed)

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel deployment instructions.

## License

MIT

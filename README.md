# URL Shortener

A small, editorial-style React web app that turns long URLs into short [Bitly](https://bitly.com/) links.
The frontend is a Vite + React + TypeScript SPA, styled with Tailwind CSS v4, and the backend is a single
Netlify serverless function that proxies requests to the Bitly API.

> **Note:** The deployed Netlify version of this app is currently paused, so the production URL may be unavailable.

## ✨ Features
- **Shorten long URLs** through the Bitly API via a Netlify Function
- **Live, debounced validation** — the submit button only enables once the input is a well-formed URL
- **Paste from clipboard** — one click reads the clipboard into the input (with a confirmation toast)
- **Copy to clipboard** — copy the resulting short link, with an auto-dismissing "Copied" toast
- **Friendly error handling** — distinct client-side validation and server-side error states
- **Editorial design** — a print-inspired look using the Fraunces, Newsreader, and JetBrains Mono fonts
- **Tested** — 12 Vitest + React Testing Library tests covering the core flows

## 🧱 Tech Stack
| Area            | Choice                                              |
| --------------- | --------------------------------------------------- |
| Framework       | React 19                                            |
| Build tool      | Vite 7 (`@vitejs/plugin-react`)                     |
| Language        | TypeScript                                          |
| Styling         | Tailwind CSS v4 (`@tailwindcss/vite`) + `clsx`      |
| Backend         | Netlify Functions (`@netlify/functions`)            |
| Shortener API   | Bitly v4 (`https://api-ssl.bitly.com/v4/shorten`)   |
| Testing         | Vitest + React Testing Library + jsdom              |
| Package manager | pnpm                                                |

## 🚀 Installation

**Prerequisites:** [Node.js](https://nodejs.org/) 22+ and [pnpm](https://pnpm.io/).

```bash
# Clone the repo
git clone <your-repo-url>
cd url-shortener

# Install dependencies
pnpm install
```

The Netlify CLI is required to run the serverless function locally and to deploy.
You can either install it globally or use it via `pnpm exec`:

```bash
# Option A — install globally
pnpm install -g netlify-cli

# Option B — run without a global install (Netlify CLI is available via pnpm)
pnpm exec netlify <command>
```

## 🔑 Environment Variables

The Bitly function reads a `BITLY_TOKEN` environment variable. For local
development create a `.env.local` file in the project root (it is gitignored via `*.local`):

```ini
BITLY_TOKEN=<your-bitly-token>
```

Get a token from your [Bitly account settings](https://app.bitly.com/settings/api/).
When deploying, set the same variable in the Netlify UI under
**Site configuration → Environment variables**.

## 🛠 Development

Run the app locally **with Netlify Functions support** (recommended — the shortener
calls `/.netlify/functions/shorten`):

```bash
netlify dev
```

This starts Vite and proxies the function locally so end-to-end shortening works.

Other scripts:

```bash
# Start the Vite dev server (frontend only — the function won't be available)
pnpm dev

# Type-check and build for production
pnpm build

# Preview the production build
pnpm preview

# Lint the codebase with ESLint
pnpm lint
```

## 🧪 Testing

Unit/component tests use **Vitest** with **React Testing Library** in a **jsdom** environment.

```bash
# Run the test suite once
pnpm test

# Run in watch mode during development
pnpm test:watch

# Run with coverage
pnpm cov
```

The tests live in [`tests/`](./tests) (`app.spec.test.ts`) and are configured in
[`vitest.config.ts`](./vitest.config.ts), with shared setup in `tests/setup.ts`.

## 📁 Project Structure

```
url-shortener/
├─ netlify/functions/shorten.ts   # Serverless handler that calls the Bitly API
├─ public/                        # Favicons and static assets
├─ src/
│  ├─ components/                 # Masthead, UrlForm, ResultCard, StatusMessage, icons
│  ├─ hooks/useShorten.ts         # All shortening state + side-effects
│  ├─ lib/utils.ts                # `shorten`, `isValidURL`, clipboard helpers
│  ├─ types.ts                    # Shared `Result` type
│  ├─ App.tsx                     # Composes the UI
│  └─ main.tsx                    # React entry point
├─ tests/                         # Vitest test suite
├─ index.html
├─ vite.config.ts
└─ vitest.config.ts
```

## 📦 Deployment

Deploy to Netlify (requires the Netlify CLI and a linked site):

```bash
# Deploy a draft (preview) URL
netlify deploy

# Deploy to production
netlify deploy --prod
```

Remember to configure `BITLY_TOKEN` in the Netlify environment before deploying.



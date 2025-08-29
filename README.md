# URL Shortener

A simple React + Vite web app to shorten long URLs using the Bitly API.
Deployed with Netlify Functions.

## ✨ Features
- Shorten long URLs quickly
- Powered by Bitly API
- Netlify serverless functions for backend logic

## 🚀 Installation
```bash
# Clone the repo
git clone <your-repo-url>
cd url-shortener

# Install dependencies
pnpm install
```

### Install Netlify CLI globally:
```bash
pnpm install -g netlify-cli
```

## 🔑 Environment Variables
Create a .env file or set environment variables in Netlify:
```ini
BITLY_TOKEN=<your-bitly-key>
```

## 🛠 Development
Run locally with Netlify Functions support:
```bash
netlify dev
```
Other scripts:
```bash
# Start Vite dev server (frontend only)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📦 Deployment
```bash
# Deploy to Netlify
netlify deploy --prod
```


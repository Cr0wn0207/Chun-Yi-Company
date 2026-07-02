# Chun Yi Company — Corporate Website

A corporate website for a personal or small business, inspired by [SCSK](https://www.scsk.jp/).  
Built with the **MERN stack** (MongoDB, Express, React, Node.js).

## Features

| Area | Description |
|------|-------------|
| **Home** | Hero slider, vision section, topics, service cards, news list |
| **About** | CEO message, philosophy, company overview, history, office map |
| **Products & Services** | Six core business areas (SCSK-style card layout) |
| **News** | Press / notice / event filters |
| **Contact** | Inquiry form stored in MongoDB |
| **Admin CMS** | Manage news, company info, and inquiries (`/admin`) |
| **i18n** | 10 languages (KO, EN, JA, ZH, DE, ES, FR, PT, VI, TH) |

## Project Structure

```
├── api/              # Vercel serverless entry
├── backend/          # Express API + MongoDB
│   ├── models/       # News, Service, Company, Contact
│   ├── routes/       # REST API endpoints (+ admin routes)
│   └── seed/         # Initial data
├── frontend/         # React (Vite)
│   └── src/
│       ├── components/  # Header, Footer, Hero, etc.
│       ├── i18n/        # Translations and locale merge
│       └── pages/       # Home, About, Services, News, Contact, Admin
├── vercel.json       # Vercel deployment config
└── package.json      # Root scripts (concurrently)
```

## Getting Started

### Prerequisites

- Node.js 18+
- [MongoDB Atlas](https://www.mongodb.com/atlas) free M0 cluster (recommended)

### MongoDB Atlas (free cluster)

1. Sign up at [MongoDB Atlas](https://cloud.mongodb.com/)
2. **Build a Database** → choose **M0 FREE** → pick a nearby region → **Create**
3. **Database Access** → **Add New Database User** (save username and password)
4. **Network Access** → **Add IP Address**
   - Development: **Allow Access from Anywhere** (`0.0.0.0/0`)
   - Production: restrict to your IP or Vercel IPs when possible
5. On the cluster, click **Connect** → **Drivers** → **Node.js**
6. Copy the connection string and set it in `backend/.env`:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/chunyi-corp?retryWrites=true&w=majority
```

> URL-encode special characters in the password (`@` → `%40`, etc.)

### Install and Run

```bash
# 1. Install dependencies
npm run install:all

# 2. Environment variables (create backend/.env from .env.example)
cp .env.example backend/.env
# Edit MONGODB_URI, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD in backend/.env

# 3. Seed the database
npm run seed

# 4. Start dev servers (backend :5000 + frontend :3000)
npm run dev
```

Open http://localhost:3000 in your browser.

**Admin:** http://localhost:3000/admin/login (credentials from `backend/.env`)

**Frontend mock mode:** set `VITE_USE_MOCK_DATA=true` in `frontend/.env` to run without the API.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/company` | Company information |
| GET | `/api/services` | Service list |
| GET | `/api/services/:slug` | Service detail |
| GET | `/api/news` | News list (`?category=press&limit=10`) |
| GET | `/api/news/:id` | News detail |
| POST | `/api/contact` | Submit inquiry |
| POST | `/api/auth/login` | Admin login |
| GET/PUT | `/api/admin/company` | Admin company (per locale) |
| CRUD | `/api/admin/news` | Admin news (per locale) |
| GET | `/api/admin/contacts` | Admin inquiries |

## Customization

- **Company name / logo**: `frontend/src/components/Logo.jsx`, `Header.jsx`, `Footer.jsx`
- **Translations**: `frontend/src/i18n/locales/*.js`
- **Seed data**: `backend/seed/seed.js` (company, services, news)
- **Design tokens**: `frontend/src/styles/global.css`

## Production Build

**Local (Express serves the built frontend):**

```bash
npm run build
NODE_ENV=production npm start --prefix backend
```

**Vercel:** connect the GitHub repo and set environment variables from `.env.example` (`MONGODB_URI`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`).

## License

Private / all rights reserved unless otherwise noted.

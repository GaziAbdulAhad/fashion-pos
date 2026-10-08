# Fashion & Glow POS

**Fashion • Clothing • Jewelry • Cosmetics** Point of Sale System

Production-ready React + Vite frontend designed for GitHub Pages + Google Apps Script backend.

## Features

- **POS Terminal** with product variants (Size, Color, Purity, Weight)
- **Dashboard** with real KPIs & charts
- **Products** with Clothing / Jewelry / Cosmetics / Accessories support
- **Sales** management with partial payment & due tracking
- **Customers** with due balance
- **Role-based** navigation (Admin / Manager / Cashier)
- **Dark Mode** support
- **Responsive** design (Desktop + Tablet + Mobile)
- **GitHub Pages** ready (`base: '/fashion-pos/'`)

## Demo Login

| Role    | Email                     | Password |
|---------|---------------------------|----------|
| Admin   | admin@fashionpos.com      | 123456   |
| Manager | manager@fashionpos.com    | 123456   |
| Cashier | cashier@fashionpos.com    | 123456   |

## Quick Start

```bash
npm install
npm run dev
```

Open: http://localhost:5173/fashion-pos/

## GitHub Pages Deploy

1. `base` in `vite.config.ts` is already set to `/fashion-pos/`
2. `npm run build`
3. Deploy `dist/` to gh-pages branch

```bash
npm install -D gh-pages
npm pkg set scripts.predeploy="npm run build"
npm pkg set scripts.deploy="gh-pages -d dist"
npm run deploy
```

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Zustand
- React Router 6
- Recharts
- Lucide Icons

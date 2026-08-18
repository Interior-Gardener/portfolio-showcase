# Kartik Verma — Personal Portfolio

A modern, animated personal portfolio built with **TanStack Start (React 19 + Vite)**, featuring WebGL scenes, a light/dark editorial theme, detailed project case studies, and a Razorpay-powered "Buy me a chai" support page backed by MongoDB.

**Live:** https://kartikverma.onrender.com/
> **Note:** The website is hosted on Render's free tier and may take about 50 seconds to a minute to spin up upon the first request. Please be patient!

**GitHub:** https://github.com/Interior-Gardener
**LinkedIn:** https://www.linkedin.com/in/kartikverma2204

---

## About Me

I am a Full-Stack and Machine Learning Engineer passionate about building scalable, immersive, and impactful applications. My experience ranges from developing robust enterprise solutions and public-good platforms to crafting interactive 3D web experiences and VR simulations. I thrive on solving complex problems across the stack, whether it's optimizing backend workflows, designing modern UIs, or integrating AI models.

## Portfolio Details

This portfolio is not just a showcase of my projects, but a demonstration of my technical capabilities:
- **Interactive 3D Elements:** Uses Three.js for interactive WebGL scenes (like the GeoSwipe globe and JSW lattice).
- **Modern Tech Stack:** Built with TanStack Start, React 19, Tailwind CSS v4, and Framer Motion for a seamless, fast, and highly animated user experience.
- **Backend & Database:** Features a fully functional backend using typed RPCs (`createServerFn`) and MongoDB for persisting user interactions, such as the "Buy me a chai" support page.
- **Detailed Case Studies:** Dynamic pages detailing stack breakdowns, features, and challenges for projects like *GeoSwipe*, *Industrial Asset Management*, *Atomix*, *Skill_Verse*, and more.

---

## Features

- **Editorial dark/light theme** — hand-built design tokens, Instrument Serif + Inter typography, persisted theme toggle.
- **Motion throughout** — Framer Motion entrance/scroll animations, animated aurora wash, drifting লড়াই particles, masked engineering grid, scroll-progress bar.
- **Three.js scenes** — an interactive point-globe with orbiting markers and arcs (GeoSwipe theme) behind the hero, and a breathing instanced steel lattice (JSW theme) behind the experience section and project pages. Client-only, pointer-reactive, theme-aware, and automatically disabled on mobile or with `prefers-reduced-motion`.
- **Project case studies** — dynamic `/projects/{slug}` pages with stack breakdowns, feature lists and highlights, sourced from public repos.
- **Résumé** — inline view plus a one-click download.
- **Support page** — `/support` with preset/custom amounts, Razorpay Checkout, server-side order creation and HMAC signature verification, plus a UPI QR fallback.
- **Persistence** — donations recorded in MongoDB with schema validation and indexes; degrades gracefully to a no-op when no database is configured.
- **SEO** — per-route titles/descriptions, Open Graph and Twitter cards, semantic HTML, `robots.txt`.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start v1 (React 19, SSR) |
| Routing | TanStack Router (file-based, `src/routes`) |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 (`src/styles.css`, `@theme` tokens) |
| Animation | Framer Motion |
| 3D | three.js + @react-three/fiber |
| UI primitives | shadcn/ui + Radix, lucide-react icons |
| Server logic | `createServerFn` (typed RPC) |
| Payments | Razorpay Orders API + Checkout |
| Database | MongoDB (native driver locally, Atlas Data API on edge) |
| Validation | Zod |
| Runtime | Bun (npm/pnpm also work) |

---

## Getting started

### Prerequisites
- Bun (or Node 20+)
- A MongoDB instance — local (`mongodb://localhost:27017`) or Atlas
- A Razorpay account for test keys (optional)

### Install and run

```bash
git clone https://github.com/Interior-Gardener/<repo>.git
cd <repo>
bun install
cp .env.example .env      # fill in your values
bun run db:init           # creates the DB, collections and indexes
bun run dev               # http://localhost:8080
```

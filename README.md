# Miguel Guerreiro — Portfolio

[![CI](https://github.com/MGuerreiro42/dev-portifolio/actions/workflows/ci.yml/badge.svg)](https://github.com/MGuerreiro42/dev-portifolio/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![Three.js](https://img.shields.io/badge/Three.js-0.170-000000?logo=three.js&logoColor=white&style=flat-square)

Personal portfolio built with Next.js 15, React 19, TypeScript, Tailwind CSS 4, Framer Motion and Three.js. Designed with obsessive attention to motion, spacing and visual depth — a work in progress, actively evolving.

**Live:** [guerreiro-dev.vercel.app](https://guerreiro-dev.vercel.app) (English by default, `/pt-br` for Portuguese)

---

## Overview

A single-page portfolio with four full-screen sticky sections that stack on scroll, plus dedicated case-study pages per project:

| Section | Description |
|---------|-------------|
| **Hero** | Three.js particle field (density/size tuned against real FPS measurements), corner photo with scroll-linked exit parallax |
| **About** | Biography, experience timeline, competencies/tech stack, three Three.js "glass" blobs sized in a deliberate visual hierarchy |
| **Work** | Expandable project panels (hover/click) with parallax image effect; each project links to a `/work/[slug]` case-study page (overview, architecture, tech rationale, a real challenge, status) |
| **Contact** | Email CTA, social links and location metadata |

Fully bilingual (English/Portuguese) via `next-intl`, including the case-study pages. Heavy Three.js scenes are `next/dynamic`-imported and only mounted while their section is actually the active one, so at most one WebGL context runs at a time.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 (CSS-based `@theme`, no `tailwind.config.js`) |
| i18n | next-intl (EN/PT-BR) |
| Animation | Framer Motion 11 |
| 3D / Canvas | Three.js 0.170 |
| Icons | Lucide React, react-icons (brand-colored tech pills) |
| Package Manager | pnpm |
| Runtime | Node.js 20+ |

---

## Project Structure

```
src/
  app/
    [locale]/
      layout.tsx          # Root layout per locale (fonts, metadata, <html lang>)
      page.tsx            # Home — composes all four sections
      work/[slug]/
        page.tsx           # Case-study page, statically generated per project × locale
        loading.tsx        # Route-transition loading state
      loading.tsx          # Home route-transition loading state
    icon.tsx / apple-icon.tsx / opengraph-image.tsx  # Generated favicon/OG image
    robots.ts / sitemap.ts
    globals.css            # Tailwind base + the site's semantic color tokens
  components/
    hero/         # HeroSection, DustField (particle field), useHero/usePanelFloat hooks
    about/        # AboutSection, GlassBlobs (Three.js)
    work/         # WorkSection, ProjectDetailView
    contact/      # ContactSection
    nav/          # Brand, Navbar, MobileMenu, LocaleSwitcher
    ui/           # Reveal, TechPill, LoadingScreen
    ScrollContainer.tsx    # Scroll-snap orchestrator + URL hash sync
    SectionIndicator.tsx
  context/
    SectionContext.tsx     # Active section index + scroll container ref
  hooks/
    useIsSectionActive.ts  # Gates heavy scenes to the currently active section
    useIsDesktop.ts
  lib/
    projects.ts   # Single source of truth for project data (Work + case studies)
    sections.ts   # Section key↔index mapping (nav, indicator, URL hash)
    techIcons.ts  # Tech name → icon + brand color
    site.ts       # Canonical site URL
    utils.ts      # cn() utility (clsx + tailwind-merge)
  i18n/           # next-intl routing/navigation config
messages/
  en.json / pt-br.json      # All UI copy, including case-study content
public/
  photo.webp, about-photo.jpg, portfolio.png, projects/
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
# Clone the repository
git clone git@github.com:MGuerreiro42/dev-portifolio.git
cd dev-portifolio

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser (redirects to `/en`).

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |

CI (`.github/workflows/ci.yml`) runs typecheck + lint + build on every push/PR to `main`.

---

## Customisation

### Personal information

- **`src/lib/projects.ts`** — project data (title, tags, image, live/repo links); the actual copy (category, description, and each case-study's overview/architecture/stack/challenge/status) lives in `messages/en.json` / `messages/pt-br.json` under `Work.projects.<id>`.
- **`src/components/about/AboutSection.tsx`** — `EXPERIENCE_IDS`, `TECH_STACK`; bio/competencies copy is in `messages/*.json` under `About`.
- **`src/components/contact/ContactSection.tsx`** — email address and social links.
- **`messages/en.json`, `messages/pt-br.json`** — all UI copy for both locales.

### Profile photo

Replace `public/photo.webp` with your own image. The component expects a portrait photo (recommended ratio ≈ 1536 × 2730 / 0.56). Update `PHOTO_RATIO` in `HeroSection.tsx` if the aspect ratio differs.

### Project images

Add project cover images to `public/projects/` and reference them in `src/lib/projects.ts`.

### Resume / CV

Replace the PDFs in `public/resume/` with your own (`RESUME_HREF` in `ContactSection.tsx` maps each locale to its file); the Contact section's download button picks the right one based on the active locale.

---

## Deployment

Deploys to [Vercel](https://vercel.com) with zero configuration — every push to `main` auto-deploys to production, PRs get preview deployments.

For other hosting providers (Netlify, Cloudflare Pages, etc.), run `pnpm build` and serve the `.next` output directory.

---

## Performance Notes

- Particle counts and material choices in `DustField`/`GlassBlobs` are tuned against measured FPS under CPU throttling, not guesswork — see the components' own comments for the reasoning.
- Both Three.js scenes are lazy-loaded (`next/dynamic`) and gated by `useIsSectionActive`, so their WebGL context only exists while their section is actually active.
- `prefers-reduced-motion` is respected site-wide: `MotionConfig reducedMotion="user"` covers every Framer Motion animation automatically, and the Three.js scenes + Hero's manual scroll/mouse-driven transforms are gated separately via `usePrefersReducedMotion`.
- Images use the Next.js `<Image>` component for automatic optimisation and lazy loading; source images are pre-optimised too (e.g. the Hero photo is WebP with real alpha transparency, not an unoptimised multi-MB PNG).
- Framer Motion animations use `will-change: transform` only where needed.

---

## License

This project is open source under the [MIT License](LICENSE).

---

## Author

**Miguel Pachiega Guerreiro** — Software Engineer & Front-End Developer
Americana, SP · Brazil
[GitHub](https://github.com/MGuerreiro42) · [LinkedIn](https://linkedin.com/in/miguelpguerreiro)

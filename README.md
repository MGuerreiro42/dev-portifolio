# Miguel Guerreiro — Portfolio

Personal portfolio built with Next.js 15, React 19, TypeScript, Tailwind CSS 4, Framer Motion and Three.js. Designed with obsessive attention to motion, spacing and visual depth.

**Live demo:** _add your URL here_

---

## Overview

A single-page portfolio with four full-screen sticky sections that stack on scroll:

| Section | Description |
|---------|-------------|
| **Hero** | Animated particle field (Three.js), 3D photo tilt on mouse, entrance transitions |
| **About** | Biography, experience timeline, core competencies and tech stack |
| **Work** | Expandable project panels with parallax image effect on hover/click |
| **Contact** | Email CTA, social links and location metadata |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion 11 |
| 3D / Canvas | Three.js 0.170 |
| UI Primitives | shadcn/ui, Base UI, Lucide React |
| Package Manager | pnpm |
| Runtime | Node.js 20+ |

---

## Project Structure

```
src/
  app/
    layout.tsx          # Root layout (fonts, global styles)
    page.tsx            # Entry point — composes all sections
    globals.css         # Global styles and Tailwind base
  components/
    hero/
      HeroSection.tsx   # Hero layout, 3D photo tilt, entrance animations
      DustField.tsx     # Three.js particle field reacting to mouse
      useHero.ts        # Mouse tracking, rotation and glow logic
    about/
      AboutSection.tsx  # Biography, experience, tech stack
    work/
      WorkSection.tsx   # Expandable project panels with parallax
    contact/
      ContactSection.tsx# Email CTA, social links, footer metadata
    nav/
      Navbar.tsx        # Top navigation bar
    ui/
      Reveal.tsx        # Scroll-triggered reveal animation wrapper
      button.tsx        # shadcn Button component
    ScrollContainer.tsx # Smooth scroll orchestrator between sections
    SectionIndicator.tsx# Active section dot indicator
  context/
    SectionContext.tsx  # Global active section state
  hooks/               # Custom hooks
  lib/
    utils.ts           # cn() utility (clsx + tailwind-merge)
public/
  photo.png            # Hero profile photo
  portfolio.png        # Portfolio project screenshot
  projects/            # Project cover images
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/portfolio-nextjs.git
cd portfolio-nextjs

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |

---

## Customisation

### Personal information

Update the following files with your own data:

- **`src/components/hero/HeroSection.tsx`** — name, title, location
- **`src/components/about/AboutSection.tsx`** — `EXPERIENCE`, `COMPETENCIES`, `TECH_STACK` arrays
- **`src/components/work/WorkSection.tsx`** — `PROJECTS` array (title, description, tags, image, href)
- **`src/components/contact/ContactSection.tsx`** — email address and social links

### Profile photo

Replace `public/photo.png` with your own image. The component expects a portrait photo (recommended ratio ≈ 1536 × 2730 / 0.56). Update `PHOTO_RATIO` in `HeroSection.tsx` if the aspect ratio differs.

### Project images

Add project cover images to `public/projects/` and reference them in the `PROJECTS` array in `WorkSection.tsx`.

---

## Deployment

The project deploys to [Vercel](https://vercel.com) with zero configuration.

```bash
# Install the Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Alternatively, push to a GitHub repository and import it directly from the Vercel dashboard.

For other hosting providers (Netlify, Cloudflare Pages, etc.), run `pnpm build` and serve the `.next` output directory.

---

## Performance Notes

- Images use the Next.js `<Image>` component for automatic optimisation and lazy loading.
- The `DustField` Three.js canvas is rendered outside the React tree to avoid unnecessary re-renders.
- Framer Motion animations use `will-change: transform` only where needed.
- All client components are co-located with a `"use client"` directive; the root layout remains a Server Component.

---

## License

This project is open source under the [MIT License](LICENSE).

---

## Author

**Miguel Guerreiro** — Software Engineer & Front-End Developer
Americana, SP · Brazil
[GitHub](https://github.com/) · [LinkedIn](https://linkedin.com/in/) · [Instagram](https://instagram.com/)

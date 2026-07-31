"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Project {
  title: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  image: string;
  /** Live demo — omitted when the project has no public deploy (e.g. a mobile-only app). */
  href?: string;
  /** GitHub repository — always present. */
  repoHref: string;
}

const PROJECTS: Project[] = [
  {
    title: "Mini TMS",
    category: "Full-Stack Application",
    year: "2026",
    description:
      "Multi-tenant transportation management system with real-time delivery tracking — NestJS, Next.js, PostgreSQL and Redis pub/sub, built to demonstrate real domain modeling and a horizontally-scalable real-time architecture.",
    tags: ["NestJS", "Next.js", "PostgreSQL", "Redis", "WebSocket"],
    image: "/projects/mini-tms.png",
    href: "https://mini-tms-logitrack.vercel.app",
    repoHref: "https://github.com/MGuerreiro42/mini-tms-logitrack",
  },
  {
    title: "Vigil Dashboard",
    category: "Data Visualization",
    year: "2026",
    description:
      "A live global monitoring dashboard aggregating crypto markets, ISS tracking, seismic activity, weather and news into one real-time interface — React, a Three.js globe, WebSocket and REST polling side by side.",
    tags: ["React", "TypeScript", "Three.js", "WebSocket"],
    image: "/projects/vigil-dashboard.png",
    repoHref: "https://github.com/MGuerreiro42/vigil-dashboard",
  },
  {
    title: "Real-Time Communication",
    category: "Technical Demo",
    year: "2026",
    description:
      "An interactive, side-by-side comparison of Polling, Long Polling, Server-Sent Events and WebSocket — live event streams for each technique, plus a bilingual technical deep-dive presentation.",
    tags: ["Next.js", "Express", "WebSocket", "SSE"],
    image: "/projects/realtime-communication.png",
    href: "https://realtime-comunication-talk.vercel.app",
    repoHref: "https://github.com/MGuerreiro42/realtime-comunication-talk",
  },
  {
    title: "Dine Out App",
    category: "Mobile App",
    year: "2026",
    description:
      "A restaurant and bar discovery app — browse by cuisine, occasion and vibe, dig into a menu and reviews. Expo/React Native, built with a spec-driven workflow; currently a navigable prototype for business partners.",
    tags: ["React Native", "Expo", "TypeScript"],
    image: "/projects/dine-out-app.png",
    repoHref: "https://github.com/MGuerreiro42/dine-out-app",
  },
  {
    title: "Portfolio",
    category: "Personal Project",
    year: "2026",
    description:
      "This very portfolio — built with Next.js, Three.js and Framer Motion. Obsessive attention to motion, detail and visual depth.",
    tags: ["Next.js", "Three.js", "Framer Motion", "Tailwind"],
    image: "/portfolio.png",
    repoHref: "https://github.com/MGuerreiro42/dev-portifolio",
  },
];

interface ParallaxOffset {
  x: number;
  y: number;
}

export default function WorkSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [parallax, setParallax] = useState<Record<number, ParallaxOffset>>({});
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleClick = (i: number) => {
    setActive((prev) => (prev === i ? null : i));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
    const el = panelRefs.current[i];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5;  // -0.5 to 0.5
    setParallax((prev) => ({ ...prev, [i]: { x: nx * 22, y: ny * 14 } }));
  };

  const handleMouseLeave = (i: number) => {
    setHovered(null);
    setParallax((prev) => ({ ...prev, [i]: { x: 0, y: 0 } }));
  };

  return (
    <section
      id="work"
      className="relative w-full h-screen flex overflow-hidden sticky top-0 z-[3]"
    >
      {/* Linha divisória do topo */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06] z-10" />

      {PROJECTS.map((project, i) => (
        <div
          key={project.title}
          ref={(el) => { panelRefs.current[i] = el; }}
          className={[
            "relative overflow-hidden cursor-pointer",
            "transition-[flex] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            active === i
              ? "flex-[2.5]"
              : active !== null
              ? "flex-[0.75]"
              : "flex-1",
          ].join(" ")}
          onClick={() => handleClick(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseMove={(e) => handleMouseMove(e, i)}
          onMouseLeave={() => handleMouseLeave(i)}
        >
          {/* Imagem de fundo com parallax */}
          <motion.div
            className={[
              "absolute inset-[-6%] transition-[filter] duration-700",
              hovered === i || active === i ? "grayscale-0 blur-none" : "grayscale blur-[6px]",
            ].join(" ")}
            animate={
              active === i && hovered !== i
                ? { x: [0, 11, -8, 4, 0], y: [0, 6, -5, 8, 0] }
                : { x: parallax[i]?.x ?? 0, y: parallax[i]?.y ?? 0 }
            }
            transition={
              active === i && hovered !== i
                ? { duration: 12, repeat: Infinity, ease: "easeInOut" }
                : { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
            }
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Gradiente de baixo para cima */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-[1]" />

          {/* Separador vertical entre painéis */}
          {i > 0 && (
            <div className="absolute left-0 top-0 bottom-0 w-px bg-white/[0.07] z-[2]" />
          )}

          {/* Conteúdo */}
          <div className="absolute inset-0 z-[3] flex flex-col justify-between p-10">

            {/* Topo — categoria + ano, visível só quando ativo */}
            <div
              className={[
                "transition-[opacity,transform] duration-500",
                active === i
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2",
              ].join(" ")}
            >
              <p className="font-light text-[9px] tracking-[0.55em] uppercase text-[#f0ede8]/[0.35]">
                {project.category} · {project.year}
              </p>
            </div>

            {/* Rodapé — título + conteúdo expandido */}
            <div className="flex flex-col">
              <h3
                className={[
                  "font-display uppercase leading-[0.87] tracking-[-0.01em] text-[#f0ede8]",
                  "transition-[font-size] duration-500",
                  active === i
                    ? "text-[clamp(38px,4vw,68px)] mb-6"
                    : "text-[clamp(22px,2vw,36px)] mb-0",
                ].join(" ")}
              >
                {project.title}
              </h3>

              {/* Só visível quando ativo (clique) */}
              <div
                className={[
                  "flex flex-col gap-5 overflow-hidden",
                  "transition-[opacity,transform] duration-500",
                  active === i
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 translate-y-4 pointer-events-none",
                ].join(" ")}
              >
                <p className="font-light text-[12px] leading-[1.9] text-[#f0ede8]/[0.38] max-w-[380px]">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-light text-[9px] tracking-[0.22em] uppercase text-[#f0ede8]/50 border border-white/[0.10] px-3 py-1.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-x-10 gap-y-3 mt-1">
                  {project.href && (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-[18px] font-light text-[9px] tracking-[0.5em] uppercase text-[#f0ede8]/30 no-underline transition-colors duration-400 hover:text-[#f0ede8]/65"
                    >
                      <span className="block w-8 h-px bg-current [transition:width_0.5s_cubic-bezier(0.16,1,0.3,1)] group-hover:w-[52px]" />
                      View Live
                    </a>
                  )}
                  <a
                    href={project.repoHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-[18px] font-light text-[9px] tracking-[0.5em] uppercase text-[#f0ede8]/30 no-underline transition-colors duration-400 hover:text-[#f0ede8]/65"
                  >
                    <span className="block w-8 h-px bg-current [transition:width_0.5s_cubic-bezier(0.16,1,0.3,1)] group-hover:w-[52px]" />
                    View Code
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

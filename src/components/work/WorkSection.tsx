"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Globe, Radio, Rss } from "lucide-react";
import {
  SiNestjs,
  SiNextdotjs,
  SiPostgresql,
  SiRedis,
  SiReact,
  SiTypescript,
  SiThreedotjs,
  SiExpress,
  SiExpo,
  SiFramer,
  SiTailwindcss,
  SiGithub,
} from "react-icons/si";

const TECH_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "NestJS": SiNestjs,
  "Next.js": SiNextdotjs,
  "PostgreSQL": SiPostgresql,
  "Redis": SiRedis,
  "WebSocket": Radio,
  "React": SiReact,
  "TypeScript": SiTypescript,
  "Three.js": SiThreedotjs,
  "Express": SiExpress,
  "SSE": Rss,
  "React Native": SiReact,
  "Expo": SiExpo,
  "Framer Motion": SiFramer,
  "Tailwind": SiTailwindcss,
};

interface Project {
  id: string;
  title: string;
  year: string;
  tags: string[];
  image: string;
  /** Live demo — omitted when the project has no public deploy (e.g. a mobile-only app). */
  href?: string;
  /** GitHub repository — always present. */
  repoHref: string;
}

const PROJECTS: Project[] = [
  {
    id: "miniTms",
    title: "Mini TMS",
    year: "2026",
    tags: ["NestJS", "Next.js", "PostgreSQL", "Redis", "WebSocket"],
    image: "/projects/mini-tms.png",
    href: "https://mini-tms-logitrack.vercel.app",
    repoHref: "https://github.com/MGuerreiro42/mini-tms-logitrack",
  },
  {
    id: "vigilDashboard",
    title: "Vigil Dashboard",
    year: "2026",
    tags: ["React", "TypeScript", "Three.js", "WebSocket"],
    image: "/projects/vigil-dashboard.png",
    repoHref: "https://github.com/MGuerreiro42/vigil-dashboard",
  },
  {
    id: "realtimeCommunication",
    title: "Real-Time Communication",
    year: "2026",
    tags: ["Next.js", "Express", "WebSocket", "SSE"],
    image: "/projects/realtime-communication.png",
    href: "https://realtime-comunication-talk.vercel.app",
    repoHref: "https://github.com/MGuerreiro42/realtime-comunication-talk",
  },
  {
    id: "dineOutApp",
    title: "Dine Out App",
    year: "2026",
    tags: ["React Native", "Expo", "TypeScript"],
    image: "/projects/dine-out-app.png",
    repoHref: "https://github.com/MGuerreiro42/dine-out-app",
  },
  {
    id: "portfolio",
    title: "Portfolio",
    year: "2026",
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
  const t = useTranslations("Work");
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
              : hovered === i
              ? "flex-[1.4]"
              : hovered !== null
              ? "flex-[0.85]"
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
          <div className="absolute inset-0 z-[3]">

            {/* Topo — categoria + ano, visível só quando ativo */}
            <div
              className={[
                "absolute top-10 left-10 right-10",
                "transition-[opacity,transform] duration-500",
                active === i
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2",
              ].join(" ")}
            >
              <p className="font-light text-[10px] tracking-[0.55em] uppercase text-[#f0ede8]/[0.35]">
                {t(`projects.${project.id}.category`)} · {project.year}
              </p>
            </div>

            {/* Título — base fixa exatamente no centro vertical do painel, para alinhar entre projetos */}
            <div className="absolute left-10 right-10 top-1/2 -translate-y-full flex items-end">
              <h3
                className={[
                  "font-display uppercase leading-[0.87] tracking-[-0.01em] text-[#f0ede8]",
                  "transition-[font-size] duration-500",
                  active === i
                    ? "text-[clamp(38px,4vw,68px)]"
                    : "text-[clamp(22px,2vw,36px)]",
                ].join(" ")}
              >
                {project.title}
              </h3>
            </div>

            {/* Ícones + conteúdo expandido — crescem a partir do centro vertical */}
            <div className="absolute left-10 right-10 top-1/2 flex flex-col">
              {/* Stack + status — visível só quando colapsado (some ao ativar) */}
              <div
                className={[
                  "flex items-center gap-3 overflow-hidden",
                  "transition-[opacity,max-height,margin] duration-500",
                  active === i
                    ? "opacity-0 max-h-0 mt-0 pointer-events-none"
                    : "opacity-100 max-h-8 mt-4",
                ].join(" ")}
              >
                <div className="flex items-center gap-2.5">
                  {project.tags.map((tag) => {
                    const Icon = TECH_ICONS[tag];
                    return Icon ? (
                      <Icon
                        key={tag}
                        className="w-[15px] h-[15px] text-[#f0ede8]/45"
                      />
                    ) : null;
                  })}
                </div>

                <span className="w-px h-3.5 bg-white/15 shrink-0" />

                <div className="flex items-center gap-2.5">
                  <SiGithub className="w-[13px] h-[13px] text-[#f0ede8]/45" />
                  {project.href && (
                    <Globe className="w-[13px] h-[13px] text-emerald-400/70" />
                  )}
                </div>
              </div>

              {/* Só visível quando ativo (clique) — grid-rows colapsa a altura no layout quando inativo */}
              <div
                className={[
                  "grid transition-[grid-template-rows,margin] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  active === i ? "grid-rows-[1fr] mt-6" : "grid-rows-[0fr] mt-0",
                ].join(" ")}
              >
                <div className="overflow-hidden">
                  <div
                    className={[
                      "flex flex-col gap-5",
                      "transition-[opacity,transform] duration-500",
                      active === i
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 translate-y-4 pointer-events-none",
                    ].join(" ")}
                  >
                    <p className="font-light text-[13px] leading-[1.9] text-[#f0ede8]/[0.38] max-w-[380px]">
                      {t(`projects.${project.id}.description`)}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-light text-[10px] tracking-[0.22em] uppercase text-[#f0ede8]/75 bg-white/[0.03] border border-white/[0.25] px-3 py-1.5"
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
                          className="group inline-flex items-center gap-[18px] font-light text-[10px] tracking-[0.5em] uppercase text-[#f0ede8]/30 no-underline transition-colors duration-400 hover:text-[#f0ede8]/65"
                        >
                          <span className="block w-8 h-px bg-current [transition:width_0.5s_cubic-bezier(0.16,1,0.3,1)] group-hover:w-[52px]" />
                          {t("viewLive")}
                        </a>
                      )}
                      <a
                        href={project.repoHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-[18px] font-light text-[10px] tracking-[0.5em] uppercase text-[#f0ede8]/30 no-underline transition-colors duration-400 hover:text-[#f0ede8]/65"
                      >
                        <span className="block w-8 h-px bg-current [transition:width_0.5s_cubic-bezier(0.16,1,0.3,1)] group-hover:w-[52px]" />
                        {t("viewCode")}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

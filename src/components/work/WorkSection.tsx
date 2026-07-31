"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ChevronDown, ExternalLink } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { TECH_ICONS } from "@/lib/techIcons";
import TechPill from "@/components/ui/TechPill";

/** Indicador "ao vivo" — bolinha vermelha com oscilação de brilho, como um sinal de REC. */
function RecDot() {
  return (
    <span className="relative flex w-[9px] h-[9px]">
      <motion.span
        className="absolute inset-0 rounded-full bg-red-500"
        animate={{
          opacity: [0.55, 1, 0.55],
          boxShadow: [
            "0 0 2px 0px rgba(239,68,68,0.5)",
            "0 0 7px 2px rgba(239,68,68,0.9)",
            "0 0 2px 0px rgba(239,68,68,0.5)",
          ],
        }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </span>
  );
}

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
      className="relative w-full min-h-screen md:h-screen overflow-hidden md:sticky md:top-0 z-[3]"
    >
      {/* Linha divisória do topo */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06] z-10" />

      {/* Desktop — painéis lado a lado, expandem com hover/clique */}
      <div className="hidden md:flex w-full h-full">
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

          {/* Leve vinheta sobre a própria imagem quando o projeto está
              selecionado, para dar profundidade e reforçar o destaque */}
          <div
            className={[
              "absolute inset-0 z-[1] pointer-events-none transition-opacity duration-700",
              "shadow-[inset_0_0_140px_40px_rgba(0,0,0,0.45)]",
              active === i ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />

          {/* Separador vertical entre painéis */}
          {i > 0 && (
            <div className="absolute left-0 top-0 bottom-0 w-px bg-white/[0.07] z-[2]" />
          )}

          {/* Conteúdo */}
          <div className="absolute inset-0 z-[3]">

            {/* Faixa com blur sobre a imagem — mesmo tratamento do estado
                minimizado, mas só na área do texto, para manter a imagem
                nítida no resto do painel quando ativo */}
            <div
              className={[
                "absolute left-0 right-0 bottom-0 backdrop-blur-md bg-black/20",
                "transition-opacity duration-500",
                active === i ? "opacity-100" : "opacity-0 pointer-events-none",
              ].join(" ")}
              style={{ top: "calc(50% - 150px)" }}
            />

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
                  {project.href && <RecDot />}
                </div>
              </div>

              {/* Só visível quando ativo (clique) — grid-rows colapsa a altura no layout quando inativo */}
              <div
                className={[
                  "grid transition-[grid-template-rows,margin] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  active === i ? "grid-rows-[1fr] mt-6" : "grid-rows-[0fr] mt-0",
                ].join(" ")}
              >
                <div className="overflow-hidden pb-2">
                  <div
                    className={[
                      "flex flex-col gap-5",
                      "transition-[opacity,transform] duration-500",
                      active === i
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 translate-y-4 pointer-events-none",
                    ].join(" ")}
                  >
                    <p className="font-light text-[13px] leading-[1.9] text-[#f0ede8]/[0.55] max-w-[380px]">
                      {t(`projects.${project.id}.description`)}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <TechPill key={tag} label={tag} />
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3 mt-1">
                      {project.href && (
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 font-light text-[10px] tracking-[0.25em] uppercase text-[#f0ede8]/75 no-underline transition-colors duration-300 hover:bg-white/15 hover:border-white/30 hover:text-[#f0ede8]"
                        >
                          {t("viewLive")}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <a
                        href={project.repoHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 font-light text-[10px] tracking-[0.25em] uppercase text-[#f0ede8]/75 no-underline transition-colors duration-300 hover:bg-white/15 hover:border-white/30 hover:text-[#f0ede8]"
                      >
                        {t("viewCode")}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      </div>

      {/* Mobile — lista vertical, toque expande a descrição/tags/links */}
      <div className="flex md:hidden flex-col gap-5 px-6 py-24">
        {PROJECTS.map((project, i) => (
          <div
            key={project.title}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
          >
            <button
              onClick={() => handleClick(i)}
              className="block w-full text-left cursor-pointer"
              aria-expanded={active === i}
            >
              <div className="relative h-52 w-full">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-light text-[9px] tracking-[0.4em] uppercase text-[#f0ede8]/50 mb-1.5">
                    {t(`projects.${project.id}.category`)} · {project.year}
                  </p>
                  <h3 className="font-display text-[26px] leading-none uppercase text-[#f0ede8]">
                    {project.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3.5">
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
                  {project.href && <RecDot />}
                </div>

                <ChevronDown
                  className={[
                    "w-4 h-4 text-[#f0ede8]/30 ml-auto transition-transform duration-300",
                    active === i ? "rotate-180" : "",
                  ].join(" ")}
                />
              </div>
            </button>

            <div
              className={[
                "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                active === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              ].join(" ")}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-4 px-4 pb-5">
                  <p className="font-light text-[13px] leading-[1.9] text-[#f0ede8]/[0.5]">
                    {t(`projects.${project.id}.description`)}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <TechPill key={tag} label={tag} />
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {project.href && (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 font-light text-[10px] tracking-[0.2em] uppercase text-[#f0ede8]/75 no-underline transition-colors duration-300 hover:bg-white/15 hover:border-white/30 hover:text-[#f0ede8]"
                      >
                        {t("viewLive")}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <a
                      href={project.repoHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 font-light text-[10px] tracking-[0.2em] uppercase text-[#f0ede8]/75 no-underline transition-colors duration-300 hover:bg-white/15 hover:border-white/30 hover:text-[#f0ede8]"
                    >
                      {t("viewCode")}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

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
  href: string;
}

const PROJECTS: Project[] = [
  {
    title: "Portfolio",
    category: "Personal Project",
    year: "2025",
    description:
      "This very portfolio — built with Next.js, Three.js and Framer Motion. Obsessive attention to motion, detail and visual depth.",
    tags: ["Next.js", "Three.js", "Framer Motion", "Tailwind"],
    image: "/portfolio.png",
    href: "#",
  },
  {
    title: "Project Two",
    category: "Web Application",
    year: "2024",
    description:
      "Short description of what this project is about and the problems it solves. Replace with your real project.",
    tags: ["React", "TypeScript", "Node.js"],
    image: "/projects/project2.jpg",
    href: "#",
  },
  {
    title: "Project Three",
    category: "Interface Design",
    year: "2023",
    description:
      "A project focused on motion design and micro-interactions. Replace with your real project.",
    tags: ["React", "Framer Motion"],
    image: "/projects/project3.jpg",
    href: "#",
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

                <a
                  href={project.href}
                  className="group inline-flex items-center gap-[18px] font-light text-[9px] tracking-[0.5em] uppercase text-[#f0ede8]/30 no-underline transition-colors duration-400 hover:text-[#f0ede8]/65 mt-1"
                >
                  <span className="block w-8 h-px bg-current [transition:width_0.5s_cubic-bezier(0.16,1,0.3,1)] group-hover:w-[52px]" />
                  Ver Projeto
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

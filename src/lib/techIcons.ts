import type { ComponentType, CSSProperties } from "react";
import { Radio, Rss } from "lucide-react";
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
  SiNodedotjs,
} from "react-icons/si";

/** Ícones por nome de tecnologia — WebSocket e SSE não têm logo de marca,
 * usamos ícones genéricos do lucide para representar o protocolo. */
export const TECH_ICONS: Record<
  string,
  ComponentType<{ className?: string; style?: CSSProperties }>
> = {
  NestJS: SiNestjs,
  "Next.js": SiNextdotjs,
  PostgreSQL: SiPostgresql,
  Redis: SiRedis,
  WebSocket: Radio,
  React: SiReact,
  TypeScript: SiTypescript,
  "Three.js": SiThreedotjs,
  Express: SiExpress,
  SSE: Rss,
  "React Native": SiReact,
  Expo: SiExpo,
  "Framer Motion": SiFramer,
  Tailwind: SiTailwindcss,
  "Node.js": SiNodedotjs,
};

/** Cor de marca por tecnologia, aplicada só no ícone (pill continua neutra) —
 * omitidas de propósito quando a marca é monocromática (Next.js, Three.js,
 * Express) ou quando não há uma cor oficial confiável (protocolos, Framer
 * Motion), para não inventar uma identidade que não existe. */
export const TECH_COLORS: Record<string, string> = {
  React: "#61DAFB",
  "React Native": "#61DAFB",
  TypeScript: "#3178C6",
  "Node.js": "#68A063",
  Tailwind: "#38BDF8",
  NestJS: "#E0234E",
  PostgreSQL: "#336791",
  Redis: "#DC382D",
  Expo: "#4630EB",
};

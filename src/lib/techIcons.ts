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

/** Cor de marca por tecnologia, aplicada só no ícone (pill continua neutra).
 * Next.js e Three.js são propositalmente um branco quase neutro — a marca
 * real dos dois é monocromática (preto/branco), então "estimar uma cor"
 * ali significa só um destaque de brilho, não um matiz. Express não tem
 * cor oficial forte; usamos o cinza-azulado comumente associado à marca.
 * WebSocket/SSE são protocolos sem marca — o azul/verde aqui é só uma
 * convenção visual de "tempo real", não uma cor oficial. */
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
  Express: "#8A9BA8",
  "Next.js": "#FFFFFF",
  "Three.js": "#FFFFFF",
  WebSocket: "#0EA5E9",
  SSE: "#10B981",
  "Framer Motion": "#FF0088",
};

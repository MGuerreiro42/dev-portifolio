import type { ComponentType } from "react";
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
export const TECH_ICONS: Record<string, ComponentType<{ className?: string }>> = {
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

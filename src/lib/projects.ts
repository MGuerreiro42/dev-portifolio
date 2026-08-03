export interface Project {
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

export const PROJECTS: Project[] = [
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

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

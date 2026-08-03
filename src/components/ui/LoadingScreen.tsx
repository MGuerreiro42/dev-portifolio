"use client";

import { motion } from "framer-motion";

/** Tela de carregamento entre rotas — mostrada pelo Next via Suspense
 * (loading.tsx) enquanto a próxima rota compila/carrega, para que a
 * transição nunca pareça "não aconteceu nada". */
export default function LoadingScreen() {
  return (
    <div className="relative min-h-screen w-full bg-surface flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />

      <div className="relative z-[1] flex items-center gap-2.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-highlight/80"
            animate={{ opacity: [0.25, 1, 0.25], y: [0, -6, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useHero } from "./useHero";
import DustField from "./DustField";
import Navbar from "@/components/nav/Navbar";

/* Proporção original da foto: 1536 × 2730 ≈ 0.5629 */
const PHOTO_RATIO = 1536 / 2730;

export default function HeroSection() {
  const {
    containerRef,
    mouseXRef,
    mouseYRef,
    glowPos,
    rotateX,
    rotateY,
    translateX,
    translateY,
    handleMouseMove,
    handleMouseLeave,
  } = useHero();

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-screen bg-black flex flex-col overflow-hidden sticky top-0 z-[1]"
    >
      <DustField mouseXRef={mouseXRef} mouseYRef={mouseYRef} count={2000} opacity={0.22} />

      <Navbar />

      <div className="flex-1 grid grid-cols-2 items-start min-h-screen px-24 relative z-[5] overflow-visible">

        {/* ── Texto ── */}
        <div className="flex flex-col justify-start pt-[160px] overflow-visible">
          <motion.p
            className="font-light text-[9px] tracking-[0.55em] uppercase text-[#f0ede8]/[0.18] mb-[22px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.0 }}
          >
            Miguel Guerreiro
          </motion.p>

          <motion.h1
            className="font-display text-[clamp(78px,9vw,152px)] leading-[0.87] tracking-[-0.01em] text-[#f0ede8] mb-[38px] whitespace-nowrap overflow-visible uppercase"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
          >
            SOFTWARE<br />ENGINEER<br />
            <span className="text-[#f0ede8]/[0.08]">FRONT-END<br />DEVELOPER</span>
          </motion.h1>

          <motion.p
            className="font-light text-[12px] leading-[2] text-[#f0ede8]/[0.28] max-w-[270px] mb-[52px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            React · TypeScript · System Design
          </motion.p>

          <motion.a
            href="#work"
            className="group inline-flex items-center gap-4.5 font-light text-[9px] tracking-[0.5em] uppercase text-[#f0ede8]/30 no-underline transition-colors duration-400 hover:text-[#f0ede8]/65"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.65 }}
          >
            <span className="block w-8 h-px bg-current [transition:width_0.5s_cubic-bezier(0.16,1,0.3,1)] group-hover:w-15" />
            Ver Projetos
          </motion.a>
        </div>

        {/* ── Foto ── */}
        <div className="relative flex items-end justify-start h-screen">
          {/* Poeira na frente da foto */}
          <div className="absolute inset-0 z-[6] pointer-events-none">
            <DustField mouseXRef={mouseXRef} mouseYRef={mouseYRef} count={500} opacity={0.14} />
          </div>
          {/* Brilho de chão */}
          <div
            className="absolute bottom-0 left-0 h-4/5 pointer-events-none z-2"
            style={{
              width: `calc(100vh * ${PHOTO_RATIO})`,
              background:
                "radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.02) 58%, transparent 75%)",
            }}
          />

          {/* Brilho de mouse */}
          <div
            className="absolute w-95 h-130 rounded-full blur-[100px] pointer-events-none z-2"
            style={{
              background: `radial-gradient(ellipse at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 50%, transparent 72%)`,
            }}
          />

          {/* Container 3D */}
          <div
            className="relative z-4 h-screen flex items-end"
            style={{ perspective: "900px" }}
          >
            <motion.div
              style={{
                transform: `translate(${translateX}px, ${translateY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Frame com proporção original da foto */}
              <div
                className="relative h-screen"
                style={{ width: `calc(100vh * ${PHOTO_RATIO})` }}
              >
                <Image
                  src="/photo.png"
                  alt="Miguel"
                  fill
                  priority
                  className="object-contain object-bottom mix-blend-lighten"
                  style={{
                    filter:
                      "grayscale(1) contrast(1.05) brightness(0.88) drop-shadow(0 0 72px rgba(255,255,255,0.06)) drop-shadow(0 0 140px rgba(255,255,255,0.03))",
                    opacity: 1,
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Rodapé ── */}
      <div className="absolute bottom-9.5 left-24 right-24 h-px bg-white/4 z-10" />
      <motion.span
        className="absolute bottom-11.5 right-24 font-light text-[8px] tracking-[0.45em] uppercase text-[#f0ede8]/12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.0 }}
      >
        Based in Americana, SP · Brazil
      </motion.span>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";

export default function Brand() {
  return (
    <motion.div
      className="fixed top-[23.75px] left-24 z-[100]"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
    >
      {/* backdrop-blur precisa ficar num elemento sem transform próprio —
          combinar os dois no mesmo elemento quebra o blur no Firefox. */}
      <div className="flex items-center rounded-full border border-white/10 bg-black/40 px-4 py-1.5 backdrop-blur-md">
        <Link
          href="/"
          className="font-light text-[11px] tracking-[0.1em] lowercase no-underline text-[#f0ede8]/80"
        >
          guerreiro.dev
        </Link>
      </div>
    </motion.div>
  );
}

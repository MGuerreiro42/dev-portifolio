"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "pt-br", label: "PT-BR" },
] as const;

export default function LocaleSwitcher() {
  const locale = useLocale();

  return (
    <motion.div
      className="absolute top-[21.75px] right-24 z-[50]"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
    >
      {/* backdrop-blur precisa ficar num elemento sem transform próprio —
          combinar os dois no mesmo elemento quebra o blur no Firefox. */}
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-1.5 py-1 backdrop-blur-md">
        {LOCALES.map((l) => (
          <Link
            key={l.code}
            href="/"
            locale={l.code}
            className={[
              "font-light text-[11px] tracking-[0.18em] uppercase no-underline px-2.5 py-1 rounded-full transition-colors duration-[350ms]",
              locale === l.code
                ? "text-[#f0ede8]/90 bg-white/10"
                : "text-[#f0ede8]/35 hover:text-[#f0ede8]/70",
            ].join(" ")}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

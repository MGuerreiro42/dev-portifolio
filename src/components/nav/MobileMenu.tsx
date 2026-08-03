"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useSectionContext } from "@/context/SectionContext";
import { Link } from "@/i18n/navigation";

const NAV_KEYS = ["home", "about", "work", "contact"] as const;

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "pt-br", label: "PT-BR" },
] as const;

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { scrollToIndex, currentIndex } = useSectionContext();
  const t = useTranslations("Nav");
  const locale = useLocale();

  const handleNavClick = (i: number) => {
    scrollToIndex(i);
    setOpen(false);
  };

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="fixed top-5 right-6 z-[110] flex flex-col items-center justify-center gap-[5px] w-11 h-11 rounded-full border border-white/10 bg-black/40 backdrop-blur-md"
      >
        <span
          className={[
            "block w-4 h-px bg-highlight/85 transition-transform duration-300",
            open ? "rotate-45 translate-y-[3px]" : "",
          ].join(" ")}
        />
        <span
          className={[
            "block w-4 h-px bg-highlight/85 transition-transform duration-300",
            open ? "-rotate-45 -translate-y-[3px]" : "",
          ].join(" ")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[105] flex flex-col items-center justify-center gap-12 bg-black/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="flex flex-col items-center gap-8 list-none">
              {NAV_KEYS.map((key, i) => (
                <li key={key}>
                  <button
                    onClick={() => handleNavClick(i)}
                    className={[
                      "font-display text-[28px] uppercase tracking-[0.03em] transition-colors duration-300",
                      currentIndex === i
                        ? "text-highlight/90"
                        : "text-muted-warm/80",
                    ].join(" ")}
                  >
                    {t(key)}
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-1.5 py-1">
              {LOCALES.map((l) => (
                <Link
                  key={l.code}
                  href="/"
                  locale={l.code}
                  onClick={() => setOpen(false)}
                  className={[
                    "font-light text-[11px] tracking-[0.18em] uppercase no-underline px-2.5 py-1 rounded-full transition-colors duration-[350ms]",
                    locale === l.code
                      ? "text-highlight/90 bg-white/10"
                      : "text-muted-warm/70",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

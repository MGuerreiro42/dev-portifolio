"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useSectionContext } from "@/context/SectionContext";
import { Link } from "@/i18n/navigation";

const NAV_KEYS = ["home", "about", "work", "contact"] as const;

const linkClass =
  "font-light text-[10px] tracking-[0.32em] uppercase text-[#f0ede8]/[0.38] no-underline px-6 transition-colors duration-[350ms] hover:text-[#f0ede8]/80 cursor-pointer";

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "pt-br", label: "PT-BR" },
] as const;

export default function Navbar() {
  const { scrollToIndex } = useSectionContext();
  const t = useTranslations("Nav");
  const locale = useLocale();

  return (
    <motion.nav
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-3 py-2.5 backdrop-blur-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
    >
      <ul className="flex items-center list-none">
        {NAV_KEYS.map((key, i) => (
          <Fragment key={key}>
            {i > 0 && (
              <li className="w-px h-[10px] bg-[#f0ede8]/[0.14] shrink-0" />
            )}
            <li>
              <button onClick={() => scrollToIndex(i)} className={linkClass}>
                {t(key)}
              </button>
            </li>
          </Fragment>
        ))}
      </ul>

      <span className="w-px h-[14px] bg-[#f0ede8]/[0.14] shrink-0 mx-1" />

      <ul className="flex items-center list-none gap-1">
        {LOCALES.map((l) => (
          <li key={l.code}>
            <Link
              href="/"
              locale={l.code}
              className={[
                "font-light text-[10px] tracking-[0.18em] uppercase no-underline px-2.5 py-1 rounded-full transition-colors duration-[350ms]",
                locale === l.code
                  ? "text-[#f0ede8]/90 bg-white/10"
                  : "text-[#f0ede8]/35 hover:text-[#f0ede8]/70",
              ].join(" ")}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}

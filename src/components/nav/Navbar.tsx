"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSectionContext } from "@/context/SectionContext";

const NAV_KEYS = ["home", "about", "work", "contact"] as const;

const baseLinkClass =
  "font-light text-[11px] leading-none tracking-[0.32em] uppercase no-underline px-5 py-1 transition-colors duration-[350ms] cursor-pointer";

export default function Navbar() {
  const { scrollToIndex, currentIndex } = useSectionContext();
  const t = useTranslations("Nav");

  return (
    <motion.nav
      className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] hidden md:flex items-center rounded-full border border-white/10 bg-black/40 px-2 py-1.5 backdrop-blur-md"
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
              <button
                onClick={() => scrollToIndex(i)}
                className={[
                  baseLinkClass,
                  currentIndex === i
                    ? "text-[#f0ede8]/80"
                    : "text-[#f0ede8]/[0.38] hover:text-[#f0ede8]/80",
                ].join(" ")}
              >
                {t(key)}
              </button>
            </li>
          </Fragment>
        ))}
      </ul>
    </motion.nav>
  );
}

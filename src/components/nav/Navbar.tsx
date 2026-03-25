"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { useSectionContext } from "@/context/SectionContext";

const NAV_LINKS = [
  { label: "Home",    index: 0 },
  { label: "About",   index: 1 },
  { label: "Work",    index: 2 },
  { label: "Contact", index: 3 },
];

const linkClass =
  "font-light text-[10px] tracking-[0.32em] uppercase text-[#f0ede8]/[0.38] no-underline px-8 transition-colors duration-[350ms] hover:text-[#f0ede8]/80 cursor-pointer";

export default function Navbar() {
  const { scrollToIndex } = useSectionContext();

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-[100] py-9 flex justify-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
    >
      <ul className="flex items-center list-none">
        {NAV_LINKS.map((link, i) => (
          <Fragment key={link.label}>
            {i > 0 && (
              <li className="w-px h-[10px] bg-[#f0ede8]/[0.14] shrink-0" />
            )}
            <li>
              <button
                onClick={() => scrollToIndex(link.index)}
                className={linkClass}
              >
                {link.label}
              </button>
            </li>
          </Fragment>
        ))}
      </ul>
    </motion.nav>
  );
}

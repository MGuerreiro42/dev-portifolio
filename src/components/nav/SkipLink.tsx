"use client";

import { useTranslations } from "next-intl";

/** Invisible until focused (first Tab stop on the page) — lets a keyboard
 * user jump past Brand/Navbar/LocaleSwitcher/MobileMenu straight to the
 * page content, instead of tabbing through the whole nav on every load. */
export default function SkipLink() {
  const t = useTranslations("Nav");

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-1/2 focus:-translate-x-1/2 focus:z-[200] focus:rounded-b-full focus:border focus:border-t-0 focus:border-white/20 focus:bg-black focus:px-5 focus:py-2 focus:font-light focus:text-[11px] focus:uppercase focus:tracking-[0.2em] focus:text-highlight focus:no-underline"
    >
      {t("skipToContent")}
    </a>
  );
}

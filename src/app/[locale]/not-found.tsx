import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

/** Catches notFound() calls from within a valid locale (e.g. an unknown
 * project slug in /work/[slug]) — has full i18n context, since the locale
 * itself already resolved successfully to get here. An invalid locale
 * segment itself (notFound() from [locale]/layout.tsx) falls through to
 * Next's default 404 instead — that failure happens before this same
 * layout (and the i18n context it sets up) ever mounts. */
export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="relative min-h-screen w-full bg-surface flex flex-col items-center justify-center overflow-hidden px-6">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />

      <div className="relative z-[1] flex flex-col items-center text-center">
        <p className="font-display text-[clamp(90px,18vw,220px)] leading-none tracking-[-0.02em] text-highlight">
          404
        </p>
        <h1 className="font-display text-[clamp(20px,3vw,32px)] uppercase tracking-[0.02em] text-highlight mt-2">
          {t("title")}
        </h1>
        <p className="font-light text-[14px] leading-[1.7] text-body/80 mt-4 max-w-[420px]">
          {t("description")}
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2.5 rounded-full bg-highlight px-6 py-3 font-light text-[11px] tracking-[0.25em] uppercase text-surface no-underline transition-colors duration-300 hover:bg-highlight/85"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}

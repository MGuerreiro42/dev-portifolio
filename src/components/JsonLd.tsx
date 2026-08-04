import { personJsonLd } from "@/lib/personJsonLd";

/** Server Component — renders once per page load, no client JS needed.
 * dangerouslySetInnerHTML is safe here: the payload is a fixed, static
 * object with no user input reaching it. */
export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
    />
  );
}

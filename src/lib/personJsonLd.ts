import { SITE_URL } from "./site";

/** schema.org Person, kept locale-independent (structured data is
 * machine-consumed, not UI copy) — helps Google/LinkedIn resolve "who is
 * this site about" when indexing/link-unfurling. */
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Miguel Pachiega Guerreiro",
  alternateName: "Miguel Guerreiro",
  jobTitle: "Software Engineer",
  description:
    "Software Engineer with a front-end focus and 8 years of experience building web applications with React, Next.js and TypeScript.",
  url: SITE_URL,
  image: `${SITE_URL}/about-photo.jpg`,
  email: "mailto:miguelpachiega@gmail.com",
  sameAs: ["https://github.com/MGuerreiro42", "https://linkedin.com/in/miguelpguerreiro"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Americana",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  knowsAbout: ["React", "Next.js", "TypeScript", "Node.js", "Front-end Architecture"],
} as const;

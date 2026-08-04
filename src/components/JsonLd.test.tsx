import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { personJsonLd } from "@/lib/personJsonLd";
import JsonLd from "./JsonLd";

describe("JsonLd", () => {
  it("renders the Person schema as an application/ld+json script tag", () => {
    const { container } = render(<JsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
    expect(JSON.parse(script!.innerHTML)).toEqual(personJsonLd);
  });
});

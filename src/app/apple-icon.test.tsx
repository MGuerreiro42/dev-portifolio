import { describe, expect, it, vi } from "vitest";

const ImageResponseMock = vi.fn(function (element: unknown, options: unknown) {
  return { element, options };
});
vi.mock("next/og", () => ({ ImageResponse: ImageResponseMock }));

const { default: AppleIcon, size, contentType } = await import("./apple-icon");

describe("AppleIcon", () => {
  it("is a 180x180 PNG", () => {
    expect(size).toEqual({ width: 180, height: 180 });
    expect(contentType).toBe("image/png");
  });

  it("renders a square monogram (no border radius, unlike the favicon)", () => {
    AppleIcon();
    const [element, options] = ImageResponseMock.mock.calls[0];
    expect(options).toEqual(size);
    const node = element as React.ReactElement<{
      children: string;
      style: { borderRadius?: string };
    }>;
    expect(node.props.children).toBe("G");
    expect(node.props.style.borderRadius).toBeUndefined();
  });
});

import { describe, expect, it, vi } from "vitest";

const ImageResponseMock = vi.fn(function (element: unknown, options: unknown) {
  return { element, options };
});
vi.mock("next/og", () => ({ ImageResponse: ImageResponseMock }));

const { default: Icon, size, contentType } = await import("./icon");

describe("Icon", () => {
  it("is a 32x32 PNG", () => {
    expect(size).toEqual({ width: 32, height: 32 });
    expect(contentType).toBe("image/png");
  });

  it("renders a dark circular monogram matching the size options", () => {
    Icon();
    const [element, options] = ImageResponseMock.mock.calls[0];
    expect(options).toEqual(size);
    const node = element as React.ReactElement<{
      children: string;
      style: { borderRadius?: string };
    }>;
    expect(node.props.children).toBe("G");
    expect(node.props.style.borderRadius).toBe("50%");
  });
});

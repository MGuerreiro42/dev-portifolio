import { describe, expect, it, vi } from "vitest";

const ImageResponseMock = vi.fn(function (element: unknown, options: unknown) {
  return { element, options };
});
vi.mock("next/og", () => ({ ImageResponse: ImageResponseMock }));

const { default: OpengraphImage, size, contentType } = await import("./opengraph-image");

describe("OpengraphImage", () => {
  it("is a 1200x630 PNG", () => {
    expect(size).toEqual({ width: 1200, height: 630 });
    expect(contentType).toBe("image/png");
  });

  it("renders the name and title, matching the size options", () => {
    OpengraphImage();
    const [element, options] = ImageResponseMock.mock.calls[0];
    expect(options).toEqual(size);

    type TextNode = React.ReactElement<{ children: string }>;
    const [nameNode, titleNode] = (
      element as React.ReactElement<{ children: TextNode[] }>
    ).props.children;
    expect(nameNode.props.children).toBe("MIGUEL GUERREIRO");
    expect(titleNode.props.children).toBe("SOFTWARE ENGINEER · FRONT-END DEVELOPER");
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { installFakeRaf } from "@/test/raf";
import * as ThreeMock from "@/test/mocks/three";

vi.mock("three", () => import("@/test/mocks/three"));

// Imported after the mock is registered so DustField picks up the fake.
const { default: DustField } = await import("./DustField");

function refOf(value: number) {
  return { current: value };
}

afterEach(() => {
  vi.restoreAllMocks();
  cleanup();
});

describe("DustField", () => {
  it("mounts a WebGL canvas into its container", () => {
    installFakeRaf();
    const { container } = render(
      <DustField mouseXRef={refOf(0)} mouseYRef={refOf(0)} />
    );
    const mount = container.firstElementChild as HTMLElement;
    expect(mount.querySelector("canvas")).toBeInTheDocument();
  });

  it("sizes the particle buffers to the requested count", () => {
    installFakeRaf();
    const rendererSpy = vi.spyOn(ThreeMock, "BufferGeometry");
    render(<DustField mouseXRef={refOf(0)} mouseYRef={refOf(0)} count={123} />);

    const geo = rendererSpy.mock.instances[0] as InstanceType<
      typeof ThreeMock.BufferGeometry
    >;
    expect(geo.attributes.position.array).toHaveLength(123 * 3);
    expect(geo.attributes.size.array).toHaveLength(123);
  });

  it("passes the requested opacity into the shader uniforms", () => {
    installFakeRaf();
    const materialSpy = vi.spyOn(ThreeMock, "ShaderMaterial");
    render(<DustField mouseXRef={refOf(0)} mouseYRef={refOf(0)} opacity={0.42} />);

    const mat = materialSpy.mock.instances[0] as InstanceType<
      typeof ThreeMock.ShaderMaterial
    >;
    expect(mat.uniforms.opacity.value).toBe(0.42);
  });

  it("fades in one frame after mount", () => {
    const fakeRaf = installFakeRaf();
    const { container } = render(
      <DustField mouseXRef={refOf(0)} mouseYRef={refOf(0)} />
    );
    const mount = container.firstElementChild as HTMLElement;
    expect(mount.style.opacity).toBe("0");

    act(() => {
      fakeRaf.flushTimes(3);
    });
    expect(mount.style.opacity).toBe("1");
  });

  it("drifts the camera toward the mouse position over frames", () => {
    const fakeRaf = installFakeRaf();
    const cameraSpy = vi.spyOn(ThreeMock, "PerspectiveCamera");
    const mouseX = refOf(1);
    const mouseY = refOf(1);
    render(<DustField mouseXRef={mouseX} mouseYRef={mouseY} />);

    const camera = cameraSpy.mock.instances[0] as InstanceType<
      typeof ThreeMock.PerspectiveCamera
    >;
    // tick() runs once synchronously on mount (before any RAF flush), so
    // the camera has already taken its first lerp step toward the target.
    expect(camera.position.x).toBeCloseTo(0.0075, 4);

    act(() => {
      fakeRaf.flushTimes(300);
    });
    expect(camera.position.x).toBeCloseTo(0.25, 1);
    expect(camera.position.y).toBeCloseTo(-0.18, 1);
    expect(camera.lookAt).toHaveBeenCalled();
  });

  it("resizes the renderer and updates the camera aspect on window resize", () => {
    installFakeRaf();
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(400);
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(200);
    const rendererSpy = vi.spyOn(ThreeMock, "WebGLRenderer");
    const cameraSpy = vi.spyOn(ThreeMock, "PerspectiveCamera");
    render(<DustField mouseXRef={refOf(0)} mouseYRef={refOf(0)} />);

    const renderer = rendererSpy.mock.instances[0] as InstanceType<
      typeof ThreeMock.WebGLRenderer
    >;
    const camera = cameraSpy.mock.instances[0] as InstanceType<
      typeof ThreeMock.PerspectiveCamera
    >;

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(renderer.setSize).toHaveBeenLastCalledWith(400, 200);
    expect(camera.aspect).toBe(2);
    expect(camera.updateProjectionMatrix).toHaveBeenCalled();
  });

  it("tears down the WebGL context and listeners on unmount", () => {
    const fakeRaf = installFakeRaf();
    const rendererSpy = vi.spyOn(ThreeMock, "WebGLRenderer");
    const { container, unmount } = render(
      <DustField mouseXRef={refOf(0)} mouseYRef={refOf(0)} />
    );
    const mount = container.firstElementChild as HTMLElement;
    const renderer = rendererSpy.mock.instances[0] as InstanceType<
      typeof ThreeMock.WebGLRenderer
    >;
    expect(mount.querySelector("canvas")).toBeInTheDocument();

    unmount();

    expect(fakeRaf.caf).toHaveBeenCalled();
    expect(renderer.dispose).toHaveBeenCalled();
    expect(mount.querySelector("canvas")).not.toBeInTheDocument();
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { installFakeRaf } from "@/test/raf";
import * as ThreeMock from "@/test/mocks/three";

vi.mock("three", () => import("@/test/mocks/three"));

const { default: GlassBlobs } = await import("./GlassBlobs");

afterEach(() => {
  vi.restoreAllMocks();
  cleanup();
});

describe("GlassBlobs", () => {
  it("mounts a WebGL canvas into its container", () => {
    installFakeRaf();
    const { container } = render(<GlassBlobs />);
    const mount = container.firstElementChild as HTMLElement;
    expect(mount.querySelector("canvas")).toBeInTheDocument();
  });

  it("builds three blobs plus their glow lights by default", () => {
    installFakeRaf();
    const meshSpy = vi.spyOn(ThreeMock, "Mesh");
    const lightSpy = vi.spyOn(ThreeMock, "PointLight");
    render(<GlassBlobs />);

    expect(meshSpy).toHaveBeenCalledTimes(3);
    expect(lightSpy).toHaveBeenCalledTimes(3);
  });

  it("builds a single blob when single is set (mobile layout)", () => {
    installFakeRaf();
    const meshSpy = vi.spyOn(ThreeMock, "Mesh");
    const lightSpy = vi.spyOn(ThreeMock, "PointLight");
    render(<GlassBlobs single />);

    expect(meshSpy).toHaveBeenCalledTimes(1);
    expect(lightSpy).toHaveBeenCalledTimes(1);
  });

  it("sizes the blobs in the documented hierarchy — blue large, amber medium, violet small", () => {
    installFakeRaf();
    const meshSpy = vi.spyOn(ThreeMock, "Mesh");
    render(<GlassBlobs />);

    // Reading geometry off each constructed Mesh instead of spying on
    // IcosahedronGeometry directly — double-spying a class whose prototype
    // defines an accessor (attributes getter) breaks under vi.spyOn.
    const radii = meshSpy.mock.instances.map((mesh) => {
      const geometry = (mesh as InstanceType<typeof ThreeMock.Mesh>)
        .geometry as unknown as InstanceType<typeof ThreeMock.IcosahedronGeometry>;
      return geometry.radius;
    });
    expect(radii).toEqual([1.8, 1.3, 0.8]);
  });

  it("places every light in front of its blob, not behind (avoids self-occlusion)", () => {
    installFakeRaf();
    const lightSpy = vi.spyOn(ThreeMock, "PointLight");
    render(<GlassBlobs single />);

    const light = lightSpy.mock.instances[0] as InstanceType<typeof ThreeMock.PointLight>;
    // Blob center is (0,0,0); the light sits at z+1.2, in front of camera-facing surface.
    expect(light.position.z).toBe(1.2);
  });

  it("spins each mesh a little more every frame", () => {
    const fakeRaf = installFakeRaf();
    const meshSpy = vi.spyOn(ThreeMock, "Mesh");
    render(<GlassBlobs single />);

    const mesh = meshSpy.mock.instances[0] as InstanceType<typeof ThreeMock.Mesh>;
    const initialY = mesh.rotation.y;

    act(() => {
      fakeRaf.flushTimes(50);
    });
    expect(mesh.rotation.y).toBeGreaterThan(initialY);
  });

  it("fades in one frame after mount", () => {
    const fakeRaf = installFakeRaf();
    const { container } = render(<GlassBlobs />);
    const mount = container.firstElementChild as HTMLElement;
    expect(mount.style.opacity).toBe("0");

    act(() => {
      fakeRaf.flushTimes(3);
    });
    expect(mount.style.opacity).toBe("1");
  });

  it("resizes the renderer and updates the camera aspect on window resize", () => {
    installFakeRaf();
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(600);
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(300);
    const rendererSpy = vi.spyOn(ThreeMock, "WebGLRenderer");
    const cameraSpy = vi.spyOn(ThreeMock, "PerspectiveCamera");
    render(<GlassBlobs />);

    const renderer = rendererSpy.mock.instances[0] as InstanceType<
      typeof ThreeMock.WebGLRenderer
    >;
    const camera = cameraSpy.mock.instances[0] as InstanceType<
      typeof ThreeMock.PerspectiveCamera
    >;

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(renderer.setSize).toHaveBeenLastCalledWith(600, 300);
    expect(camera.aspect).toBe(2);
    expect(camera.updateProjectionMatrix).toHaveBeenCalled();
  });

  it("tears down the WebGL context, geometries and materials on unmount", () => {
    const fakeRaf = installFakeRaf();
    const rendererSpy = vi.spyOn(ThreeMock, "WebGLRenderer");
    const meshSpy = vi.spyOn(ThreeMock, "Mesh");
    const { container, unmount } = render(<GlassBlobs single />);
    const mount = container.firstElementChild as HTMLElement;

    const renderer = rendererSpy.mock.instances[0] as InstanceType<
      typeof ThreeMock.WebGLRenderer
    >;
    const mesh = meshSpy.mock.instances[0] as InstanceType<typeof ThreeMock.Mesh>;
    const geo = mesh.geometry as unknown as InstanceType<typeof ThreeMock.IcosahedronGeometry>;
    const mat = mesh.material as unknown as InstanceType<typeof ThreeMock.MeshPhysicalMaterial>;

    unmount();

    expect(fakeRaf.caf).toHaveBeenCalled();
    expect(geo.dispose).toHaveBeenCalled();
    expect(mat.dispose).toHaveBeenCalled();
    expect(renderer.dispose).toHaveBeenCalled();
    expect(mount.querySelector("canvas")).not.toBeInTheDocument();
  });
});

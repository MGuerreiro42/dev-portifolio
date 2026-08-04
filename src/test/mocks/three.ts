import { vi } from "vitest";

/** Lightweight fakes standing in for the pieces of three.js that
 * DustField/GlassBlobs use — real WebGLRenderer needs an actual GL
 * context, which jsdom can't provide. These track constructor args and
 * method calls so tests can assert on the *setup/cleanup wiring* (what got
 * created, disposed, resized) without ever touching a GPU. */

function makeVector3() {
  return {
    x: 0,
    y: 0,
    z: 0,
    set(x: number, y: number, z: number) {
      this.x = x;
      this.y = y;
      this.z = z;
    },
  };
}

export class WebGLRenderer {
  domElement = document.createElement("canvas");
  options: unknown;
  setPixelRatio = vi.fn();
  setSize = vi.fn();
  setClearColor = vi.fn();
  render = vi.fn();
  dispose = vi.fn();
  constructor(options: unknown) {
    this.options = options;
  }
}

export class Scene {
  children: unknown[] = [];
  add = vi.fn((...objs: unknown[]) => {
    this.children.push(...objs);
  });
}

export class PerspectiveCamera {
  fov: number;
  aspect: number;
  near: number;
  far: number;
  position = makeVector3();
  updateProjectionMatrix = vi.fn();
  lookAt = vi.fn();
  constructor(fov: number, aspect: number, near: number, far: number) {
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
  }
}

export class BufferAttribute {
  array: Float32Array;
  itemSize: number;
  needsUpdate = false;
  constructor(array: Float32Array, itemSize: number) {
    this.array = array;
    this.itemSize = itemSize;
  }
}

export class BufferGeometry {
  attributes: Record<string, BufferAttribute> = {};
  setAttribute = vi.fn((name: string, attr: BufferAttribute) => {
    this.attributes[name] = attr;
    return this;
  });
  computeVertexNormals = vi.fn();
  dispose = vi.fn();
}

/** A handful of vertices is enough to exercise the noise-displacement loop
 * in createBlobGeometry without any real icosahedron math. Deliberately
 * doesn't extend BufferGeometry — just duck-types what GlassBlobs reads
 * (attributes.position.{count,getX/Y/Z,setXYZ}, computeVertexNormals,
 * dispose) to avoid fighting the class-field/getter conflict a shared
 * base would create. */
export class IcosahedronGeometry {
  radius: number;
  detail: number;
  private positions = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1, -1, -1, -1]);
  computeVertexNormals = vi.fn();
  dispose = vi.fn();

  constructor(radius: number, detail: number) {
    this.radius = radius;
    this.detail = detail;
  }

  get attributes() {
    const positions = this.positions;
    return {
      position: {
        array: positions,
        count: positions.length / 3,
        getX: (i: number) => positions[i * 3],
        getY: (i: number) => positions[i * 3 + 1],
        getZ: (i: number) => positions[i * 3 + 2],
        setXYZ: (i: number, x: number, y: number, z: number) => {
          positions[i * 3] = x;
          positions[i * 3 + 1] = y;
          positions[i * 3 + 2] = z;
        },
      },
    };
  }
}

export class CanvasTexture {
  image: unknown;
  dispose = vi.fn();
  constructor(image: unknown) {
    this.image = image;
  }
}

export class ShaderMaterial {
  uniforms: Record<string, { value: unknown }>;
  transparent?: boolean;
  depthWrite?: boolean;
  blending?: unknown;
  dispose = vi.fn();
  constructor(params: {
    uniforms: Record<string, { value: unknown }>;
    transparent?: boolean;
    depthWrite?: boolean;
    blending?: unknown;
  }) {
    this.uniforms = params.uniforms;
    this.transparent = params.transparent;
    this.depthWrite = params.depthWrite;
    this.blending = params.blending;
  }
}

export class MeshPhysicalMaterial {
  params: Record<string, unknown>;
  dispose = vi.fn();
  constructor(params: Record<string, unknown>) {
    this.params = params;
  }
}

export class Points {
  geometry: BufferGeometry;
  material: ShaderMaterial;
  constructor(geometry: BufferGeometry, material: ShaderMaterial) {
    this.geometry = geometry;
    this.material = material;
  }
}

export class Mesh {
  geometry: BufferGeometry;
  material: MeshPhysicalMaterial;
  position = makeVector3();
  rotation = makeVector3();
  constructor(geometry: BufferGeometry, material: MeshPhysicalMaterial) {
    this.geometry = geometry;
    this.material = material;
  }
}

export class Color {
  hex: unknown;
  constructor(hex: unknown) {
    this.hex = hex;
  }
}

class Light {
  color: unknown;
  intensity: number;
  position = makeVector3();
  constructor(color: unknown, intensity: number) {
    this.color = color;
    this.intensity = intensity;
  }
}

export class AmbientLight extends Light {}

export class DirectionalLight extends Light {}

export class PointLight extends Light {
  distance: number;
  decay: number;
  constructor(color: unknown, intensity: number, distance: number, decay: number) {
    super(color, intensity);
    this.distance = distance;
    this.decay = decay;
  }
}

export const AdditiveBlending = 2;

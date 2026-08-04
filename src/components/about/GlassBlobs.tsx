"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/** Desloca os vértices de uma esfera com uma "pseudo-ruído" barata (senos
 * combinados) para dar uma silhueta orgânica e assimétrica, em vez de uma
 * esfera perfeita — mais barato que Simplex/Perlin real e suficiente aqui,
 * já que o blob nunca muda de forma depois de criado. */
function createBlobGeometry(radius: number, detail: number, jitter: number) {
  const geo = new THREE.IcosahedronGeometry(radius, detail);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const noise = (Math.sin(x * 2.4) + Math.cos(y * 2.1) + Math.sin(z * 2.7)) / 3;
    const scale = 1 + noise * jitter;
    pos.setXYZ(i, x * scale, y * scale, z * scale);
  }

  geo.computeVertexNormals();
  return geo;
}

function createGlassMaterial(color: number, opacity: number, roughness: number) {
  return new THREE.MeshPhysicalMaterial({
    color,
    transparent: true,
    opacity,
    roughness,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    // Brilho de dentro do próprio material — barato (só afeta o shader do
    // fragmento, sem passada de render extra como transmission), dá a
    // sensação de luz vindo de dentro do vidro em vez de só refletida.
    // Esse é o principal responsável pelo brilho — independe de onde as
    // luzes da cena estão, então nunca fica "escondido" por oclusão.
    emissive: color,
    emissiveIntensity: 1.4,
  });
}

interface GlassBlobsProps {
  /** Mobile: um único blob, num container menor (atrás da lista de
   * experiência) em vez dos três blobs cobrindo a seção inteira — o layout
   * de coluna única do mobile não dá espaço pra composição do desktop. */
  single?: boolean;
}

/** Blobs de "vidro" numa única cena/renderer (mais barato que cenas
 * separadas) — MeshPhysicalMaterial com clearcoat, sem transmission (que
 * dispara uma passada de render extra no Three.js) para manter o custo
 * baixo, já que isso é só um detalhe decorativo de fundo. */
export default function GlassBlobs({ single = false }: GlassBlobsProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  // O chunk do three.js (carregado sob demanda) leva um instante pra baixar
  // e parsear na primeira vez — sem isso o blob aparece de repente assim
  // que fica pronto, em vez de surgir suavemente.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const w = el.offsetWidth;
    const h = el.offsetHeight;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 8;

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 1.3);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 0.4);
    rim.position.set(-4, -2, 3);
    scene.add(rim);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const meshes: { mesh: THREE.Mesh; spinY: number; spinX: number }[] = [];

    // Uma luz literalmente atrás do blob não ilumina o lado voltado pra
    // câmera — num material sem transmission (sem luz atravessando de
    // verdade), a direção superfície→luz fica oposta à normal aí, então a
    // contribuição difusa é zero: a luz existia, mas era inteiramente
    // auto-ocluída pelo próprio blob. Por isso ela mora um pouco à frente
    // do centro (mais perto da câmera), criando um ponto de brilho visível
    // na superfície voltada pra nós — o emissive acima é que dá a sensação
    // de "vindo de dentro"; essa luz aqui é o acento de brilho extra.
    const glowLight = (
      color: number,
      x: number,
      y: number,
      z: number,
      intensity: number
    ) => {
      const light = new THREE.PointLight(color, intensity, 8, 2);
      light.position.set(x, y, z + 1.2);
      scene.add(light);
    };

    if (single) {
      const geo = createBlobGeometry(1.6, 4, 0.07);
      const mat = createGlassMaterial(0x78a0ff, 0.24, 0.08);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, 0, 0);
      scene.add(mesh);
      geometries.push(geo);
      materials.push(mat);
      meshes.push({ mesh, spinY: 0.001, spinX: 0.0005 });
      glowLight(0x78a0ff, 0, 0, 0, 30);
    } else {
      // Hierarquia de tamanho — azul grande, âmbar médio, violeta pequeno
      // no canto oposto, em vez de dois blobs quase do mesmo tamanho.
      const blueGeo = createBlobGeometry(1.8, 4, 0.07);
      const blueMat = createGlassMaterial(0x78a0ff, 0.22, 0.08);
      const blueMesh = new THREE.Mesh(blueGeo, blueMat);
      blueMesh.position.set(2.9, 2.3, 0);
      scene.add(blueMesh);
      geometries.push(blueGeo);
      materials.push(blueMat);
      meshes.push({ mesh: blueMesh, spinY: 0.0012, spinX: 0.0006 });
      glowLight(0x78a0ff, 2.9, 2.3, 0, 30);

      const amberGeo = createBlobGeometry(1.3, 4, 0.08);
      const amberMat = createGlassMaterial(0xffb478, 0.2, 0.1);
      const amberMesh = new THREE.Mesh(amberGeo, amberMat);
      amberMesh.position.set(-3.1, -2.5, -1);
      scene.add(amberMesh);
      geometries.push(amberGeo);
      materials.push(amberMat);
      meshes.push({ mesh: amberMesh, spinY: -0.0009, spinX: 0.0005 });
      glowLight(0xffb478, -3.1, -2.5, -1, 30);

      const violetGeo = createBlobGeometry(0.8, 4, 0.09);
      const violetMat = createGlassMaterial(0xb18aff, 0.22, 0.1);
      const violetMesh = new THREE.Mesh(violetGeo, violetMat);
      violetMesh.position.set(3.0, -2.4, -0.5);
      scene.add(violetMesh);
      geometries.push(violetGeo);
      materials.push(violetMat);
      meshes.push({ mesh: violetMesh, spinY: 0.0018, spinX: -0.0008 });
      glowLight(0xb18aff, 3.0, -2.4, -0.5, 22);
    }

    let raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      for (const { mesh, spinY, spinX } of meshes) {
        mesh.rotation.y += spinY;
        mesh.rotation.x += spinX;
      }
      renderer.render(scene, camera);
    };
    tick();
    // Um frame depois, já com algo de fato renderizado na tela — dispara a
    // transição de opacidade em vez de aparecer tudo de uma vez.
    requestAnimationFrame(() => setReady(true));

    const onResize = () => {
      const nw = el.offsetWidth;
      const nh = el.offsetHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [single]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ opacity: ready ? 1 : 0, transition: "opacity 1200ms ease" }}
    />
  );
}

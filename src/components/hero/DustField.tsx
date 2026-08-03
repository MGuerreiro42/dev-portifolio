"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface DustFieldProps {
  mouseXRef: React.RefObject<number>;
  mouseYRef: React.RefObject<number>;
  count?: number;
  opacity?: number;
}

export default function DustField({
  mouseXRef,
  mouseYRef,
  count = 700,
  opacity = 0.28,
}: DustFieldProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  // O chunk do three.js (carregado sob demanda) leva um instante pra baixar
  // e parsear na primeira vez — sem isso a cena aparece de repente assim
  // que fica pronta, em vez de surgir suavemente.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const w = el.offsetWidth;
    const h = el.offsetHeight;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.z = 5;

    const COUNT = count;
    const positions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const angles = new Float32Array(COUNT);
    const radii = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);
    const yOffsets = new Float32Array(COUNT);

    const BASE_SIZE = 0.028;
    for (let i = 0; i < COUNT; i++) {
      const r = 1.0 + Math.random() * 3.8;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 3.0;

      radii[i] = r;
      angles[i] = angle;
      speeds[i] =
        (0.0001 + Math.random() * 0.00025) * (Math.random() > 0.5 ? 1 : -1);
      yOffsets[i] = y;

      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * r * 0.35;

      // Math.random() ao quadrado enviesa pra baixo — a maioria fica
      // pequena (poeira fina), só umas poucas saem grandes (brilho de
      // destaque), em vez de uma distribuição uniforme que ficaria
      // homogênea demais.
      sizes[i] = BASE_SIZE * (0.5 + Math.random() * Math.random() * 2.6);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // Textura de glow: gradiente radial branco → transparente
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.35, "rgba(255,255,255,0.3)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const glowTexture = new THREE.CanvasTexture(canvas);

    // PointsMaterial só aceita um `size` único pra todos os pontos — para
    // variar o tamanho por partícula precisa de um shader próprio lendo um
    // atributo `size` por vértice, mantendo ainda assim uma única draw
    // call (crucial pro custo por frame continuar barato em 8000 partículas).
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: glowTexture },
        color: { value: new THREE.Color(0xffffff) },
        opacity: { value: opacity },
      },
      vertexShader: `
        attribute float size;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (400.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform vec3 color;
        uniform float opacity;
        void main() {
          vec4 tex = texture2D(map, gl_PointCoord);
          gl_FragColor = vec4(color, opacity) * tex;
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick);

      const pos = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        angles[i] += speeds[i];
        pos[i * 3] = Math.cos(angles[i]) * radii[i];
        pos[i * 3 + 1] = yOffsets[i];
        pos[i * 3 + 2] = Math.sin(angles[i]) * radii[i] * 0.35;
      }
      geo.attributes.position.needsUpdate = true;

      camera.position.x +=
        (mouseXRef.current * 0.25 - camera.position.x) * 0.03;
      camera.position.y +=
        (-mouseYRef.current * 0.18 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

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
      glowTexture.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [mouseXRef, mouseYRef, count, opacity]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        opacity: ready ? 1 : 0,
        transition: "opacity 1200ms ease",
      }}
    />
  );
}

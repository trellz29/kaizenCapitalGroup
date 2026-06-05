"use client";
import { useRef, useEffect, useState } from "react";

// Pure canvas WebGL-like geometric hero — no React Three Fiber
// to avoid SSR/Turbopack issues. Uses raw Three.js via dynamic import.
export default function HeroGlobe() {
  const mountRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let renderer, scene, camera, mesh, wireMesh, particles, raf;
    let mouseX = 0, mouseY = 0;

    const init = async () => {
      const THREE = await import("three");
      const el = mountRef.current;
      if (!el) return;

      const W = el.offsetWidth || window.innerWidth;
      const H = el.offsetHeight || window.innerHeight;

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      // Scene
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
      camera.position.set(0, 0, 4.5);

      // Icosahedron — solid
      const geo = new THREE.IcosahedronGeometry(1.4, 2);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x0a1628,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9,
      });
      mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);

      // Wireframe overlay
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x9fb4c1,
        wireframe: true,
        transparent: true,
        opacity: 0.18,
      });
      wireMesh = new THREE.Mesh(geo.clone(), wireMat);
      wireMesh.scale.setScalar(1.01);
      scene.add(wireMesh);

      // Outer glow ring
      const ringGeo = new THREE.TorusGeometry(1.8, 0.004, 16, 120);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x9fb4c1, transparent: true, opacity: 0.15 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI * 0.3;
      scene.add(ring);

      const ring2 = ring.clone();
      ring2.rotation.x = -Math.PI * 0.15;
      ring2.rotation.y = Math.PI * 0.5;
      scene.add(ring2);

      // Particles
      const pGeo = new THREE.BufferGeometry();
      const pCount = 600;
      const pPos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount * 3; i++) {
        pPos[i] = (Math.random() - 0.5) * 12;
      }
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({ color: 0x9fb4c1, size: 0.015, transparent: true, opacity: 0.5 });
      particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      // Lighting
      const ambient = new THREE.AmbientLight(0x9fb4c1, 0.4);
      scene.add(ambient);
      const point1 = new THREE.PointLight(0x6496c8, 2, 10);
      point1.position.set(3, 3, 3);
      scene.add(point1);
      const point2 = new THREE.PointLight(0x9fb4c1, 1, 8);
      point2.position.set(-3, -2, 2);
      scene.add(point2);

      // Mouse
      const onMouseMove = (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouseMove, { passive: true });

      // Resize
      const onResize = () => {
        const W2 = el.offsetWidth;
        const H2 = el.offsetHeight;
        camera.aspect = W2 / H2;
        camera.updateProjectionMatrix();
        renderer.setSize(W2, H2);
      };
      window.addEventListener("resize", onResize);

      // Animate
      let t = 0;
      const animate = () => {
        raf = requestAnimationFrame(animate);
        t += 0.005;

        mesh.rotation.x += (mouseY * 0.3 - mesh.rotation.x) * 0.04;
        mesh.rotation.y += (mouseX * 0.3 + t * 0.15 - mesh.rotation.y) * 0.04;
        wireMesh.rotation.copy(mesh.rotation);
        ring.rotation.z = t * 0.2;
        ring2.rotation.z = -t * 0.15;
        particles.rotation.y = t * 0.03;

        renderer.render(scene, camera);
      };
      animate();
      setReady(true);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(raf);
        renderer.dispose();
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      };
    };

    const cleanup = init();
    return () => { cleanup.then(fn => fn && fn()); };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        right: "5%",
        top: "50%",
        transform: "translateY(-50%)",
        width: "min(50vw, 560px)",
        height: "min(50vw, 560px)",
        zIndex: 3,
        opacity: ready ? 1 : 0,
        transition: "opacity 1s ease 0.5s",
      }}
    />
  );
}

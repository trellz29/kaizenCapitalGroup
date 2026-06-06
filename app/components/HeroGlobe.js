"use client";
import { useRef, useEffect, useState } from "react";

export default function HeroGlobe() {
  const mountRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let renderer, scene, camera, raf;
    let cleanup = null;

    const init = async () => {
      const THREE = await import("three");
      const el = mountRef.current;
      if (!el) return;

      const W = el.offsetWidth || 540;
      const H = el.offsetHeight || 540;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
      camera.position.set(0, 0, 4.2);

      const RADIUS = 1.5;

      // --- Solid sphere base ---
      const sphereGeo = new THREE.SphereGeometry(RADIUS, 64, 64);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x030d1e,
        metalness: 0.6,
        roughness: 0.4,
        transparent: true,
        opacity: 0.92,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      scene.add(sphere);

      // --- Lat/Lon grid lines ---
      const gridGroup = new THREE.Group();
      const gridMat = new THREE.LineBasicMaterial({
        color: 0x4a7fa5,
        transparent: true,
        opacity: 0.22,
      });

      // Latitude lines
      for (let lat = -75; lat <= 75; lat += 15) {
        const phi = (lat * Math.PI) / 180;
        const r = RADIUS * Math.cos(phi) * 1.002;
        const y = RADIUS * Math.sin(phi) * 1.002;
        const pts = [];
        for (let i = 0; i <= 64; i++) {
          const theta = (i / 64) * Math.PI * 2;
          pts.push(new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta)));
        }
        gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
      }

      // Longitude lines
      for (let lon = 0; lon < 180; lon += 15) {
        const theta = (lon * Math.PI) / 180;
        const pts = [];
        for (let i = 0; i <= 64; i++) {
          const phi = (i / 64) * Math.PI - Math.PI / 2;
          pts.push(new THREE.Vector3(
            RADIUS * 1.002 * Math.cos(phi) * Math.cos(theta),
            RADIUS * 1.002 * Math.sin(phi),
            RADIUS * 1.002 * Math.cos(phi) * Math.sin(theta)
          ));
        }
        gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
      }
      scene.add(gridGroup);

      // --- Financial hub cities: [lat, lon, name] ---
      const CITIES = [
        [40.71, -74.01, "NYC"],
        [51.51, -0.13, "LON"],
        [35.69, 139.69, "TYO"],
        [1.35, 103.82, "SIN"],
        [22.32, 114.17, "HKG"],
        [48.85, 2.35, "PAR"],
        [52.52, 13.41, "BER"],
        [25.20, 55.27, "DXB"],
        [-33.87, 151.21, "SYD"],
        [19.08, 72.88, "MUM"],
        [37.57, 126.98, "SEO"],
        [-23.55, -46.63, "SAO"],
        [-1.29, 36.82, "NAI"],
        [55.75, 37.62, "MOW"],
        [31.23, 121.47, "SHA"],
        [43.65, -79.38, "TOR"],
        [41.39, 2.15, "BCN"],
        [47.38, 8.54, "ZUR"],
      ];

      function latLonToVec3(lat, lon, r) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        return new THREE.Vector3(
          -r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        );
      }

      // City dot markers
      const dotGeo = new THREE.SphereGeometry(0.022, 8, 8);
      const cityDots = [];
      CITIES.forEach(([lat, lon]) => {
        const pos = latLonToVec3(lat, lon, RADIUS * 1.008);
        const dotMat = new THREE.MeshBasicMaterial({
          color: 0x00e87a,
          transparent: true,
          opacity: 0.9,
        });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.copy(pos);
        scene.add(dot);

        // Pulse ring
        const ringGeo = new THREE.RingGeometry(0.03, 0.05, 16);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x00e87a,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(pos);
        ring.lookAt(new THREE.Vector3(0, 0, 0));
        ring.rotateX(Math.PI / 2);
        scene.add(ring);
        cityDots.push({ dot, ring, baseOpacity: 0.5, phase: Math.random() * Math.PI * 2 });
      });

      // --- Transaction arcs ---
      // Each arc: start city, end city, color, progress
      const ARC_PAIRS = [
        [0, 1, 0x6496c8],  // NYC-LON (wire)
        [1, 2, 0x00e87a],  // LON-TYO (bitcoin)
        [0, 11, 0xf7931a], // NYC-SAO (bitcoin orange)
        [3, 4, 0x6496c8],  // SIN-HKG
        [7, 3, 0x00e87a],  // DXB-SIN
        [2, 8, 0xf7931a],  // TYO-SYD
        [5, 6, 0x6496c8],  // PAR-BER
        [0, 14, 0x00e87a], // NYC-SHA
        [1, 7, 0xf7931a],  // LON-DXB
        [9, 3, 0x6496c8],  // MUM-SIN
        [10, 2, 0x00e87a], // SEO-TYO
        [12, 1, 0x6496c8], // NAI-LON
        [13, 0, 0xf7931a], // MOW-NYC
        [4, 8, 0x00e87a],  // HKG-SYD
        [15, 0, 0x6496c8], // TOR-NYC
        [16, 5, 0xf7931a], // BCN-PAR
        [17, 1, 0x00e87a], // ZUR-LON
        [11, 12, 0x6496c8],// SAO-NAI
      ];

      function buildArcPoints(cityA, cityB, segments = 60) {
        const [latA, lonA] = CITIES[cityA];
        const [latB, lonB] = CITIES[cityB];
        const vA = latLonToVec3(latA, lonA, RADIUS * 1.01);
        const vB = latLonToVec3(latB, lonB, RADIUS * 1.01);
        const mid = vA.clone().add(vB).multiplyScalar(0.5);
        const lift = RADIUS * (0.3 + mid.length() * 0.15);
        mid.normalize().multiplyScalar(RADIUS + lift);

        const pts = [];
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const p = new THREE.Vector3()
            .addScaledVector(vA, (1 - t) * (1 - t))
            .addScaledVector(mid, 2 * t * (1 - t))
            .addScaledVector(vB, t * t);
          pts.push(p);
        }
        return pts;
      }

      const arcs = ARC_PAIRS.map(([a, b, color], idx) => {
        const allPts = buildArcPoints(a, b);
        const mat = new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: 0,
        });
        const geo = new THREE.BufferGeometry().setFromPoints(allPts.slice(0, 2));
        const line = new THREE.Line(geo, mat);
        scene.add(line);

        // Traveling dot
        const travGeo = new THREE.SphereGeometry(0.018, 6, 6);
        const travMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0 });
        const travDot = new THREE.Mesh(travGeo, travMat);
        scene.add(travDot);

        return {
          allPts,
          line,
          geo,
          mat,
          travDot,
          travMat,
          progress: -(idx * 0.12) % 1, // stagger starts
          speed: 0.003 + Math.random() * 0.002,
          active: false,
          color,
        };
      });

      // --- Atmosphere glow ring ---
      const atmosGeo = new THREE.SphereGeometry(RADIUS * 1.08, 32, 32);
      const atmosMat = new THREE.MeshBasicMaterial({
        color: 0x1a4a7a,
        transparent: true,
        opacity: 0.07,
        side: THREE.BackSide,
      });
      scene.add(new THREE.Mesh(atmosGeo, atmosMat));

      // --- Orbital rings ---
      const makeRing = (rx, ry, rz, col, op) => {
        const rg = new THREE.TorusGeometry(RADIUS * 1.22, 0.003, 12, 120);
        const rm = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op });
        const r = new THREE.Mesh(rg, rm);
        r.rotation.set(rx, ry, rz);
        scene.add(r);
        return r;
      };
      const orbRing1 = makeRing(Math.PI * 0.25, 0, 0, 0x6496c8, 0.25);
      const orbRing2 = makeRing(-Math.PI * 0.1, Math.PI * 0.5, 0, 0x00e87a, 0.15);

      // Background stars
      const starGeo = new THREE.BufferGeometry();
      const starPos = new Float32Array(1200 * 3);
      for (let i = 0; i < 1200 * 3; i++) starPos[i] = (Math.random() - 0.5) * 18;
      starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({ color: 0x8ab4d4, size: 0.012, transparent: true, opacity: 0.4 });
      scene.add(new THREE.Points(starGeo, starMat));

      // Lighting
      scene.add(new THREE.AmbientLight(0x9fb4c1, 0.5));
      const pl1 = new THREE.PointLight(0x6496c8, 3, 12);
      pl1.position.set(4, 3, 3);
      scene.add(pl1);
      const pl2 = new THREE.PointLight(0x00e87a, 1.5, 10);
      pl2.position.set(-3, -2, 2);
      scene.add(pl2);
      const pl3 = new THREE.PointLight(0xf7931a, 1, 8);
      pl3.position.set(0, -3, -2);
      scene.add(pl3);

      // Mouse
      let mouseX = 0, mouseY = 0;
      const onMouse = (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouse, { passive: true });

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
      const globeGroup = new THREE.Group();
      globeGroup.add(sphere);
      globeGroup.add(gridGroup);
      scene.add(globeGroup);
      sphere.parent.remove(sphere);
      gridGroup.parent.remove(gridGroup);

      const animate = () => {
        raf = requestAnimationFrame(animate);
        t += 0.005;

        // Globe slow auto-rotate + mouse nudge
        const targetY = mouseX * 0.25 + t * 0.08;
        const targetX = mouseY * 0.15;
        globeGroup.rotation.y += (targetY - globeGroup.rotation.y) * 0.03;
        globeGroup.rotation.x += (targetX - globeGroup.rotation.x) * 0.03;

        // City pulse
        cityDots.forEach(({ ring, phase }, i) => {
          const s = 1 + 0.5 * Math.sin(t * 2 + phase);
          ring.scale.setScalar(s);
          ring.material.opacity = 0.15 + 0.25 * Math.abs(Math.sin(t * 1.5 + phase));
        });

        // Arc animations
        arcs.forEach((arc) => {
          arc.progress += arc.speed;
          if (arc.progress > 1.3) arc.progress = -0.1;

          const p = Math.max(0, Math.min(1, arc.progress));
          const visibleCount = Math.floor(p * arc.allPts.length);

          if (visibleCount >= 2) {
            arc.geo.setFromPoints(arc.allPts.slice(0, visibleCount));
            arc.mat.opacity = p < 0.1 ? p * 5 : p > 0.85 ? (1 - p) * 6.67 : 0.7;
          } else {
            arc.mat.opacity = 0;
          }

          // Traveling dot position
          if (p > 0.02 && p < 0.98) {
            const dotIdx = Math.min(Math.floor(p * arc.allPts.length), arc.allPts.length - 1);
            arc.travDot.position.copy(arc.allPts[dotIdx]);
            arc.travMat.opacity = 1;
          } else {
            arc.travMat.opacity = 0;
          }
        });

        // Orbital rings spin
        orbRing1.rotation.z = t * 0.12;
        orbRing2.rotation.z = -t * 0.09;

        renderer.render(scene, camera);
      };
      animate();
      setReady(true);

      cleanup = () => {
        window.removeEventListener("mousemove", onMouse);
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(raf);
        renderer.dispose();
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      };
    };

    init();
    return () => { if (cleanup) cleanup(); };
  }, []);

  return (
    <div
      ref={mountRef}
      className="hero-globe-wrap"
      style={{
        position: "absolute",
        right: "5%",
        top: "50%",
        transform: "translateY(-50%)",
        width: "min(46vw, 560px)",
        height: "min(46vw, 560px)",
        zIndex: 3,
        opacity: ready ? 1 : 0,
        transition: "opacity 1.2s ease 0.5s",
      }}
    />
  );
}

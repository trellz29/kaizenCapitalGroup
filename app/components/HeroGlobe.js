"use client";
import { useRef, useEffect, useState } from "react";

// Simplified continent outlines as polygon point arrays [lon, lat]
// Drawn onto a canvas texture so the sphere looks like an actual Earth
const CONTINENT_POLYS = [
  // North America (simplified)
  [[-168,72],[-140,70],[-110,75],[-85,75],[-65,68],[-55,52],[-65,44],[-70,42],[-75,35],[-80,25],[-90,15],[-85,10],[-75,8],[-77,7],[-80,8],[-83,9],[-84,11],[-87,15],[-90,18],[-92,22],[-97,19],[-105,20],[-108,22],[-110,23],[-117,28],[-120,34],[-122,37],[-124,40],[-125,48],[-130,54],[-140,60],[-148,62],[-155,60],[-162,60],[-168,64],[-168,72]],
  // South America
  [[-80,12],[-75,10],[-62,11],[-60,5],[-50,5],[-44,3],[-35,-5],[-35,-10],[-38,-15],[-40,-20],[-42,-22],[-44,-23],[-48,-28],[-50,-30],[-53,-33],[-65,-55],[-68,-55],[-72,-50],[-75,-45],[-72,-40],[-68,-38],[-65,-35],[-62,-30],[-58,-25],[-58,-20],[-60,-15],[-62,-10],[-68,-5],[-72,0],[-78,2],[-80,5],[-80,12]],
  // Europe
  [[30,72],[28,70],[20,70],[10,62],[8,58],[5,51],[0,48],[2,44],[5,43],[8,44],[12,44],[14,46],[20,46],[22,48],[28,52],[30,58],[28,62],[25,65],[30,68],[30,72]],
  // Africa
  [[-18,16],[-16,20],[-18,24],[-14,27],[-8,33],[0,37],[10,37],[15,36],[20,37],[28,38],[32,30],[37,22],[42,12],[44,11],[48,12],[50,14],[44,16],[40,20],[40,25],[36,28],[36,24],[34,18],[30,10],[26,0],[22,-5],[18,-10],[14,-15],[12,-20],[18,-34],[26,-34],[32,-30],[40,-10],[42,12],[50,14],[48,12],[44,11],[40,20],[42,28],[40,38],[32,30],[28,38],[20,37],[15,36],[10,37],[0,37],[-8,33],[-14,27],[-18,24],[-16,20],[-18,16]],
  // Asia (simplified)
  [[30,72],[40,70],[50,72],[60,70],[80,72],[100,72],[120,70],[140,70],[160,72],[170,68],[160,60],[150,55],[145,48],[140,42],[135,35],[128,25],[120,20],[115,20],[108,20],[105,22],[100,15],[98,10],[102,5],[104,1],[108,2],[112,2],[108,8],[105,12],[108,18],[112,22],[116,26],[118,32],[120,38],[125,42],[128,48],[132,48],[138,38],[142,38],[140,40],[142,44],[148,48],[150,52],[160,60],[170,68],[160,72],[140,70],[120,70],[100,72],[80,72],[60,70],[50,72],[40,70],[30,72]],
  // Australia
  [[114,-22],[116,-20],[120,-18],[124,-14],[128,-14],[132,-12],[136,-12],[138,-14],[140,-18],[142,-20],[148,-18],[152,-24],[154,-28],[152,-32],[150,-38],[148,-38],[144,-38],[140,-36],[136,-34],[132,-32],[128,-32],[122,-34],[118,-34],[114,-28],[114,-22]],
  // Greenland
  [[-46,84],[-20,84],[-18,76],[-22,70],[-28,68],[-36,68],[-44,70],[-50,72],[-54,76],[-50,80],[-46,84]],
];

function drawEarthTexture(size = 1024) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext("2d");

  // Ocean
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, "#020d1f");
  oceanGrad.addColorStop(0.5, "#031525");
  oceanGrad.addColorStop(1, "#020d1f");
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Convert lon/lat to canvas x/y
  const toXY = (lon, lat) => {
    const x = ((lon + 180) / 360) * canvas.width;
    const y = ((90 - lat) / 180) * canvas.height;
    return [x, y];
  };

  // Draw continents
  CONTINENT_POLYS.forEach((poly) => {
    ctx.beginPath();
    poly.forEach(([lon, lat], i) => {
      const [x, y] = toXY(lon, lat);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();

    // Land gradient — dark teal/blue-green
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#0d2a3a");
    grad.addColorStop(0.5, "#0f3040");
    grad.addColorStop(1, "#0a2030");
    ctx.fillStyle = grad;
    ctx.fill();

    // Subtle coastline glow
    ctx.strokeStyle = "rgba(100,160,200,0.35)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // Lat/lon grid lines on texture
  ctx.strokeStyle = "rgba(80,130,180,0.12)";
  ctx.lineWidth = 0.8;
  for (let lat = -90; lat <= 90; lat += 15) {
    const [, y] = toXY(0, lat);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  for (let lon = -180; lon <= 180; lon += 15) {
    ctx.beginPath();
    for (let lat = -90; lat <= 90; lat += 5) {
      const [x, y] = toXY(lon, lat);
      lat === -90 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  return canvas;
}

export default function HeroGlobe() {
  const mountRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let renderer, raf;
    let cleanupFn = null;

    const init = async () => {
      const THREE = await import("three");
      const el = mountRef.current;
      if (!el) return;

      const W = el.offsetWidth || 560;
      const H = el.offsetHeight || 560;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
      camera.position.set(0, 0, 4.0);

      const R = 1.5;

      // Earth texture from canvas
      const earthCanvas = drawEarthTexture(1024);
      const earthTex = new THREE.CanvasTexture(earthCanvas);

      // Main sphere
      const sphereGeo = new THREE.SphereGeometry(R, 64, 64);
      const sphereMat = new THREE.MeshPhongMaterial({
        map: earthTex,
        specular: new THREE.Color(0x4477aa),
        shininess: 25,
        transparent: false,
      });
      const globe = new THREE.Mesh(sphereGeo, sphereMat);
      scene.add(globe);

      // Wireframe lat/lon overlay (3D grid lines on top of texture)
      const wireGeo = new THREE.SphereGeometry(R * 1.002, 24, 24);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x4a8ec2,
        wireframe: true,
        transparent: true,
        opacity: 0.08,
      });
      scene.add(new THREE.Mesh(wireGeo, wireMat));

      // Atmosphere shell
      const atmosGeo = new THREE.SphereGeometry(R * 1.06, 32, 32);
      const atmosMat = new THREE.MeshBasicMaterial({
        color: 0x1a5090,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
      });
      scene.add(new THREE.Mesh(atmosGeo, atmosMat));

      // Atmosphere rim glow (front side, very subtle)
      const rimGeo = new THREE.SphereGeometry(R * 1.04, 32, 32);
      const rimMat = new THREE.MeshBasicMaterial({
        color: 0x2060a0,
        transparent: true,
        opacity: 0.04,
        side: THREE.FrontSide,
      });
      scene.add(new THREE.Mesh(rimGeo, rimMat));

      // City hub definitions [lat, lon]
      const CITIES = [
        [40.71, -74.01],   // NYC
        [51.51, -0.13],    // London
        [35.69, 139.69],   // Tokyo
        [1.35, 103.82],    // Singapore
        [22.32, 114.17],   // Hong Kong
        [48.85, 2.35],     // Paris
        [25.20, 55.27],    // Dubai
        [-33.87, 151.21],  // Sydney
        [19.08, 72.88],    // Mumbai
        [55.75, 37.62],    // Moscow
        [31.23, 121.47],   // Shanghai
        [-23.55, -46.63],  // Sao Paulo
        [-1.29, 36.82],    // Nairobi
        [43.65, -79.38],   // Toronto
        [47.38, 8.54],     // Zurich
        [37.57, 126.98],   // Seoul
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

      // City dots + pulse rings
      const cityObjects = CITIES.map(([lat, lon], i) => {
        const pos = latLonToVec3(lat, lon, R * 1.012);

        const dotGeo = new THREE.SphereGeometry(0.025, 8, 8);
        const dotMat = new THREE.MeshBasicMaterial({ color: 0x00e87a, transparent: true, opacity: 0.95 });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.copy(pos);
        scene.add(dot);

        // Outer pulse ring
        const ringGeo = new THREE.RingGeometry(0.032, 0.052, 20);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x00e87a, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(pos);
        ring.lookAt(new THREE.Vector3(0, 0, 0));
        scene.add(ring);

        return { pos, dot, ring, phase: (i / CITIES.length) * Math.PI * 2 };
      });

      // Arc connections between cities
      const ARC_DEFS = [
        [0, 1, 0x6496c8, 0.0035],  // NYC-LON wire
        [1, 2, 0x00e87a, 0.003],   // LON-TYO BTC
        [0, 11, 0xf7931a, 0.004],  // NYC-SAO BTC
        [3, 4, 0x6496c8, 0.0045],  // SIN-HKG wire
        [6, 3, 0x00e87a, 0.003],   // DXB-SIN
        [2, 7, 0xf7931a, 0.0035],  // TYO-SYD
        [0, 10, 0x00e87a, 0.003],  // NYC-SHA
        [1, 6, 0xf7931a, 0.004],   // LON-DXB
        [8, 3, 0x6496c8, 0.0035],  // MUM-SIN
        [15, 2, 0x00e87a, 0.003],  // SEO-TYO
        [12, 1, 0x6496c8, 0.004],  // NAI-LON
        [9, 0, 0xf7931a, 0.003],   // MOW-NYC
        [4, 7, 0x00e87a, 0.0045],  // HKG-SYD
        [13, 0, 0x6496c8, 0.004],  // TOR-NYC
        [14, 1, 0x00e87a, 0.003],  // ZUR-LON
        [11, 12, 0x6496c8, 0.003], // SAO-NAI
        [5, 14, 0xf7931a, 0.004],  // PAR-ZUR
        [0, 5, 0x6496c8, 0.003],   // NYC-PAR
      ];

      function buildArcPoints(idxA, idxB, segs = 80) {
        const vA = latLonToVec3(CITIES[idxA][0], CITIES[idxA][1], R * 1.01);
        const vB = latLonToVec3(CITIES[idxB][0], CITIES[idxB][1], R * 1.01);
        const mid = vA.clone().add(vB).multiplyScalar(0.5);
        const dist = vA.distanceTo(vB);
        mid.normalize().multiplyScalar(R + dist * 0.55 + 0.1);
        const pts = [];
        for (let i = 0; i <= segs; i++) {
          const t = i / segs;
          pts.push(
            new THREE.Vector3()
              .addScaledVector(vA, (1 - t) * (1 - t))
              .addScaledVector(mid, 2 * t * (1 - t))
              .addScaledVector(vB, t * t)
          );
        }
        return pts;
      }

      const arcs = ARC_DEFS.map(([a, b, color, speed], i) => {
        const pts = buildArcPoints(a, b);

        const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0 });
        const lineGeo = new THREE.BufferGeometry().setFromPoints(pts.slice(0, 2));
        const line = new THREE.Line(lineGeo, lineMat);
        scene.add(line);

        // Traveling head dot
        const headGeo = new THREE.SphereGeometry(0.022, 6, 6);
        const headMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0 });
        const head = new THREE.Mesh(headGeo, headMat);
        scene.add(head);

        // Particle trail (small dots behind the head)
        const trailCount = 8;
        const trail = [];
        for (let j = 0; j < trailCount; j++) {
          const tGeo = new THREE.SphereGeometry(0.01 * (1 - j / trailCount), 4, 4);
          const tMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0 });
          const tDot = new THREE.Mesh(tGeo, tMat);
          scene.add(tDot);
          trail.push({ mesh: tDot, mat: tMat });
        }

        return {
          pts,
          line, lineGeo, lineMat,
          head, headMat,
          trail,
          progress: -(i * 0.11) % 1,
          speed,
          color,
        };
      });

      // Background stars
      const starGeo = new THREE.BufferGeometry();
      const starPos = new Float32Array(1500 * 3);
      for (let i = 0; i < 1500 * 3; i++) starPos[i] = (Math.random() - 0.5) * 20;
      starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
      scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x8ab4d4, size: 0.013, transparent: true, opacity: 0.35 })));

      // Lighting
      scene.add(new THREE.AmbientLight(0x334466, 0.8));
      const sun = new THREE.DirectionalLight(0x7799cc, 2.5);
      sun.position.set(5, 3, 4);
      scene.add(sun);
      const fill = new THREE.PointLight(0x00e87a, 0.6, 15);
      fill.position.set(-4, -2, 2);
      scene.add(fill);

      // Mouse
      let mX = 0, mY = 0;
      const onMouse = (e) => {
        mX = (e.clientX / window.innerWidth - 0.5) * 2;
        mY = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouse, { passive: true });

      const onResize = () => {
        const W2 = el.offsetWidth;
        const H2 = el.offsetHeight;
        camera.aspect = W2 / H2;
        camera.updateProjectionMatrix();
        renderer.setSize(W2, H2);
      };
      window.addEventListener("resize", onResize);

      let t = 0;
      const animate = () => {
        raf = requestAnimationFrame(animate);
        t += 0.005;

        // Globe rotation
        const tgtY = mX * 0.2 + t * 0.07;
        const tgtX = mY * 0.12;
        globe.rotation.y += (tgtY - globe.rotation.y) * 0.025;
        globe.rotation.x += (tgtX - globe.rotation.x) * 0.025;

        // Sync wireframe + city dots to globe rotation
        scene.children.forEach((c) => {
          if (c !== globe && c.isMesh && c.geometry && c.geometry.type === "SphereGeometry" && c.geometry.parameters && c.geometry.parameters.widthSegments === 24) {
            c.rotation.copy(globe.rotation);
          }
        });

        // City pulses
        cityObjects.forEach(({ dot, ring, pos, phase }) => {
          // Rotate dots with globe
          const rPos = pos.clone().applyEuler(globe.rotation);
          dot.position.copy(rPos);
          ring.position.copy(rPos);
          ring.lookAt(new THREE.Vector3(0, 0, 0));

          const pulse = Math.sin(t * 2.5 + phase);
          ring.scale.setScalar(1 + 0.6 * Math.abs(pulse));
          ring.material.opacity = 0.15 + 0.4 * Math.abs(pulse);
        });

        // Arc animations
        arcs.forEach((arc) => {
          arc.progress += arc.speed;
          if (arc.progress > 1.25) arc.progress = -0.05;

          const p = Math.max(0, Math.min(1, arc.progress));
          const N = arc.pts.length;
          const visN = Math.floor(p * N);

          // Rotate arc points with globe
          const rotatedPts = arc.pts.map((pt) => pt.clone().applyEuler(globe.rotation));

          if (visN >= 2) {
            arc.lineGeo.setFromPoints(rotatedPts.slice(0, visN));
            const fadeIn = p < 0.08 ? p / 0.08 : 1;
            const fadeOut = p > 0.88 ? (1 - p) / 0.12 : 1;
            arc.lineMat.opacity = 0.75 * fadeIn * fadeOut;
          } else {
            arc.lineMat.opacity = 0;
          }

          // Head dot
          if (p > 0.01 && p < 0.99) {
            const hi = Math.min(Math.floor(p * N), N - 1);
            arc.head.position.copy(rotatedPts[hi]);
            arc.headMat.opacity = 1;
          } else {
            arc.headMat.opacity = 0;
          }

          // Particle trail behind head
          arc.trail.forEach(({ mesh, mat }, j) => {
            const trailP = p - (j + 1) * 0.018;
            if (trailP > 0 && trailP < 1) {
              const ti = Math.min(Math.floor(trailP * N), N - 1);
              mesh.position.copy(rotatedPts[ti]);
              mat.opacity = (1 - j / arc.trail.length) * 0.6 * (arc.lineMat.opacity > 0 ? 1 : 0);
            } else {
              mat.opacity = 0;
            }
          });
        });

        renderer.render(scene, camera);
      };

      animate();
      setReady(true);

      cleanupFn = () => {
        window.removeEventListener("mousemove", onMouse);
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(raf);
        renderer.dispose();
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      };
    };

    init();
    return () => { if (cleanupFn) cleanupFn(); };
  }, []);

  return (
    <div
      ref={mountRef}
      className="hero-globe-wrap"
      style={{
        position: "absolute",
        right: "3%",
        top: "50%",
        transform: "translateY(-50%)",
        width: "min(48vw, 580px)",
        height: "min(48vw, 580px)",
        zIndex: 3,
        opacity: ready ? 1 : 0,
        transition: "opacity 1.2s ease 0.5s",
      }}
    />
  );
}

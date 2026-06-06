"use client";
import { useRef, useEffect, useState } from "react";

// Detailed continent polygons [lon, lat] for realistic land masses
const LAND_POLYS = [
  // North America
  [[-168,72],[-140,70],[-120,74],[-85,75],[-65,68],[-55,52],[-65,44],[-70,42],[-75,35],[-80,25],[-87,15],[-83,9],[-77,8],[-80,8],[-84,11],[-90,18],[-97,19],[-105,20],[-110,23],[-117,28],[-120,34],[-122,37],[-124,40],[-125,48],[-130,54],[-140,60],[-148,62],[-155,60],[-162,60],[-168,64],[-168,72]],
  // South America
  [[-80,12],[-75,10],[-62,11],[-50,5],[-44,3],[-35,-5],[-35,-10],[-38,-15],[-40,-20],[-42,-22],[-44,-23],[-48,-28],[-50,-30],[-53,-33],[-65,-55],[-68,-55],[-72,-50],[-75,-45],[-72,-40],[-65,-35],[-58,-25],[-58,-20],[-60,-15],[-62,-10],[-68,-5],[-72,0],[-78,2],[-80,5],[-80,12]],
  // Europe
  [[30,72],[20,70],[10,62],[5,51],[0,48],[2,44],[5,43],[8,44],[12,44],[14,46],[20,46],[22,48],[28,52],[30,58],[28,62],[25,65],[30,68],[30,72]],
  // Scandinavia
  [[5,58],[8,56],[10,58],[12,60],[14,64],[16,68],[20,70],[24,68],[28,70],[30,68],[26,65],[22,62],[18,58],[14,56],[10,56],[5,58]],
  // UK/Ireland
  [[-5,50],[2,51],[2,53],[0,58],[-5,58],[-8,55],[-6,52],[-5,50]],
  // Africa
  [[-18,16],[-16,20],[-18,24],[-14,27],[-8,33],[0,37],[10,37],[20,37],[28,38],[36,28],[42,12],[44,11],[50,14],[44,16],[40,20],[40,25],[36,28],[34,18],[30,10],[26,0],[22,-5],[18,-10],[14,-15],[12,-20],[18,-34],[26,-34],[32,-30],[40,-10],[42,12],[50,14],[44,11],[40,20],[42,28],[32,30],[20,37],[0,37],[-8,33],[-18,16]],
  // Madagascar
  [[44,-12],[50,-12],[50,-25],[44,-25],[44,-12]],
  // Asia main
  [[30,72],[40,70],[60,70],[80,72],[100,72],[120,70],[140,70],[160,68],[150,55],[145,48],[138,38],[132,48],[128,48],[120,38],[118,32],[116,26],[112,22],[108,18],[105,12],[100,15],[98,10],[102,5],[108,2],[112,2],[108,8],[105,12],[102,5],[98,5],[95,15],[90,22],[88,26],[85,27],[80,30],[75,34],[72,36],[68,38],[62,40],[55,42],[48,42],[42,38],[38,38],[36,42],[32,48],[28,52],[22,48],[20,46],[30,58],[28,62],[30,68],[30,72]],
  // Indian subcontinent
  [[62,22],[68,22],[72,22],[78,8],[80,10],[82,12],[80,20],[78,26],[76,30],[72,34],[68,36],[62,34],[60,28],[62,22]],
  // SE Asia / Indochina
  [[98,28],[100,22],[102,18],[104,10],[100,2],[104,1],[108,2],[112,2],[116,4],[120,6],[118,14],[116,20],[110,20],[108,22],[104,22],[100,16],[98,18],[98,28]],
  // Japan
  [[130,32],[132,34],[134,36],[138,38],[142,40],[142,44],[140,44],[136,34],[134,32],[130,32]],
  // Australia
  [[114,-22],[120,-18],[128,-14],[136,-12],[140,-18],[148,-18],[152,-24],[154,-28],[152,-32],[148,-38],[144,-38],[140,-36],[136,-34],[128,-32],[122,-34],[118,-34],[114,-28],[114,-22]],
  // New Zealand
  [[166,-46],[168,-44],[172,-42],[174,-36],[172,-34],[168,-38],[166,-42],[166,-46]],
  // Greenland
  [[-46,84],[-20,84],[-18,76],[-22,70],[-28,68],[-36,68],[-44,70],[-50,72],[-54,76],[-50,80],[-46,84]],
  // Iceland
  [[-24,64],[-14,64],[-13,66],[-18,66],[-24,65],[-24,64]],
  // Borneo
  [[108,2],[116,4],[118,6],[118,2],[116,0],[112,-2],[108,0],[108,2]],
  // Sumatra
  [[96,4],[100,2],[104,-2],[106,-6],[104,-5],[100,-2],[96,2],[96,4]],
  // Sri Lanka
  [[80,10],[82,8],[82,6],[80,6],[80,8],[80,10]],
];

function buildEarthTexture() {
  const W = 2048, H = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Deep ocean gradient
  const ocean = ctx.createLinearGradient(0, 0, 0, H);
  ocean.addColorStop(0,   "#0a2a5e");
  ocean.addColorStop(0.3, "#0d3b8a");
  ocean.addColorStop(0.5, "#1556a8");
  ocean.addColorStop(0.7, "#0d3b8a");
  ocean.addColorStop(1,   "#0a2a5e");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, W, H);

  // Subtle ocean shimmer streaks
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const g = ctx.createRadialGradient(x, y, 0, x, y, 60 + Math.random() * 120);
    g.addColorStop(0, "rgba(80,160,255,0.07)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  // lon/lat -> canvas pixel
  const px = (lon, lat) => [((lon + 180) / 360) * W, ((90 - lat) / 180) * H];

  const drawLand = (poly, baseColor, highlightColor) => {
    ctx.beginPath();
    poly.forEach(([lon, lat], i) => {
      const [x, y] = px(lon, lat);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();

    // Land fill — green to brown gradient (elevation feel)
    const bounds = poly.reduce((b, [lon, lat]) => ({
      minX: Math.min(b.minX, ((lon+180)/360)*W),
      maxX: Math.max(b.maxX, ((lon+180)/360)*W),
      minY: Math.min(b.minY, ((90-lat)/180)*H),
      maxY: Math.max(b.maxY, ((90-lat)/180)*H),
    }), { minX: W, maxX: 0, minY: H, maxY: 0 });

    const lg = ctx.createLinearGradient(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
    lg.addColorStop(0,   baseColor);
    lg.addColorStop(0.4, highlightColor);
    lg.addColorStop(0.7, baseColor);
    lg.addColorStop(1,   "#5a3a1a");
    ctx.fillStyle = lg;
    ctx.fill();

    // Coastal glow
    ctx.strokeStyle = "rgba(120,200,120,0.4)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Interior texture noise (simulated elevation)
    ctx.save();
    ctx.clip();
    for (let i = 0; i < 60; i++) {
      const nx = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
      const ny = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);
      const r = 4 + Math.random() * 18;
      const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, r);
      ng.addColorStop(0, "rgba(90,60,20,0.18)");
      ng.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = ng;
      ctx.fillRect(bounds.minX, bounds.minY, bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
    }
    ctx.restore();
  };

  // Draw all continents
  LAND_POLYS.forEach((poly) => {
    // Color by latitude (tropical=green, temperate=olive, polar=grey-brown)
    const avgLat = poly.reduce((s, [, lat]) => s + lat, 0) / poly.length;
    let base, hi;
    if (Math.abs(avgLat) > 60) {
      base = "#7a8a6a"; hi = "#9aaa8a"; // polar/tundra
    } else if (Math.abs(avgLat) > 35) {
      base = "#4a7a3a"; hi = "#6a9a5a"; // temperate
    } else {
      base = "#3a7a2a"; hi = "#5aaa3a"; // tropical
    }
    drawLand(poly, base, hi);
  });

  // Polar ice caps
  const drawIce = (yCenter, height) => {
    const iceGrad = ctx.createLinearGradient(0, yCenter - height, 0, yCenter + height);
    iceGrad.addColorStop(0, "rgba(220,235,255,0.95)");
    iceGrad.addColorStop(0.5, "rgba(200,220,255,0.7)");
    iceGrad.addColorStop(1, "rgba(180,210,255,0)");
    ctx.fillStyle = iceGrad;
    ctx.fillRect(0, yCenter - height, W, height * 2);
  };
  drawIce(0, 55);          // North pole
  drawIce(H, 70);          // South pole (Antarctica)

  // Cloud layer (subtle white wisps)
  for (let i = 0; i < 80; i++) {
    const cx = Math.random() * W;
    const cy = H * 0.15 + Math.random() * H * 0.7;
    const cw = 40 + Math.random() * 200;
    const ch = 8 + Math.random() * 30;
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cw / 2);
    cg.addColorStop(0, "rgba(255,255,255,0.12)");
    cg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = cg;
    ctx.save();
    ctx.scale(1, ch / cw);
    ctx.beginPath();
    ctx.arc(cx, cy * cw / ch, cw / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Lat/lon grid lines (subtle)
  ctx.strokeStyle = "rgba(100,160,220,0.15)";
  ctx.lineWidth = 0.8;
  for (let lat = -75; lat <= 75; lat += 15) {
    const [, y] = px(0, lat);
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  for (let lon = -165; lon <= 180; lon += 15) {
    ctx.beginPath();
    for (let lat = -90; lat <= 90; lat += 3) {
      const [x, y] = px(lon, lat);
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
      const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
      camera.position.set(0, 0, 4.0);

      const R = 1.5;

      // Earth texture
      const earthCanvas = buildEarthTexture();
      const earthTex = new THREE.CanvasTexture(earthCanvas);

      // Globe mesh
      const sphereGeo = new THREE.SphereGeometry(R, 64, 64);
      const sphereMat = new THREE.MeshPhongMaterial({
        map: earthTex,
        specular: new THREE.Color(0x224488),
        shininess: 40,
      });
      const globe = new THREE.Mesh(sphereGeo, sphereMat);
      scene.add(globe);

      // Specular ocean highlight layer
      const specGeo = new THREE.SphereGeometry(R * 1.001, 32, 32);
      const specMat = new THREE.MeshPhongMaterial({
        color: 0x002244,
        transparent: true,
        opacity: 0.18,
        specular: new THREE.Color(0x6699ff),
        shininess: 120,
      });
      scene.add(new THREE.Mesh(specGeo, specMat));

      // Atmosphere glow (BackSide — halo)
      const atmosGeo = new THREE.SphereGeometry(R * 1.10, 32, 32);
      const atmosMat = new THREE.MeshBasicMaterial({
        color: 0x1a6ab0,
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide,
      });
      scene.add(new THREE.Mesh(atmosGeo, atmosMat));

      // Thin rim atmosphere (FrontSide)
      const rimGeo = new THREE.SphereGeometry(R * 1.05, 32, 32);
      const rimMat = new THREE.MeshBasicMaterial({
        color: 0x4488dd,
        transparent: true,
        opacity: 0.06,
        side: THREE.FrontSide,
      });
      scene.add(new THREE.Mesh(rimGeo, rimMat));

      // Cloud layer (slowly counter-rotating sphere)
      const cloudCanvas = document.createElement("canvas");
      cloudCanvas.width = 1024; cloudCanvas.height = 512;
      const cc = cloudCanvas.getContext("2d");
      for (let i = 0; i < 200; i++) {
        const cx = Math.random() * 1024;
        const cy = Math.random() * 512;
        const r2 = 20 + Math.random() * 80;
        const cg = cc.createRadialGradient(cx, cy, 0, cx, cy, r2);
        cg.addColorStop(0, "rgba(255,255,255,0.18)");
        cg.addColorStop(1, "rgba(255,255,255,0)");
        cc.fillStyle = cg;
        cc.beginPath(); cc.arc(cx, cy, r2, 0, Math.PI * 2); cc.fill();
      }
      const cloudTex = new THREE.CanvasTexture(cloudCanvas);
      const cloudGeo = new THREE.SphereGeometry(R * 1.012, 48, 48);
      const cloudMat = new THREE.MeshPhongMaterial({
        map: cloudTex,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
      });
      const clouds = new THREE.Mesh(cloudGeo, cloudMat);
      scene.add(clouds);

      // City hubs
      const CITIES = [
        [40.71,-74.01],[51.51,-0.13],[35.69,139.69],[1.35,103.82],
        [22.32,114.17],[48.85,2.35],[25.20,55.27],[-33.87,151.21],
        [19.08,72.88],[55.75,37.62],[31.23,121.47],[-23.55,-46.63],
        [-1.29,36.82],[43.65,-79.38],[47.38,8.54],[37.57,126.98],
      ];

      const latLon = (lat, lon, r) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const th  = (lon + 180) * (Math.PI / 180);
        return new THREE.Vector3(
          -r * Math.sin(phi) * Math.cos(th),
           r * Math.cos(phi),
           r * Math.sin(phi) * Math.sin(th)
        );
      };

      const cityObjs = CITIES.map(([lat, lon], i) => {
        const pos = latLon(lat, lon, R * 1.013);
        const dg = new THREE.SphereGeometry(0.024, 8, 8);
        const dm = new THREE.MeshBasicMaterial({ color: 0x00e87a, transparent: true, opacity: 0.95 });
        const dot = new THREE.Mesh(dg, dm);
        dot.position.copy(pos);

        const rg = new THREE.RingGeometry(0.03, 0.05, 20);
        const rm = new THREE.MeshBasicMaterial({ color: 0x00e87a, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(rg, rm);
        ring.position.copy(pos);
        ring.lookAt(new THREE.Vector3(0,0,0));

        scene.add(dot); scene.add(ring);
        return { pos, dot, ring, phase: (i / CITIES.length) * Math.PI * 2 };
      });

      // Transaction arcs
      const ARC_DEFS = [
        [0,1,0x6496c8,0.0035],[1,2,0x00e87a,0.003],[0,11,0xf7931a,0.004],
        [3,4,0x6496c8,0.0045],[6,3,0x00e87a,0.003],[2,7,0xf7931a,0.0035],
        [0,10,0x00e87a,0.003],[1,6,0xf7931a,0.004],[8,3,0x6496c8,0.0035],
        [15,2,0x00e87a,0.003],[12,1,0x6496c8,0.004],[9,0,0xf7931a,0.003],
        [4,7,0x00e87a,0.0045],[13,0,0x6496c8,0.004],[14,1,0x00e87a,0.003],
        [11,12,0x6496c8,0.003],[5,14,0xf7931a,0.004],[0,5,0x6496c8,0.003],
      ];

      const buildArc = (iA, iB, segs = 80) => {
        const vA = latLon(CITIES[iA][0], CITIES[iA][1], R * 1.01);
        const vB = latLon(CITIES[iB][0], CITIES[iB][1], R * 1.01);
        const mid = vA.clone().add(vB).multiplyScalar(0.5);
        mid.normalize().multiplyScalar(R + vA.distanceTo(vB) * 0.55 + 0.1);
        return Array.from({ length: segs + 1 }, (_, k) => {
          const t = k / segs;
          return new THREE.Vector3()
            .addScaledVector(vA, (1-t)*(1-t))
            .addScaledVector(mid, 2*t*(1-t))
            .addScaledVector(vB, t*t);
        });
      };

      const arcs = ARC_DEFS.map(([a, b, color, speed], i) => {
        const pts = buildArc(a, b);
        const lm = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0 });
        const lg = new THREE.BufferGeometry().setFromPoints(pts.slice(0,2));
        const line = new THREE.Line(lg, lm);
        scene.add(line);

        const hm = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0 });
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 6), hm);
        scene.add(head);

        const trail = Array.from({ length: 8 }, (_, j) => {
          const tm = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0 });
          const td = new THREE.Mesh(new THREE.SphereGeometry(0.01*(1-j/8), 4, 4), tm);
          scene.add(td);
          return { mesh: td, mat: tm };
        });

        return { pts, line, lineGeo: lg, lineMat: lm, head, headMat: hm, trail, progress: -(i*0.11)%1, speed };
      });

      // Stars
      const sp = new Float32Array(1500*3);
      for (let i = 0; i < 1500*3; i++) sp[i] = (Math.random()-0.5)*20;
      const sg = new THREE.BufferGeometry();
      sg.setAttribute("position", new THREE.BufferAttribute(sp,3));
      scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color:0x8ab4d4, size:0.013, transparent:true, opacity:0.3 })));

      // Lighting — sunlight from top-right
      scene.add(new THREE.AmbientLight(0x334466, 0.9));
      const sun = new THREE.DirectionalLight(0xfff5e0, 2.8);
      sun.position.set(5, 3, 4);
      scene.add(sun);
      const fill = new THREE.PointLight(0x2244aa, 0.8, 20);
      fill.position.set(-5,-3,-3);
      scene.add(fill);

      // --- Mouse drag to spin ---
      let isDragging = false;
      let prevMX = 0, prevMY = 0;
      let velX = 0, velY = 0;
      let autoRotY = 0;

      const onMouseDown = (e) => {
        isDragging = true;
        prevMX = e.clientX;
        prevMY = e.clientY;
        velX = 0; velY = 0;
        el.style.cursor = "grabbing";
      };
      const onMouseMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - prevMX;
        const dy = e.clientY - prevMY;
        velX = dx * 0.005;
        velY = dy * 0.005;
        globe.rotation.y += velX;
        globe.rotation.x += velY;
        globe.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, globe.rotation.x));
        prevMX = e.clientX;
        prevMY = e.clientY;
      };
      const onMouseUp = () => {
        isDragging = false;
        el.style.cursor = "grab";
      };

      // Touch support
      const onTouchStart = (e) => {
        isDragging = true;
        prevMX = e.touches[0].clientX;
        prevMY = e.touches[0].clientY;
        velX = 0; velY = 0;
      };
      const onTouchMove = (e) => {
        if (!isDragging) return;
        const dx = e.touches[0].clientX - prevMX;
        const dy = e.touches[0].clientY - prevMY;
        velX = dx * 0.005;
        velY = dy * 0.005;
        globe.rotation.y += velX;
        globe.rotation.x += velY;
        globe.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, globe.rotation.x));
        prevMX = e.touches[0].clientX;
        prevMY = e.touches[0].clientY;
      };
      const onTouchEnd = () => { isDragging = false; };

      el.style.cursor = "grab";
      el.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      el.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onTouchEnd);

      const onResize = () => {
        const W2 = el.offsetWidth, H2 = el.offsetHeight;
        camera.aspect = W2/H2;
        camera.updateProjectionMatrix();
        renderer.setSize(W2, H2);
      };
      window.addEventListener("resize", onResize);

      let t = 0;
      const animate = () => {
        raf = requestAnimationFrame(animate);
        t += 0.005;

        if (!isDragging) {
          // Momentum decay
          velX *= 0.95; velY *= 0.95;
          globe.rotation.y += velX;
          globe.rotation.x += velY;
          // Gentle auto-rotate when momentum gone
          if (Math.abs(velX) < 0.0003) globe.rotation.y += 0.0008;
        }

        // Clamp tilt
        globe.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, globe.rotation.x));

        // Clouds drift slightly faster
        clouds.rotation.y = globe.rotation.y + t * 0.002;
        clouds.rotation.x = globe.rotation.x;

        // City dots follow globe rotation
        cityObjs.forEach(({ pos, dot, ring, phase }) => {
          const rPos = pos.clone().applyEuler(globe.rotation);
          dot.position.copy(rPos);
          ring.position.copy(rPos);
          ring.lookAt(new THREE.Vector3(0,0,0));
          const pulse = Math.abs(Math.sin(t*2.5 + phase));
          ring.scale.setScalar(1 + 0.7*pulse);
          ring.material.opacity = 0.15 + 0.45*pulse;
        });

        // Arc animations
        arcs.forEach((arc) => {
          arc.progress += arc.speed;
          if (arc.progress > 1.25) arc.progress = -0.05;
          const p = Math.max(0, Math.min(1, arc.progress));
          const N = arc.pts.length;
          const visN = Math.floor(p * N);
          const rotPts = arc.pts.map(pt => pt.clone().applyEuler(globe.rotation));

          if (visN >= 2) {
            arc.lineGeo.setFromPoints(rotPts.slice(0, visN));
            const fi = p < 0.08 ? p/0.08 : 1;
            const fo = p > 0.88 ? (1-p)/0.12 : 1;
            arc.lineMat.opacity = 0.8 * fi * fo;
          } else {
            arc.lineMat.opacity = 0;
          }

          if (p > 0.01 && p < 0.99) {
            arc.head.position.copy(rotPts[Math.min(Math.floor(p*N), N-1)]);
            arc.headMat.opacity = 1;
          } else {
            arc.headMat.opacity = 0;
          }

          arc.trail.forEach(({ mesh, mat }, j) => {
            const tp = p - (j+1)*0.018;
            if (tp > 0 && tp < 1 && arc.lineMat.opacity > 0) {
              mesh.position.copy(rotPts[Math.min(Math.floor(tp*N), N-1)]);
              mat.opacity = (1 - j/arc.trail.length) * 0.65;
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
        el.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        el.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
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

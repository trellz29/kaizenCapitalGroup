"use client";
import { useRef, useEffect, useState } from "react";

const LAND_POLYS = [
  // ── NORTH AMERICA ──────────────────────────────────────────────────
  [[-168,72],[-162,70],[-152,70],[-140,70],[-132,56],[-126,50],
   [-124,46],[-124,40],[-122,37],[-120,34],[-117,32],[-118,28],
   [-110,23],[-105,20],[-97,19],[-90,18],[-84,10],[-83,9],[-77,8],
   [-80,8],[-83,10],[-87,16],[-90,18],[-97,26],[-97,28],[-97,30],
   [-94,30],[-90,29],[-89,30],[-85,30],[-81,25],[-80,25],[-80,28],
   [-81,31],[-80,32],[-76,35],[-76,37],[-75,38],[-74,40],[-70,42],
   [-67,44],[-65,44],[-60,46],[-64,48],[-60,46],[-65,44],[-66,45],
   [-70,44],[-70,42],[-74,40],[-76,37],[-76,35],[-81,31],[-80,28],
   [-80,25],[-81,25],[-85,30],[-89,30],[-90,29],[-94,30],[-97,30],
   [-97,28],[-97,26],[-97,19],[-90,18],[-87,16],[-83,10],[-80,8],
   [-77,8],[-83,9],[-84,10],[-90,18],[-97,19],[-100,20],[-105,20],
   [-110,23],[-118,28],[-117,32],[-120,34],[-122,37],[-124,40],
   [-124,46],[-126,50],[-132,56],[-140,60],[-148,62],[-152,60],
   [-156,60],[-162,60],[-166,62],[-168,66],[-168,72]],

  // ── ALASKA PENINSULA ──
  [[-162,60],[-152,58],[-148,58],[-152,60],[-162,60]],

  // ── GREENLAND ──────────────────────────────────────────────────────
  [[-44,83],[-26,83],[-18,77],[-20,72],[-24,70],[-30,68],[-36,66],
   [-40,65],[-44,66],[-48,68],[-52,72],[-56,76],[-52,80],[-44,83]],

  // ── SOUTH AMERICA ──────────────────────────────────────────────────
  [[-80,12],[-76,10],[-72,12],[-66,12],[-62,11],[-60,6],[-52,4],
   [-50,2],[-44,2],[-36,-4],[-34,-8],[-35,-10],[-36,-14],[-38,-16],
   [-40,-20],[-41,-22],[-43,-23],[-44,-23],[-46,-24],[-48,-28],
   [-50,-30],[-52,-33],[-54,-36],[-58,-40],[-62,-46],[-65,-55],
   [-68,-54],[-72,-50],[-74,-44],[-72,-40],[-68,-38],[-65,-35],
   [-60,-30],[-58,-25],[-58,-20],[-60,-15],[-63,-10],[-68,-5],
   [-72,0],[-76,2],[-78,5],[-80,8],[-80,12]],

  // ── EUROPE ─────────────────────────────────────────────────────────
  // Iberian Peninsula
  [[-9,44],[-2,44],[2,44],[3,43],[0,44],[-2,44],[-9,44]],
  [[-9,44],[-9,36],[-6,36],[-2,36],[0,38],[2,40],[3,43],[0,44],[-2,44],[-9,44]],
  // Main Europe body
  [[2,44],[5,43],[8,44],[10,44],[12,46],[14,46],[16,46],[18,44],
   [20,44],[22,40],[26,40],[28,42],[30,42],[32,42],[36,42],[38,40],
   [36,36],[28,36],[24,38],[22,40],[18,44],[14,46],[12,44],[10,44],
   [8,44],[5,43],[3,43],[0,44],[2,44]],
  // Scandinavia
  [[5,58],[8,56],[10,58],[12,60],[14,64],[16,68],[20,70],[25,70],
   [28,72],[30,70],[28,66],[25,64],[22,62],[18,58],[14,56],[10,56],[5,58]],
  // UK
  [[-5,50],[2,51],[2,53],[0,58],[-4,58],[-5,56],[-3,54],[-5,52],[-5,50]],
  // Ireland
  [[-10,52],[-6,52],[-6,55],[-10,54],[-10,52]],
  // Iceland
  [[-24,64],[-13,64],[-13,66],[-18,66],[-24,65],[-24,64]],
  // Italy
  [[8,44],[10,44],[12,46],[14,44],[16,40],[16,38],[18,40],[16,38],[14,38],[12,38],[10,38],[8,44]],

  // ── AFRICA ─────────────────────────────────────────────────────────
  [[-18,16],[-16,20],[-18,24],[-12,28],[-6,34],[0,37],[8,38],
   [12,36],[16,36],[20,36],[24,32],[28,32],[32,28],[34,24],[36,20],
   [38,16],[40,12],[42,12],[44,12],[48,12],[50,14],[44,16],[42,20],
   [40,24],[40,28],[38,30],[36,32],[34,28],[32,12],[28,6],[26,0],
   [22,-5],[18,-10],[16,-14],[14,-16],[18,-34],[26,-34],[32,-30],
   [36,-18],[38,-12],[40,-8],[42,0],[44,8],[44,12],[42,12],[40,12],
   [38,16],[36,20],[34,24],[32,28],[28,32],[24,32],[20,36],[16,36],
   [12,36],[8,38],[0,37],[-6,34],[-12,28],[-18,24],[-16,20],[-18,16]],
  // Madagascar
  [[44,-12],[50,-14],[50,-26],[44,-26],[44,-12]],

  // ── MIDDLE EAST / ARABIA ───────────────────────────────────────────
  [[36,36],[38,36],[40,38],[44,38],[48,38],[52,36],[56,28],[58,22],
   [60,22],[56,24],[52,26],[50,28],[48,30],[46,30],[44,32],[42,36],
   [40,38],[38,36],[36,36]],

  // ── ASIA (main body) ───────────────────────────────────────────────
  [[26,42],[28,42],[32,42],[36,42],[38,40],[40,38],[44,38],[48,38],
   [52,36],[56,28],[58,22],[62,22],[68,22],[72,22],[78,8],[80,10],
   [82,14],[80,20],[78,26],[76,30],[72,34],[68,36],[64,38],[60,38],
   [58,40],[54,42],[50,44],[46,44],[42,38],[40,38],[38,40],[36,44],
   [32,48],[28,52],[24,48],[20,46],[22,42],[26,40],[26,42]],
  // Indian subcontinent
  [[62,22],[68,22],[72,22],[76,18],[78,8],[80,10],[82,14],[80,20],
   [78,26],[76,30],[72,34],[68,36],[64,38],[62,34],[60,28],[62,22]],
  // Sri Lanka
  [[80,10],[82,8],[82,6],[80,6],[80,10]],

  // ── SIBERIA / RUSSIA ───────────────────────────────────────────────
  [[28,52],[32,48],[36,44],[40,38],[44,38],[48,42],[54,42],[58,40],
   [62,40],[68,38],[72,42],[78,48],[88,52],[96,54],[104,54],[110,54],
   [120,52],[128,52],[132,48],[136,48],[140,50],[144,50],[148,48],
   [150,52],[156,52],[160,58],[164,62],[168,64],[168,72],[150,72],
   [140,72],[130,68],[120,68],[110,68],[100,68],[90,68],[80,68],
   [70,66],[60,66],[50,68],[44,68],[36,66],[30,62],[28,58],[28,52]],

  // ── SE ASIA / INDOCHINA ────────────────────────────────────────────
  [[98,28],[100,22],[102,18],[104,14],[104,10],[102,6],[100,4],
   [104,2],[108,2],[112,2],[116,4],[120,6],[118,12],[116,18],
   [112,20],[108,22],[104,22],[100,16],[98,20],[98,28]],

  // ── CHINA / KOREA ─────────────────────────────────────────────────
  [[78,48],[84,48],[90,50],[96,54],[104,54],[110,54],[116,52],
   [120,52],[124,48],[128,52],[130,46],[132,44],[130,42],[128,38],
   [122,32],[120,26],[116,22],[112,22],[108,22],[104,22],[100,16],
   [100,22],[98,28],[96,28],[92,26],[88,26],[84,28],[80,30],[76,30],
   [78,34],[78,38],[76,40],[72,42],[68,38],[64,38],[62,40],[62,44],
   [68,48],[74,50],[78,48]],

  // ── JAPAN ─────────────────────────────────────────────────────────
  [[130,32],[132,34],[134,36],[136,36],[138,38],[140,40],[142,42],
   [142,44],[140,44],[138,42],[136,36],[134,34],[130,32]],
  // Hokkaido
  [[140,42],[144,44],[146,44],[144,42],[140,42]],

  // ── BORNEO ────────────────────────────────────────────────────────
  [[108,2],[116,4],[118,6],[118,2],[116,0],[112,-2],[108,0],[108,2]],
  // Sumatra
  [[96,4],[100,2],[104,-2],[106,-6],[104,-4],[100,-2],[96,2],[96,4]],
  // Java
  [[106,-6],[112,-6],[114,-8],[106,-8],[106,-6]],
  // Philippines
  [[118,18],[122,18],[122,14],[120,10],[118,8],[116,10],[118,14],[118,18]],

  // ── AUSTRALIA ─────────────────────────────────────────────────────
  [[114,-22],[118,-20],[122,-18],[126,-14],[130,-12],[134,-12],
   [136,-12],[138,-14],[140,-16],[142,-18],[144,-18],[148,-18],
   [150,-22],[152,-24],[154,-26],[154,-28],[152,-32],[150,-36],
   [148,-38],[144,-38],[140,-36],[136,-34],[132,-32],[128,-34],
   [124,-34],[120,-34],[116,-32],[114,-28],[114,-22]],
  // Tasmania
  [[144,-40],[148,-40],[148,-44],[144,-44],[144,-40]],
  // New Zealand North
  [[172,-36],[178,-38],[178,-42],[174,-42],[172,-40],[172,-36]],
  // New Zealand South
  [[168,-44],[172,-44],[174,-46],[172,-48],[168,-46],[168,-44]],
];;



// Transaction types: BTC, ETH, wire, cash, USDT
const TX_TYPES = ["BTC","ETH","WIRE","CASH","USDT"];
const TX_COLORS = { BTC:"#f7931a", ETH:"#627eea", WIRE:"#6496c8", CASH:"#00e87a", USDT:"#26a17b" };

function buildEarthTexture() {
  const W = 2048, H = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Dark ocean matching site bg (#02040a to #060c1a)
  const ocean = ctx.createLinearGradient(0, 0, 0, H);
  ocean.addColorStop(0,   "#020610");
  ocean.addColorStop(0.3, "#030a18");
  ocean.addColorStop(0.5, "#04102a");
  ocean.addColorStop(0.7, "#030a18");
  ocean.addColorStop(1,   "#020610");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, W, H);

  // Subtle deep ocean shimmer
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * W, y = Math.random() * H;
    const g = ctx.createRadialGradient(x, y, 0, x, y, 80 + Math.random() * 100);
    g.addColorStop(0, "rgba(40,80,140,0.06)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  const px = (lon, lat) => [((lon+180)/360)*W, ((90-lat)/180)*H];

  LAND_POLYS.forEach((poly) => {
    ctx.beginPath();
    poly.forEach(([lon, lat], i) => {
      const [x, y] = px(lon, lat);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();

    const avgLat = poly.reduce((s, [,lat]) => s + lat, 0) / poly.length;
    // Dark theme land: steel-blue tinted dark greys matching site palette
    let base, hi;
    if (Math.abs(avgLat) > 60) { base="#1a2535"; hi="#222f42"; }
    else if (Math.abs(avgLat) > 35) { base="#152030"; hi="#1c2c40"; }
    else { base="#162535"; hi="#1e3048"; }

    const b = poly.reduce((b,[lon,lat])=>({
      minX:Math.min(b.minX,((lon+180)/360)*W), maxX:Math.max(b.maxX,((lon+180)/360)*W),
      minY:Math.min(b.minY,((90-lat)/180)*H),  maxY:Math.max(b.maxY,((90-lat)/180)*H),
    }),{minX:W,maxX:0,minY:H,maxY:0});

    const lg = ctx.createLinearGradient(b.minX, b.minY, b.maxX, b.maxY);
    lg.addColorStop(0, base); lg.addColorStop(0.5, hi); lg.addColorStop(1, base);
    ctx.fillStyle = lg; ctx.fill();

    // Coastal glow — steel blue accent
    ctx.strokeStyle = "rgba(100,150,195,0.3)";
    ctx.lineWidth = 1.2; ctx.stroke();
  });

  // Polar ice (dark tint)
  const ice = (yC, h) => {
    const g = ctx.createLinearGradient(0, yC-h, 0, yC+h);
    g.addColorStop(0, "rgba(160,185,220,0.6)");
    g.addColorStop(0.4, "rgba(120,150,190,0.3)");
    g.addColorStop(1, "rgba(80,110,160,0)");
    ctx.fillStyle = g; ctx.fillRect(0, yC-h, W, h*2);
  };
  ice(0, 50); ice(H, 65);

  // Grid lines — site accent colour
  ctx.strokeStyle = "rgba(100,150,195,0.12)";
  ctx.lineWidth = 0.7;
  for (let lat = -75; lat <= 75; lat += 15) {
    const [,y] = px(0, lat);
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
  }
  for (let lon = -165; lon <= 180; lon += 15) {
    ctx.beginPath();
    for (let lat = -90; lat <= 90; lat += 3) {
      const [x,y] = px(lon, lat);
      lat === -90 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.stroke();
  }

  return canvas;
}

// Draw a mini crypto/transaction icon onto a canvas and return as texture
function makeIconTexture(THREE, type) {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = s; c.height = s;
  const ctx = c.getContext("2d");
  const col = TX_COLORS[type];

  // Glow circle bg
  const g = ctx.createRadialGradient(s/2,s/2,0, s/2,s/2,s/2);
  g.addColorStop(0, col+"55"); g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g; ctx.fillRect(0,0,s,s);

  ctx.fillStyle = col;
  ctx.font = `bold ${s*0.38}px Arial`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  const labels = { BTC:"₿", ETH:"Ξ", WIRE:"⇄", CASH:"$", USDT:"₮" };
  ctx.fillText(labels[type] || "$", s/2, s/2);

  return new THREE.CanvasTexture(c);
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
      const camera = new THREE.PerspectiveCamera(40, W/H, 0.1, 100);
      camera.position.set(0, 0, 4.0);
      const R = 1.5;

      // Earth
      const earthTex = new THREE.CanvasTexture(buildEarthTexture());
      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(R, 64, 64),
        new THREE.MeshPhongMaterial({ map: earthTex, specular: new THREE.Color(0x1a3a6a), shininess: 30 })
      );
      scene.add(globe);

      // Atmosphere — dark blue halo
      scene.add(new THREE.Mesh(
        new THREE.SphereGeometry(R*1.10, 32, 32),
        new THREE.MeshBasicMaterial({ color:0x0a2060, transparent:true, opacity:0.10, side:THREE.BackSide })
      ));
      // Rim glow matching site accent
      scene.add(new THREE.Mesh(
        new THREE.SphereGeometry(R*1.04, 32, 32),
        new THREE.MeshBasicMaterial({ color:0x3a6090, transparent:true, opacity:0.05, side:THREE.FrontSide })
      ));

      // Hub cities
      const CITIES = [
        [40.71,-74.01],[51.51,-0.13],[35.69,139.69],[1.35,103.82],
        [22.32,114.17],[48.85,2.35],[25.20,55.27],[-33.87,151.21],
        [19.08,72.88],[55.75,37.62],[31.23,121.47],[-23.55,-46.63],
        [-1.29,36.82],[43.65,-79.38],[47.38,8.54],[37.57,126.98],
      ];

      const ll2v = (lat, lon, r) => {
        const phi = (90-lat)*(Math.PI/180), th = (lon+180)*(Math.PI/180);
        return new THREE.Vector3(-r*Math.sin(phi)*Math.cos(th), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(th));
      };

      // City pulse dots (small, site-green)
      const cityObjs = CITIES.map(([lat,lon], i) => {
        const pos = ll2v(lat, lon, R*1.013);
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.02, 8, 8),
          new THREE.MeshBasicMaterial({ color:0x6496c8, transparent:true, opacity:0.9 })
        );
        dot.position.copy(pos);
        const rg = new THREE.RingGeometry(0.028, 0.044, 18);
        const ring = new THREE.Mesh(rg, new THREE.MeshBasicMaterial({ color:0x6496c8, transparent:true, opacity:0.5, side:THREE.DoubleSide }));
        ring.position.copy(pos); ring.lookAt(new THREE.Vector3(0,0,0));
        scene.add(dot); scene.add(ring);
        return { pos, dot, ring, phase:(i/CITIES.length)*Math.PI*2 };
      });

      // Arc definitions with transaction types
      const ARC_DEFS = [
        [0,1,"BTC",0.0035],[1,2,"ETH",0.003],[0,11,"BTC",0.004],
        [3,4,"WIRE",0.0045],[6,3,"USDT",0.003],[2,7,"ETH",0.0035],
        [0,10,"CASH",0.003],[1,6,"WIRE",0.004],[8,3,"USDT",0.0035],
        [15,2,"BTC",0.003],[12,1,"CASH",0.004],[9,0,"WIRE",0.003],
        [4,7,"ETH",0.0045],[13,0,"BTC",0.004],[14,1,"USDT",0.003],
        [11,12,"CASH",0.003],[5,14,"WIRE",0.004],[0,5,"ETH",0.003],
      ];

      // Pre-build icon textures
      const iconTextures = {};
      TX_TYPES.forEach(t => { iconTextures[t] = makeIconTexture(THREE, t); });

      const buildArc = (iA, iB) => {
        const vA = ll2v(CITIES[iA][0], CITIES[iA][1], R*1.01);
        const vB = ll2v(CITIES[iB][0], CITIES[iB][1], R*1.01);
        const mid = vA.clone().add(vB).multiplyScalar(0.5);
        mid.normalize().multiplyScalar(R + vA.distanceTo(vB)*0.55 + 0.1);
        return Array.from({length:81},(_,k)=>{
          const t=k/80;
          return new THREE.Vector3()
            .addScaledVector(vA,(1-t)*(1-t)).addScaledVector(mid,2*t*(1-t)).addScaledVector(vB,t*t);
        });
      };

      const arcs = ARC_DEFS.map(([a,b,type,speed],i) => {
        const pts = buildArc(a, b);
        const col = new THREE.Color(TX_COLORS[type]);
        const lm = new THREE.LineBasicMaterial({ color:col, transparent:true, opacity:0 });
        const lg = new THREE.BufferGeometry().setFromPoints(pts.slice(0,2));
        const line = new THREE.Line(lg, lm);
        scene.add(line);

        // Icon sprite on the head
        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({ map:iconTextures[type], transparent:true, opacity:0, sizeAttenuation:true })
        );
        sprite.scale.set(0.18, 0.18, 1);
        scene.add(sprite);

        // Particle trail
        const trail = Array.from({length:6},(_,j)=>{
          const tm = new THREE.MeshBasicMaterial({ color:col, transparent:true, opacity:0 });
          const td = new THREE.Mesh(new THREE.SphereGeometry(0.01*(1-j/6),4,4), tm);
          scene.add(td);
          return {mesh:td, mat:tm};
        });

        return { pts, line, lineGeo:lg, lineMat:lm, sprite, spriteMat:sprite.material, trail, progress:-(i*0.11)%1, speed, type };
      });

      // Stars
      const sp = new Float32Array(1200*3);
      for(let i=0;i<1200*3;i++) sp[i]=(Math.random()-0.5)*20;
      const sg = new THREE.BufferGeometry();
      sg.setAttribute("position", new THREE.BufferAttribute(sp,3));
      scene.add(new THREE.Points(sg, new THREE.PointsMaterial({color:0x4466aa,size:0.012,transparent:true,opacity:0.35})));

      // Lighting — darker, cooler, matching site
      scene.add(new THREE.AmbientLight(0x1a2a44, 1.2));
      const sun = new THREE.DirectionalLight(0x6080b0, 2.5);
      sun.position.set(5,3,4); scene.add(sun);
      const fill = new THREE.PointLight(0x001830, 0.6, 20);
      fill.position.set(-5,-3,-3); scene.add(fill);
      // Accent light — site steel blue
      const accent = new THREE.PointLight(0x6496c8, 0.4, 10);
      accent.position.set(0,3,-2); scene.add(accent);

      // Mouse drag
      let isDragging=false, prevMX=0, prevMY=0, velX=0, velY=0;
      const onDown = (e) => { isDragging=true; prevMX=e.clientX; prevMY=e.clientY; velX=0; velY=0; el.style.cursor="grabbing"; };
      const onMove = (e) => {
        if(!isDragging) return;
        const dx=e.clientX-prevMX, dy=e.clientY-prevMY;
        velX=dx*0.005; velY=dy*0.005;
        globe.rotation.y+=velX; globe.rotation.x+=velY;
        globe.rotation.x=Math.max(-Math.PI/2,Math.min(Math.PI/2,globe.rotation.x));
        prevMX=e.clientX; prevMY=e.clientY;
      };
      const onUp = () => { isDragging=false; el.style.cursor="grab"; };
      const onTStart = (e) => { isDragging=true; prevMX=e.touches[0].clientX; prevMY=e.touches[0].clientY; velX=0; velY=0; };
      const onTMove = (e) => {
        if(!isDragging) return;
        const dx=e.touches[0].clientX-prevMX, dy=e.touches[0].clientY-prevMY;
        velX=dx*0.005; velY=dy*0.005;
        globe.rotation.y+=velX; globe.rotation.x+=velY;
        globe.rotation.x=Math.max(-Math.PI/2,Math.min(Math.PI/2,globe.rotation.x));
        prevMX=e.touches[0].clientX; prevMY=e.touches[0].clientY;
      };
      const onTEnd = () => { isDragging=false; };
      el.style.cursor="grab";
      el.addEventListener("mousedown",onDown);
      window.addEventListener("mousemove",onMove);
      window.addEventListener("mouseup",onUp);
      el.addEventListener("touchstart",onTStart,{passive:true});
      window.addEventListener("touchmove",onTMove,{passive:true});
      window.addEventListener("touchend",onTEnd);

      const onResize = () => {
        camera.aspect=el.offsetWidth/el.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(el.offsetWidth,el.offsetHeight);
      };
      window.addEventListener("resize",onResize);

      let t=0;
      const animate = () => {
        raf=requestAnimationFrame(animate);
        t+=0.005;

        if(!isDragging){
          velX*=0.95; velY*=0.95;
          globe.rotation.y+=velX; globe.rotation.x+=velY;
          if(Math.abs(velX)<0.0003) globe.rotation.y+=0.0007;
        }
        globe.rotation.x=Math.max(-Math.PI/2,Math.min(Math.PI/2,globe.rotation.x));

        // City pulses follow globe
        cityObjs.forEach(({pos,dot,ring,phase})=>{
          const rp = pos.clone().applyEuler(globe.rotation);
          dot.position.copy(rp); ring.position.copy(rp); ring.lookAt(new THREE.Vector3(0,0,0));
          const p = Math.abs(Math.sin(t*2.5+phase));
          ring.scale.setScalar(1+0.7*p); ring.material.opacity=0.1+0.4*p;
        });

        // Arc animations
        arcs.forEach((arc)=>{
          arc.progress+=arc.speed;
          if(arc.progress>1.25) arc.progress=-0.05;
          const p=Math.max(0,Math.min(1,arc.progress));
          const N=arc.pts.length;
          const visN=Math.floor(p*N);
          const rPts=arc.pts.map(pt=>pt.clone().applyEuler(globe.rotation));

          if(visN>=2){
            arc.lineGeo.setFromPoints(rPts.slice(0,visN));
            const fi=p<0.08?p/0.08:1, fo=p>0.88?(1-p)/0.12:1;
            arc.lineMat.opacity=0.75*fi*fo;
          } else { arc.lineMat.opacity=0; }

          if(p>0.01&&p<0.99){
            const hi=Math.min(Math.floor(p*N),N-1);
            arc.sprite.position.copy(rPts[hi]);
            arc.spriteMat.opacity=arc.lineMat.opacity>0?1:0;
          } else { arc.spriteMat.opacity=0; }

          arc.trail.forEach(({mesh,mat},j)=>{
            const tp=p-(j+1)*0.02;
            if(tp>0&&tp<1&&arc.lineMat.opacity>0){
              mesh.position.copy(rPts[Math.min(Math.floor(tp*N),N-1)]);
              mat.opacity=(1-j/arc.trail.length)*0.6;
            } else { mat.opacity=0; }
          });
        });

        renderer.render(scene,camera);
      };
      animate();
      setReady(true);

      cleanupFn=()=>{
        el.removeEventListener("mousedown",onDown);
        window.removeEventListener("mousemove",onMove);
        window.removeEventListener("mouseup",onUp);
        el.removeEventListener("touchstart",onTStart);
        window.removeEventListener("touchmove",onTMove);
        window.removeEventListener("touchend",onTEnd);
        window.removeEventListener("resize",onResize);
        cancelAnimationFrame(raf);
        renderer.dispose();
        if(el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      };
    };

    init();
    return ()=>{ if(cleanupFn) cleanupFn(); };
  }, []);

  return (
    <div ref={mountRef} className="hero-globe-wrap" style={{
      position:"absolute", right:"2%", top:"50%", transform:"translateY(-50%)",
      width:"min(44vw, 560px)", height:"min(44vw, 560px)", zIndex:3,
      opacity: ready?1:0, transition:"opacity 1.2s ease 0.5s",
    }}/>
  );
}

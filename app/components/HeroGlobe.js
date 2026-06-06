"use client";
import { useRef, useEffect, useState } from "react";

const LAND_POLYS = [
  // North America — detailed west coast, Gulf, eastern seaboard
  [[-168,72],[-155,71],[-140,70],[-130,68],[-120,74],[-100,76],[-85,75],[-70,68],[-60,62],[-55,52],[-60,47],[-65,44],[-67,45],[-70,42],[-73,40],[-75,35],[-77,34],[-80,32],[-81,25],[-83,22],[-87,15],[-85,10],[-80,8],[-78,8],[-83,9],[-84,11],[-87,15],[-90,18],[-93,20],[-97,19],[-105,20],[-108,22],[-110,23],[-115,28],[-117,28],[-120,34],[-122,37],[-124,40],[-124,46],[-125,49],[-128,52],[-132,56],[-140,60],[-148,62],[-155,60],[-160,59],[-165,62],[-168,66],[-168,72]],
  // Greenland
  [[-44,84],[-25,84],[-18,77],[-20,72],[-25,68],[-32,66],[-38,66],[-44,68],[-50,72],[-54,76],[-52,80],[-44,84]],
  // South America — Amazon bulge, Andes spine, Patagonia taper
  [[-80,12],[-76,10],[-72,12],[-65,11],[-60,8],[-52,4],[-50,3],[-44,2],[-36,-4],[-34,-8],[-35,-12],[-37,-15],[-39,-18],[-41,-22],[-43,-23],[-47,-28],[-49,-30],[-52,-33],[-57,-38],[-62,-46],[-65,-55],[-68,-55],[-72,-50],[-75,-45],[-73,-40],[-68,-38],[-65,-35],[-60,-30],[-58,-24],[-58,-20],[-60,-15],[-63,-10],[-68,-5],[-72,0],[-76,2],[-78,5],[-80,8],[-80,12]],
  // Europe — Iberia, France, Italy boot, Balkans, Scandinavia base
  [[28,72],[18,70],[8,62],[5,58],[2,51],[0,48],[2,44],[3,43],[5,43],[8,44],[10,44],[12,46],[14,46],[16,46],[18,44],[20,44],[22,40],[26,40],[28,41],[32,42],[36,42],[38,40],[36,36],[28,36],[24,38],[22,40],[18,44],[14,46],[12,44],[10,44],[8,44],[5,43],[3,43],[0,44],[0,48],[2,50],[2,51],[5,58],[8,56],[10,58],[12,60],[14,64],[16,68],[20,70],[24,68],[28,70],[28,72]],
  // UK
  [[-5,50],[2,51],[2,53],[0,58],[-4,58],[-5,56],[-3,54],[-5,52],[-5,50]],
  // Ireland
  [[-10,52],[-6,52],[-6,55],[-10,54],[-10,52]],
  // Iceland
  [[-24,64],[-13,64],[-12,65],[-14,66],[-18,66],[-24,65],[-24,64]],
  // Africa — Horn, Cape, West bulge, Nile delta
  [[-18,16],[-15,20],[-18,24],[-12,28],[-8,33],[0,37],[10,37],[14,36],[20,36],[28,32],[34,28],[38,22],[42,14],[44,11],[48,12],[50,14],[44,16],[42,20],[40,24],[38,28],[36,32],[34,18],[32,12],[28,6],[26,0],[22,-5],[18,-10],[14,-15],[12,-18],[18,-34],[26,-34],[32,-30],[38,-16],[40,-10],[42,0],[44,10],[42,14],[38,22],[34,28],[28,32],[20,36],[14,36],[10,37],[0,37],[-8,33],[-12,28],[-16,24],[-18,18],[-18,16]],
  // Madagascar
  [[44,-12],[50,-13],[50,-25],[44,-25],[44,-12]],
  // Asia — from Turkey through Arabia, India, SE Asia, China, Siberia
  [[28,42],[32,42],[36,42],[38,40],[40,38],[44,36],[46,34],[48,32],[50,30],[54,26],[58,22],[60,20],[62,22],[68,22],[72,22],[78,8],[80,10],[82,14],[80,20],[78,26],[76,30],[72,34],[68,36],[64,38],[62,38],[60,38],[58,40],[54,42],[50,44],[46,42],[44,40],[40,38],[38,40],[36,44],[32,48],[28,52],[24,48],[20,46],[22,42],[26,40],[28,42]],
  // Indian subcontinent detail
  [[62,22],[68,22],[72,24],[76,20],[78,8],[80,10],[82,14],[80,20],[78,26],[76,30],[72,34],[68,36],[64,38],[62,34],[60,28],[62,22]],
  // SE Asia / Indochina
  [[98,28],[100,22],[102,18],[104,14],[104,10],[100,4],[104,2],[108,2],[112,2],[116,4],[120,6],[118,12],[116,18],[110,20],[108,22],[104,22],[100,16],[98,20],[98,28]],
  // China / Korea / Japan area
  [[80,48],[88,50],[95,52],[100,54],[110,54],[120,52],[128,52],[132,48],[138,40],[140,38],[140,40],[142,44],[140,44],[138,42],[136,36],[134,32],[130,32],[132,34],[134,36],[136,36],[138,38],[140,40],[142,42],[142,44],[140,46],[138,48],[134,50],[128,52],[120,52],[110,54],[100,54],[95,52],[88,50],[80,48]],
  // Japan main islands
  [[130,32],[132,34],[134,36],[136,36],[138,38],[140,40],[142,42],[140,44],[136,36],[134,34],[130,32]],
  // Borneo
  [[108,2],[116,4],[118,6],[118,2],[116,0],[112,-2],[108,0],[108,2]],
  // Sumatra
  [[96,4],[100,2],[104,-2],[106,-6],[104,-4],[100,-2],[96,2],[96,4]],
  // Australia — detailed coastline
  [[114,-22],[118,-20],[122,-18],[126,-14],[130,-12],[136,-12],[138,-14],[140,-18],[142,-18],[146,-18],[150,-24],[152,-26],[154,-28],[152,-32],[150,-38],[148,-38],[144,-38],[140,-36],[136,-34],[130,-32],[126,-34],[122,-34],[118,-34],[116,-32],[114,-28],[114,-22]],
  // New Zealand North
  [[172,-36],[178,-38],[178,-42],[174,-42],[172,-40],[172,-36]],
  // New Zealand South
  [[168,-44],[172,-44],[174,-46],[172,-48],[168,-46],[168,-44]],
  // Sri Lanka
  [[80,10],[82,8],[82,6],[80,6],[80,8],[80,10]],
];


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

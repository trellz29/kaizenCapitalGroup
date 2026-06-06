"use client";
import { useEffect, useRef, useState } from "react";

function useInView(t = 0.15) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: t });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return [ref, v];
}

const S = `
@keyframes kcgF1{0%,100%{transform:perspective(1100px) rotateY(-18deg) rotateX(6deg) translateY(0px)}50%{transform:perspective(1100px) rotateY(-18deg) rotateX(6deg) translateY(-22px)}}
@keyframes kcgF2{0%,100%{transform:perspective(1100px) rotateY(16deg) rotateX(5deg) translateY(0px)}50%{transform:perspective(1100px) rotateY(16deg) rotateX(5deg) translateY(-18px)}}
@keyframes kcgF3{0%,100%{transform:perspective(1100px) rotateY(-12deg) rotateX(8deg) translateY(0px)}50%{transform:perspective(1100px) rotateY(-12deg) rotateX(8deg) translateY(-20px)}}
@keyframes kcgFL{0%,100%{transform:perspective(900px) rotateX(12deg) rotateY(-6deg) translateY(0px)}50%{transform:perspective(900px) rotateX(12deg) rotateY(-6deg) translateY(-16px)}}
@keyframes kcgGlow{0%,100%{opacity:0.45}50%{opacity:0.85}}
@keyframes kcgTick{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes kcgPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.8)}}
@keyframes kcgBlink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes kcgBar{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes kcgFadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.kcg-scene{background:#050d18;padding:88px 40px;display:flex;align-items:center;justify-content:center;gap:72px;flex-wrap:wrap;position:relative;overflow:hidden}
.kcg-scene::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 55% 45% at 58% 50%,rgba(34,158,217,0.07) 0%,transparent 68%);pointer-events:none}
.kcg-phone{width:196px;height:392px;background:linear-gradient(155deg,#1c2d40 0%,#0c1725 100%);border-radius:32px;border:1.5px solid rgba(255,255,255,0.11);overflow:hidden;position:relative}
.kcg-phone::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.055) 0%,transparent 50%);border-radius:32px;pointer-events:none;z-index:10}
.kcg-laptop{width:320px;height:200px;background:linear-gradient(150deg,#1a2a3a 0%,#0c1825 100%);border-radius:12px 12px 0 0;border:1.5px solid rgba(255,255,255,0.1);overflow:hidden;position:relative}
.kcg-laptop::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.045) 0%,transparent 45%);pointer-events:none;z-index:5}
.kcg-base{width:360px;height:12px;background:linear-gradient(180deg,#1a2a3a,#111e2a);border-radius:0 0 10px 10px;border:1.5px solid rgba(255,255,255,0.08);border-top:none;margin:0 auto}
.kcg-notch{width:58px;height:6px;background:#0c1725;border-radius:0 0 8px 8px;position:absolute;top:0;left:50%;transform:translateX(-50%);z-index:11}
.kcg-wrap{transform-style:preserve-3d}
`;

function Glow({ color = "rgba(34,158,217,0.14)", size = 340, top = "50%", left = "55%" }) {
  return <div style={{ position:"absolute", width:size, height:size, borderRadius:"50%", background:`radial-gradient(circle,${color} 0%,transparent 68%)`, top, left, transform:"translate(-50%,-50%)", animation:"kcgGlow 5s ease-in-out infinite", pointerEvents:"none" }} />;
}

function Phone({ children, anim = "kcgF1" }) {
  return (
    <div className="kcg-wrap" style={{ animation:`${anim} 5.5s ease-in-out infinite`, filter:"drop-shadow(0 44px 64px rgba(0,0,0,0.72)) drop-shadow(0 0 44px rgba(34,158,217,0.22))" }}>
      <div className="kcg-phone">
        <div className="kcg-notch" />
        {children}
      </div>
    </div>
  );
}

function Laptop({ children, anim = "kcgFL" }) {
  return (
    <div className="kcg-wrap" style={{ animation:`${anim} 6s ease-in-out infinite`, filter:"drop-shadow(0 36px 56px rgba(0,0,0,0.68)) drop-shadow(0 0 36px rgba(34,158,217,0.18))" }}>
      <div className="kcg-laptop">{children}</div>
      <div className="kcg-base" />
    </div>
  );
}

function Scene({ children, glowLeft = "58%" }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className="kcg-scene">
      <style>{S}</style>
      <Glow left={glowLeft} />
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:72, flexWrap:"wrap", maxWidth:1120, width:"100%", opacity:1, transform:inView?"none":"translateY(36px)", transition:"transform 0.9s ease" }}>
        {children}
      </div>
    </div>
  );
}

function Copy({ label, title, body }) {
  return (
    <div style={{ maxWidth:268 }}>
      {label && <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#3a6070", margin:"0 0 14px", fontFamily:"sans-serif" }}>{label}</p>}
      <h3 style={{ fontSize:28, fontWeight:700, color:"#fff", lineHeight:1.25, margin:"0 0 12px", fontFamily:"sans-serif" }}>{title}</h3>
      <p style={{ fontSize:14, color:"#7a99b0", lineHeight:1.75, margin:0, fontFamily:"sans-serif" }}>{body}</p>
    </div>
  );
}

const pStyle = { padding:"22px 12px 12px", height:"100%", boxSizing:"border-box", overflowY:"hidden" };
const rowStyle = (sel) => ({ background:sel?"rgba(34,158,217,0.12)":"rgba(255,255,255,0.045)", border:`1px solid ${sel?"rgba(34,158,217,0.35)":"rgba(255,255,255,0.07)"}`, borderRadius:10, padding:"8px 10px", marginBottom:7, display:"flex", justifyContent:"space-between", alignItems:"center" });
const fn = { fontSize:10, fontWeight:700, color:"#fff", fontFamily:"sans-serif" };
const fs = { fontSize:8, color:"#5a7a8a", fontFamily:"sans-serif" };
const fr = (c) => ({ fontSize:12, fontWeight:700, color:c, fontFamily:"sans-serif", textAlign:"right" });
const badge = { fontSize:7, background:"rgba(34,197,94,0.14)", color:"#22c55e", padding:"2px 6px", borderRadius:20, fontWeight:600, fontFamily:"sans-serif" };
const dot = { width:7, height:7, borderRadius:"50%", background:"#22c55e", display:"inline-block", animation:"kcgPulse 1.5s ease infinite", marginRight:4, verticalAlign:"middle" };
const ticker = (items) => (
  <div style={{ overflow:"hidden", borderTop:"1px solid rgba(255,255,255,0.055)", paddingTop:7, marginTop:7 }}>
    <div style={{ display:"flex", gap:22, animation:"kcgTick 9s linear infinite", width:"200%" }}>
      {[...items,...items].map((t,i) => <span key={i} style={{ fontSize:9, color:"#7a99b0", whiteSpace:"nowrap", fontFamily:"sans-serif" }}>{t}</span>)}
    </div>
  </div>
);
const macBar = <div style={{ background:"#07111e", padding:"7px 12px", display:"flex", gap:5, alignItems:"center" }}>{["#ff5f57","#febc2e","#28c840"].map(c=><div key={c} style={{ width:9, height:9, borderRadius:"50%", background:c }}/>)}</div>;

export function VisHome() {
  const funds=[["Fund 1","Alpha Scalper","MultiBank","+4.2%"],["Fund 3","Swarm","TradeStation","+7.8%"],["Fund 5","Momentum","TMGM","+2.1%"],["Fund 7","Swarm","MultiBank","-0.4%"]];
  return (
    <Scene glowLeft="62%">
      <Phone anim="kcgF1">
        <div style={pStyle}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:14 }}>
            <div style={{ width:22, height:22, borderRadius:6, background:"#0f1a28", border:"1px solid rgba(255,255,255,0.14)", display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:7, fontWeight:900, color:"#fff", fontFamily:"sans-serif" }}>KCG</span></div>
            <span style={{ fontSize:9, fontWeight:600, color:"rgba(255,255,255,0.35)", letterSpacing:".1em", fontFamily:"sans-serif" }}>PORTFOLIO</span>
          </div>
          <div style={{ fontSize:9, color:"#5a7a8a", marginBottom:2, fontFamily:"sans-serif" }}>Total AUM</div>
          <div style={{ fontSize:24, fontWeight:700, color:"#fff", marginBottom:14, fontFamily:"sans-serif" }}>$2.4M</div>
          {funds.map(([n,s,b,r])=>(
            <div key={n} style={rowStyle(false)}>
              <div><div style={fn}>{n}</div><div style={fs}>{s} · {b}</div></div>
              <div><div style={badge}>LIVE</div><div style={fr(parseFloat(r)>=0?"#22c55e":"#ef4444")}>{r}</div></div>
            </div>
          ))}
          {ticker(["XAU/USD 3,248 +0.41%","BTC 63,140 -1.28%","EUR/USD 1.1062"])}
        </div>
      </Phone>
      <Copy label="KCG Fund Dashboard" title="13 active funds. One disciplined platform." body="Every KCG fund is tracked, reported, and managed with institutional precision — visible at a glance." />
    </Scene>
  );
}

export function VisOverview() {
  const bars=[38,62,50,75,58,84,70,92,65,80,72,88];
  return (
    <Scene glowLeft="38%">
      <Copy label="Portfolio Overview" title="Strategic positioning. Growth-first framework." body="Built to communicate premium identity across every touchpoint — for partners, capital, and clients." />
      <Laptop anim="kcgFL">
        <div style={{ padding:"12px 14px", position:"relative", zIndex:2 }}>
          <div style={{ fontSize:8, color:"#3a6070", marginBottom:9, letterSpacing:".1em", fontFamily:"sans-serif" }}>KCG PERFORMANCE — 12 MONTHS</div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:94 }}>
            {bars.map((h,i)=>(
              <div key={i} style={{ flex:1, background:`rgba(34,158,217,${0.22+h/300})`, borderRadius:"3px 3px 0 0", height:`${h}%`, animation:`kcgBar 0.9s ease ${i*0.07}s both`, transformOrigin:"bottom" }}/>
            ))}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
            {["Jan","Mar","May","Jul","Sep","Nov"].map(m=><span key={m} style={{ fontSize:7, color:"#3a6070", fontFamily:"sans-serif" }}>{m}</span>)}
          </div>
          <div style={{ display:"flex", gap:7, marginTop:10 }}>
            {[["AUM","$2.4M"],["Funds","12"],["Return","+4.8%"]].map(([l,v])=>(
              <div key={l} style={{ flex:1, background:"rgba(255,255,255,0.04)", borderRadius:6, padding:"6px 8px", border:"1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize:7, color:"#3a6070", fontFamily:"sans-serif" }}>{l}</div>
                <div style={{ fontSize:11, fontWeight:700, color:"#fff", fontFamily:"sans-serif" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </Laptop>
    </Scene>
  );
}

export function VisMarketData() {
  const candles=[{o:58,c:72,h:77,l:52},{o:72,c:67,h:75,l:62},{o:67,c:82,h:87,l:65},{o:82,c:76,h:85,l:72},{o:76,c:91,h:95,l:74},{o:91,c:84,h:97,l:82},{o:84,c:100,h:105,l:82},{o:100,c:94,h:104,l:91},{o:94,c:110,h:114,l:91},{o:110,c:104,h:114,l:101},{o:104,c:116,h:120,l:102}];
  const ticks=["XAU/USD  3,248.40  +13.20 (+0.41%)","EUR/USD  1.1062  +0.0012","BTC/USD  63,140  -820 (-1.28%)","DXY  104.2  -0.3","OIL/WTI  82.40  +0.60 (+0.73%)"];
  return (
    <Scene glowLeft="50%">
      <div style={{ width:"100%", maxWidth:660 }}>
        <Laptop anim="kcgF3">
          <div style={{ position:"relative", zIndex:2 }}>
            {macBar}
            <div style={{ padding:"12px 16px" }}>
              <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:10, color:"#fff", fontWeight:700, fontFamily:"sans-serif" }}>XAU/USD</span>
                <span style={{ fontSize:10, color:"#22c55e", fontFamily:"sans-serif" }}>3,248.40  +13.20 (+0.41%)</span>
              </div>
              <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:88 }}>
                {candles.map((c,i)=>{
                  const bull=c.c>c.o, col=bull?"#22c55e":"#ef4444", M=126;
                  const bH=Math.abs(c.c-c.o)/M*88, bY=(M-Math.max(c.o,c.c))/M*88;
                  const wH=(c.h-c.l)/M*88, wY=(M-c.h)/M*88;
                  return (
                    <div key={i} style={{ flex:1, position:"relative", height:88 }}>
                      <div style={{ position:"absolute", left:"50%", width:1, background:col, top:wY, height:wH, transform:"translateX(-50%)" }}/>
                      <div style={{ position:"absolute", left:"8%", right:"8%", background:col, top:bY, height:Math.max(bH,2), borderRadius:2 }}/>
                    </div>
                  );
                })}
              </div>
              <div style={{ overflow:"hidden", borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:7, marginTop:8 }}>
                <div style={{ display:"flex", gap:24, animation:"kcgTick 10s linear infinite", width:"200%" }}>
                  {[...ticks,...ticks].map((t,i)=><span key={i} style={{ fontSize:9, color:"#7a99b0", whiteSpace:"nowrap", fontFamily:"sans-serif" }}>{t}</span>)}
                </div>
              </div>
            </div>
          </div>
        </Laptop>
        <div style={{ marginTop:32 }}>
          <Copy label="Live Market Data" title="Real-time visibility on the instruments KCG watches most." body="Gold, EUR/USD, Bitcoin, DXY, and oil — updating live so the platform always feels active and institutional." />
        </div>
      </div>
    </Scene>
  );
}

export function VisFunds() {
  const cards=[["Fund 1","Alpha Scalper","+4.2%","MultiBank"],["Fund 3","Swarm","+7.8%","TradeStation"],["Fund 5","Momentum","+2.1%","TMGM"]];
  return (
    <Scene glowLeft="38%">
      <Phone anim="kcgF2">
        <div style={pStyle}>
          <div style={{ fontSize:9, color:"#3a6070", marginBottom:12, letterSpacing:".12em", fontFamily:"sans-serif" }}>KCG FUNDS</div>
          {cards.map(([n,s,r,b])=>(
            <div key={n} style={rowStyle(false)}>
              <div>
                <div style={fn}>{n}</div>
                <div style={fs}>{s} · {b}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={badge}>ACTIVE</div>
                <div style={fr("#22c55e")}>{r}</div>
              </div>
            </div>
          ))}
          {ticker(["Fund 1 XAU/USD +4.2%","Fund 3 Swarm +7.8%","Fund 5 Gold +2.1%"])}
        </div>
      </Phone>
      <Copy label="Active Funds" title="15 funds. Every strategy documented." body="From Gold scalping to algorithmic systems — each KCG fund has a clear strategy, defined brokerage, and active management." />
    </Scene>
  );
}

export function VisAISystems() {
  const lines=[
    {t:0,c:"#3a6070",text:"// KCG Algo Engine v2.4"},
    {t:280,c:"#9fb4c1",text:"> Scanning XAU/USD M15..."},
    {t:560,c:"#22c55e",text:"✓ Signal: BUY 3248.40"},
    {t:840,c:"#9fb4c1",text:"> SL: 3238.10  TP1: 3258.00"},
    {t:1120,c:"#22c55e",text:"✓ Order placed — Fund 5"},
    {t:1400,c:"#9fb4c1",text:"> Monitoring EUR/USD..."},
    {t:1680,c:"#f97316",text:"⚠ Volatility spike detected"},
    {t:1960,c:"#22c55e",text:"✓ Fund 3 TP1 hit +12 pips"},
    {t:2240,c:"#3a6070",text:"// Next scan: 00:04:32"},
  ];
  const [vis,setVis]=useState(0);
  useEffect(()=>{
    const ts=lines.map((l,i)=>setTimeout(()=>setVis(i+1),l.t+300));
    const lp=setInterval(()=>{setVis(0);setTimeout(()=>setVis(lines.length),80);},6500);
    return()=>{ts.forEach(clearTimeout);clearInterval(lp);};
  },[]);
  return (
    <Scene glowLeft="58%">
      <Copy label="Algorithmic Systems" title="Algo precision. Every entry calculated." body="KCG algorithmic systems scan, score, and execute — removing emotion from every trade decision." />
      <div className="kcg-wrap" style={{ animation:"kcgF1 5.5s ease-in-out infinite", filter:"drop-shadow(0 40px 60px rgba(0,0,0,0.7)) drop-shadow(0 0 36px rgba(34,158,217,0.2))" }}>
        <div style={{ background:"#060d18", borderRadius:14, border:"1px solid rgba(255,255,255,0.09)", width:300, overflow:"hidden", fontFamily:"monospace" }}>
          {macBar}
          <div style={{ padding:"12px 14px", minHeight:192 }}>
            {lines.slice(0,vis).map((l,i)=>(
              <div key={i} style={{ fontSize:11, color:l.c, marginBottom:4, animation:"kcgFadeUp 0.3s ease both" }}>{l.text}</div>
            ))}
            {vis<lines.length&&<span style={{ fontSize:11, color:"#22c55e", animation:"kcgBlink 1s step-end infinite" }}>█</span>}
          </div>
        </div>
      </div>
    </Scene>
  );
}

export function VisInvestorFunnel() {
  const steps=["Private Investor","Allocator / Larger Capital","Strategic Partner","General Inquiry"];
  return (
    <Scene glowLeft="38%">
      <Laptop anim="kcgFL">
        <div style={{ position:"relative", zIndex:2 }}>
          {macBar}
          <div style={{ padding:"10px 14px" }}>
            <div style={{ fontSize:8, color:"#3a6070", marginBottom:8, letterSpacing:".1em", fontFamily:"sans-serif" }}>INVESTOR PATHWAY SELECTOR</div>
            {steps.map((s,i)=>(
              <div key={s} style={{ background:i===0?"rgba(34,158,217,0.13)":"rgba(255,255,255,0.04)", border:`1px solid ${i===0?"rgba(34,158,217,0.38)":"rgba(255,255,255,0.06)"}`, borderRadius:6, padding:"7px 10px", marginBottom:5, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:10, color:i===0?"#fff":"#7a99b0", fontWeight:i===0?700:400, fontFamily:"sans-serif" }}>{s}</span>
                {i===0&&<span style={{ fontSize:8, color:"#229ED9", fontFamily:"sans-serif" }}>Selected ✓</span>}
              </div>
            ))}
            <div style={{ marginTop:8, background:"#229ED9", borderRadius:6, padding:"7px", textAlign:"center" }}>
              <span style={{ fontSize:10, color:"#fff", fontWeight:700, fontFamily:"sans-serif" }}>Continue →</span>
            </div>
          </div>
        </div>
      </Laptop>
      <Copy label="Investor Pathways" title="Four pathways. One structured entry." body="Whether you're a private investor or a strategic capital partner — KCG has a defined pathway built for your profile." />
    </Scene>
  );
}

export function VisActivity() {
  const trades=[["XAU/USD","BUY","+18","F1","09:42"],["EUR/USD","SELL","-4","F3","09:38"],["BTC/USD","BUY","+31","F7","09:31"],["XAU/USD","BUY","+12","F5","09:24"],["DXY","SELL","+9","F2","09:18"]];
  return (
    <Scene glowLeft="62%">
      <Phone anim="kcgF1">
        <div style={pStyle}>
          <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:12 }}>
            <span style={dot}/><span style={{ fontSize:9, color:"#9fb4c1", fontWeight:600, fontFamily:"sans-serif" }}>LIVE FEED</span>
          </div>
          {trades.map(([p,d,r,f,t],i)=>(
            <div key={i} style={rowStyle(false)}>
              <div><div style={fn}>{p}</div><div style={fs}>{f} · {t}</div></div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:8, color:d==="BUY"?"#22c55e":"#ef4444", fontWeight:700, fontFamily:"sans-serif" }}>{d}</div>
                <div style={fr(parseFloat(r)>0?"#22c55e":"#ef4444")}>{r}p</div>
              </div>
            </div>
          ))}
        </div>
      </Phone>
      <Copy label="Live Trading Activity" title="Real execution. Real results. No noise." body="Every KCG trade is logged, timestamped, and attributed to a fund — giving partners full execution visibility." />
    </Scene>
  );
}

export function VisWhyKCG() {
  const m=[["Active Funds","12","Across all strategies"],["Avg Monthly Return","+4.8%","Blended across funds"],["Brokerages","4","MultiBank, TMGM, TradeStation"],["Founded","2023","Institutional from day one"]];
  return (
    <Scene glowLeft="38%">
      <Copy label="Why KCG" title="Built for credibility. Verified by numbers." body="KCG is a fully documented, actively managed capital strategy platform — not just a brand." />
      <div className="kcg-wrap" style={{ animation:"kcgF2 5.5s ease-in-out infinite", filter:"drop-shadow(0 40px 60px rgba(0,0,0,0.7)) drop-shadow(0 0 36px rgba(34,158,217,0.2))" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, width:288 }}>
          {m.map(([l,v,s])=>(
            <div key={l} style={{ background:"linear-gradient(145deg,#1a2a3a,#0e1e2c)", borderRadius:12, padding:"16px 14px", border:"1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize:8, color:"#3a6070", marginBottom:4, textTransform:"uppercase", letterSpacing:".08em", fontFamily:"sans-serif" }}>{l}</div>
              <div style={{ fontSize:22, fontWeight:700, color:"#fff", marginBottom:3, fontFamily:"sans-serif" }}>{v}</div>
              <div style={{ fontSize:8, color:"#3a6070", fontFamily:"sans-serif" }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
}

export function VisCommunity() {
  const msgs=[
    {from:"KCG Analyst",text:"XAU/USD signal. BUY 3248 SL 3238 TP 3268.",time:"09:42",mine:false},
    {from:"Member",text:"Caught it! +18 pips already",time:"09:44",mine:true},
    {from:"KCG Analyst",text:"Fund 3 TP1 hit. SL to breakeven.",time:"09:51",mine:false},
    {from:"Member",text:"KCG never misses.",time:"09:52",mine:true},
  ];
  return (
    <Scene glowLeft="62%">
      <Phone anim="kcgF3">
        <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>
          <div style={{ background:"#172336", padding:"22px 10px 9px", display:"flex", alignItems:"center", gap:8, borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"#229ED9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>✈</div>
            <div>
              <div style={{ fontSize:9, fontWeight:700, color:"#fff", fontFamily:"sans-serif" }}>KCG Community</div>
              <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                <span style={dot}/><span style={{ fontSize:7, color:"#22c55e", fontFamily:"sans-serif" }}>Active Now</span>
              </div>
            </div>
          </div>
          <div style={{ flex:1, padding:"8px 9px", display:"flex", flexDirection:"column", gap:6 }}>
            {msgs.map((m,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:m.mine?"flex-end":"flex-start" }}>
                <div style={{ background:m.mine?"#229ED9":"rgba(255,255,255,0.07)", borderRadius:m.mine?"10px 10px 2px 10px":"10px 10px 10px 2px", padding:"7px 9px", maxWidth:"82%" }}>
                  {!m.mine&&<div style={{ fontSize:7, color:"#229ED9", fontWeight:700, marginBottom:2, fontFamily:"sans-serif" }}>{m.from}</div>}
                  <div style={{ fontSize:9, color:"#fff", lineHeight:1.45, fontFamily:"sans-serif" }}>{m.text}</div>
                  <div style={{ fontSize:7, color:m.mine?"rgba(255,255,255,0.5)":"#3a6070", marginTop:2, textAlign:"right", fontFamily:"sans-serif" }}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Phone>
      <Copy label="KCG Community" title="Live signals. Real community. Free access." body="Join thousands of traders getting KCG signals, fund updates, and market alerts — directly in Telegram and Discord." />
    </Scene>
  );
}

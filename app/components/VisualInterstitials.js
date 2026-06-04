"use client";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

const KCG_STYLE = `
@keyframes kcgFloat { 0%,100%{transform:translateY(0px) rotate(-8deg)}50%{transform:translateY(-18px) rotate(-8deg)} }
@keyframes kcgFloat2 { 0%,100%{transform:translateY(0px) rotate(6deg)}50%{transform:translateY(-14px) rotate(6deg)} }
@keyframes kcgPulse { 0%,100%{opacity:1}50%{opacity:0.3} }
@keyframes kcgTicker { 0%{transform:translateX(0)}100%{transform:translateX(-50%)} }
@keyframes kcgFadeIn { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
@keyframes kcgBlink { 0%,100%{opacity:1}50%{opacity:0} }
@keyframes kcgBarGrow { from{transform:scaleY(0)}to{transform:scaleY(1)} }
.kcg-phone{width:176px;height:356px;border-radius:28px;border:2px solid rgba(255,255,255,0.14);background:#0f1a28;position:relative;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,0.55)}
.kcg-notch{width:56px;height:5px;background:#1a2a3d;border-radius:0 0 6px 6px;position:absolute;top:0;left:50%;transform:translateX(-50%)}
.kcg-laptop{width:316px;height:196px;border-radius:10px 10px 0 0;border:2px solid rgba(255,255,255,0.14);background:#0f1a28;position:relative;overflow:hidden}
.kcg-base{width:356px;height:11px;background:#1a2a3d;border-radius:0 0 8px 8px;border:2px solid rgba(255,255,255,0.08);border-top:none;margin:0 auto}
`;

function Phone({ children, tilt = -8, anim = "kcgFloat" }) {
  return (
    <div style={{ animation: `\${anim} 4s ease-in-out infinite`, transform: `rotate(\${tilt}deg)` }}>
      <div className="kcg-phone"><div className="kcg-notch" />{children}</div>
    </div>
  );
}

function Laptop({ children }) {
  return (
    <div style={{ animation: "kcgFloat2 5s ease-in-out infinite" }}>
      <div className="kcg-laptop">{children}</div>
      <div className="kcg-base" />
    </div>
  );
}

function Wrap({ children, label }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ background: "#07111f", overflow: "hidden", padding: "80px 24px" }}>
      <style>{KCG_STYLE}</style>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 44,
        opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(28px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}>
        {label && <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#4a6275", margin: 0 }}>{label}</p>}
        {children}
      </div>
    </div>
  );
}

function Row({ children }) {
  return <div style={{ display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>{children}</div>;
}

function Blurb({ title, body }) {
  return (
    <div style={{ maxWidth: 272 }}>
      <h3 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.25 }}>{title}</h3>
      <p style={{ fontSize: 14, color: "#9fb4c1", lineHeight: 1.7, margin: 0 }}>{body}</p>
    </div>
  );
}

export function VisHome() {
  const funds = [["Fund 1","+4.2%"],["Fund 3","+7.8%"],["Fund 5","+2.1%"],["Fund 7","-0.4%"]];
  return (
    <Wrap label="KCG Fund Dashboard">
      <Row>
        <Phone tilt={-10}>
          <div style={{ padding: "24px 10px 10px", height: "100%" }}>
            <div style={{ fontSize: 8, color: "#4a6275", marginBottom: 4, letterSpacing: "0.12em" }}>PORTFOLIO</div>
            <div style={{ fontSize: 9, color: "#9fb4c1", marginBottom: 2 }}>Total AUM</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 14 }}>$2.4M</div>
            {funds.map(([n,r]) => (
              <div key={n} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px", marginBottom: 6,
                border: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: "#fff" }}>{n}</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: parseFloat(r) >= 0 ? "#22c55e" : "#ef4444" }}>{r}</span>
              </div>
            ))}
          </div>
        </Phone>
        <Blurb title="12 active funds. One disciplined platform." body="Every KCG fund is tracked, reported, and managed with institutional precision — visible at a glance." />
      </Row>
    </Wrap>
  );
}

export function VisOverview() {
  const bars = [40,65,52,78,60,88,72,95,68,82,74,90];
  return (
    <Wrap label="Portfolio Overview">
      <Row>
        <Blurb title="Strategic positioning. Growth-first framework." body="Built to communicate premium identity across every touchpoint — for partners, capital, and clients." />
        <Laptop>
          <div style={{ padding: "12px 14px" }}>
            <div style={{ fontSize: 8, color: "#4a6275", marginBottom: 8, letterSpacing: "0.1em" }}>KCG PERFORMANCE — 12M</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 96 }}>
              {bars.map((h,i) => (
                <div key={i} style={{ flex: 1, background: `rgba(34,158,217,\${0.25+h/280})`, borderRadius: "3px 3px 0 0",
                  height: `\${h}%`, animation: `kcgBarGrow 0.8s ease \${i*0.06}s both`, transformOrigin: "bottom" }} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              {["Jan","Mar","May","Jul","Sep","Nov"].map(m => <span key={m} style={{ fontSize: 7, color: "#4a6275" }}>{m}</span>)}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              {[["AUM","$2.4M"],["Funds","12"],["Avg Ret","+4.8%"]].map(([l,v]) => (
                <div key={l} style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "6px 8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 7, color: "#4a6275" }}>{l}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </Laptop>
      </Row>
    </Wrap>
  );
}

export function VisMarketData() {
  const candles = [{o:60,c:75,h:80,l:55},{o:75,c:70,h:78,l:65},{o:70,c:85,h:90,l:68},
    {o:85,c:80,h:88,l:75},{o:80,c:95,h:98,l:78},{o:95,c:88,h:100,l:85},
    {o:88,c:105,h:110,l:85},{o:105,c:98,h:108,l:95},{o:98,c:115,h:118,l:95},
    {o:115,c:108,h:118,l:105},{o:108,c:120,h:124,l:106}];
  const tickers = ["XAU/USD 3,248.40 +13.20 (+0.41%)","EUR/USD 1.1062 +0.0012","BTC/USD 63,140 -820 (-1.28%)","DXY 104.2 -0.3","OIL/WTI 82.40 +0.60 (+0.73%)"];
  return (
    <Wrap label="Live Market Data">
      <div style={{ width: "100%", maxWidth: 660 }}>
        <div style={{ background: "#0d1929", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div style={{ background: "#080f1c", padding: "8px 14px", display: "flex", gap: 5 }}>
            {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
            <span style={{ fontSize: 10, color: "#4a6275", marginLeft: 8 }}>XAU/USD — Gold Spot · Live</span>
          </div>
          <div style={{ padding: "14px 18px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 110, marginBottom: 8 }}>
              {candles.map((c,i) => {
                const bull = c.c > c.o, col = bull ? "#22c55e" : "#ef4444", M = 130;
                const bH = Math.abs(c.c-c.o)/M*110, bY = (M-Math.max(c.o,c.c))/M*110;
                const wH = (c.h-c.l)/M*110, wY = (M-c.h)/M*110;
                return (
                  <div key={i} style={{ flex:1, position:"relative", height:110 }}>
                    <div style={{ position:"absolute", left:"50%", width:1, background:col, top:wY, height:wH, transform:"translateX(-50%)" }} />
                    <div style={{ position:"absolute", left:"8%", right:"8%", background:col, top:bY, height:Math.max(bH,2), borderRadius:2 }} />
                  </div>
                );
              })}
            </div>
            <div style={{ overflow:"hidden", borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:8 }}>
              <div style={{ display:"flex", gap:28, animation:"kcgTicker 10s linear infinite", width:"200%" }}>
                {[...tickers,...tickers].map((t,i) => <span key={i} style={{ fontSize:10, color:"#9fb4c1", whiteSpace:"nowrap" }}>{t}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrap>
  );
}

export function VisFunds() {
  const cards = [["Fund 1","Alpha Scalper","+4.2%","MultiBank"],["Fund 3","Swarm","+7.8%","TradeStation"],["Fund 5","Momentum","+2.1%","TMGM"]];
  return (
    <Wrap label="Active Funds">
      <Row>
        <Phone tilt={8} anim="kcgFloat2">
          <div style={{ padding: "26px 10px 10px" }}>
            <div style={{ fontSize: 9, color: "#4a6275", marginBottom: 10, letterSpacing: "0.12em" }}>KCG FUNDS</div>
            {cards.map(([n,s,r,b]) => (
              <div key={n} style={{ background:"rgba(255,255,255,0.05)", borderRadius:10, padding:"10px", marginBottom:7, border:"1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:"#fff" }}>{n}</span>
                  <span style={{ fontSize:8, background:"rgba(34,197,94,0.14)", color:"#22c55e", padding:"1px 6px", borderRadius:20, fontWeight:600 }}>ACTIVE</span>
                </div>
                <div style={{ fontSize:8, color:"#9fb4c1", marginBottom:3 }}>{s} · {b}</div>
                <div style={{ fontSize:14, fontWeight:700, color:"#22c55e" }}>{r}</div>
              </div>
            ))}
          </div>
        </Phone>
        <Blurb title="15 funds. Every strategy documented." body="From Gold scalping to algorithmic systems — each KCG fund is built with a clear strategy, defined brokerage, and active management." />
      </Row>
    </Wrap>
  );
}

export function VisAISystems() {
  const lines = [
    {t:0,c:"#4a6275",text:"// KCG Algo Engine v2.4"},
    {t:300,c:"#9fb4c1",text:"> Scanning XAU/USD M15..."},
    {t:600,c:"#22c55e",text:"✓ Signal: BUY 3248.40"},
    {t:900,c:"#9fb4c1",text:"> SL: 3238.10  TP1: 3258.00"},
    {t:1200,c:"#22c55e",text:"✓ Order placed — Fund 5"},
    {t:1500,c:"#9fb4c1",text:"> Monitoring EUR/USD..."},
    {t:1800,c:"#f97316",text:"⚠ Volatility spike detected"},
    {t:2100,c:"#22c55e",text:"✓ Fund 3 TP1 hit +12 pips"},
    {t:2400,c:"#4a6275",text:"// Next scan: 00:04:32"},
  ];
  const [vis, setVis] = useState(0);
  useEffect(() => {
    let timers = lines.map((l,i) => setTimeout(() => setVis(i+1), l.t+400));
    let loop = setInterval(() => { setVis(0); setTimeout(() => setVis(lines.length), 100); }, 7000);
    return () => { timers.forEach(clearTimeout); clearInterval(loop); };
  }, []);
  return (
    <Wrap label="Algorithmic Systems">
      <Row>
        <Blurb title="Algo precision. Every entry calculated." body="KCG algorithmic systems scan, score, and execute — removing emotion from every trade decision." />
        <div style={{ background:"#050d18", borderRadius:12, border:"1px solid rgba(255,255,255,0.08)", width:308, fontFamily:"monospace", overflow:"hidden" }}>
          <div style={{ background:"#090f1e", padding:"8px 12px", display:"flex", gap:5, alignItems:"center" }}>
            {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width:10, height:10, borderRadius:"50%", background:c }} />)}
            <span style={{ fontSize:10, color:"#4a6275", marginLeft:6 }}>kcg-algo — zsh</span>
          </div>
          <div style={{ padding:"12px 14px", minHeight:200 }}>
            {lines.slice(0,vis).map((l,i) => (
              <div key={i} style={{ fontSize:11, color:l.c, marginBottom:4, animation:"kcgFadeIn 0.3s ease both" }}>{l.text}</div>
            ))}
            {vis < lines.length && <span style={{ fontSize:11, color:"#22c55e", animation:"kcgBlink 1s step-end infinite" }}>█</span>}
          </div>
        </div>
      </Row>
    </Wrap>
  );
}

export function VisInvestorFunnel() {
  const steps = ["Private Investor","Allocator / Larger Capital","Strategic Partner","General Inquiry"];
  return (
    <Wrap label="Investor Pathways">
      <Row>
        <Laptop>
          <div style={{ padding:"12px 14px" }}>
            <div style={{ fontSize:8, color:"#4a6275", marginBottom:8, letterSpacing:"0.1em" }}>INVESTOR PATHWAY SELECTOR</div>
            {steps.map((s,i) => (
              <div key={s} style={{ background:i===0?"rgba(34,158,217,0.14)":"rgba(255,255,255,0.04)",
                border:`1px solid \${i===0?"#229ED9":"rgba(255,255,255,0.06)"}`,
                borderRadius:6, padding:"7px 10px", marginBottom:5, display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:10, color:i===0?"#fff":"#9fb4c1", fontWeight:i===0?700:400 }}>{s}</span>
                {i===0 && <span style={{ fontSize:8, color:"#229ED9" }}>Selected ✓</span>}
              </div>
            ))}
            <div style={{ marginTop:8, background:"#229ED9", borderRadius:6, padding:"7px", textAlign:"center" }}>
              <span style={{ fontSize:10, color:"#fff", fontWeight:700 }}>Continue →</span>
            </div>
          </div>
        </Laptop>
        <Blurb title="Four pathways. One structured entry." body="Whether you're a private investor or a strategic capital partner — KCG has a defined pathway built for your profile." />
      </Row>
    </Wrap>
  );
}

export function VisActivity() {
  const trades = [["XAU/USD","BUY","+18","F1","09:42"],["EUR/USD","SELL","-4","F3","09:38"],["BTC/USD","BUY","+31","F7","09:31"],["XAU/USD","BUY","+12","F5","09:24"],["DXY","SELL","+9","F2","09:18"]];
  return (
    <Wrap label="Live Trading Activity">
      <Row>
        <Phone tilt={-6}>
          <div style={{ padding:"22px 10px 10px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:10 }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e", animation:"kcgPulse 1.5s ease infinite", display:"inline-block" }} />
              <span style={{ fontSize:9, color:"#9fb4c1", fontWeight:600 }}>LIVE FEED</span>
            </div>
            {trades.map(([p,d,r,f,t],i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.04)", borderRadius:8, padding:"7px 9px", marginBottom:5, border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:9, fontWeight:700, color:"#fff" }}>{p}</div>
                  <div style={{ fontSize:8, color:"#4a6275" }}>{f} · {t}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:8, color:d==="BUY"?"#22c55e":"#ef4444", fontWeight:700 }}>{d}</div>
                  <div style={{ fontSize:10, fontWeight:700, color:parseFloat(r)>0?"#22c55e":"#ef4444" }}>{r}p</div>
                </div>
              </div>
            ))}
          </div>
        </Phone>
        <Blurb title="Real execution. Real results. No noise." body="Every KCG trade is logged, timestamped, and attributed to a fund — giving partners full execution visibility." />
      </Row>
    </Wrap>
  );
}

export function VisWhyKCG() {
  const m = [["Active Funds","12","Across all strategies"],["Avg Monthly Return","+4.8%","Blended across funds"],["Brokerages","4","MultiBank, TMGM, TradeStation"],["Founded","2023","Institutional from day one"]];
  return (
    <Wrap label="Why KCG">
      <Row>
        <Blurb title="Built for credibility. Verified by numbers." body="KCG is a fully documented, actively managed capital strategy platform — not just a brand." />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, width:290 }}>
          {m.map(([l,v,s]) => (
            <div key={l} style={{ background:"#0f1a28", borderRadius:12, padding:"14px 12px", border:"1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize:8, color:"#4a6275", marginBottom:3, textTransform:"uppercase", letterSpacing:"0.08em" }}>{l}</div>
              <div style={{ fontSize:20, fontWeight:700, color:"#fff", marginBottom:2 }}>{v}</div>
              <div style={{ fontSize:8, color:"#4a6275" }}>{s}</div>
            </div>
          ))}
        </div>
      </Row>
    </Wrap>
  );
}

export function VisCommunity() {
  const msgs = [
    {from:"KCG Analyst",text:"XAU/USD signal. BUY 3248 SL 3238 TP 3268.",time:"09:42",mine:false},
    {from:"Member",text:"Caught it! +18 pips already",time:"09:44",mine:true},
    {from:"KCG Analyst",text:"Fund 3 TP1 hit. SL to breakeven.",time:"09:51",mine:false},
    {from:"Member",text:"KCG never misses.",time:"09:52",mine:true},
  ];
  return (
    <Wrap label="KCG Community">
      <Row>
        <Phone tilt={-8}>
          <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>
            <div style={{ background:"#1a2a3d", padding:"20px 10px 8px", display:"flex", alignItems:"center", gap:7, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ width:26, height:26, borderRadius:"50%", background:"#229ED9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12 }}>✈</div>
              <div>
                <div style={{ fontSize:9, fontWeight:700, color:"#fff" }}>KCG Community</div>
                <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                  <span style={{ width:5, height:5, borderRadius:"50%", background:"#22c55e", display:"inline-block" }} />
                  <span style={{ fontSize:7, color:"#22c55e" }}>Active Now</span>
                </div>
              </div>
            </div>
            <div style={{ flex:1, padding:"8px", display:"flex", flexDirection:"column", gap:5 }}>
              {msgs.map((m,i) => (
                <div key={i} style={{ display:"flex", justifyContent:m.mine?"flex-end":"flex-start" }}>
                  <div style={{ background:m.mine?"#229ED9":"rgba(255,255,255,0.07)", borderRadius:m.mine?"10px 10px 2px 10px":"10px 10px 10px 2px", padding:"6px 8px", maxWidth:"82%" }}>
                    {!m.mine && <div style={{ fontSize:7, color:"#229ED9", fontWeight:700, marginBottom:2 }}>{m.from}</div>}
                    <div style={{ fontSize:8, color:"#fff", lineHeight:1.4 }}>{m.text}</div>
                    <div style={{ fontSize:7, color:m.mine?"rgba(255,255,255,0.55)":"#4a6275", marginTop:2, textAlign:"right" }}>{m.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Phone>
        <Blurb title="Live signals. Real community. Free access." body="Join thousands of traders getting KCG signals, fund updates, and market alerts — directly in Telegram and Discord." />
      </Row>
    </Wrap>
  );
}

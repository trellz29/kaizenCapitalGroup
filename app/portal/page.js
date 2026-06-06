"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// ── DEMO DATA ────────────────────────────────────────────────────────────────
const DEMO_USER = { email: "cottrell@kaizencapitalgrp.com", password: "KCG2026", name: "Cottrell" };

const DEMO_DATA = {
  balance: 24850.00,
  profit: 2184.40,
  todayProfit: 0.92,
  totalWithdrawn: 0.00,
  fundName: "KaizenCapitalGroup.Xau-TMGM",
  fundReturn: "+9.4%",
  fundStatus: "LIVE",
  refCode: "KCG-INV-7291",
  refCount: 3,
  refEarnings: 245.00,
  transactions: [
    { id:1, type:"deposit",    amount:"+$10,000.00", date:"2024-11-01", status:"completed", note:"Initial capital" },
    { id:2, type:"deposit",    amount:"+$15,000.00", date:"2024-11-15", status:"completed", note:"Top-up" },
    { id:3, type:"profit",     amount:"+$1,102.20",  date:"2024-12-01", status:"completed", note:"Monthly return 9.4%" },
    { id:4, type:"profit",     amount:"+$1,082.20",  date:"2025-01-01", status:"completed", note:"Monthly return 9.2%" },
    { id:5, type:"withdrawal", amount:"-$2,500.00",  date:"2025-01-10", status:"pending",   note:"Withdrawal request" },
  ],
  months: ["Aug","Sep","Oct","Nov","Dec","Jan"],
  returns: [7.2, 8.1, 9.4, 11.2, 8.8, 9.4],
};

const TELEGRAM_CHANNELS = [
  { name:"KCG Main Channel",   desc:"Live signals & market updates", link:"https://t.me/KaizenCapitalGroup",  icon:"📡" },
  { name:"KCG Private Alerts", desc:"Priority fund alerts",          link:"https://t.me/KaizenCapitalGroup",  icon:"🔔" },
  { name:"Direct Support",     desc:"Message the team",              link:"https://t.me/trellz_P",            icon:"💬" },
];

// ── NAV ──────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id:"overview",     label:"Overview",     icon:"⬡" },
  { id:"trading",      label:"Trading",      icon:"📊" },
  { id:"wallet",       label:"Wallet",       icon:"💳" },
  { id:"education",    label:"Education",    icon:"🎓" },
  { id:"performance",  label:"Performance",  icon:"📈" },
  { id:"transactions", label:"Transactions", icon:"⇄" },
  { id:"withdraw",     label:"Withdraw",     icon:"↑" },
  { id:"referrals",    label:"Referrals",    icon:"👥" },
  { id:"telegram",     label:"Telegram",     icon:"✈" },
];

// ── STYLES ───────────────────────────────────────────────────────────────────
const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #02040a; color: #fff; font-family: sans-serif; }
  .portal-wrap { display: flex; min-height: 100vh; }

  /* Sidebar */
  .sidebar {
    width: 220px; flex-shrink: 0;
    background: #070d1c; border-right: 1px solid rgba(255,255,255,0.06);
    display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
    transition: transform 0.3s ease;
  }
  .sidebar-logo {
    padding: 24px 20px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; gap: 10px;
  }
  .sidebar-logo-ring {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg,#9FB4C1,#0C1A30,#C9D8E2);
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 900; color: #fff; flex-shrink: 0;
  }
  .sidebar-logo-text { font-size: 11px; font-weight: 700; letter-spacing: 0.16em; color: rgba(255,255,255,0.6); text-transform: uppercase; }
  .sidebar-nav { padding: 16px 12px; flex: 1; display: flex; flex-direction: column; gap: 2px; }
  .sidebar-link {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 10px; cursor: pointer;
    font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.4);
    transition: all 0.2s ease; border: none; background: none; width: 100%; text-align: left;
  }
  .sidebar-link:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.05); }
  .sidebar-link.active { color: #fff; background: rgba(100,150,200,0.12); border: 1px solid rgba(100,150,200,0.15); }
  .sidebar-link .icon { width: 20px; text-align: center; font-size: 14px; }
  .sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }

  /* Main */
  .main { margin-left: 220px; flex: 1; padding: 32px; min-height: 100vh; }

  /* Cards */
  .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 28px; }
  .stat-card {
    background: #070d1c; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px; padding: 20px 22px;
  }
  .stat-label { font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 8px; }
  .stat-val { font-size: 26px; font-weight: 800; letter-spacing: -0.03em; color: #fff; }
  .stat-val.green { color: #00E87A; }
  .stat-val.red { color: #F84F4F; }

  .section-card { background: #070d1c; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 24px; margin-bottom: 20px; }
  .section-title { font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 16px; letter-spacing: -0.01em; }

  /* Table */
  .tx-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .tx-row:last-child { border-bottom: none; }
  .tx-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; flex-shrink: 0; }
  .tx-info { flex: 1; }
  .tx-type { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.8); margin-bottom: 2px; }
  .tx-date { font-size: 10px; color: rgba(255,255,255,0.3); }
  .tx-note { font-size: 10px; color: rgba(255,255,255,0.25); }
  .tx-amount { font-size: 14px; font-weight: 800; }
  .tx-status { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; padding: 3px 8px; border-radius: 100px; text-align: right; }

  /* Chart bars */
  .bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 120px; padding-top: 8px; }
  .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .bar { width: 100%; border-radius: 4px 4px 0 0; background: linear-gradient(180deg, #00E87A, #00a855); transition: all 0.5s ease; }
  .bar-lbl { font-size: 9px; color: rgba(255,255,255,0.3); font-weight: 600; }
  .bar-pct { font-size: 9px; color: #00E87A; font-weight: 700; }

  /* Inputs */
  .portal-input { width:100%; padding:12px 14px; border-radius:10px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); color:#fff; font-family:sans-serif; font-size:13px; outline:none; transition:border-color 0.2s; margin-bottom:12px; }
  .portal-input:focus { border-color:rgba(100,150,200,0.5); }
  .portal-input::placeholder { color:rgba(255,255,255,0.2); }
  .portal-btn-primary { padding:12px 24px; border-radius:10px; background:#00E87A; color:#050810; font-family:sans-serif; font-size:13px; font-weight:700; border:none; cursor:pointer; transition:all 0.2s; width:100%; }
  .portal-btn-primary:hover { background:#00d670; }
  .portal-btn-secondary { padding:12px 24px; border-radius:10px; background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.7); font-family:sans-serif; font-size:13px; font-weight:700; border:1px solid rgba(255,255,255,0.1); cursor:pointer; transition:all 0.2s; width:100%; }

  /* Badge */
  .badge { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:100px; font-size:9px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; }
  .badge-green { background:rgba(0,232,122,0.12); color:#00E87A; }
  .badge-yellow { background:rgba(245,158,11,0.12); color:#F59E0B; }
  .badge-blue { background:rgba(100,150,200,0.12); color:#6496C8; }

  /* Live dot */
  @keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .live-dot { width:6px; height:6px; border-radius:50%; background:#00E87A; display:inline-block; margin-right:4px; animation:livePulse 2s infinite; }

  /* Referral box */
  .ref-code { font-family:monospace; font-size:18px; font-weight:800; color:#6496C8; letter-spacing:0.1em; background:rgba(100,150,200,0.08); border:1px solid rgba(100,150,200,0.2); border-radius:10px; padding:14px 20px; text-align:center; margin:12px 0; }

  /* Telegram card */
  .tg-card { display:flex; align-items:center; gap:14px; padding:14px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:12px; margin-bottom:10px; text-decoration:none; transition:all 0.2s; }
  .tg-card:hover { border-color:rgba(100,150,200,0.3); background:rgba(100,150,200,0.06); }

  /* Mobile */
  .mobile-header { display:none; padding:12px 16px; background:#070d1c; border-bottom:1px solid rgba(255,255,255,0.07); position:sticky; top:0; z-index:200; align-items:center; justify-content:space-between; }
  .mobile-nav { display:none; position:fixed; bottom:0; left:0; right:0; background:#070d1c; border-top:1px solid rgba(255,255,255,0.08); padding:6px 0 20px; z-index:100; overflow-x:auto; }
  .mobile-nav-items { display:flex; justify-content:space-around; min-width:max-content; width:100%; padding:0 4px; gap:0; }
  .mobile-nav-item { display:flex; flex-direction:column; align-items:center; gap:2px; cursor:pointer; padding:4px 10px; border-radius:8px; background:none; border:none; color:rgba(255,255,255,0.35); font-size:8px; font-weight:700; letter-spacing:0.04em; transition:color 0.2s; white-space:nowrap; flex-shrink:0; }
  .mobile-nav-item.active { color:#00E87A; }
  .mobile-nav-item .icon { font-size:16px; }

  @media (max-width:768px) {
    .sidebar { display:none; }
    .main { margin-left:0; padding:20px 16px 110px; }
    .mobile-header { display:flex; }
    .mobile-nav { display:block; }
    .stat-grid { grid-template-columns:1fr 1fr; gap:10px; }
    .stat-val { font-size:20px; }
  }
`;

// ── LOGIN PAGE ────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      onLogin();
    } else {
      setError("Invalid credentials. Use demo: investor@kcg.com / kcg2024");
    }
  };

  return (
    <main style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", background:"#02040a", position:"relative" }}>
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse 60% 60% at 50% 40%, rgba(12,26,48,0.7) 0%, #02040a 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:420 }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#9FB4C1,#0C1A30,#C9D8E2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:900, color:"#fff", margin:"0 auto 14px" }}>KCG</div>
          <h1 style={{ fontSize:"1.5rem", fontWeight:800, color:"#fff", letterSpacing:"-0.02em", marginBottom:4 }}>Investor Portal</h1>
          <p style={{ fontSize:12, color:"rgba(255,255,255,0.3)" }}>Private access for KCG investors</p>
        </div>

        <div style={{ background:"#070d1c", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:32 }}>
          <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,0.04)", borderRadius:100, padding:4, marginBottom:28 }}>
            {["login","apply"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ flex:1, padding:"7px 0", borderRadius:100, border:"none", cursor:"pointer", fontFamily:"sans-serif", fontSize:12, fontWeight:700, background: tab===t ? "rgba(255,255,255,0.1)" : "transparent", color: tab===t ? "#fff" : "rgba(255,255,255,0.35)", transition:"all 0.2s" }}>
                {t === "login" ? "Sign In" : "Apply for Access"}
              </button>
            ))}
          </div>

          {tab === "login" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(159,180,193,0.5)", display:"block", marginBottom:7 }}>Email Address</label>
                <input type="email" className="portal-input" style={{ marginBottom:0 }} placeholder="investor@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(159,180,193,0.5)", display:"block", marginBottom:7 }}>Password</label>
                <input type="password" className="portal-input" style={{ marginBottom:0 }} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key==="Enter" && handleLogin()} />
              </div>
              {error && <p style={{ fontSize:11, color:"#F84F4F", textAlign:"center" }}>Invalid email or password. Please try again.</p>}
              <button className="portal-btn-primary" style={{ marginTop:4 }} onClick={handleLogin}>Access Portal →</button>
              <p style={{ fontSize:11, color:"rgba(255,255,255,0.2)", textAlign:"center" }}>
                Contact support if you need access
              </p>
            </div>
          )}

          {tab === "apply" && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ background:"rgba(0,232,120,0.06)", border:"1px solid rgba(0,232,120,0.15)", borderRadius:10, padding:"12px 14px", marginBottom:4 }}>
                <p style={{ fontSize:12, color:"rgba(0,232,120,0.8)", lineHeight:1.6 }}>Portal access is by invitation only. Submit your details and a KCG representative will be in touch within 24–48 hours.</p>
              </div>
              <input type="text" className="portal-input" placeholder="Full name" />
              <input type="email" className="portal-input" placeholder="Email address" />
              <input type="text" className="portal-input" placeholder="Telegram @handle" />
              <select className="portal-input" style={{ appearance:"none" }}>
                <option value="">Investment interest...</option>
                <option>Copy Trading / Signal Subscription</option>
                <option>Capital Allocation ($10k–$50k)</option>
                <option>Capital Allocation ($50k+)</option>
                <option>Strategic Partnership</option>
              </select>
              <a href="mailto:support@kaizencapitalgrp.com?subject=Portal Access Request" className="portal-btn-primary" style={{ textDecoration:"none", textAlign:"center", display:"block" }}>Submit Application →</a>
            </div>
          )}
        </div>

        <div style={{ display:"flex", gap:20, marginTop:24, justifyContent:"center", flexWrap:"wrap" }}>
          {["🔒 Encrypted","✓ Verified","🏛 Institutional"].map(t => (
            <span key={t} style={{ fontSize:10, color:"rgba(255,255,255,0.2)", letterSpacing:"0.04em" }}>{t}</span>
          ))}
        </div>
      </div>
    </main>
  );
}

// ── DASHBOARD SECTIONS ───────────────────────────────────────────────────────
function Overview() {
  const d = DEMO_DATA;
  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Welcome back</p>
        <h2 style={{ fontSize:"1.6rem", fontWeight:800, letterSpacing:"-0.02em", color:"#fff" }}>Your Portfolio</h2>
      </div>

      <div className="stat-grid">
        {[
          { label:"Total Balance",    val:`$${d.balance.toLocaleString()}`,   cls:"" },
          { label:"Total Profit",     val:`+$${d.profit.toLocaleString()}`,   cls:"green" },
          { label:"Today's Return",   val:`+${d.todayProfit}%`,              cls:"green" },
          { label:"Total Withdrawn",  val:`$${d.totalWithdrawn.toFixed(2)}`,  cls:"" },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className={`stat-val ${s.cls}`}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="section-card">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div className="section-title" style={{ marginBottom:0 }}>Active Fund</div>
          <span className="badge badge-green"><span className="live-dot"/>LIVE</span>
        </div>
        <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
          <div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Fund</div>
            <div style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{d.fundName}</div>
          </div>
          <div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Monthly Return</div>
            <div style={{ fontSize:22, fontWeight:800, color:"#00E87A" }}>{d.fundReturn}</div>
          </div>
          <div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Broker</div>
            <div style={{ fontSize:14, fontWeight:700, color:"#fff" }}>TMGM</div>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-title">Recent Transactions</div>
        {d.transactions.slice(0,3).map(tx => <TxRow key={tx.id} tx={tx} />)}
      </div>
    </div>
  );
}

function TxRow({ tx }) {
  const isProfit = tx.type === "profit";
  const isDeposit = tx.type === "deposit";
  const isWithdraw = tx.type === "withdrawal";
  const iconBg = isProfit ? "rgba(0,232,122,0.12)" : isDeposit ? "rgba(100,150,200,0.12)" : "rgba(248,113,113,0.12)";
  const iconColor = isProfit ? "#00E87A" : isDeposit ? "#6496C8" : "#F84F4F";
  const icon = isProfit ? "%" : isDeposit ? "↓" : "↑";
  const statusCls = tx.status === "completed" ? "badge badge-green" : tx.status === "pending" ? "badge badge-yellow" : "badge badge-blue";

  return (
    <div className="tx-row">
      <div className="tx-icon" style={{ background:iconBg, color:iconColor }}>{icon}</div>
      <div className="tx-info">
        <div className="tx-type" style={{ textTransform:"capitalize" }}>{tx.type}</div>
        <div className="tx-date">{tx.date} · <span className="tx-note">{tx.note}</span></div>
      </div>
      <div style={{ textAlign:"right" }}>
        <div className="tx-amount" style={{ color:isWithdraw?"#F84F4F":"#00E87A", marginBottom:4 }}>{tx.amount}</div>
        <span className={statusCls}>{tx.status}</span>
      </div>
    </div>
  );
}

function Trading() {
  const [tradingOn, setTradingOn] = useState(true);
  const [mode, setMode] = useState("conservative");
  const [duration, setDuration] = useState("1M");
  const [search, setSearch] = useState("");

  const STATS = {
    "1M":  { profitPct:"9.40%", aggressive:"0.00%", conservative:"9.40%", trades:14, winRate:"92.86%" },
    "3M":  { profitPct:"28.60%", aggressive:"0.00%", conservative:"28.60%", trades:41, winRate:"90.24%" },
    "6M":  { profitPct:"54.20%", aggressive:"0.00%", conservative:"54.20%", trades:88, winRate:"89.77%" },
    "ALL": { profitPct:"54.20%", aggressive:"0.00%", conservative:"54.20%", trades:88, winRate:"89.77%" },
  };

  const LIVE_TRADES = [
    { asset:"XAU/USD", openPrice:"3,312.40", investment:"4%", side:"BUY",  pnl:"+$142.20" },
    { asset:"XAU/USD", openPrice:"3,298.10", investment:"4%", side:"BUY",  pnl:"+$88.50"  },
  ];

  const ALL_TRADES = [
    { asset:"XAU/USD",   openPrice:"3,285.00", investment:"4%", side:"BUY",  result:"WIN",  pnl:"+$124.00" },
    { asset:"EUR/USD",   openPrice:"1.0821",   investment:"4%", side:"SELL", result:"WIN",  pnl:"+$67.30"  },
    { asset:"XAU/USD",   openPrice:"3,310.50", investment:"4%", side:"BUY",  result:"WIN",  pnl:"+$98.80"  },
    { asset:"BTC/USD",   openPrice:"92,400",   investment:"4%", side:"BUY",  result:"LOSS", pnl:"-$44.10"  },
    { asset:"XAU/USD",   openPrice:"3,290.00", investment:"4%", side:"BUY",  result:"WIN",  pnl:"+$112.60" },
    { asset:"EUR/USD",   openPrice:"1.0798",   investment:"4%", side:"BUY",  result:"WIN",  pnl:"+$55.20"  },
    { asset:"XAU/USD",   openPrice:"3,275.80", investment:"4%", side:"SELL", result:"WIN",  pnl:"+$78.40"  },
  ];

  const st = STATS[duration];
  const filtered = ALL_TRADES.filter(t => t.asset.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Live Activity</p>
        <h2 style={{ fontSize:"1.6rem", fontWeight:800, letterSpacing:"-0.02em", color:"#fff" }}>Trading</h2>
      </div>

      {/* Status + Mode */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <div className="section-card" style={{ padding:18 }}>
          <div className="stat-label" style={{ marginBottom:12 }}>Trading Status</div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div onClick={() => setTradingOn(o=>!o)} style={{ width:44, height:24, borderRadius:100, background: tradingOn ? "#00E87A" : "rgba(255,255,255,0.1)", cursor:"pointer", position:"relative", transition:"background 0.3s" }}>
              <div style={{ position:"absolute", top:3, left: tradingOn ? 23 : 3, width:18, height:18, borderRadius:"50%", background:"#fff", transition:"left 0.3s", boxShadow:"0 1px 4px rgba(0,0,0,0.3)" }}/>
            </div>
            <span style={{ fontSize:13, fontWeight:700, color: tradingOn ? "#00E87A" : "rgba(255,255,255,0.4)" }}>{tradingOn ? "Active" : "Paused"}</span>
          </div>
        </div>
        <div className="section-card" style={{ padding:18 }}>
          <div className="stat-label" style={{ marginBottom:12 }}>Trading Mode</div>
          <div style={{ display:"flex", gap:6 }}>
            {["conservative","aggressive"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{ flex:1, padding:"6px 4px", borderRadius:8, border:"none", cursor:"pointer", fontSize:10, fontWeight:800, textTransform:"capitalize", transition:"all 0.2s", background: mode===m ? (m==="aggressive" ? "#00E87A" : "#6496C8") : "rgba(255,255,255,0.06)", color: mode===m ? "#050810" : "rgba(255,255,255,0.4)" }}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="section-card" style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div className="section-title" style={{ marginBottom:0 }}>General Stats</div>
          <div style={{ display:"flex", gap:4 }}>
            {["1M","3M","6M","ALL"].map(d => (
              <button key={d} onClick={() => setDuration(d)} style={{ padding:"4px 10px", borderRadius:100, border:"none", cursor:"pointer", fontSize:10, fontWeight:700, background: duration===d ? "rgba(100,150,200,0.2)" : "rgba(255,255,255,0.05)", color: duration===d ? "#6496C8" : "rgba(255,255,255,0.3)", transition:"all 0.2s" }}>{d}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[
            { label:"📈 Profit %",        val:st.profitPct,    green:true },
            { label:"🚀 Aggressive Mode", val:st.aggressive,   green:false },
            { label:"🏷 Conservative",    val:st.conservative, green:true },
            { label:"🔢 Total Trades",    val:st.trades,       green:false },
            { label:"🎯 Win Rate",        val:st.winRate,      green:true },
          ].map(s => (
            <div key={s.label} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:10, padding:"12px 14px" }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginBottom:6 }}>{s.label}</div>
              <div style={{ fontSize:18, fontWeight:800, color: s.green ? "#00E87A" : "#fff" }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Trades */}
      <div className="section-card" style={{ marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
          <span className="live-dot"/>
          <div className="section-title" style={{ marginBottom:0 }}>Live Trades</div>
          <span className="badge badge-green">{LIVE_TRADES.length} open</span>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ color:"rgba(255,255,255,0.3)", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase" }}>
                <th style={{ textAlign:"left", paddingBottom:10, fontWeight:700 }}>Asset</th>
                <th style={{ textAlign:"left", paddingBottom:10, fontWeight:700 }}>Open</th>
                <th style={{ textAlign:"left", paddingBottom:10, fontWeight:700 }}>Invest %</th>
                <th style={{ textAlign:"right", paddingBottom:10, fontWeight:700 }}>P&L</th>
              </tr>
            </thead>
            <tbody>
              {LIVE_TRADES.map((t,i) => (
                <tr key={i} style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding:"10px 0", fontWeight:700 }}>
                    <span style={{ background:"rgba(0,232,122,0.1)", color:"#00E87A", fontSize:9, fontWeight:800, padding:"2px 6px", borderRadius:4, marginRight:6 }}>{t.side}</span>
                    {t.asset}
                  </td>
                  <td style={{ padding:"10px 0", color:"rgba(255,255,255,0.6)" }}>{t.openPrice}</td>
                  <td style={{ padding:"10px 0", color:"rgba(255,255,255,0.4)" }}>{t.investment}</td>
                  <td style={{ padding:"10px 0", textAlign:"right", fontWeight:800, color:"#00E87A" }}>{t.pnl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Trades */}
      <div className="section-card">
        <div className="section-title">All Trades</div>
        <input type="text" className="portal-input" placeholder="Search by asset name..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom:14 }}/>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ color:"rgba(255,255,255,0.3)", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase" }}>
                <th style={{ textAlign:"left", paddingBottom:10, fontWeight:700 }}>Asset</th>
                <th style={{ textAlign:"left", paddingBottom:10, fontWeight:700 }}>Open</th>
                <th style={{ textAlign:"left", paddingBottom:10, fontWeight:700 }}>%</th>
                <th style={{ textAlign:"right", paddingBottom:10, fontWeight:700 }}>Result</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t,i) => (
                <tr key={i} style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding:"10px 0", fontWeight:700 }}>
                    <span style={{ background: t.side==="BUY" ? "rgba(0,232,122,0.1)" : "rgba(248,79,79,0.1)", color: t.side==="BUY" ? "#00E87A" : "#F84F4F", fontSize:9, fontWeight:800, padding:"2px 6px", borderRadius:4, marginRight:6 }}>{t.side}</span>
                    {t.asset}
                  </td>
                  <td style={{ padding:"10px 0", color:"rgba(255,255,255,0.5)", fontSize:11 }}>{t.openPrice}</td>
                  <td style={{ padding:"10px 0", color:"rgba(255,255,255,0.4)" }}>{t.investment}</td>
                  <td style={{ padding:"10px 0", textAlign:"right" }}>
                    <span style={{ fontWeight:800, color: t.result==="WIN" ? "#00E87A" : "#F84F4F", fontSize:11 }}>{t.pnl}</span>
                    <span className={`badge ${t.result==="WIN"?"badge-green":"badge"}`} style={{ marginLeft:6, background: t.result==="WIN" ? "rgba(0,232,122,0.1)" : "rgba(248,79,79,0.1)", color: t.result==="WIN" ? "#00E87A" : "#F84F4F" }}>{t.result}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Wallet() {
  const [flipped, setFlipped] = useState(false);
  const [tab, setTab] = useState("deposit");
  const [amount, setAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const WALLET_TXS = [
    { type:"deposit",    asset:"USDT",    amount:"+$10,000",  date:"2024-11-01", status:"completed", hash:"0x7f3a...d91c" },
    { type:"deposit",    asset:"USDT",    amount:"+$15,000",  date:"2024-11-15", status:"completed", hash:"0x2b8e...a44f" },
    { type:"profit",     asset:"USD",     amount:"+$1,102",   date:"2024-12-01", status:"completed", hash:"Internal"     },
    { type:"withdrawal", asset:"USDT",    amount:"-$2,500",   date:"2025-01-10", status:"pending",   hash:"Pending"      },
    { type:"profit",     asset:"USD",     amount:"+$1,082",   date:"2025-01-01", status:"completed", hash:"Internal"     },
  ];

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Capital Account</p>
        <h2 style={{ fontSize:"1.6rem", fontWeight:800, letterSpacing:"-0.02em", color:"#fff" }}>Wallet</h2>
      </div>

      {/* Virtual Card */}
      <div style={{ perspective:1000, marginBottom:20, cursor:"pointer" }} onClick={() => setFlipped(f=>!f)}>
        <div style={{ position:"relative", height:190, transition:"transform 0.6s", transformStyle:"preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>

          {/* Front */}
          <div style={{ position:"absolute", inset:0, borderRadius:20, background:"linear-gradient(135deg, #0a1628 0%, #0d2240 40%, #0a1a35 70%, #061020 100%)", border:"1px solid rgba(100,150,200,0.2)", overflow:"hidden", backfaceVisibility:"hidden", padding:"24px 28px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
            {/* Card glow */}
            <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(100,150,200,0.12) 0%, transparent 70%)" }}/>
            <div style={{ position:"absolute", bottom:-60, left:20, width:180, height:180, borderRadius:"50%", background:"radial-gradient(circle, rgba(0,232,122,0.06) 0%, transparent 70%)" }}/>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", position:"relative" }}>
              <div>
                <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.2em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:4 }}>KCG Investor Card</div>
                <div style={{ fontSize:22, fontWeight:900, color:"#fff", letterSpacing:"-0.02em" }}>$24,850<span style={{ fontSize:13, color:"rgba(255,255,255,0.5)" }}>.00</span></div>
              </div>
              <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#9FB4C1,#0C1A30,#C9D8E2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:900, color:"#fff" }}>KCG</div>
            </div>

            <div style={{ position:"relative" }}>
              <div style={{ fontFamily:"monospace", fontSize:16, letterSpacing:"0.2em", color:"rgba(255,255,255,0.7)", marginBottom:14 }}>•••• &nbsp;•••• &nbsp;•••• &nbsp;7291</div>
              <div style={{ display:"flex", gap:32 }}>
                <div>
                  <div style={{ fontSize:8, color:"rgba(255,255,255,0.3)", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:3 }}>Card Holder</div>
                  <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.8)", letterSpacing:"0.06em" }}>KCG INVESTOR</div>
                </div>
                <div>
                  <div style={{ fontSize:8, color:"rgba(255,255,255,0.3)", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:3 }}>Valid Thru</div>
                  <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.8)" }}>12/27</div>
                </div>
              </div>
            </div>

            {/* Chip */}
            <div style={{ position:"absolute", top:60, left:28, width:36, height:28, borderRadius:5, background:"linear-gradient(135deg,#c9b060,#e8d080)", opacity:0.8 }}/>
          </div>

          {/* Back */}
          <div style={{ position:"absolute", inset:0, borderRadius:20, background:"linear-gradient(135deg, #061020 0%, #0a1628 100%)", border:"1px solid rgba(100,150,200,0.2)", backfaceVisibility:"hidden", transform:"rotateY(180deg)", overflow:"hidden" }}>
            <div style={{ height:40, background:"rgba(255,255,255,0.08)", margin:"28px 0 20px" }}/>
            <div style={{ padding:"0 28px" }}>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>Network</div>
              <div style={{ display:"flex", gap:12 }}>
                {["USDT TRC20","BTC","ETH"].map(n => (
                  <span key={n} style={{ fontSize:10, fontWeight:700, color:"rgba(100,150,200,0.8)", background:"rgba(100,150,200,0.1)", padding:"4px 10px", borderRadius:100 }}>{n}</span>
                ))}
              </div>
              <div style={{ marginTop:20, fontSize:10, color:"rgba(255,255,255,0.2)", lineHeight:1.6 }}>
                This card represents your KCG investment account. Tap to flip. All transactions are processed through verified brokerage networks.
              </div>
            </div>
          </div>
        </div>
        <p style={{ fontSize:10, color:"rgba(255,255,255,0.2)", textAlign:"center", marginTop:8 }}>Tap card to flip</p>
      </div>

      {/* Quick stats */}
      <div className="stat-grid" style={{ marginBottom:20 }}>
        {[
          { label:"Total Deposited", val:"$25,000", col:"" },
          { label:"Total Profit",    val:"+$2,184", col:"green" },
          { label:"Withdrawn",       val:"$0",      col:"" },
          { label:"Net Balance",     val:"$27,184", col:"green" },
        ].map(s => (
          <div className="stat-card" key={s.label} style={{ padding:"16px 18px" }}>
            <div className="stat-label">{s.label}</div>
            <div className={`stat-val ${s.col}`} style={{ fontSize:18 }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Deposit / Withdraw tabs */}
      <div className="section-card" style={{ marginBottom:20 }}>
        <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,0.04)", borderRadius:100, padding:4, marginBottom:20 }}>
          {["deposit","withdraw"].map(t => (
            <button key={t} onClick={() => { setTab(t); setSubmitted(false); }} style={{ flex:1, padding:"8px 0", borderRadius:100, border:"none", cursor:"pointer", fontFamily:"sans-serif", fontSize:12, fontWeight:700, textTransform:"capitalize", background: tab===t ? "rgba(255,255,255,0.1)" : "transparent", color: tab===t ? "#fff" : "rgba(255,255,255,0.35)", transition:"all 0.2s" }}>{t}</button>
          ))}
        </div>

        {submitted ? (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ fontSize:36, marginBottom:12 }}>✓</div>
            <h3 style={{ color:"#00E87A", fontWeight:800, marginBottom:8 }}>Request Submitted</h3>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13 }}>You will receive confirmation via email and Telegram within 24 hours.</p>
            <button className="portal-btn-secondary" style={{ marginTop:16, width:"auto", padding:"10px 24px" }} onClick={() => setSubmitted(false)}>New Request</button>
          </div>
        ) : tab === "deposit" ? (
          <div>
            <div style={{ background:"rgba(0,232,122,0.06)", border:"1px solid rgba(0,232,122,0.15)", borderRadius:10, padding:"12px 14px", marginBottom:16 }}>
              <p style={{ fontSize:12, color:"rgba(0,232,122,0.8)", lineHeight:1.6, margin:0 }}>Send USDT (TRC20) to the wallet address below. Minimum deposit: $500. Funds are credited within 1–3 hours after confirmation.</p>
            </div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(159,180,193,0.5)", marginBottom:8 }}>USDT TRC20 Deposit Address</div>
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"12px 14px", fontFamily:"monospace", fontSize:12, color:"rgba(255,255,255,0.6)", marginBottom:12, wordBreak:"break-all" }}>
              TRcKaizenCapitalGroupXXXXXXXXXXXXXX
            </div>
            <label style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(159,180,193,0.5)", display:"block", marginBottom:7 }}>Amount (USD)</label>
            <input type="number" className="portal-input" placeholder="500.00" value={amount} onChange={e => setAmount(e.target.value)} />
            <button className="portal-btn-primary" onClick={() => setSubmitted(true)}>Confirm Deposit →</button>
          </div>
        ) : (
          <div>
            <div style={{ background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.15)", borderRadius:10, padding:"12px 14px", marginBottom:16 }}>
              <p style={{ fontSize:12, color:"rgba(245,158,11,0.8)", lineHeight:1.6, margin:0 }}>⚠ Minimum withdrawal: $500. Processing: 2–5 business days. Funds sent via USDT TRC20.</p>
            </div>
            <label style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(159,180,193,0.5)", display:"block", marginBottom:7 }}>Amount (USD)</label>
            <input type="number" className="portal-input" placeholder="500.00" value={amount} onChange={e => setAmount(e.target.value)} />
            <label style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(159,180,193,0.5)", display:"block", marginBottom:7 }}>Your USDT Wallet (TRC20)</label>
            <input type="text" className="portal-input" placeholder="T..." />
            <button className="portal-btn-primary" onClick={() => setSubmitted(true)}>Request Withdrawal →</button>
          </div>
        )}
      </div>

      {/* Transaction history */}
      <div className="section-card">
        <div className="section-title">Transaction History</div>
        {WALLET_TXS.map((tx, i) => {
          const isIn = tx.type !== "withdrawal";
          return (
            <div key={i} className="tx-row">
              <div className="tx-icon" style={{ background: isIn ? "rgba(0,232,122,0.1)" : "rgba(248,79,79,0.1)", color: isIn ? "#00E87A" : "#F84F4F" }}>
                {tx.type === "profit" ? "%" : isIn ? "↓" : "↑"}
              </div>
              <div className="tx-info">
                <div className="tx-type" style={{ textTransform:"capitalize" }}>{tx.type} · <span style={{ color:"rgba(100,150,200,0.7)" }}>{tx.asset}</span></div>
                <div className="tx-date">{tx.date}</div>
                <div style={{ fontSize:9, color:"rgba(255,255,255,0.2)", fontFamily:"monospace", marginTop:1 }}>{tx.hash}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div className="tx-amount" style={{ color: isIn ? "#00E87A" : "#F84F4F", marginBottom:4 }}>{tx.amount}</div>
                <span className={`badge ${tx.status==="completed"?"badge-green":tx.status==="pending"?"badge-yellow":"badge-blue"}`}>{tx.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Education() {
  const [filter, setFilter] = useState("all");
  const [unlocking, setUnlocking] = useState(null);
  const [unlocked, setUnlocked] = useState(new Set(["intro-1"]));

  const COURSES = [
    {
      id:"intro-1", category:"free", instructor:"KCG Team", level:"Beginner",
      title:"Introduction to Copy Trading", lessons:6, duration:"1h 20m",
      desc:"Learn how copy trading works, how to follow top traders, and how KCG funds generate consistent returns.",
      price:null, tag:"FREE", tagColor:"#00E87A",
      topics:["What is copy trading","How KCG selects strategies","Risk management basics","Brokerage setup (TMGM/MultiBank)","Reading fund performance","Getting started checklist"],
    },
    {
      id:"gold-1", category:"paid", instructor:"Kaizen Trader", level:"Intermediate",
      title:"Gold Trading Masterclass (XAU/USD)", lessons:12, duration:"4h 45m",
      desc:"Deep dive into institutional gold trading strategies — the foundation of KCG Fund 1 and Alpha Fund.",
      price:"$97", tag:"POPULAR", tagColor:"#F59E0B",
      topics:["Gold market structure","Session timing (London/NY)","Scalping vs intraday setups","Risk-reward frameworks","Reading gold correlations (DXY, yields)","Live trade walkthroughs"],
    },
    {
      id:"forex-1", category:"paid", instructor:"Phoenix Trader", level:"Intermediate",
      title:"Forex Fundamentals & EUR/USD Strategy", lessons:10, duration:"3h 30m",
      desc:"Master EUR/USD price action, macro drivers, and the algorithmic approach behind the MAMALYN and Forex Fortune AI funds.",
      price:"$79", tag:"NEW", tagColor:"#6496C8",
      topics:["Forex market mechanics","EUR/USD macro drivers","Price action patterns","Algo vs manual strategies","Session-based entries","Risk & position sizing"],
    },
    {
      id:"crypto-1", category:"paid", instructor:"VaultKano", level:"Intermediate",
      title:"Crypto Portfolio Strategy", lessons:8, duration:"2h 55m",
      desc:"Institutional approach to crypto allocation — Bitcoin, Ethereum, on-chain metrics, and the VaultKano fund methodology.",
      price:"$89", tag:"COMING SOON", tagColor:"#a78bfa",
      topics:["BTC/ETH market cycles","On-chain analysis basics","Portfolio allocation models","Crypto risk management","DeFi fundamentals","VaultKano fund breakdown"],
    },
    {
      id:"risk-1", category:"paid", instructor:"KCG Team", level:"Advanced",
      title:"Institutional Risk Management", lessons:9, duration:"3h 10m",
      desc:"The exact risk protocols used across all KCG funds — drawdown limits, position sizing, capital preservation.",
      price:"$119", tag:"ADVANCED", tagColor:"#F84F4F",
      topics:["Position sizing formulas","Drawdown management","Portfolio correlation","Stop loss strategies","Capital preservation rules","Institutional reporting"],
    },
    {
      id:"bundle-1", category:"bundle", instructor:"All Instructors", level:"All Levels",
      title:"KCG Complete Trading Bundle", lessons:45, duration:"15h 40m",
      desc:"All 4 paid courses bundled together at a significant discount. Everything you need to understand and follow KCG strategies.",
      price:"$249", tag:"BEST VALUE", tagColor:"#00E87A",
      topics:["All Gold Masterclass content","All Forex content","All Crypto content","Risk Management","Bonus: Live Q&A sessions","Lifetime updates"],
    },
  ];

  const filtered = filter === "all" ? COURSES : COURSES.filter(c => c.category === filter);
  const isUnlocked = (id) => unlocked.has(id);

  const handleUnlock = (id) => {
    setUnlocking(id);
  };

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Learn from the traders</p>
        <h2 style={{ fontSize:"1.6rem", fontWeight:800, letterSpacing:"-0.02em", color:"#fff" }}>Education Hub</h2>
      </div>

      {/* Stats bar */}
      <div className="stat-grid" style={{ marginBottom:20 }}>
        {[
          { label:"Courses Available", val:"6" },
          { label:"Total Lessons",     val:"45" },
          { label:"Your Progress",     val:"1/6" },
          { label:"Instructors",       val:"4" },
        ].map(s => (
          <div className="stat-card" key={s.label} style={{ padding:"14px 16px" }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-val" style={{ fontSize:20 }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:20, flexWrap:"wrap" }}>
        {[["all","All Courses"],["free","Free"],["paid","Paid"],["bundle","Bundle"]].map(([val,lbl]) => (
          <button key={val} onClick={() => setFilter(val)} style={{ padding:"6px 14px", borderRadius:100, border:"none", cursor:"pointer", fontSize:11, fontWeight:700, transition:"all 0.2s", background: filter===val ? "rgba(100,150,200,0.2)" : "rgba(255,255,255,0.05)", color: filter===val ? "#6496C8" : "rgba(255,255,255,0.4)" }}>{lbl}</button>
        ))}
      </div>

      {/* Course cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {filtered.map(course => {
          const locked = !isUnlocked(course.id);
          return (
            <div key={course.id} className="section-card" style={{ padding:0, overflow:"hidden", opacity: course.tag==="COMING SOON" ? 0.65 : 1 }}>
              {/* Card header */}
              <div style={{ padding:"20px 22px 16px", background: locked && course.price ? "rgba(5,8,16,0.5)" : "rgba(5,8,16,0.3)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10, gap:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, flexWrap:"wrap" }}>
                      <span style={{ fontSize:9, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", padding:"3px 8px", borderRadius:100, background:`${course.tagColor}18`, color:course.tagColor }}>{course.tag}</span>
                      <span style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.08em" }}>{course.level}</span>
                    </div>
                    <h3 style={{ fontSize:15, fontWeight:800, color: locked && course.price ? "rgba(255,255,255,0.5)" : "#fff", letterSpacing:"-0.01em", margin:0, lineHeight:1.3 }}>{course.title}</h3>
                  </div>
                  {locked && course.price && (
                    <div style={{ fontSize:24, flexShrink:0, opacity:0.4 }}>🔒</div>
                  )}
                  {!locked && (
                    <div style={{ fontSize:20, flexShrink:0 }}>✅</div>
                  )}
                </div>

                <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", lineHeight:1.6, margin:"0 0 12px" }}>{course.desc}</p>

                <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>👤 {course.instructor}</span>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>📚 {course.lessons} lessons</span>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>⏱ {course.duration}</span>
                </div>
              </div>

              {/* Topics preview */}
              <div style={{ padding:"14px 22px", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.25)", marginBottom:10 }}>What you'll learn</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px 16px" }}>
                  {course.topics.map((t, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color: locked && course.price && i > 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.55)" }}>
                      <span style={{ color: locked && course.price && i > 1 ? "rgba(255,255,255,0.1)" : "#00E87A", fontSize:9 }}>✓</span>
                      {locked && course.price && i > 1 ? "••••••••••••" : t}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div style={{ padding:"14px 22px 18px", borderTop:"1px solid rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
                {!locked ? (
                  <button className="portal-btn-primary" style={{ maxWidth:200 }}>Continue Learning →</button>
                ) : course.tag === "COMING SOON" ? (
                  <button className="portal-btn-secondary" disabled style={{ maxWidth:200, opacity:0.5 }}>Coming Soon</button>
                ) : (
                  <button className="portal-btn-primary" style={{ maxWidth:200 }} onClick={() => handleUnlock(course.id)}>
                    Unlock for {course.price} →
                  </button>
                )}
                {course.price && locked && course.tag !== "COMING SOON" && (
                  <span style={{ fontSize:22, fontWeight:900, color:"#fff", letterSpacing:"-0.02em" }}>{course.price}</span>
                )}
                {!locked && (
                  <span style={{ fontSize:11, color:"rgba(0,232,122,0.6)", fontWeight:700 }}>Enrolled</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Unlock modal */}
      {unlocking && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", backdropFilter:"blur(8px)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:"#070d1c", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, padding:32, maxWidth:400, width:"100%" }}>
            <h3 style={{ fontSize:"1.2rem", fontWeight:800, color:"#fff", marginBottom:8 }}>
              {COURSES.find(c=>c.id===unlocking)?.title}
            </h3>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginBottom:20, lineHeight:1.6 }}>
              To unlock this course, complete payment via USDT (TRC20) or contact the KCG team directly on Telegram.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <a href="https://t.me/trellz_P" target="_blank" rel="noopener noreferrer" className="portal-btn-primary" style={{ textDecoration:"none", textAlign:"center", flex:1 }}>Pay via Telegram →</a>
              <button className="portal-btn-secondary" style={{ flex:1 }} onClick={() => setUnlocking(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Performance() {
  const d = DEMO_DATA;
  const max = Math.max(...d.returns);
  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Fund Performance</p>
        <h2 style={{ fontSize:"1.6rem", fontWeight:800, letterSpacing:"-0.02em", color:"#fff" }}>Monthly Returns</h2>
      </div>

      <div className="section-card">
        <div className="section-title">Return History</div>
        <div className="bar-chart">
          {d.months.map((m, i) => (
            <div className="bar-col" key={m}>
              <div className="bar-pct">{d.returns[i]}%</div>
              <div className="bar" style={{ height:`${(d.returns[i]/max)*88}px` }}/>
              <div className="bar-lbl">{m}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="stat-grid">
        {[
          { label:"Avg Monthly Return", val:"9.2%" },
          { label:"Best Month",         val:"11.2%" },
          { label:"Months Active",      val:"6" },
          { label:"Drawdown",           val:"<2%" },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-val green">{s.val}</div>
          </div>
        ))}
      </div>

      <div className="section-card">
        <div className="section-title">Fund Details</div>
        {[
          ["Strategy","Gold Scalping"],["Broker","TMGM"],["Risk Level","Medium"],
          ["Timeframe","Intraday"],["Copy Platform","TradeZella / Signal"],
          ["Min Allocation","$500"],
        ].map(([k,v]) => (
          <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:13 }}>
            <span style={{ color:"rgba(255,255,255,0.4)" }}>{k}</span>
            <span style={{ fontWeight:700 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Transactions() {
  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Account History</p>
        <h2 style={{ fontSize:"1.6rem", fontWeight:800, letterSpacing:"-0.02em", color:"#fff" }}>All Transactions</h2>
      </div>
      <div className="section-card">
        {DEMO_DATA.transactions.map(tx => <TxRow key={tx.id} tx={tx} />)}
      </div>
      <p style={{ fontSize:11, color:"rgba(255,255,255,0.25)", textAlign:"center", marginTop:12 }}>Showing last 5 transactions · Contact support for full history</p>
    </div>
  );
}

function Withdraw() {
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Capital Management</p>
        <h2 style={{ fontSize:"1.6rem", fontWeight:800, letterSpacing:"-0.02em", color:"#fff" }}>Withdrawal Request</h2>
      </div>

      <div className="stat-grid" style={{ marginBottom:24 }}>
        <div className="stat-card">
          <div className="stat-label">Available Balance</div>
          <div className="stat-val green">$24,850.00</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Withdrawals</div>
          <div className="stat-val">$2,500.00</div>
        </div>
      </div>

      {submitted ? (
        <div className="section-card" style={{ textAlign:"center", padding:40 }}>
          <div style={{ fontSize:40, marginBottom:16 }}>✓</div>
          <h3 style={{ color:"#00E87A", fontWeight:800, marginBottom:8 }}>Request Submitted</h3>
          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13 }}>Your withdrawal request has been submitted. Processing takes 2–5 business days. You will be notified via email and Telegram.</p>
          <button className="portal-btn-secondary" style={{ marginTop:20, width:"auto", padding:"10px 24px" }} onClick={() => setSubmitted(false)}>New Request</button>
        </div>
      ) : (
        <div className="section-card">
          <div className="section-title">Submit Request</div>
          <div style={{ background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.15)", borderRadius:10, padding:"12px 14px", marginBottom:20 }}>
            <p style={{ fontSize:12, color:"rgba(245,158,11,0.8)", lineHeight:1.6 }}>⚠ Withdrawal requests are reviewed manually. Minimum withdrawal: $500. Processing time: 2–5 business days.</p>
          </div>
          <label style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(159,180,193,0.5)", display:"block", marginBottom:7 }}>Amount (USD)</label>
          <input type="number" className="portal-input" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
          <label style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(159,180,193,0.5)", display:"block", marginBottom:7 }}>USDT Wallet Address (TRC20)</label>
          <input type="text" className="portal-input" placeholder="T..." value={wallet} onChange={e => setWallet(e.target.value)} />
          <label style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(159,180,193,0.5)", display:"block", marginBottom:7 }}>Notes (optional)</label>
          <input type="text" className="portal-input" placeholder="Any additional notes..." />
          <button className="portal-btn-primary" onClick={() => setSubmitted(true)} style={{ marginTop:4 }}>Submit Withdrawal Request →</button>
        </div>
      )}
    </div>
  );
}

function Referrals() {
  const d = DEMO_DATA;
  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Earn Together</p>
        <h2 style={{ fontSize:"1.6rem", fontWeight:800, letterSpacing:"-0.02em", color:"#fff" }}>Referral Program</h2>
      </div>

      <div className="stat-grid" style={{ marginBottom:20 }}>
        {[
          { label:"Your Referrals", val:d.refCount },
          { label:"Referral Earnings", val:`$${d.refEarnings}` },
          { label:"Commission Rate", val:"5%" },
          { label:"Pending Payout", val:"$45.00" },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-val green">{s.val}</div>
          </div>
        ))}
      </div>

      <div className="section-card">
        <div className="section-title">Your Referral Code</div>
        <div className="ref-code">{d.refCode}</div>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.3)", marginBottom:16 }}>Share this code and earn 5% of your referral's monthly profits for the lifetime of their account.</p>
        <button className="portal-btn-secondary" onClick={() => navigator.clipboard?.writeText(d.refCode)}>Copy Code</button>
      </div>

      <div className="section-card">
        <div className="section-title">Share Link</div>
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"12px 14px", fontFamily:"monospace", fontSize:12, color:"rgba(255,255,255,0.5)", marginBottom:12, wordBreak:"break-all" }}>
          https://kaizencapitalgrp.com?ref={d.refCode}
        </div>
        <button className="portal-btn-secondary" onClick={() => navigator.clipboard?.writeText(`https://kaizencapitalgrp.com?ref=${d.refCode}`)}>Copy Link</button>
      </div>
    </div>
  );
}

function Telegram() {
  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Stay Connected</p>
        <h2 style={{ fontSize:"1.6rem", fontWeight:800, letterSpacing:"-0.02em", color:"#fff" }}>Telegram Access</h2>
      </div>

      <div className="section-card" style={{ marginBottom:20 }}>
        <div className="section-title">Your Channels</div>
        {TELEGRAM_CHANNELS.map(ch => (
          <a key={ch.name} href={ch.link} target="_blank" rel="noopener noreferrer" className="tg-card">
            <div style={{ width:44, height:44, borderRadius:12, background:"rgba(35,158,217,0.15)", border:"1px solid rgba(35,158,217,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{ch.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:2 }}>{ch.name}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>{ch.desc}</div>
            </div>
            <div style={{ fontSize:12, color:"rgba(100,150,200,0.7)" }}>Join →</div>
          </a>
        ))}
      </div>

      <div className="section-card">
        <div className="section-title">Direct Support</div>
        <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginBottom:16, lineHeight:1.6 }}>Need help? Message the KCG team directly on Telegram for portfolio questions, technical support, or account inquiries.</p>
        <a href="https://t.me/trellz_P" target="_blank" rel="noopener noreferrer" className="portal-btn-primary" style={{ textDecoration:"none", textAlign:"center", display:"block" }}>Message @trellz_P →</a>
      </div>
    </div>
  );
}

// ── MAIN PORTAL ──────────────────────────────────────────────────────────────
export default function Portal() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [active, setActive] = useState("overview");

  const SECTIONS = { overview:<Overview/>, trading:<Trading/>, wallet:<Wallet/>, education:<Education/>, performance:<Performance/>, transactions:<Transactions/>, withdraw:<Withdraw/>, referrals:<Referrals/>, telegram:<Telegram/> };

  if (!loggedIn) return (
    <>
      <style>{CSS}</style>
      <LoginPage onLogin={() => setLoggedIn(true)} />
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="portal-wrap">

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-ring">KCG</div>
            <span className="sidebar-logo-text">Kaizen Capital</span>
          </div>
          <nav className="sidebar-nav">
            {NAV_ITEMS.map(item => (
              <button key={item.id} className={`sidebar-link${active===item.id?" active":""}`} onClick={() => setActive(item.id)}>
                <span className="icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <button className="sidebar-link" onClick={() => setLoggedIn(false)} style={{ color:"rgba(248,113,113,0.6)", width:"100%" }}>
              <span className="icon">⊗</span> Sign Out
            </button>
            <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", fontSize:12, color:"rgba(255,255,255,0.25)", textDecoration:"none", marginTop:4 }}>
              ← Back to HQ
            </Link>
          </div>
        </aside>

        {/* Mobile header */}
        <div className="mobile-header">
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#9FB4C1,#0C1A30)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:900, color:"#fff" }}>KCG</div>
            <span style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", color:"rgba(255,255,255,0.6)", textTransform:"uppercase" }}>Portal</span>
          </div>
          <button onClick={() => setLoggedIn(false)} style={{ fontSize:11, color:"rgba(248,113,113,0.6)", background:"none", border:"none", cursor:"pointer" }}>Sign Out</button>
        </div>

        {/* Main content */}
        <main className="main">
          {SECTIONS[active]}
        </main>

        {/* Mobile bottom nav */}
        <nav className="mobile-nav">
          <div className="mobile-nav-items">
            {NAV_ITEMS.map(item => (
              <button key={item.id} className={`mobile-nav-item${active===item.id?" active":""}`} onClick={() => setActive(item.id)}>
                <span className="icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}

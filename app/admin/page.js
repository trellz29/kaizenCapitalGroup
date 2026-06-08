"use client";
import { useState } from "react";

const ADMIN_PASSWORD = "KCG_ADMIN_2026";

const INITIAL_CLIENTS = [
  {
    id: "1", name: "Cottrell", email: "cottrell@kaizencapitalgrp.com", password: "KCG2026",
    fund: "KaizenCapitalGroup.Xau-TMGM", broker: "TMGM",
    balance: 24850, profit: 2184.40, todayReturn: 0.92,
    withdrawn: 0, status: "active", joined: "2024-11-01",
  },
];

const EMPTY_CLIENT = {
  id: "", name: "", email: "", password: "KCG2026",
  fund: "KaizenCapitalGroup.Xau-TMGM", broker: "TMGM",
  balance: 0, profit: 0, todayReturn: 0,
  withdrawn: 0, status: "active", joined: new Date().toISOString().split("T")[0],
};

const FUNDS = [
  "KaizenCapitalGroup.Xau-TMGM","KaizenCapitalGroup.Xau-MB",
  "The Alpha Fund","MAMALYN Fund","CXFund",
  "VaultKano Fund","Forex Profit Snipers Fund","Algo Amalgamation Fund",
];

const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{background:#02040a;color:#fff;font-family:sans-serif}
  .aw{min-height:100vh}
  .ah{background:#070d1c;border-bottom:1px solid rgba(255,255,255,0.07);padding:14px 28px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
  .ab{padding:28px;max-width:1400px;margin:0 auto}
  .sr{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:24px}
  .sb{background:#070d1c;border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:16px 18px}
  .sbl{font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:6px}
  .sbv{font-size:22px;font-weight:800;letter-spacing:-0.03em;color:#fff}
  .sbv.g{color:#00E87A}
  .card{background:#070d1c;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:22px;margin-bottom:18px}
  .ct{font-size:15px;font-weight:800;color:#fff;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between}
  table{width:100%;border-collapse:collapse;font-size:12px}
  th{text-align:left;padding:9px 10px;font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.3);border-bottom:1px solid rgba(255,255,255,0.06)}
  td{padding:11px 10px;border-bottom:1px solid rgba(255,255,255,0.04);vertical-align:middle}
  tr:hover td{background:rgba(255,255,255,0.02)}
  .badge{display:inline-block;padding:3px 8px;border-radius:100px;font-size:9px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase}
  .bg{background:rgba(0,232,122,0.12);color:#00E87A}
  .br{background:rgba(248,79,79,0.12);color:#F84F4F}
  .by{background:rgba(245,158,11,0.12);color:#F59E0B}
  .btn{padding:7px 14px;border-radius:8px;border:none;cursor:pointer;font-family:sans-serif;font-size:11px;font-weight:700;transition:all 0.2s}
  .b-g{background:#00E87A;color:#050810}.b-g:hover{background:#00d670}
  .b-r{background:rgba(248,79,79,0.12);color:#F84F4F;border:1px solid rgba(248,79,79,0.2)}
  .b-b{background:rgba(100,150,200,0.12);color:#6496C8;border:1px solid rgba(100,150,200,0.2)}
  .b-ghost{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.1)}
  input,select{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;font-family:sans-serif;font-size:12px;padding:8px 11px;border-radius:8px;outline:none;width:100%}
  input:focus,select:focus{border-color:rgba(100,150,200,0.4)}
  input::placeholder{color:rgba(255,255,255,0.2)}
  .fg{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
  .fg3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px}
  .fl{font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(159,180,193,0.5);display:block;margin-bottom:5px}
  .mo{position:fixed;inset:0;background:rgba(0,0,0,0.75);backdrop-filter:blur(8px);z-index:999;display:flex;align-items:center;justify-content:center;padding:20px}
  .modal{background:#070d1c;border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:28px;width:100%;max-width:540px;max-height:90vh;overflow-y:auto}
  .mt{font-size:17px;font-weight:800;color:#fff;margin-bottom:20px}
  @media(max-width:768px){.ab{padding:14px}.fg,.fg3{grid-template-columns:1fr}table{font-size:11px}th,td{padding:8px 6px}}
`;

function LoginGate({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const attempt = () => pw === ADMIN_PASSWORD ? onLogin() : setErr(true);
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#02040a" }}>
      <style>{CSS}</style>
      <div style={{ background:"#070d1c", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:40, width:"100%", maxWidth:360 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:42, height:42, borderRadius:"50%", background:"linear-gradient(135deg,#9FB4C1,#0C1A30)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:900, color:"#fff", margin:"0 auto 12px" }}>KCG</div>
          <h1 style={{ fontSize:"1.2rem", fontWeight:800, color:"#fff", marginBottom:4 }}>Admin Panel</h1>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>Restricted access only</p>
        </div>
        <label className="fl">Password</label>
        <input type="password" placeholder="••••••••" value={pw}
          onChange={e=>{ setPw(e.target.value); setErr(false); }}
          onKeyDown={e=>e.key==="Enter"&&attempt()}
          style={{ marginBottom:10 }} />
        {err && <p style={{ fontSize:11, color:"#F84F4F", marginBottom:10 }}>Incorrect password</p>}
        <button className="btn b-g" style={{ width:"100%", padding:"10px" }} onClick={attempt}>Access Admin →</button>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [authed, setAuthed]   = useState(false);
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [tab, setTab]         = useState("clients");
  const [modal, setModal]     = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY_CLIENT);
  const [saved, setSaved]     = useState(false);
  const [withdrawals, setWithdrawals] = useState([
    { id:"w1", client:"Cottrell", email:"cottrell@kaizencapitalgrp.com", amount:2500, wallet:"TRcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", date:"2025-01-10", status:"pending" },
  ]);

  if (!authed) return <LoginGate onLogin={() => setAuthed(true)} />;

  const totalBalance   = clients.reduce((s,c)=>s+c.balance,0);
  const totalProfit    = clients.reduce((s,c)=>s+c.profit,0);
  const totalWithdrawn = clients.reduce((s,c)=>s+c.withdrawn,0);
  const activeCount    = clients.filter(c=>c.status==="active").length;
  const pendingW       = withdrawals.filter(w=>w.status==="pending").length;

  const openAdd = () => { setForm({...EMPTY_CLIENT, id:Date.now().toString()}); setEditing(null); setModal("form"); };
  const openEdit = c => { setForm({...c}); setEditing(c.id); setModal("form"); };

  const save = () => {
    if (!form.name || !form.email) return;
    setClients(prev => editing
      ? prev.map(c => c.id===editing ? {...form} : c)
      : [...prev, {...form}]
    );
    setModal(null); setSaved(true); setTimeout(()=>setSaved(false), 2500);
  };

  const remove = id => confirm("Remove this client permanently?") && setClients(prev=>prev.filter(c=>c.id!==id));
  const uf = (k,v) => setForm(f=>({...f,[k]:v}));

  const approveW = id => setWithdrawals(prev=>prev.map(w=>w.id===id?{...w,status:"approved"}:w));
  const rejectW  = id => setWithdrawals(prev=>prev.map(w=>w.id===id?{...w,status:"rejected"}:w));

  return (
    <>
      <style>{CSS}</style>
      <div className="aw">

        {/* Header */}
        <div className="ah">
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#9FB4C1,#0C1A30)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:7, fontWeight:900, color:"#fff" }}>KCG</div>
            <div>
              <div style={{ fontSize:12, fontWeight:800, color:"#fff" }}>KCG Admin</div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>Kaizen Capital Group</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {saved && <span style={{ fontSize:11, color:"#00E87A", alignSelf:"center", marginRight:4 }}>✓ Saved</span>}
            <a href="/portal" style={{ textDecoration:"none" }}><button className="btn b-ghost">Portal</button></a>
            <a href="/" style={{ textDecoration:"none" }}><button className="btn b-ghost">Site</button></a>
            <button className="btn b-r" onClick={()=>setAuthed(false)}>Sign Out</button>
          </div>
        </div>

        <div className="ab">

          {/* Tabs */}
          <div style={{ display:"flex", gap:6, marginBottom:22, flexWrap:"wrap" }}>
            {[["clients",`👥 Clients (${clients.length})`],["withdrawals",`💸 Withdrawals${pendingW>0?` (${pendingW})`:""}`,],["funds","📊 Funds"]].map(([id,label])=>(
              <button key={id} className="btn" onClick={()=>setTab(id)}
                style={{ background:tab===id?"rgba(100,150,200,0.18)":"rgba(255,255,255,0.05)", color:tab===id?"#6496C8":"rgba(255,255,255,0.45)", border:`1px solid ${tab===id?"rgba(100,150,200,0.3)":"transparent"}` }}>
                {label}
              </button>
            ))}
          </div>

          {/* ── CLIENTS ── */}
          {tab==="clients" && <>
            <div className="sr">
              {[
                {l:"Total Clients", v:clients.length, g:false},
                {l:"Active",        v:activeCount,    g:true},
                {l:"Total AUM",     v:`$${totalBalance.toLocaleString()}`, g:true},
                {l:"Total Profit",  v:`$${totalProfit.toLocaleString()}`,  g:true},
                {l:"Withdrawn",     v:`$${totalWithdrawn.toLocaleString()}`, g:false},
                {l:"Pending Withdrawals", v:pendingW, g:false},
              ].map(s=>(
                <div className="sb" key={s.l}>
                  <div className="sbl">{s.l}</div>
                  <div className={`sbv${s.g?" g":""}`}>{s.v}</div>
                </div>
              ))}
            </div>

            <div className="card">
              <div className="ct">
                <span>Client Accounts</span>
                <button className="btn b-g" onClick={openAdd}>+ Add Client</button>
              </div>
              <div style={{ overflowX:"auto" }}>
                <table>
                  <thead><tr>
                    {["Name","Email","Password","Fund","Balance","Profit","Today %","Withdrawn","Status",""].map(h=><th key={h}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {clients.map(c=>(
                      <tr key={c.id}>
                        <td style={{ fontWeight:700 }}>{c.name}</td>
                        <td style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>{c.email}</td>
                        <td style={{ fontFamily:"monospace", fontSize:11, color:"rgba(100,150,200,0.7)" }}>{c.password}</td>
                        <td style={{ fontSize:11, color:"rgba(255,255,255,0.5)", maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.fund}</td>
                        <td style={{ fontWeight:700 }}>${c.balance.toLocaleString()}</td>
                        <td style={{ color:"#00E87A", fontWeight:700 }}>+${c.profit.toLocaleString()}</td>
                        <td style={{ color:"#00E87A" }}>+{c.todayReturn}%</td>
                        <td style={{ color:"rgba(255,255,255,0.5)" }}>${c.withdrawn.toLocaleString()}</td>
                        <td><span className={`badge ${c.status==="active"?"bg":c.status==="pending"?"by":"br"}`}>{c.status}</span></td>
                        <td>
                          <div style={{ display:"flex", gap:5 }}>
                            <button className="btn b-b" onClick={()=>openEdit(c)}>Edit</button>
                            <button className="btn b-r" onClick={()=>remove(c.id)}>✕</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {clients.length===0 && <p style={{ textAlign:"center", color:"rgba(255,255,255,0.2)", padding:"32px 0", fontSize:12 }}>No clients yet. Add one above.</p>}
              </div>
            </div>
          </>}

          {/* ── WITHDRAWALS ── */}
          {tab==="withdrawals" && (
            <div className="card">
              <div className="ct">Withdrawal Requests</div>
              <table>
                <thead><tr>{["Client","Email","Amount","Wallet","Date","Status","Action"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {withdrawals.map(w=>(
                    <tr key={w.id}>
                      <td style={{ fontWeight:700 }}>{w.client}</td>
                      <td style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{w.email}</td>
                      <td style={{ fontWeight:700, color:"#F84F4F" }}>${w.amount.toLocaleString()}</td>
                      <td style={{ fontFamily:"monospace", fontSize:10, color:"rgba(255,255,255,0.4)" }}>{w.wallet.slice(0,16)}…</td>
                      <td style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>{w.date}</td>
                      <td><span className={`badge ${w.status==="approved"?"bg":w.status==="rejected"?"br":"by"}`}>{w.status}</span></td>
                      <td>
                        {w.status==="pending" && (
                          <div style={{ display:"flex", gap:5 }}>
                            <button className="btn b-g" onClick={()=>approveW(w.id)}>Approve</button>
                            <button className="btn b-r" onClick={()=>rejectW(w.id)}>Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {withdrawals.length===0 && <p style={{ textAlign:"center", color:"rgba(255,255,255,0.2)", padding:"32px 0", fontSize:12 }}>No withdrawal requests</p>}
            </div>
          )}

          {/* ── FUNDS ── */}
          {tab==="funds" && (
            <div className="card">
              <div className="ct">Fund Overview</div>
              <table>
                <thead><tr>{["Fund","Clients","Total AUM","Avg Monthly","Status"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {FUNDS.map(f=>{
                    const fc=clients.filter(c=>c.fund===f);
                    const aum=fc.reduce((s,c)=>s+c.balance,0);
                    return (
                      <tr key={f}>
                        <td style={{ fontWeight:700 }}>{f}</td>
                        <td>{fc.length}</td>
                        <td style={{ color:"#00E87A", fontWeight:700 }}>{aum>0?`$${aum.toLocaleString()}`:"—"}</td>
                        <td style={{ color:"#00E87A" }}>+9.2%</td>
                        <td><span className={`badge ${fc.length>0?"bg":"by"}`}>{fc.length>0?"ACTIVE":"NO CLIENTS"}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── CLIENT FORM MODAL ── */}
      {modal==="form" && (
        <div className="mo" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal">
            <div className="mt">{editing?"Edit Client":"Add New Client"}</div>

            <div className="fg">
              <div><label className="fl">Full Name</label><input value={form.name} onChange={e=>uf("name",e.target.value)} placeholder="John Smith" /></div>
              <div><label className="fl">Email</label><input type="email" value={form.email} onChange={e=>uf("email",e.target.value)} placeholder="client@email.com" /></div>
            </div>
            <div className="fg">
              <div><label className="fl">Password</label><input value={form.password} onChange={e=>uf("password",e.target.value)} placeholder="KCG2026" /></div>
              <div><label className="fl">Status</label>
                <select value={form.status} onChange={e=>uf("status",e.target.value)}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <div className="fg">
              <div><label className="fl">Fund</label>
                <select value={form.fund} onChange={e=>uf("fund",e.target.value)}>
                  {FUNDS.map(f=><option key={f}>{f}</option>)}
                </select>
              </div>
              <div><label className="fl">Broker</label>
                <select value={form.broker} onChange={e=>uf("broker",e.target.value)}>
                  {["TMGM","MultiBank","TradeSmart"].map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div className="fg3">
              <div><label className="fl">Balance ($)</label><input type="number" value={form.balance} onChange={e=>uf("balance",parseFloat(e.target.value)||0)} /></div>
              <div><label className="fl">Total Profit ($)</label><input type="number" value={form.profit} onChange={e=>uf("profit",parseFloat(e.target.value)||0)} /></div>
              <div><label className="fl">Today's Return (%)</label><input type="number" step="0.01" value={form.todayReturn} onChange={e=>uf("todayReturn",parseFloat(e.target.value)||0)} /></div>
            </div>
            <div className="fg">
              <div><label className="fl">Withdrawn ($)</label><input type="number" value={form.withdrawn} onChange={e=>uf("withdrawn",parseFloat(e.target.value)||0)} /></div>
              <div><label className="fl">Join Date</label><input type="date" value={form.joined} onChange={e=>uf("joined",e.target.value)} /></div>
            </div>

            <div style={{ display:"flex", gap:8, marginTop:8 }}>
              <button className="btn b-g" style={{ flex:1, padding:"10px" }} onClick={save}>{editing?"Save Changes →":"Add Client →"}</button>
              <button className="btn b-ghost" onClick={()=>setModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

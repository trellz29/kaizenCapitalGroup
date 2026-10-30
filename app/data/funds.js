// Single fund roster for the whole site (F1, F12). Edit funds here only.
// No return figures live here on purpose (D1/D2, F2/F7): a figure may only be shown
// next to its own verified track-record link and RISK_LINE.

export const FUNDS = [
  { id:"1",  name:"KaizenCapitalGroup.Xau-TMGM",  focus:"Gold Scalping & Intra-day", broker:"TMGM",       managers:1, status:"live",         tag:"FLAGSHIP",       color:"#00E87A",
    link:"https://signal.tmc2lnbmfs.com/portal/registration/subscription/94720/KCG-TMGM",
    track:"https://ratings.tmgmplatform.com/widgets/shared/5173e304d7494051b27287f70426a327?lang=en%3Fpreview%3DP3U9ODIxMzA2JmE9MTM0NjMmcD0xMzgzNCZ3PTEmcz01MTczZTMwNGQ3NDk0MDUxYjI3Mjg3ZjcwNDI2YTMyNw%3D%3D" },
  { id:"1a", name:"KaizenCapitalGroup.Xau-MB",     focus:"Gold Scalping & Intra-day", broker:"MultiBank",  managers:1, status:"live",         tag:"LIVE",           color:"#00E87A",
    link:"https://social.mexatlantic.com/portal/registration/subscription/89528/KCG30",
    track:null },
  { id:"2",  name:"TradeXMarkets Fund",            focus:"Gold + Oil",                broker:"MultiBank",  managers:2, status:"coming",       tag:"COMING SOON",    color:"#6496C8", link:null, track:null },
  { id:"3",  name:"VaultKano Fund",               focus:"Crypto (BTC) + Gold",       broker:"MultiBank",  managers:2, status:"relaunching",  tag:"RE-LAUNCHING",   color:"#F59E0B", link:null, track:null },
  { id:"4",  name:"Forex Profit Snipers Fund",    focus:"Forex + Gold",              broker:"TBC",        managers:2, status:"coming",       tag:"US INCLUDED",    color:"#9FB4C1", link:null, track:null },
  { id:"5",  name:"Trellz + Phoenix",             focus:"Gold + FX Currencies",      broker:"MultiBank",  managers:2, status:"coming",       tag:"SPECULATIVE",    color:"#6496C8", link:null, track:null },
  { id:"6",  name:"Phoenix",                      focus:"Forex Mixed Assets",        broker:"MultiBank",  managers:1, status:"coming",       tag:"AI · COMING SOON", color:"#a78bfa", link:null, track:null },
  { id:"7",  name:"Forex Fortune Fund",           focus:"EUR/USD",                   broker:"MultiBank",  managers:1, status:"coming",       tag:"AI POWERED",     color:"#a78bfa", link:null, track:null },
  { id:"8",  name:"The Alpha Fund",               focus:"Gold Manual Trading",       broker:"TMGM",       managers:2, status:"live",         tag:"LIVE",           color:"#00E87A",
    link:"https://signal.tmc2lnbmfs.com/portal/registration/subscription/67622/Alpha",
    track:"https://ratings.tmgmplatform.com/widgets/shared/05a7391d205e4c82982ea3141e98aee5?lang=en?preview=P3U9N2M1Y2IwJmE9MTg5ODgmcD0xOTUwMCZ3PTEmcz0wNWE3MzkxZDIwNWU0YzgyOTgyZWEzMTQxZTk4YWVlNQ==" },
  { id:"9",  name:"Algo Amalgamation Fund",       focus:"Multi-asset (Fully Algo)",  broker:"MultiBank / TMGM", managers:0, status:"coming", tag:"ALGORITHMIC", color:"#6496C8", link:null, track:null },
  { id:"10", name:"PfaneTXau Fund",               focus:"CFDs — All Indices",        broker:"TBC",        managers:1, status:"discontinued", tag:"DISCONTINUED",   color:"#555",    link:null, track:null },
  { id:"11", name:"MAMALYN Fund",                 focus:"EUR/USD Fully Algorithmic", broker:"MultiBank",  managers:1, status:"live",         tag:"LIVE",           color:"#00E87A",
    link:"https://social.multibankfx.com/portal/registration/subscription/89236/mamalynMin3000dollars",
    track:"https://www.myfxbook.com/members/Panevino83/mamalyn-mt4-31229860/11078849" },
  { id:"12", name:"CXFund",                       focus:"Gold Manual Trading",       broker:"TMGM",       managers:2, status:"live",         tag:"LIVE",           color:"#00E87A",
    link:"https://signal.tmc2lnbmfs.com/portal/registration/subscription/69413/CXFund2026",
    track:"https://ratings.tmgmplatform.com/widgets/shared/cc306ad97ef243a5aa092cd4d0d226bb?lang=en?preview=P3U9NjJiODU0JmE9MTg3MzkmcD0xOTI0NyZ3PTEmcz1jYzMwNmFkOTdlZjI0M2E1YWEwOTJjZDRkMGQyMjZiYg==" },
];

export const LIVE_FUNDS = FUNDS.filter(f => f.status === "live");
export const LIVE_COUNT = LIVE_FUNDS.length;
export const FUND_COUNT = FUNDS.length;
export const APPROVED_BROKERS = ["TMGM", "MultiBank", "Genesis FX"];
export const FUND_SUMMARY = `${LIVE_COUNT} live funds · ${FUND_COUNT} strategies`;
export const RISK_LINE = "Past performance does not guarantee future results. Trading involves risk of loss.";
export const CALENDLY_URL = "https://calendly.com/trellzp12/30min";
export const SUPPORT_EMAIL = "support@kaizencapitalgrp.com";

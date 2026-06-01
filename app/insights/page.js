import Link from "next/link";

export const metadata = {
  title: 'Insights | Kaizen Capital Group',
  description: 'Market analysis, fund strategy, and institutional investment perspectives from the Kaizen Capital Group team.',
  openGraph: {
    title: 'Insights | Kaizen Capital Group',
    description: 'Market analysis, fund strategy, and institutional investment perspectives.',
    url: 'https://www.kaizencapitalgrp.com/insights',
    siteName: 'Kaizen Capital Group',
    type: 'website',
  },
};

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/funds", label: "Funds" },
  { href: "/performance", label: "Performance" },
  { href: "/contact", label: "Contact" },
  { href: "/portal", label: "Portal" },
  { href: "/insights", label: "Insights" },
];

const ARTICLES = [
  {
    category: "Institutional Strategy",
    date: "May 2026",
    readTime: "5 min read",
    title: "Why Structure Is the Foundation of Every Serious Fund",
    excerpt: "Most retail investors chase returns. Institutional investors build structure first. The difference between a fund that survives a drawdown and one that collapses under it rarely comes down to strategy — it comes down to how the fund was built.",
    paragraphs: [
      "Most retail investors chase returns. Institutional investors build structure first.",
      "The difference between a fund that survives a drawdown and one that collapses under it rarely comes down to strategy — it comes down to how the fund was built. Risk parameters, capital allocation rules, manager accountability, brokerage relationships — these are not administrative details. They are the fund.",
      "At KCG, every fund in our platform is evaluated against a structural checklist before it goes live. We ask: what is the maximum drawdown tolerance? What triggers a halt? Who is accountable when the system deviates from its parameters? How is investor capital protected if a manager exits?",
      "These questions sound obvious. But most funds operating at the retail and semi-institutional level do not have written answers to any of them.",
      "Structure is not a constraint on performance. It is what makes consistent performance possible. A well-structured fund with a 30% annual return is worth more than an unstructured fund with a 60% return — because the 30% is repeatable and the 60% is an accident waiting to reverse.",
      "This is the core philosophy behind the KCG platform. We do not just allocate to strategies. We build the scaffolding that holds them together.",
    ],
    accent: "from-[#A9C2D1] via-[#DCE7EE] to-[#C7D9E4]",
  },
  {
    category: "Market Outlook",
    date: "April 2026",
    readTime: "6 min read",
    title: "Gold in 2026: The Institutional Case for Staying Long",
    excerpt: "Gold has been one of the most consistently misread assets of the past decade. When it underperforms equities, it gets dismissed. When it outperforms, it gets called a bubble. The institutional view is simpler: gold is a monetary hedge, and the conditions that make it attractive have not changed.",
    paragraphs: [
      "Gold has been one of the most consistently misread assets of the past decade. When it underperforms equities, it gets dismissed. When it outperforms, it gets called a bubble. The institutional view is simpler: gold is a monetary hedge, and the conditions that make it attractive have not changed.",
      "What has changed is the sophistication with which institutional capital accesses gold exposure. CFD-based gold trading, in particular, has opened up intraday and swing strategies that were previously inaccessible to non-exchange participants.",
      "At KCG, our longest-running funds are gold-focused. Not because gold is the best performing asset in any given year — it is not always — but because it is structurally reliable. The correlation with dollar weakness, geopolitical uncertainty, and central bank accumulation creates a persistent edge for systematic strategies.",
      "The macro backdrop for 2026 remains supportive. Central bank gold reserves are at multi-decade highs. The dollar reserve currency status faces ongoing structural questions. Real yields, though elevated, are compressing at the margin.",
      "The institutional case for gold is not sentimental. It is mechanical. And right now, the mechanics are favourable.",
    ],
    accent: "from-[#B8D4C2] via-[#DCE7EE] to-[#C7D9E4]",
  },
  {
    category: "Fund Strategy",
    date: "March 2026",
    readTime: "7 min read",
    title: "Algorithmic vs Manual: How KCG Thinks About the Balance",
    excerpt: "The debate between algorithmic and manual trading is often framed as a competition. In practice, the most resilient funds use both — but with clear rules about when each approach applies. The question is not which is better. It is which is better for a specific market condition.",
    paragraphs: [
      "The debate between algorithmic and manual trading is often framed as a competition. In practice, the most resilient funds use both — but with clear rules about when each applies.",
      "Algorithmic trading excels in high-frequency, pattern-dependent environments. When market structure is consistent — defined sessions, predictable liquidity windows, stable correlations — algorithms outperform humans on execution speed, discipline, and scalability. There is no fatigue, no emotional drift, no second-guessing at 2am.",
      "Manual trading has its own edge: adaptability. In regime-change environments — central bank pivots, geopolitical shocks, structural breaks in correlation — experienced discretionary traders often outperform algorithms that were trained on historical data that no longer applies.",
      "At KCG, we do not mandate one approach. We evaluate each fund manager on how clearly they understand the conditions in which their approach works — and, crucially, the conditions in which it does not.",
      "Our algorithmic funds come with explicit regime filters: conditions under which the system steps back from the market rather than trading into chaos. Our manual funds come with defined drawdown limits that remove discretion at the worst possible moments.",
      "The best trading operations we have seen do not ask whether to use algo or manual. They ask: what are the rules, and do you follow them? That question applies equally to both.",
    ],
    accent: "from-[#C2BFD4] via-[#DCE7EE] to-[#C7D9E4]",
  },
];

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-[#E6EEF2] text-[#0F1A28]">
      <nav className="fixed top-0 left-0 z-50 w-full border-b border-white/40 backdrop-blur-xl bg-[#E6EEF2]/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F1A28] sm:h-8 sm:w-8">
              <span className="text-[10px] font-bold text-white">K</span>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2E4358] sm:text-xs">Kaizen Capital Group</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#2E4358]">
            {NAV_LINKS.map(l => <Link key={l.href} href={l.href} className="hover:opacity-70 transition-opacity">{l.label}</Link>)}
          </div>
          <Link href="/contact" className="rounded-full bg-[#0F1A28] px-4 py-2 text-xs font-semibold text-white hover:opacity-80 transition-opacity">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="px-4 pb-8 pt-36 sm:px-6 sm:pt-44">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#5A7188]">Insights</p>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-[#0F1A28] sm:text-5xl md:text-6xl">
            Perspectives on Capital,<br className="hidden sm:block" /> Structure &amp; Markets
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[#2E4358]">
            Analysis and thinking from the KCG team — on fund construction, market dynamics, and the principles behind long-term institutional performance.
          </p>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-5xl space-y-8">
          {ARTICLES.map((article, i) => (
            <article key={i} className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/75 shadow-[0_12px_40px_rgba(15,26,40,0.07)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1">
              <div className={"absolute inset-x-0 top-0 h-1 bg-gradient-to-r " + article.accent} />
              <div className="p-7 sm:p-8 md:flex md:gap-8">
                <div className="mb-6 md:mb-0 md:w-48 md:shrink-0">
                  <span className="inline-block rounded-full bg-[#E6EEF2] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#5A7188]">{article.category}</span>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#9FB4C1]">
                    <span>{article.date}</span>
                    <span>·</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="mb-3 text-xl font-bold leading-snug text-[#0F1A28] sm:text-2xl">{article.title}</h2>
                  <p className="mb-5 text-[#2E4358] leading-relaxed">{article.excerpt}</p>
                  <details className="group/d">
                    <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#0F1A28] hover:opacity-70 transition-opacity list-none">
                      <span>Read article</span>
                      <span className="text-[#9FB4C1] transition-transform group-open/d:rotate-180">&#9660;</span>
                    </summary>
                    <div className="mt-5 space-y-4 border-t border-white/60 pt-5">
                      {article.paragraphs.map((p, j) => (
                        <p key={j} className="text-[#2E4358] leading-relaxed">{p}</p>
                      ))}
                    </div>
                  </details>
                </div>
              </div>
            </article>
          ))}

          <div className="rounded-3xl border border-white/60 bg-white/50 p-8 text-center backdrop-blur-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#5A7188]">More Coming</p>
            <h3 className="mb-3 text-2xl font-bold text-[#0F1A28]">New perspectives published regularly</h3>
            <p className="mx-auto mb-6 max-w-lg text-[#2E4358]">Join the KCG Telegram community to get notified when new insights are published.</p>
            <a href="https://t.me/KaizenCapitalGroup" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#0F1A28] px-6 py-3 text-sm font-semibold text-white hover:opacity-80 transition-opacity">
              Join Telegram Community
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/40 bg-white/30 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#9FB4C1]">© 2026 Kaizen Capital Group. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 text-xs text-[#5A7188]">
            {NAV_LINKS.map(l => <Link key={l.href} href={l.href} className="hover:opacity-70 transition-opacity">{l.label}</Link>)}
            <Link href="/privacy" className="hover:opacity-70 transition-opacity">Privacy</Link>
            <Link href="/disclaimer" className="hover:opacity-70 transition-opacity">Disclaimer</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

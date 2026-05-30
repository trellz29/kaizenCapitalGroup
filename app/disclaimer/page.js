import Link from "next/link";

export const metadata = {
  title: "Risk Disclaimer | Kaizen Capital Group",
  description: "Important risk disclosure and disclaimer information for Kaizen Capital Group funds and services.",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[#E6EEF2] px-4 py-32 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-[#5A7188] hover:text-[#0F1A28] transition-colors">
          ← Back to Home
        </Link>
        <h1 className="mb-2 text-4xl font-bold text-[#0F1A28]">Risk Disclaimer</h1>
        <p className="mb-10 text-sm text-[#5A7188]">Last updated: May 2026</p>
        <div className="space-y-8 text-[#2E4358] leading-relaxed">
          <section>
            <h2 className="mb-3 text-xl font-bold text-[#0F1A28]">1. General Risk Warning</h2>
            <p>Trading and investing in financial instruments including CFDs, Forex, Crypto, Indices, and Commodities involves substantial risk of loss and may not be suitable for all investors. The high degree of leverage available in these markets can work against you as well as for you.</p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-bold text-[#0F1A28]">2. Past Performance</h2>
            <p>Past performance of any fund, strategy, or trader featured on this website is not indicative of future results. All performance figures, return percentages, win rates, and drawdown statistics are historical and do not guarantee similar results going forward.</p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-bold text-[#0F1A28]">3. No Investment Advice</h2>
            <p>Nothing on this website constitutes financial, investment, legal, or tax advice. The information provided is for informational purposes only. KCG does not act as a financial advisor, broker, or registered investment adviser. Any decision to invest is made solely at your own discretion and risk.</p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-bold text-[#0F1A28]">4. Fund Access &amp; Eligibility</h2>
            <p>Access to KCG funds is subject to eligibility requirements, minimum investment thresholds, and the terms set by the relevant third-party brokerages (TMGM, MultiBank, GenesisFX). KCG acts as an introducer and signal/copy-trade provider, not as a custodian or fund manager. All trading accounts remain in the client's name with the respective regulated broker.</p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-bold text-[#0F1A28]">5. Leverage &amp; Margin Risk</h2>
            <p>Many instruments traded across KCG funds use leverage. Leveraged products can result in losses that exceed your initial deposit. Never invest money you cannot afford to lose.</p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-bold text-[#0F1A28]">6. Third-Party Platforms</h2>
            <p>KCG operates through third-party regulated brokerages. KCG is not responsible for the acts, omissions, or financial standing of any third-party platform or broker. Use of affiliate links may result in KCG receiving a referral fee which does not affect your trading costs.</p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-bold text-[#0F1A28]">7. Regulatory Notice</h2>
            <p>Kaizen Capital Group is not a regulated financial institution in any jurisdiction and does not hold a financial services licence or investment management authorisation. Prospective investors should seek independent regulated financial advice before committing capital.</p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-bold text-[#0F1A28]">8. Contact</h2>
            <p>Questions about this disclaimer: <a href="mailto:support@kaizencapitalgrp.com" className="text-[#0F1A28] underline underline-offset-2 hover:opacity-70">support@kaizencapitalgrp.com</a></p>
          </section>
        </div>
        <div className="mt-12 flex gap-4">
          <Link href="/" className="rounded-full bg-[#0F1A28] px-6 py-3 text-sm font-semibold text-white hover:opacity-80 transition-opacity">Back to Home</Link>
          <Link href="/contact" className="rounded-full border border-[#2E4358]/40 bg-white/50 px-6 py-3 text-sm font-semibold text-[#0F1A28] hover:bg-white/75 transition-colors">Contact Us</Link>
        </div>
      </div>
    </main>
  );
}

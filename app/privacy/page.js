export const metadata = {
  title: 'Privacy Policy | Kaizen Capital Group',
  description: 'Privacy Policy for Kaizen Capital Group.',
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#E6EEF2] px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F1A28]">
            <span className="text-[10px] font-black text-white">KCG</span>
          </div>
          <span className="text-sm font-semibold uppercase tracking-widest text-[#5A7188]">Kaizen Capital Group</span>
        </div>
        <h1 className="mb-2 text-4xl font-bold text-[#0F1A28]">Privacy Policy</h1>
        <p className="mb-10 text-sm text-[#5A7188]">Last updated: May 28, 2026</p>

        <div className="space-y-8 text-[#2E4358]">
          <section>
            <h2 className="mb-3 text-xl font-bold text-[#0F1A28]">1. Information We Collect</h2>
            <p className="leading-7">When you submit an inquiry through our website, we collect your name, email address, inquiry type, capital interest level, and message. We may also collect basic usage data such as pages visited and time spent on the site.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-[#0F1A28]">2. How We Use Your Information</h2>
            <p className="leading-7">We use the information you provide to respond to your inquiry, assess investment fit, and communicate relevant opportunities at Kaizen Capital Group. We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-[#0F1A28]">3. Data Storage</h2>
            <p className="leading-7">Inquiry data is stored securely and used solely for the purpose of managing investor relationships. We use industry-standard security measures to protect your information.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-[#0F1A28]">4. Cookies</h2>
            <p className="leading-7">Our website may use cookies to improve your browsing experience. You can disable cookies in your browser settings at any time.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-[#0F1A28]">5. Third-Party Services</h2>
            <p className="leading-7">We use third-party services including Calendly for booking, Telegram for messaging, and analytics tools to improve our platform. These services have their own privacy policies.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-[#0F1A28]">6. Your Rights</h2>
            <p className="leading-7">You have the right to request access to, correction of, or deletion of your personal data. To make a request, contact us at support@kaizencapitalgrp.com.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-[#0F1A28]">7. Investment Disclaimer</h2>
            <p className="leading-7">Nothing on this website constitutes financial or investment advice. Past performance is not indicative of future results. All investments involve risk, including the possible loss of principal.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-[#0F1A28]">8. Contact</h2>
            <p className="leading-7">For any privacy-related questions, contact us at <a href="mailto:support@kaizencapitalgrp.com" className="text-[#0F1A28] underline">support@kaizencapitalgrp.com</a>.</p>
          </section>
        </div>

        <div className="mt-12 border-t border-[#C9D8E2] pt-8">
          <a href="/" className="rounded-full bg-[#0F1A28] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1A2A3D]">← Back to Home</a>
        </div>
      </div>
    </main>
  );
}

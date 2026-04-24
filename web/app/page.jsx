import Link from 'next/link';
import { HiArrowRight } from 'react-icons/hi2';

export default function HomePage() {
  return (
    <main className="fintech-grid min-h-screen px-4 py-10 lg:px-6">
      <div className="mx-auto max-w-7xl rounded-[36px] bg-[#091d13] p-6 text-white shadow-soft lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#cf9f47]">Revenue-first fintech architecture</p>
            <h1 className="display-font mt-5 max-w-3xl text-5xl font-semibold leading-tight lg:text-7xl">
              Super app rails for rent, travel, cards, recharge, and bills.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-white/70">
              MarginMint is designed to monetize every high-frequency payment surface with controlled convenience fees,
              markups, commissions, and webhook-verified settlements.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[#ff7a59] px-5 py-3 font-semibold text-ink">
                Launch App <HiArrowRight />
              </Link>
              <Link href="/register" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 font-semibold text-white">
                Create Account
              </Link>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['Rent via credit card', '3.25% platform fee + GST'],
              ['Credit card bill pay', 'Convenience margin embedded'],
              ['Flight booking', 'Markup + service fee per ticket'],
              ['Hotel booking', 'Commission-led room monetization'],
              ['Mobile recharge', 'Operator commission capture'],
              ['Bill pay', 'Convenience fee on recurring utility usage']
            ].map(([title, subtitle]) => (
              <div key={title} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <h3 className="display-font text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-white/65">{subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

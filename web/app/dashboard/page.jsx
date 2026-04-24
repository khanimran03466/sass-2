'use client';

import { AppShell } from '@/components/layout/AppShell';
import { ProtectedPage } from '@/components/shared/ProtectedPage';
import { SectionCard } from '@/components/shared/SectionCard';
import { StatCard } from '@/components/shared/StatCard';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedPage>
      <AppShell
        title={`Welcome, ${user?.name?.split(' ')[0] || 'Operator'}`}
        subtitle="Track the highest-margin payment corridors first: rent, cards, flights, hotels, recharge, and recurring utilities."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Rent Yield" value="3.25%" hint="Platform fee before GST per rent payment." />
          <StatCard label="Flight Margin" value="6% +" hint="Base markup plus fixed ticket service fee." />
          <StatCard label="Hotel Margin" value="15% blended" hint="Markup plus service fee on room inventory." />
          <StatCard label="Recharge Yield" value="2.5%" hint="Commission capture on every prepaid recharge." />
        </div>

        <SectionCard title="Profit map" subtitle="Each module is engineered as a repeatable revenue stream, not a passive utility feature.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              ['Rent', 'High ticket size with transparent fee recovery and razorpay webhook reconciliation.'],
              ['Credit cards', 'Convenience pricing on urgent due-date payments.'],
              ['Flights', 'Markupable search inventory with API-ready supplier adapters.'],
              ['Hotels', 'Commission-led bookings with room-level yield control.'],
              ['Recharge', 'Fast repeat usage and commission-backed transactions.'],
              ['Bills', 'Sticky recurring bill payments with convenience fees.']
            ].map(([title, copy]) => (
              <div key={title} className="rounded-[24px] border border-ink/10 bg-white/70 p-4">
                <h4 className="display-font text-xl font-semibold">{title}</h4>
                <p className="mt-2 text-sm text-slate">{copy}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </AppShell>
    </ProtectedPage>
  );
}

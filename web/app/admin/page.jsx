'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedPage } from '@/components/shared/ProtectedPage';
import { SectionCard } from '@/components/shared/SectionCard';
import { StatCard } from '@/components/shared/StatCard';
import { adminApi } from '@/services/api';
import { useToast } from '@/hooks/useToast';

export default function AdminPage() {
  const { pushToast } = useToast();
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [analyticsRes, usersRes] = await Promise.all([adminApi.analytics(), adminApi.users()]);
        setAnalytics(analyticsRes.analytics);
        setUsers(usersRes.users || []);
      } catch (error) {
        pushToast(error.message || 'Unable to load admin analytics', 'error');
      }
    };

    loadData();
  }, []);

  return (
    <ProtectedPage role="ADMIN">
      <AppShell title="Admin Revenue Console" subtitle="Monitor GMV, module-wise profit, user growth, refunds, and transaction quality from one place.">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Users" value={analytics?.users || 0} hint="Registered accounts on the platform." />
          <StatCard label="GMV" value={`INR ${analytics?.grossVolume || 0}`} hint="Successful payment volume only." />
          <StatCard label="Revenue" value={`INR ${analytics?.totalRevenue || 0}`} hint="Captured net revenue after webhook settlement." />
        </div>

        <SectionCard title="Revenue by module" subtitle="Highest-margin modules should be prioritized in acquisition and retargeting.">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Object.entries(analytics?.revenueByPurpose || {}).map(([key, value]) => (
              <div key={key} className="rounded-[22px] border border-ink/10 bg-white/70 p-4">
                <div className="text-sm uppercase tracking-[0.2em] text-slate">{key}</div>
                <div className="display-font mt-2 text-2xl font-semibold">INR {value}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Users" subtitle="Recent signups and role visibility.">
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="rounded-[20px] border border-ink/10 bg-white/70 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{user.name}</h4>
                    <p className="text-sm text-slate">{user.email}</p>
                  </div>
                  <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">{user.role}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </AppShell>
    </ProtectedPage>
  );
}

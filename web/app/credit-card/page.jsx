'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppShell } from '@/components/layout/AppShell';
import { TextField } from '@/components/forms/TextField';
import { FormActions } from '@/components/shared/FormActions';
import { ActionGuard } from '@/components/shared/ActionGuard';
import { SectionCard } from '@/components/shared/SectionCard';
import { RevenueBreakdown } from '@/components/shared/RevenueBreakdown';
import { EmptyState } from '@/components/shared/EmptyState';
import { creditCardApi } from '@/services/api';
import { useToast } from '@/hooks/useToast';

export default function CreditCardPage() {
  const form = useForm();
  const { pushToast } = useToast();
  const [preview, setPreview] = useState(null);
  const [payments, setPayments] = useState([]);

  const loadPayments = async () => {
    try {
      const response = await creditCardApi.payments();
      setPayments(response.payments || []);
    } catch (error) {
      if (error.status !== 401) {
        pushToast(error.message || 'Unable to load card payments', 'error');
      }
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const response = await creditCardApi.createPayment({
        ...values,
        dueAmount: Number(values.dueAmount)
      });
      setPreview(response.revenue);
      pushToast('Credit card payment order created');
      form.reset();
      loadPayments();
    } catch (error) {
      pushToast(error.message || 'Unable to create credit card payment', 'error');
    }
  });

  return (
    <AppShell title="Credit Card Bill Payment" subtitle="Capture urgency-led convenience fees on bill settlement while keeping card data out of your systems.">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard title="Pay card bill" subtitle="Use last 4 digits only for customer reference and reconciliation.">
          <ActionGuard message="Sign in to pay your credit card bills">
            <form onSubmit={onSubmit} className="space-y-4">
              <TextField 
                label="Card issuer" 
                error={form.formState.errors.cardIssuer?.message}
                {...form.register('cardIssuer', { required: 'Issuer name is required' })} 
              />
              <TextField 
                label="Card last 4 digits" 
                maxLength={4} 
                error={form.formState.errors.cardLast4?.message}
                {...form.register('cardLast4', { 
                  required: 'Last 4 digits required',
                  pattern: { value: /^[0-9]{4}$/, message: 'Must be 4 digits' }
                })} 
              />
              <TextField 
                label="Due amount" 
                type="number" 
                step="0.01" 
                error={form.formState.errors.dueAmount?.message}
                {...form.register('dueAmount', { required: 'Amount is required' })} 
              />
              <FormActions submitting={form.formState.isSubmitting} label="Create bill payment order" />
            </form>
          </ActionGuard>
          <div className="mt-4">
            <RevenueBreakdown revenue={preview} />
          </div>
        </SectionCard>

        <SectionCard title="Recent bill payments" subtitle="Track service-fee backed payment intents and completed settlements.">
          <ActionGuard message="Sign in to view your payment history">
            {payments.length ? (
              <div className="space-y-3">
                {payments.map((item) => (
                  <div key={item.id} className="rounded-[22px] border border-ink/10 bg-white/70 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{item.cardIssuer} ending {item.cardLast4}</h4>
                        <p className="text-sm text-slate">{item.status}</p>
                      </div>
                      <div className="display-font text-xl font-semibold">INR {String(item.payment.totalAmount)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No card bill payments yet" description="The first paid bill will show up here with margin and settlement visibility." />
            )}
          </ActionGuard>
        </SectionCard>
      </div>
    </AppShell>
  );
}

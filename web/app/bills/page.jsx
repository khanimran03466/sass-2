'use client';

import { useForm } from 'react-hook-form';
import { AppShell } from '@/components/layout/AppShell';
import { TextField } from '@/components/forms/TextField';
import { SelectField } from '@/components/forms/SelectField';
import { FormActions } from '@/components/shared/FormActions';
import { ActionGuard } from '@/components/shared/ActionGuard';
import { SectionCard } from '@/components/shared/SectionCard';
import { billApi } from '@/services/api';
import { useToast } from '@/hooks/useToast';

export default function BillsPage() {
  const form = useForm();
  const { pushToast } = useToast();

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await billApi.createPayment({
        ...values,
        amount: Number(values.amount)
      });
      pushToast('Bill payment order created');
      form.reset();
    } catch (error) {
      pushToast(error.message || 'Unable to create bill payment', 'error');
    }
  });

  return (
    <AppShell title="Utility Bill Payments" subtitle="Convenience-fee backed flows for recurring essentials including electricity, DTH, and broadband.">
      <SectionCard title="Pay a bill" subtitle="Increase retention by aggregating recurring utility spending in one control surface.">
        <ActionGuard message="Sign in to pay your bills">
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SelectField
              label="Category"
              options={[
                { label: 'Electricity', value: 'ELECTRICITY' },
                { label: 'DTH', value: 'DTH' },
                { label: 'Broadband', value: 'BROADBAND' }
              ]}
              error={form.formState.errors.category?.message}
              {...form.register('category', { required: 'Category is required' })}
            />
            <TextField 
              label="Provider name" 
              error={form.formState.errors.providerName?.message}
              {...form.register('providerName', { required: 'Provider name is required' })} 
            />
            <TextField 
              label="Consumer number" 
              error={form.formState.errors.consumerNumber?.message}
              {...form.register('consumerNumber', { required: 'Consumer number is required' })} 
            />
            <TextField 
              label="Amount" 
              type="number" 
              error={form.formState.errors.amount?.message}
              {...form.register('amount', { required: 'Amount is required' })} 
            />
            <FormActions submitting={form.formState.isSubmitting} label="Create bill order" />
          </form>
        </ActionGuard>
      </SectionCard>
    </AppShell>
  );
}

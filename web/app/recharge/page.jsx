'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppShell } from '@/components/layout/AppShell';
import { TextField } from '@/components/forms/TextField';
import { SelectField } from '@/components/forms/SelectField';
import { FormActions } from '@/components/shared/FormActions';
import { ActionGuard } from '@/components/shared/ActionGuard';
import { SectionCard } from '@/components/shared/SectionCard';
import { rechargeApi } from '@/services/api';
import { useToast } from '@/hooks/useToast';

const operators = ['Airtel', 'Jio', 'Vi'];

export default function RechargePage() {
  const form = useForm();
  const { pushToast } = useToast();
  const [plans, setPlans] = useState([]);

  const loadPlans = async (operator) => {
    try {
      const response = await rechargeApi.getPlans(operator);
      setPlans(response.plans || []);
      pushToast(`Loaded ${operator} plans`);
    } catch (error) {
      if (error.status !== 401) {
        pushToast(error.message || 'Unable to fetch recharge plans', 'error');
      }
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await rechargeApi.createTransaction({
        ...values,
        amount: Number(values.amount)
      });
      pushToast('Recharge order created');
      form.reset();
    } catch (error) {
      pushToast(error.message || 'Unable to create recharge', 'error');
    }
  });

  return (
    <AppShell title="Mobile Recharge" subtitle="High-repeat utility product with operator commissions and low-friction checkout behavior.">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard title="Create recharge" subtitle="Choose operator and plan, then monetize through commission capture.">
          <ActionGuard message="Sign in to recharge your mobile">
            <form onSubmit={onSubmit} className="space-y-4">
              <SelectField
                label="Operator"
                options={[{ label: 'Select operator', value: '' }, ...operators.map((value) => ({ label: value, value }))]}
                error={form.formState.errors.operator?.message}
                {...form.register('operator', {
                  required: 'Operator is required',
                  onChange: (event) => loadPlans(event.target.value)
                })}
              />
              <TextField 
                label="Mobile number" 
                maxLength={10} 
                error={form.formState.errors.mobileNumber?.message}
                {...form.register('mobileNumber', { 
                  required: 'Mobile number is required',
                  pattern: { value: /^[0-9]{10}$/, message: 'Invalid 10-digit number' }
                })} 
              />
              <SelectField
                label="Plan"
                options={[
                  { label: 'Select a plan', value: '' },
                  ...plans.map((plan) => ({
                    label: `${plan.amount} - ${plan.validity}`,
                    value: plan.planCode
                  }))
                ]}
                error={form.formState.errors.planCode?.message}
                {...form.register('planCode', { required: 'Plan selection is required' })}
              />
              <TextField 
                label="Amount" 
                type="number" 
                error={form.formState.errors.amount?.message}
                {...form.register('amount', { required: 'Amount is required' })} 
              />
              <FormActions submitting={form.formState.isSubmitting} label="Create recharge order" />
            </form>
          </ActionGuard>
        </SectionCard>

        <SectionCard title="Plan monetization" subtitle="Displayed plans can be ranked later by blended commission and conversion rate.">
          <div className="space-y-3">
            {plans.map((plan) => (
              <div key={plan.planCode} className="rounded-[24px] border border-ink/10 bg-white/70 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="display-font text-xl font-semibold">INR {plan.amount}</h4>
                    <p className="text-sm text-slate">{plan.benefits}</p>
                  </div>
                  <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">{plan.validity}</span>
                </div>
              </div>
            ))}
            {!plans.length ? <p className="text-sm text-slate">Choose an operator to load plans.</p> : null}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}

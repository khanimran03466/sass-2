'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppShell } from '@/components/layout/AppShell';
import { TextField } from '@/components/forms/TextField';
import { SelectField } from '@/components/forms/SelectField';
import { FormActions } from '@/components/shared/FormActions';
import { ActionGuard } from '@/components/shared/ActionGuard';
import { SectionCard } from '@/components/shared/SectionCard';
import { RevenueBreakdown } from '@/components/shared/RevenueBreakdown';
import { EmptyState } from '@/components/shared/EmptyState';
import { rentApi } from '@/services/api';
import { useToast } from '@/hooks/useToast';

export default function RentPage() {
  const { pushToast } = useToast();
  const [landlords, setLandlords] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [preview, setPreview] = useState(null);
  const landlordForm = useForm();
  const paymentForm = useForm({ defaultValues: { amount: 0 } });

  const loadData = async () => {
    try {
      const [landlordRes, transactionRes] = await Promise.all([rentApi.landlords(), rentApi.transactions()]);
      setLandlords(landlordRes.landlords || []);
      setTransactions(transactionRes.transactions || []);
    } catch (error) {
      // Don't show toast if it's just a 401 (not logged in)
      if (error.status !== 401) {
        pushToast(error.message || 'Unable to load rent data', 'error');
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLandlord = landlordForm.handleSubmit(async (values) => {
    try {
      await rentApi.addLandlord(values);
      pushToast('Landlord added successfully');
      landlordForm.reset();
      loadData();
    } catch (error) {
      pushToast(error.message || 'Unable to add landlord', 'error');
    }
  });

  const handlePayment = paymentForm.handleSubmit(async (values) => {
    try {
      const payload = { ...values, amount: Number(values.amount) };
      const response = await rentApi.createPayment(payload);
      setPreview(response.revenue);
      pushToast('Rent payment order created. Trigger Razorpay checkout next.');
      loadData();
    } catch (error) {
      pushToast(error.message || 'Unable to create rent payment', 'error');
    }
  });

  return (
    <AppShell title="Rent Payments" subtitle="Primary revenue engine with credit-card-enabled rent transfers, fee stacking, and verified settlement states.">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Add landlord" subtitle="Prisma handles the relation mapping to ensure payments are correctly attributed.">
          <ActionGuard message="Sign in to manage your landlords">
            <form onSubmit={onAddLandlord} className="grid gap-4 md:grid-cols-2">
              <TextField 
                label="Name" 
                error={landlordForm.formState.errors.name?.message}
                {...landlordForm.register('name', { required: 'Name is required' })} 
              />
              <TextField 
                label="Phone" 
                error={landlordForm.formState.errors.phone?.message}
                {...landlordForm.register('phone', { required: 'Phone is required' })} 
              />
              <TextField 
                label="Email" 
                type="email" 
                error={landlordForm.formState.errors.email?.message}
                {...landlordForm.register('email', { required: 'Email is required' })} 
              />
              <TextField 
                label="Bank name" 
                error={landlordForm.formState.errors.bankName?.message}
                {...landlordForm.register('bankName', { required: 'Bank name is required' })} 
              />
              <TextField 
                label="Account number" 
                error={landlordForm.formState.errors.accountNumber?.message}
                {...landlordForm.register('accountNumber', { required: 'Account number is required' })} 
              />
              <TextField 
                label="IFSC code" 
                error={landlordForm.formState.errors.ifscCode?.message}
                {...landlordForm.register('ifscCode', { required: 'IFSC code is required' })} 
              />
              <FormActions submitting={landlordForm.formState.isSubmitting} label="Add landlord" />
            </form>
          </ActionGuard>
        </SectionCard>

        <SectionCard title="Pay rent" subtitle="Platform fee is calculated at 3.25% and GST applies only on that fee portion.">
          <ActionGuard message="Sign in to pay rent">
            <form onSubmit={handlePayment} className="space-y-4">
              <SelectField
                label="Landlord"
                options={[
                  { label: 'Select landlord', value: '' },
                  ...landlords.map((item) => ({ label: item.name, value: item.id }))
                ]}
                {...paymentForm.register('landlordId', { required: true })}
              />
              <TextField label="Rent amount" type="number" step="0.01" {...paymentForm.register('amount', { required: true })} />
              <TextField label="Month" placeholder="April 2026" {...paymentForm.register('month', { required: true })} />
              <TextField label="Remarks" {...paymentForm.register('remarks')} />
              <FormActions label="Create rent order" />
            </form>
          </ActionGuard>
          <div className="mt-4">
            <RevenueBreakdown revenue={preview} />
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Transaction history" subtitle="Receipts are available from the backend after successful webhook capture.">
        <ActionGuard message="Sign in to view your transaction history">
          {transactions.length ? (
            <div className="space-y-3">
              {transactions.map((item) => (
                <div key={item.id} className="rounded-[22px] border border-ink/10 bg-white/70 p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="font-semibold">{item.landlord?.name || 'Unknown landlord'}</h4>
                      <p className="text-sm text-slate">Receipt {item.receiptNumber}</p>
                    </div>
                    <div className="text-right">
                      <div className="display-font text-xl font-semibold">INR {String(item.totalAmount)}</div>
                      <p className="text-sm text-slate">{item.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No rent payments yet" description="Create the first rent order to start capturing platform fee revenue." />
          )}
        </ActionGuard>
      </SectionCard>
    </AppShell>
  );
}

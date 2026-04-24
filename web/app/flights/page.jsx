'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppShell } from '@/components/layout/AppShell';
import { TextField } from '@/components/forms/TextField';
import { FormActions } from '@/components/shared/FormActions';
import { ActionGuard } from '@/components/shared/ActionGuard';
import { SectionCard } from '@/components/shared/SectionCard';
import { flightApi } from '@/services/api';
import { useToast } from '@/hooks/useToast';

export default function FlightsPage() {
  const searchForm = useForm({ defaultValues: { travellers: 1 } });
  const { pushToast } = useToast();
  const [results, setResults] = useState([]);

  const onSearch = searchForm.handleSubmit(async (values) => {
    try {
      const response = await flightApi.search({
        ...values,
        travellers: Number(values.travellers)
      });
      setResults(response.options || []);
      pushToast('Flight inventory loaded');
    } catch (error) {
      if (error.status !== 401) {
        pushToast(error.message || 'Unable to search flights', 'error');
      }
    }
  });

  const handleBook = async (option) => {
    try {
      await flightApi.createBooking({
        ...option,
        supplierCost: Number(option.supplierCost),
        travellers: Number(option.travellers)
      });
      pushToast(`Booking order created for ${option.airline}`);
    } catch (error) {
      pushToast(error.message || 'Unable to create flight booking', 'error');
    }
  };

  return (
    <AppShell title="Flight Booking" subtitle="API-ready booking rail with supplier search abstraction, margin markup, and fixed service fee per order.">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Search flights" subtitle="Provider-ready shape for Amadeus integration with pricing control at the platform layer.">
          <form onSubmit={onSearch} className="grid gap-4 md:grid-cols-2">
            <TextField 
              label="Origin" 
              placeholder="DEL" 
              error={searchForm.formState.errors.origin?.message}
              {...searchForm.register('origin', { required: 'Origin city is required' })} 
            />
            <TextField 
              label="Destination" 
              placeholder="BOM" 
              error={searchForm.formState.errors.destination?.message}
              {...searchForm.register('destination', { required: 'Destination is required' })} 
            />
            <TextField 
              label="Departure date" 
              type="date" 
              error={searchForm.formState.errors.departureDate?.message}
              {...searchForm.register('departureDate', { required: 'Date is required' })} 
            />
            <TextField 
              label="Travellers" 
              type="number" 
              error={searchForm.formState.errors.travellers?.message}
              {...searchForm.register('travellers', { required: 'Count is required', min: { value: 1, message: 'Minimum 1' } })} 
            />
            <FormActions submitting={searchForm.formState.isSubmitting} label="Search flights" />
          </form>
        </SectionCard>

        <SectionCard title="Search results" subtitle="Display price includes supplier fare, markup, and service fee.">
          <div className="space-y-3">
            {results.map((option) => (
              <div key={option.id} className="rounded-[24px] border border-ink/10 bg-white/70 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h4 className="display-font text-xl font-semibold">{option.airline} {option.flightNumber}</h4>
                    <p className="text-sm text-slate">{option.origin} to {option.destination} on {option.departureDate}</p>
                    <p className="mt-2 text-sm text-slate">Net revenue: INR {option.revenue.netRevenue}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="display-font text-2xl font-semibold">INR {option.totalDisplayPrice}</div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate">{option.provider}</p>
                    </div>
                    <ActionGuard message="Sign in to book flights">
                      <button onClick={() => handleBook(option)} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
                        Book
                      </button>
                    </ActionGuard>
                  </div>
                </div>
              </div>
            ))}
            {!results.length ? <p className="text-sm text-slate">Search results will appear here.</p> : null}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}

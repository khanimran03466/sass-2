'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppShell } from '@/components/layout/AppShell';
import { TextField } from '@/components/forms/TextField';
import { FormActions } from '@/components/shared/FormActions';
import { ActionGuard } from '@/components/shared/ActionGuard';
import { SectionCard } from '@/components/shared/SectionCard';
import { hotelApi } from '@/services/api';
import { useToast } from '@/hooks/useToast';

export default function HotelsPage() {
  const searchForm = useForm({ defaultValues: { guests: 2 } });
  const { pushToast } = useToast();
  const [results, setResults] = useState([]);

  const onSearch = searchForm.handleSubmit(async (values) => {
    try {
      const response = await hotelApi.search({
        ...values,
        guests: Number(values.guests)
      });
      setResults(response.properties || []);
      pushToast('Hotel inventory loaded');
    } catch (error) {
      if (error.status !== 401) {
        pushToast(error.message || 'Unable to search hotels', 'error');
      }
    }
  });

  const handleBook = async (hotel) => {
    try {
      await hotelApi.createBooking({
        ...hotel,
        supplierCost: Number(hotel.supplierCost),
        guests: Number(hotel.guests)
      });
      pushToast(`Booking order created for ${hotel.hotelName}`);
    } catch (error) {
      pushToast(error.message || 'Unable to create hotel booking', 'error');
    }
  };

  return (
    <AppShell title="Hotel Booking" subtitle="Premium stay inventory with commission and markup economics baked into the booking surface.">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Search hotels" subtitle="Inventory structure is ready for Expedia Partner API wiring.">
          <form onSubmit={onSearch} className="grid gap-4 md:grid-cols-2">
            <TextField 
              label="City" 
              placeholder="Bengaluru" 
              error={searchForm.formState.errors.city?.message}
              {...searchForm.register('city', { required: 'City is required' })} 
            />
            <TextField 
              label="Check-in" 
              type="date" 
              error={searchForm.formState.errors.checkIn?.message}
              {...searchForm.register('checkIn', { required: 'Check-in date is required' })} 
            />
            <TextField 
              label="Check-out" 
              type="date" 
              error={searchForm.formState.errors.checkOut?.message}
              {...searchForm.register('checkOut', { required: 'Check-out date is required' })} 
            />
            <TextField 
              label="Guests" 
              type="number" 
              error={searchForm.formState.errors.guests?.message}
              {...searchForm.register('guests', { required: 'Guests count is required', min: { value: 1, message: 'Minimum 1' } })} 
            />
            <FormActions submitting={searchForm.formState.isSubmitting} label="Search hotels" />
          </form>
        </SectionCard>

        <SectionCard title="Room inventory" subtitle="Displayed price already reflects monetization layers.">
          <div className="space-y-3">
            {results.map((hotel) => (
              <div key={hotel.id} className="rounded-[24px] border border-ink/10 bg-white/70 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h4 className="display-font text-xl font-semibold">{hotel.hotelName}</h4>
                    <p className="text-sm text-slate">{hotel.roomType} in {hotel.city}</p>
                    <p className="mt-2 text-sm text-slate">Net revenue: INR {hotel.revenue.netRevenue}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="display-font text-2xl font-semibold">INR {hotel.totalDisplayPrice}</div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate">{hotel.provider}</p>
                    </div>
                    <ActionGuard message="Sign in to book hotels">
                      <button onClick={() => handleBook(hotel)} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
                        Book
                      </button>
                    </ActionGuard>
                  </div>
                </div>
              </div>
            ))}
            {!results.length ? <p className="text-sm text-slate">Hotel search results will appear here.</p> : null}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}

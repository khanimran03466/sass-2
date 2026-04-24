'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { TextField } from '@/components/forms/TextField';
import { FormActions } from '@/components/shared/FormActions';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const { pushToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (values) => {
    try {
      setSubmitting(true);
      await registerUser(values);
      pushToast('Account created. Let’s start monetizing payments.');
      router.push('/dashboard');
    } catch (error) {
      pushToast(error.message || 'Registration failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg rounded-[32px] p-6 lg:p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-slate">Create account</p>
        <h1 className="display-font mt-3 text-4xl font-semibold">Open your super app wallet</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <TextField label="Full name" {...register('name', { required: 'Name is required' })} error={errors.name?.message} />
          </div>
          <TextField label="Email" type="email" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
          <TextField label="Phone" {...register('phone')} error={errors.phone?.message} />
          <div className="md:col-span-2">
            <TextField label="Password" type="password" {...register('password', { required: 'Password is required' })} error={errors.password?.message} />
          </div>
          <div className="md:col-span-2">
            <FormActions submitting={submitting} label="Create account" />
          </div>
        </form>
        <p className="mt-5 text-sm text-slate">
          Already registered? <Link href="/login" className="font-semibold text-brand">Sign in</Link>
        </p>
      </div>
    </main>
  );
}

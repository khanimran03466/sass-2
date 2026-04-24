'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { TextField } from '@/components/forms/TextField';
import { FormActions } from '@/components/shared/FormActions';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export default function LoginPage({ isModal = false, onSuccess }) {
  const router = useRouter();
  const { login } = useAuth();
  const { pushToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (values) => {
    try {
      setSubmitting(true);
      await login(values);
      pushToast('Welcome back. Your control center is ready.');
      
      if (isModal && onSuccess) {
        onSuccess();
      } else {
        // Check for redirect URL in search params or default to dashboard
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get('redirect') || '/dashboard';
        router.push(redirectTo);
      }
    } catch (error) {
      pushToast(error.message || 'Login failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formContent = (
    <div className={`${isModal ? '' : 'glass-panel'} w-full max-w-md rounded-[32px] p-6 lg:p-8`}>
      <p className="text-sm uppercase tracking-[0.35em] text-slate">Sign in</p>
      <h1 className="display-font mt-3 text-4xl font-semibold">Access MarginMint</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <TextField 
          label="Email" 
          type="email" 
          autoFocus={!isModal}
          {...register('email', { required: 'Email is required' })} 
          error={errors.email?.message} 
        />
        <TextField 
          label="Password" 
          type="password" 
          {...register('password', { required: 'Password is required' })} 
          error={errors.password?.message} 
        />
        <FormActions submitting={submitting} label="Sign in" />
      </form>
      {!isModal && (
        <p className="mt-5 text-sm text-slate">
          New here? <Link href="/register" className="font-semibold text-brand">Create an account</Link>
        </p>
      )}
    </div>
  );

  if (isModal) {
    return formContent;
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      {formContent}
    </main>
  );
}

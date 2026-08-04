'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getApiError } from '@/lib/apiError';
import * as authService from '@/lib/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(values: SignupValues) {
    setFormError('');

    try {
      const { user } = await authService.signup(
        values.name,
        values.email,
        values.password
      );
      setUser(user);
      router.replace('/dashboard');
    } catch (error) {
      const { message, fieldErrors } = getApiError(error);

      // The server validates too, so show its field errors on the fields
      // themselves instead of dumping one message at the bottom.
      const named = Object.entries(fieldErrors).filter(
        (entry): entry is [keyof SignupValues, string] =>
          entry[0] === 'name' || entry[0] === 'email' || entry[0] === 'password'
      );

      named.forEach(([field, error]) => setError(field, { message: error }));

      if (named.length === 0) {
        setFormError(message);
      }
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-semibold">Start your shelf</h1>
        <p className="text-sm text-muted">A quiet place for the books you care about.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Input
          label="Name"
          autoComplete="name"
          autoFocus
          placeholder="Your name"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register('password')}
        />

        {formError && (
          <p role="alert" className="text-sm text-danger">
            {formError}
          </p>
        )}

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Create account
        </Button>
      </form>

      <p className="text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-ink underline underline-offset-4">
          Log in
        </Link>
      </p>
    </div>
  );
}

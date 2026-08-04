'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getApiError } from '@/lib/apiError';
import * as authService from '@/lib/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

export type AuthMode = 'signin' | 'signup';

// Both modes resolve to the same shape so one useForm can serve either. Signin
// simply never renders the name field, and its default of '' satisfies the
// schema without a rule that would reject an empty value.
const signinSchema = z.object({
  name: z.string(),
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
});

const signupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type AuthValues = z.infer<typeof signupSchema>;

const FIELD_NAMES = ['name', 'email', 'password'] as const;

/**
 * Remounted by the page whenever the mode flips, which swaps the schema and
 * clears anything typed into the previous form in one go.
 */
export function AuthForm({ mode, cta }: { mode: AuthMode; cta: string }) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [formError, setFormError] = useState('');

  const isSignup = mode === 'signup';

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AuthValues>({
    resolver: zodResolver(isSignup ? signupSchema : signinSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  async function onSubmit(values: AuthValues) {
    setFormError('');

    try {
      const { user } = isSignup
        ? await authService.signup(values.name, values.email, values.password)
        : await authService.login(values.email, values.password);

      setUser(user);
      router.replace('/dashboard');
    } catch (error) {
      const { message, fieldErrors } = getApiError(error);

      // The server validates too. Show whatever it flagged against the field
      // itself rather than as one vague line at the bottom.
      const named = FIELD_NAMES.filter((field) => fieldErrors[field]);
      named.forEach((field) => setError(field, { message: fieldErrors[field] }));

      if (named.length === 0) {
        setFormError(message);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8">
      <div className="flex flex-col gap-4">
        {isSignup && (
          <Input
            label="Name"
            autoComplete="name"
            autoFocus
            placeholder="Aarav Mehta"
            error={errors.name?.message}
            {...register('name')}
          />
        )}

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          autoFocus={!isSignup}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          placeholder={isSignup ? 'At least 8 characters' : ''}
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      {formError && (
        <p role="alert" className="mt-4 text-[12.5px] text-danger">
          {formError}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        isLoading={isSubmitting}
        className="mt-[26px] w-full"
      >
        {cta}
      </Button>
    </form>
  );
}

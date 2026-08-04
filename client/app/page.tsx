'use client';

import { useState } from 'react';
import { AuthForm, type AuthMode } from '@/components/auth/AuthForm';
import { Bookcase } from '@/components/auth/Bookcase';

const COPY: Record<
  AuthMode,
  Record<'title' | 'subtitle' | 'cta' | 'note' | 'alt', string>
> = {
  signin: {
    title: 'Welcome back',
    subtitle: 'Your shelf is exactly where you left it.',
    cta: 'Sign in',
    note: 'new here',
    alt: 'Create an account',
  },
  signup: {
    title: 'Start your library',
    subtitle: 'One account, one shelf, no algorithm deciding what you read next.',
    cta: 'Create my library',
    note: 'already have one',
    alt: 'Sign in instead',
  },
};

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const copy = COPY[mode];

  return (
    <div className="grid min-h-screen animate-[fadeIn_.5s_ease_both] lg:grid-cols-[1.05fr_.95fr]">
      {/* Decorative column. Dropped entirely below lg so phones get the form
          without scrolling past a half-metre of shelf first. */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[color-mix(in_oklab,var(--color-accent)_9%,var(--color-surface))] px-[52px] pt-11 lg:flex">
        <Wordmark />

        <div className="mt-[7vh] max-w-[430px]">
          <h1 className="font-display text-[42px] leading-[1.14] font-normal tracking-[-0.02em] text-pretty">
            Every great library starts with one book.
          </h1>
          <p className="mt-5 max-w-[340px] text-[14.5px] leading-[1.65] text-ink-2">
            A quiet place for the books you&rsquo;re reading, the ones you finished, and
            the ones still waiting for a rainy afternoon.
          </p>
        </div>

        {/* mt-16 keeps the top shelf clear of the paragraph above it */}
        <div className="mt-16 mb-0 flex-1 content-end">
          <Bookcase />
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-[352px]">
          <div className="mb-10 lg:hidden">
            <Wordmark />
          </div>

          <h2 className="font-display text-[30px] leading-[1.2] tracking-[-0.015em]">
            {copy.title}
          </h2>
          <p className="mt-[9px] text-[14px] leading-[1.6] text-ink-2">{copy.subtitle}</p>

          <AuthForm key={mode} mode={mode} cta={copy.cta} />

          <div className="mt-[22px] flex items-center gap-3 text-[12px] text-ink-3">
            <span className="h-px flex-1 bg-line" />
            <span>{copy.note}</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <button
            type="button"
            onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
            className="mt-[18px] h-11 w-full rounded-[12px] border border-line bg-surface text-[14px] text-ink transition-colors hover:border-ink-3 hover:bg-surface-2"
          >
            {copy.alt}
          </button>

          <p className="mt-7 text-[12px] leading-[1.6] text-ink-3">
            Your library is yours alone. We never share what you read.
          </p>
        </div>
      </div>
    </div>
  );
}

function Wordmark() {
  return (
    <div className="flex items-center gap-[11px]">
      <span className="flex size-[26px] items-center justify-center rounded-[8px] bg-accent pb-0.5 font-display text-[16px] leading-none text-[#fffdfa]">
        B
      </span>
      <span className="text-[14.5px] font-medium tracking-[-0.01em]">Bookmark</span>
    </div>
  );
}

import { useId } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.ComponentPropsWithRef<'input'> {
  label: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, id, className, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="flex flex-col gap-[7px]">
      <label
        htmlFor={inputId}
        className="text-[11.5px] tracking-[0.08em] text-ink-3 uppercase"
      >
        {label}
      </label>

      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(error && errorId, !error && hint && hintId) || undefined}
        // .field carries the border, radius and accent focus ring from the
        // design so the exact colour-mix values stay in one place.
        className={cn(
          'field h-11 w-full px-[14px] text-[14.5px] outline-none',
          className
        )}
        {...props}
      />

      {/* Tied to the input by id so a screen reader announces it with the field */}
      {error ? (
        <p id={errorId} className="text-[12.5px] text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="text-[11px] text-ink-3">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

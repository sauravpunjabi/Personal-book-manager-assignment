import { useId } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.ComponentPropsWithRef<'input'> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-ink">
        {label}
      </label>

      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'h-11 w-full rounded-md border bg-surface px-3 text-ink transition-colors',
          'placeholder:text-muted/60',
          error ? 'border-danger' : 'border-line hover:border-muted/50',
          className
        )}
        {...props}
      />

      {/* Tied to the input by id so a screen reader announces it with the field */}
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

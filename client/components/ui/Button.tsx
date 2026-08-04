import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ComponentPropsWithRef<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-[#fffdfa] shadow-[var(--shadow-1)] hover:brightness-[1.06] active:scale-[.985]',
  secondary:
    'border border-line bg-surface text-ink hover:bg-surface-2 hover:border-ink-3',
  danger: 'bg-danger text-[#fffdfa] hover:brightness-[1.06] active:scale-[.985]',
  ghost: 'text-ink-2 hover:bg-surface-2 hover:text-ink',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-[13px]',
  md: 'h-[42px] px-4 text-[13.5px]',
  lg: 'h-[46px] px-5 text-[14.5px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      // Label stays in the DOM while loading so the button keeps its width
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-[12px] font-medium',
        'transition-[transform,filter,background-color,border-color,color] duration-200',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      <span className={cn('inline-flex items-center gap-2', isLoading && 'invisible')}>
        {children}
      </span>
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </span>
      )}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="size-4 motion-safe:animate-spin"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="6.5"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2"
      />
      <path
        d="M14.5 8A6.5 6.5 0 0 0 8 1.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

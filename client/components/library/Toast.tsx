'use client';

interface ToastProps {
  message: string;
  action?: { label: string; onClick: () => void };
}

/** A centring wrapper, because the design animates transform over translateX */
export function Toast({ message, action }: ToastProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-7 z-[60] flex justify-center px-4">
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto flex animate-[riseIn_.3s_cubic-bezier(.2,.7,.3,1)_both] items-center gap-4 rounded-[14px] bg-ink py-3 pr-3.5 pl-[18px] text-[13.5px] text-bg shadow-[var(--shadow-3)]"
      >
        <span>{message}</span>
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="rounded-[9px] bg-[color-mix(in_oklab,var(--color-bg)_20%,transparent)] px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:bg-[color-mix(in_oklab,var(--color-bg)_34%,transparent)]"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

const PLACEHOLDER_COUNT = 10;

/** Matches the grid's shape so nothing shifts when the books arrive. */
export function LibrarySkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-[repeat(auto-fill,minmax(158px,1fr))] gap-x-6 gap-y-9 sm:grid-cols-[repeat(auto-fill,minmax(186px,1fr))]"
    >
      {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
        <div
          key={index}
          className="animate-[fadeIn_.4s_ease_both]"
          style={{ animationDelay: `${index * 24}ms` }}
        >
          <div className="aspect-2/3 rounded-[10px] bg-surface-2 motion-safe:animate-pulse" />
          <div className="mt-3.5 h-[11px] w-[78%] rounded bg-surface-2" />
          <div className="mt-2 h-[9px] w-[52%] rounded bg-surface-2" />
        </div>
      ))}
    </div>
  );
}

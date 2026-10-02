/** Shown at once on navigation while the next screen loads, so a tap never feels ignored. */
export default function Loading() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading">
      <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
      <div className="h-7 w-48 animate-pulse rounded-lg bg-gray-200" />
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
      ))}
    </div>
  );
}

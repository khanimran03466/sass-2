export function TextField({ label, error, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink">{label}</span>
      <input
        {...props}
        className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-brand"
      />
      {error ? <span className="mt-2 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}

export function FormActions({ submitting, label = 'Continue' }) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:opacity-60"
    >
      {submitting ? 'Processing...' : label}
    </button>
  );
}

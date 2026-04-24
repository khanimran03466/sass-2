export function EmptyState({ title, description }) {
  return (
    <div className="rounded-[24px] border border-dashed border-ink/15 bg-white/50 px-6 py-10 text-center">
      <h4 className="display-font text-xl font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-slate">{description}</p>
    </div>
  );
}

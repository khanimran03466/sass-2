export function SectionCard({ title, subtitle, children }) {
  return (
    <section className="glass-panel rounded-[28px] p-5 lg:p-6">
      <div className="mb-5">
        <h3 className="display-font text-2xl font-semibold">{title}</h3>
        {subtitle ? <p className="mt-2 text-sm text-slate">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

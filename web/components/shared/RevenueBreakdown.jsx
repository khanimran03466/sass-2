export function RevenueBreakdown({ revenue }) {
  if (!revenue) return null;

  return (
    <div className="rounded-[24px] border border-ink/10 bg-white/70 p-4">
      <h4 className="display-font text-lg font-semibold">Revenue breakdown</h4>
      <div className="mt-4 grid gap-3 text-sm text-slate md:grid-cols-2">
        <div>Base amount: INR {revenue.baseAmount}</div>
        <div>Total charged: INR {revenue.totalAmount}</div>
        <div>Platform fee: INR {revenue.platformFee || 0}</div>
        <div>Markup amount: INR {revenue.markupAmount || 0}</div>
        <div>Tax: INR {revenue.tax || 0}</div>
        <div className="font-semibold text-ink">Net revenue: INR {revenue.netRevenue || 0}</div>
      </div>
    </div>
  );
}

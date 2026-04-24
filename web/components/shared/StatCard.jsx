import { motion } from 'framer-motion';

export function StatCard({ label, value, hint }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-[28px] p-5"
    >
      <p className="text-sm uppercase tracking-[0.2em] text-slate">{label}</p>
      <h3 className="display-font mt-3 text-3xl font-semibold">{value}</h3>
      <p className="mt-2 text-sm text-slate">{hint}</p>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';

export function AppShell({ title, subtitle, children, rightSlot }) {
  return (
    <div className="min-h-screen bg-offwhite/30 dark:bg-black/10">
      <div className="mx-auto grid max-w-[1440px] gap-8 p-4 lg:grid-cols-[280px_1fr] lg:p-8">
        <Sidebar />
        <main className="space-y-8">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel relative overflow-hidden rounded-[40px] border border-white/40 bg-white/40 p-8 shadow-sm backdrop-blur-md dark:border-white/5 dark:bg-white/5"
          >
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand/80">Operations Control</p>
                <h1 className="display-font mt-3 text-4xl font-bold tracking-tight text-ink dark:text-white lg:text-5xl">{title}</h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate/80 dark:text-white/60">{subtitle}</p>
              </div>
              {rightSlot}
            </div>
            
            {/* Subtle decorative element */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/5 blur-[100px]" />
          </motion.header>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.section>
        </main>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiOutlineBuildingOffice2, HiOutlineCreditCard, HiOutlineHomeModern, HiOutlineRocketLaunch } from 'react-icons/hi2';
import { MdOutlineDashboard, MdOutlinePhoneIphone } from 'react-icons/md';
import { TbPlaneDeparture } from 'react-icons/tb';
import styles from './Sidebar.module.scss';

import { useAuth } from '@/hooks/useAuth';
import { FiLogOut, FiUser, FiChevronUp, FiSettings, FiShield } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const items = [
  { href: '/dashboard', label: 'Dashboard', icon: MdOutlineDashboard, protected: true },
  { href: '/rent', label: 'Rent', icon: HiOutlineHomeModern },
  { href: '/credit-card', label: 'Credit Cards', icon: HiOutlineCreditCard },
  { href: '/flights', label: 'Flights', icon: TbPlaneDeparture },
  { href: '/hotels', label: 'Hotels', icon: HiOutlineBuildingOffice2 },
  { href: '/recharge', label: 'Recharge', icon: MdOutlinePhoneIphone },
  { href: '/bills', label: 'Bills', icon: HiOutlineRocketLaunch },
  { href: '/admin', label: 'Admin Panel', icon: HiOutlineBuildingOffice2, protected: true, role: 'ADMIN' }
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const filteredItems = items.filter(item => {
    if (item.protected && !isAuthenticated) return false;
    if (item.role && user?.role !== item.role) return false;
    return true;
  });

  return (
    <aside className={`${styles.sidebar} flex h-[calc(100vh-48px)] flex-col p-4 lg:p-6 sticky top-6`}>
      <div className="mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand font-display text-xl font-bold text-white shadow-lg shadow-brand/20">M</div>
          <div className="display-font text-2xl font-bold tracking-tight">MarginMint</div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-white/40">Premium Fintech Operations Stack</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2">
        {filteredItems.map((item, index) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={item.href} className={`${styles.navLink} ${active ? styles.active : ''}`}>
                <Icon size={20} className={active ? 'text-brand' : 'text-white/60'} />
                <span className="font-medium">{item.label}</span>
                {active && (
                  <motion.div layoutId="active-pill" className="ml-auto h-1.5 w-1.5 rounded-full bg-brand" />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 relative">
        {isAuthenticated ? (
          <>
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-ink/90 p-1 backdrop-blur-xl shadow-2xl z-[100]"
                >
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Account</p>
                  </div>
                  <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white">
                    <FiSettings size={16} />
                    <span>Settings</span>
                  </button>
                  {user.role === 'ADMIN' && (
                    <Link href="/admin" className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white">
                      <FiShield size={16} />
                      <span>Admin Control</span>
                    </Link>
                  )}
                  <button 
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    <FiLogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex w-full items-center justify-between rounded-2xl p-3 transition-all ${isProfileOpen ? 'bg-white/10' : 'bg-white/5 hover:bg-white/10'}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand ring-1 ring-brand/30">
                  <FiUser size={20} />
                </div>
                <div className="overflow-hidden text-left">
                  <p className="truncate text-sm font-semibold text-white">{user.name}</p>
                  <p className="truncate text-[10px] uppercase tracking-wider text-white/40">{user.role}</p>
                </div>
              </div>
              <FiChevronUp className={`text-white/40 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>
          </>
        ) : (
          <Link href="/login" className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-4 text-sm font-bold text-white shadow-lg shadow-brand/20 transition-all hover:bg-brand-dark active:scale-95">
            <FiLogOut size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </aside>
  );
}

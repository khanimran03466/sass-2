'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import LoginPage from '@/app/login/page';
import { useAuth } from '@/hooks/useAuth';

/**
 * ActionGuard intercepts interactions and prompts for authentication if needed.
 * It's a key component of the "browse-first" model.
 */
export function ActionGuard({ children, message = "Please sign in to continue" }) {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  const handleAction = (e) => {
    // If user is not logged in (no user object or no token in localstorage)
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    if (!user && !token) {
      e.preventDefault();
      e.stopPropagation();
      setShowModal(true);
    }
  };

  return (
    <>
      <div onClickCapture={handleAction} className="contents">
        {children}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-ink/60 backdrop-blur-md"
            />
            
            {/* Modal */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/20 bg-white shadow-2xl dark:bg-ink"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowModal(false)}
                className="absolute right-6 top-6 z-50 rounded-full bg-slate/10 p-2 text-slate transition-colors hover:bg-slate/20 hover:text-ink dark:text-white/60 dark:hover:text-white"
              >
                <FiX size={20} />
              </button>
              
              <div className="max-h-[90vh] overflow-y-auto p-2">
                <div className="px-6 pt-8 text-center">
                  <div className="inline-block rounded-full bg-brand/10 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-brand">
                    Premium Access
                  </div>
                  <h3 className="display-font mt-4 text-2xl font-bold">{message}</h3>
                </div>
                
                {/* We pass a prop to LoginPage to tell it it's in modal mode */}
                <LoginPage isModal={true} onSuccess={() => setShowModal(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

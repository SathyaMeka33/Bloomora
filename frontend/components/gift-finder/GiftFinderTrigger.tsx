'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * GiftFinderTrigger — Floating AI Gift Finder button.
 * Appears after scrolling 400px. Matches Bloomora's existing AI button pattern.
 */
export default function GiftFinderTrigger() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400 && !dismissed);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px',
          }}
        >
          {/* Dismiss button */}
          <button
            onClick={() => { setDismissed(true); setVisible(false); }}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '10px',
            }}
            aria-label="Dismiss Gift Finder"
          >
            <X size={12} />
          </button>

          {/* Main trigger */}
          <Link href="/gift-finder" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'linear-gradient(135deg, #C084FC 0%, #E879F9 100%)',
                borderRadius: '100px',
                padding: '14px 20px',
                boxShadow: '0 8px 32px rgba(192,132,252,0.5)',
                cursor: 'pointer',
              }}
            >
              <motion.div
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles size={18} color="white" />
              </motion.div>
              <span style={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}>
                AI Gift Finder
              </span>
            </motion.div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

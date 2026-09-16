'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Store, Sparkles, Check, ArrowRight, X } from 'lucide-react';
import { useSellerStore } from '@/lib/sellerStore';

interface RoleGatewayModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export default function RoleGatewayModal({ forceOpen = false, onClose }: RoleGatewayModalProps) {
  const router = useRouter();
  const { setActiveRole } = useSellerStore();
  const [isOpen, setIsOpen] = useState(false);
  const [rememberChoice, setRememberChoice] = useState(true);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }
    const alreadyChosen = typeof window !== 'undefined' ? localStorage.getItem('bloomora_role_chosen') : null;
    if (!alreadyChosen) {
      // Small delay for smooth entry animation
      const timer = setTimeout(() => setIsOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, [forceOpen]);

  const handleSelectRole = (role: 'customer' | 'seller') => {
    setActiveRole(role);
    if (rememberChoice && typeof window !== 'undefined') {
      localStorage.setItem('bloomora_role_chosen', 'true');
    }
    setIsOpen(false);
    if (onClose) onClose();

    if (role === 'seller') {
      router.push('/auth/login?role=seller');
    } else {
      router.push('/');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-white rounded-[28px] border border-[#F1E2DD] shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden">
        {/* Subtle decorative background bloom */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#D98C95]/15 to-[#C8A46A]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button if forced open */}
        {forceOpen && (
          <button
            onClick={() => {
              setIsOpen(false);
              if (onClose) onClose();
            }}
            className="absolute top-5 right-5 p-2 text-gray-400 hover:text-[#262626] rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center space-y-2 max-w-md mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4F2] border border-[#F6D2CF] text-[#D98C95] text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to Bloomora</span>
          </div>
          <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#262626] leading-tight">
            Choose your account role
          </h2>
          <p className="text-xs text-[#6B6B6B] leading-relaxed">
            Customer and Seller accounts have separate credentials and independent sessions. Please choose your portal below.
          </p>
        </div>

        {/* Dual Role Choice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* 1. Customer Option */}
          <button
            onClick={() => handleSelectRole('customer')}
            className="text-left p-5 rounded-2xl border-2 border-[#EFE8E4] hover:border-[#D98C95] hover:bg-[#FFF8F5] transition-all duration-200 group flex flex-col justify-between h-[210px] relative shadow-xs hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF0F3] text-[#D98C95] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif-heading text-lg font-bold text-[#262626] group-hover:text-[#D98C95] transition-colors">
                  I am a Customer
                </h3>
                <p className="text-[11px] text-[#6B6B6B] leading-relaxed mt-1">
                  Discover luxury bouquets, bento cakes, surprises, and personalized artisan gift hampers.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center text-xs font-bold text-[#D98C95] gap-1">
              <span>Enter Customer Store</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* 2. Seller Option */}
          <button
            onClick={() => handleSelectRole('seller')}
            className="text-left p-5 rounded-2xl border-2 border-[#EFE8E4] hover:border-[#C8A46A] hover:bg-[#FDFBF7] transition-all duration-200 group flex flex-col justify-between h-[210px] relative shadow-xs hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FCF8EE] text-[#C8A46A] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif-heading text-lg font-bold text-[#262626] group-hover:text-[#C8A46A] transition-colors">
                    I am a Seller
                  </h3>
                  <span className="text-[9px] bg-[#C8A46A] text-white px-2 py-0.5 rounded-full font-bold uppercase">
                    Partner
                  </span>
                </div>
                <p className="text-[11px] text-[#6B6B6B] leading-relaxed mt-1">
                  Manage incoming orders, preparation statuses, catalog stock, and review bank payout settlements.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center text-xs font-bold text-[#C8A46A] gap-1">
              <span>Sign In to Seller Portal</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Footer & Remember preference */}
        <div className="pt-2 flex items-center justify-between border-t border-[#F1E2DD] text-xs text-[#6B6B6B]">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberChoice}
              onChange={(e) => setRememberChoice(e.target.checked)}
              className="accent-[#D98C95] rounded"
            />
            <span>Remember my mode on this device</span>
          </label>

          <span className="text-[11px] text-gray-400">
            Powered by Bloomora Multi-Vendor
          </span>
        </div>
      </div>
    </div>
  );
}

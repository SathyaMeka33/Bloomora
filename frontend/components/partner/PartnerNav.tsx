'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Boxes,
  IndianRupee,
  BarChart3,
  Sparkles,
  User,
  HelpCircle,
  Menu,
  X,
  LogOut,
  Store,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export type PartnerTab =
  | 'dashboard'
  | 'products'
  | 'add_product'
  | 'orders'
  | 'inventory'
  | 'earnings'
  | 'analytics'
  | 'promotions'
  | 'profile'
  | 'support';

interface PartnerNavProps {
  activeTab: PartnerTab;
  setActiveTab: (tab: PartnerTab) => void;
  pendingOrdersCount?: number;
  pendingProductsCount?: number;
}

export default function PartnerNav({
  activeTab,
  setActiveTab,
  pendingOrdersCount = 0,
  pendingProductsCount = 0,
}: PartnerNavProps) {
  const { userProfile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PartnerTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'add_product', label: 'Add Product', icon: PlusCircle },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'earnings', label: 'Earnings', icon: IndianRupee },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'promotions', label: 'Promotions', icon: Sparkles },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ];

  const handleSelect = (tab: PartnerTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#3B172D] text-[#FFFDFC] px-4 py-3 flex items-center justify-between border-b border-[#E9C9C7]/20 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-[#B58A4B]" />
          <span className="font-serif font-bold text-sm tracking-wide">Bloomora Partner</span>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/10 text-[#FFFDFC] hover:bg-white/20"
          aria-label="Toggle navigation drawer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[280px] bg-[#3B172D] text-[#FFFDFC] z-50 transform transition-transform duration-300 md:hidden flex flex-col justify-between p-5 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E9C9C7]/20 pb-4">
            <div className="flex items-center gap-2">
              <Store className="w-6 h-6 text-[#B58A4B]" />
              <span className="font-serif font-bold text-base">Partner Portal</span>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-[#B58A4B] text-[#1B1816]'
                      : 'text-[#FFFDFC]/80 hover:bg-white/10 hover:text-[#FFFDFC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {Boolean(item.badge && item.badge > 0) && (
                    <span className="bg-[#A73A4A] text-white text-[10px] px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-[#E9C9C7]/20 pt-4 space-y-3">
          <div className="text-xs text-[#FFFDFC]/70 px-2">
            <p className="font-bold text-[#FFFDFC] line-clamp-1">{userProfile?.displayName || 'Merchant Partner'}</p>
            <p className="text-[10px] text-[#B58A4B] truncate">{userProfile?.email || 'partner@bloomora.com'}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('bloomora_seller_authenticated');
                localStorage.removeItem('bloomora_active_role');
              }
              logout();
              window.location.href = '/auth/login?role=seller';
            }}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-900/30 flex items-center gap-3"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out (Merchant Session)</span>
          </button>
        </div>
      </div>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-[#3B172D] text-[#FFFDFC] min-h-screen p-5 shrink-0 justify-between">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="border-b border-[#E9C9C7]/20 pb-4 space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#B58A4B] text-[#1B1816] flex items-center justify-center shadow-xs">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-base tracking-wide text-[#FFFDFC]">Bloomora</h2>
                <span className="text-[10px] text-[#B58A4B] uppercase tracking-widest block font-bold">Partner Console</span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-[#B58A4B] text-[#1B1816] shadow-sm'
                      : 'text-[#FFFDFC]/80 hover:bg-white/10 hover:text-[#FFFDFC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {Boolean(item.badge && item.badge > 0) && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-[#3B172D] text-white' : 'bg-[#A73A4A] text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer User Info & Logout */}
        <div className="border-t border-[#E9C9C7]/20 pt-4 space-y-3">
          <div className="text-xs px-2">
            <p className="font-bold text-[#FFFDFC] truncate">{userProfile?.displayName || 'Partner Merchant'}</p>
            <span className="text-[10px] text-[#B58A4B] block truncate">{userProfile?.email || 'partner@bloomora.com'}</span>
          </div>

          <div>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('bloomora_seller_authenticated');
                  localStorage.removeItem('bloomora_active_role');
                }
                logout();
                window.location.href = '/auth/login?role=seller';
              }}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-rose-950/40 text-rose-200 hover:bg-rose-900/60 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              title="Sign Out of Merchant Session"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out (Merchant Session)</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

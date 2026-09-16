'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Store,
  Package,
  CheckSquare,
  Boxes,
  ShoppingBag,
  Gift,
  Sparkles,
  BarChart3,
  Bell,
  Calendar,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export type AdminTab =
  | 'overview'
  | 'partners'
  | 'applications'
  | 'products'
  | 'reviews'
  | 'inventory'
  | 'orders'
  | 'surprises'
  | 'surprise_requests'
  | 'sponsored'
  | 'analytics'
  | 'users'
  | 'notifications'
  | 'reminders'
  | 'settings';

interface AdminNavProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  pendingAppsCount?: number;
  pendingProductsCount?: number;
  pendingSurpriseRequestsCount?: number;
}

export default function AdminNav({
  activeTab,
  setActiveTab,
  pendingAppsCount = 0,
  pendingProductsCount = 0,
  pendingSurpriseRequestsCount = 0,
}: AdminNavProps) {
  const { userProfile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: AdminTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'partners', label: 'Partners', icon: Store },
    { id: 'applications', label: 'Applications', icon: Users, badge: pendingAppsCount },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'reviews', label: 'Product Reviews', icon: CheckSquare, badge: pendingProductsCount },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'surprises', label: 'Surprise Packages', icon: Gift },
    { id: 'surprise_requests', label: 'Surprise Requests', icon: Calendar, badge: pendingSurpriseRequestsCount },
    { id: 'sponsored', label: 'Sponsored Placements', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'reminders', label: 'Reminders', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelect = (tab: AdminTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#1B1816] text-[#FFFDFC] px-4 py-3 flex items-center justify-between border-b border-[#B58A4B]/20 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#B58A4B]" />
          <span className="font-serif font-bold text-sm tracking-wide">Bloomora Executive Admin</span>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/10 text-[#FFFDFC]"
          aria-label="Toggle admin menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[290px] bg-[#1B1816] text-[#FFFDFC] z-50 transform transition-transform duration-300 md:hidden flex flex-col justify-between p-5 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-5 overflow-y-auto max-h-[85vh]">
          <div className="flex items-center justify-between border-b border-[#B58A4B]/20 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#B58A4B]" />
              <span className="font-serif font-bold text-base">Admin Operations</span>
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
                    <span className="bg-[#A73A4A] text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-[#B58A4B]/20 pt-3 space-y-2">
          <div className="text-xs text-[#FFFDFC]/70 px-2">
            <p className="font-bold text-[#FFFDFC] truncate">{userProfile?.displayName || 'Administrator'}</p>
            <p className="text-[10px] text-[#B58A4B] truncate">{userProfile?.email || 'admin@bloomora.com'}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-full min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-950/40 flex items-center gap-3"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1B1816] text-[#FFFDFC] min-h-screen p-5 shrink-0 justify-between">
        <div className="space-y-6">
          <div className="border-b border-[#B58A4B]/20 pb-4 space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#3B172D] text-[#B58A4B] border border-[#B58A4B]/30 flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-base tracking-wide text-[#FFFDFC]">Bloomora</h2>
                <span className="text-[10px] text-[#B58A4B] uppercase tracking-widest block font-bold">Admin Console</span>
              </div>
            </div>
          </div>

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
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${isActive ? 'bg-[#1B1816] text-white' : 'bg-[#A73A4A] text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-[#B58A4B]/20 pt-4 space-y-3">
          <div className="text-xs px-2">
            <p className="font-bold text-[#FFFDFC] truncate">{userProfile?.displayName || 'Administrator'}</p>
            <span className="text-[10px] text-[#B58A4B] block truncate">{userProfile?.email || 'admin@bloomora.com'}</span>
          </div>

          <div className="flex gap-2">
            <Link
              href="/"
              className="flex-1 min-h-[44px] px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFFDFC] text-[11px] font-bold flex items-center justify-center transition-colors"
            >
              Customer Site
            </Link>

            <button
              type="button"
              onClick={logout}
              className="min-w-[44px] min-h-[44px] rounded-xl bg-rose-950/40 text-rose-200 hover:bg-rose-900/60 flex items-center justify-center transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Gift, PartyPopper, User, Sparkles, ShoppingBag } from 'lucide-react';
import { useBloomoraStore } from '@/lib/store';
import { useBloomoraAuth } from '@/lib/hooks/useBloomoraAuth';

export default function BottomNav() {
  const pathname = usePathname();
  const { isLoggedIn } = useBloomoraAuth();
  const { wishlist, totalItemCount } = useBloomoraStore();

  interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
    isAi?: boolean;
    count?: number;
  }

  const navItems: NavItem[] = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Gifts', href: '/catalog', icon: Grid },
    {
      label: 'Bag',
      href: isLoggedIn ? '/cart' : '/auth/login?next=/cart',
      icon: ShoppingBag,
      count: isLoggedIn && totalItemCount > 0 ? totalItemCount : undefined,
    },
    { label: 'AI Gifts', href: '/gift-finder', icon: Gift, isAi: true },
    {
      label: 'Account',
      href: isLoggedIn ? '/account' : '/auth/login',
      icon: User,
      count: isLoggedIn && wishlist.length > 0 ? wishlist.length : undefined,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FFF8F5]/95 backdrop-blur-md border-t border-[#EFE8E4] shadow-lg px-2 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          if (item.isAi) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5 relative group"
              >
                <div className="w-13 h-13 rounded-full bg-[#E8C8C1] p-0.5 shadow-md group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full bg-[#D98C95] flex items-center justify-center text-white">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-[#262626] mt-1 tracking-wider uppercase">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 relative transition-all duration-200 ${
                isActive ? 'text-[#D98C95]' : 'text-[#666666] hover:text-[#262626]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.75]'}`} />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#D98C95] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-wide ${
                  isActive ? 'font-bold text-[#262626]' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

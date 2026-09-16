'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search, Heart, ShoppingBag, User, Menu, X,
  Sparkles, LogIn, LogOut, ChevronDown,
} from 'lucide-react';
import { useBloomoraAuth } from '@/lib/hooks/useBloomoraAuth';
import { useBloomoraStore } from '@/lib/store';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn, logout } = useBloomoraAuth();
  const { wishlist, totalItemCount } = useBloomoraStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isHomePage = pathname === '/';
  const cartCount = isLoggedIn ? totalItemCount : 0;
  const wishlistCount = isLoggedIn ? wishlist.length : 0;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const isDark = isScrolled || !isHomePage;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Protected action — redirect to login if not authenticated
  const guardedHref = (path: string) =>
    isLoggedIn ? path : `/auth/login?next=${encodeURIComponent(path)}`;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isDark ? 'glass-header-solid text-[#262626]' : 'glass-header-transparent text-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

          {/* Mobile: Hamburger */}
          <button onClick={() => setMobileMenuOpen(o => !o)}
            className={`lg:hidden p-2.5 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
              isDark ? 'text-[#262626] hover:bg-[#FCF6F2]' : 'text-white hover:bg-white/10'
            }`} aria-label="Menu">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex flex-col items-start group">
            <span className={`font-serif-heading text-2xl sm:text-3xl font-bold tracking-tight transition-colors ${
              isDark ? 'text-[#262626] group-hover:text-[#D98C95]' : 'text-white group-hover:text-[#E8C8C1]'
            }`}>BLOOMORA</span>
            <span className={`text-[9px] tracking-[0.2em] uppercase font-bold hidden sm:block ${
              isDark ? 'text-[#8B8B8B]' : 'text-white/70'
            }`}>AI Gifting &amp; Hyperlocal</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { label: 'Shop Gifts', href: '/catalog' },
              { label: 'Surprises', href: '/surprises', gold: true },
              { label: 'Planner', href: '/surprise-planner' },
              { label: 'AI Finder', href: '/gift-finder', rose: true, icon: Sparkles },
              { label: 'Custom Studio', href: '/custom-builder' },
              { label: 'Meet Me There', href: '/meet-me-there' },
            ].map(link => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                    link.rose
                      ? 'text-[#D98C95] hover:bg-[#D98C95]/10'
                      : link.gold
                      ? 'text-[#C8A46A] hover:bg-[#C8A46A]/10'
                      : isDark
                      ? 'text-[#262626] hover:text-[#D98C95] hover:bg-[#FCF6F2]'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}>
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Action Icons */}
          <div className="flex items-center gap-1">

            {/* Search */}
            <button onClick={() => setSearchOpen(o => !o)}
              className={`p-2.5 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                isDark ? 'text-[#262626] hover:bg-[#FCF6F2]' : 'text-white hover:bg-white/10'
              }`} title="Search">
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>

            {/* Wishlist & Cart — ONLY visible when user is logged in */}
            {isLoggedIn && (
              <>
                {/* Wishlist */}
                <Link href="/account?tab=wishlist"
                  className={`p-2.5 rounded-full transition-colors relative min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    isDark ? 'text-[#262626] hover:bg-[#FCF6F2]' : 'text-white hover:bg-white/10'
                  }`} title="Wishlist">
                  <Heart className="w-5 h-5 stroke-[1.75]" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#D98C95] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link href="/cart"
                  className={`p-2.5 rounded-full transition-colors relative min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    isDark ? 'text-[#262626] hover:bg-[#FCF6F2]' : 'text-white hover:bg-white/10'
                  }`} title="Shopping Bag">
                  <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#D98C95] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* User / Auth */}
            {isLoggedIn ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(o => !o)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${
                    isDark ? 'text-[#262626] hover:bg-[#FCF6F2]' : 'text-white hover:bg-white/10'
                  }`} title="Account">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E8C8C1] to-[#D98C95] flex items-center justify-center text-white text-xs font-bold">
                    {user?.first_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className="w-3 h-3 hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#EFE8E4] overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-[#EFE8E4] bg-[#FFF8F5]">
                      <p className="text-xs font-bold text-[#262626] truncate">{user?.full_name || user?.first_name}</p>
                      <p className="text-xs text-[#8B8B8B] truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      {[
                        { label: 'My Account', href: '/account' },
                        { label: 'My Orders', href: '/account?tab=orders' },
                        { label: 'Wishlist', href: '/account?tab=wishlist' },
                        { label: 'Reminders', href: '/account?tab=reminders' },
                        { label: 'Gift DNA', href: '/account?tab=giftdna' },
                        { label: 'Addresses', href: '/account?tab=addresses' },
                      ].map(item => (
                        <Link key={item.href} href={item.href}
                          className="flex items-center px-4 py-2.5 text-sm text-[#262626] hover:bg-[#FFF8F5] hover:text-[#D98C95] transition-colors"
                          onClick={() => setUserMenuOpen(false)}>
                          {item.label}
                        </Link>
                      ))}
                      <button onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[#D98C95] hover:bg-[#FEF0F0] border-t border-[#EFE8E4] transition-colors mt-1">
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login"
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  isDark
                    ? 'bg-[#262626] text-white hover:bg-[#D98C95]'
                    : 'bg-white/15 text-white border border-white/25 hover:bg-white/25'
                }`}>
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:block">Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar (expanded) */}
        {searchOpen && (
          <div className="border-t border-[#EFE8E4] bg-white/95 backdrop-blur-md px-4 py-3">
            <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-3 items-center">
              <Search className="w-4 h-4 text-[#8B8B8B] flex-shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search gifts, occasions, flowers..."
                className="flex-1 bg-transparent outline-none text-sm text-[#262626] placeholder-[#B0B0B0]"
              />
              {searchQuery && (
                <button type="submit"
                  className="text-xs font-bold text-[#D98C95] hover:text-[#C9838B] flex-shrink-0">
                  Search
                </button>
              )}
              <button type="button" onClick={() => setSearchOpen(false)} className="text-[#8B8B8B] hover:text-[#262626]">
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FFF8F5] border-b border-[#EFE8E4] px-6 py-6 shadow-xl">
            {isLoggedIn && (
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#EFE8E4] mb-5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8C8C1] to-[#D98C95] flex items-center justify-center text-white font-bold">
                  {user?.first_name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#262626]">{user?.full_name || user?.first_name}</p>
                  <p className="text-xs text-[#8B8B8B]">{user?.email}</p>
                </div>
              </div>
            )}
            <div className="grid gap-0 text-xs font-semibold uppercase tracking-widest">
              {[
                { label: 'Shop Gifts', href: '/catalog' },
                { label: '✨ Surprise Services', href: '/surprises', gold: true },
                { label: 'Surprise Planner', href: '/surprise-planner' },
                { label: '🔮 AI Gift Finder', href: '/gift-finder', rose: true },
                { label: 'Custom Studio', href: '/custom-builder' },
                { label: 'Meet Me There', href: '/meet-me-there' },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 border-b border-[#EFE8E4] flex items-center justify-between"
                  style={{ color: item.rose ? '#D98C95' : item.gold ? '#D4AF37' : undefined, fontWeight: item.rose || item.gold ? 800 : undefined }}>
                  {item.label}
                </Link>
              ))}

              {isLoggedIn ? (
                <>
                  {[
                    { label: 'My Orders', href: '/account?tab=orders' },
                    { label: 'Wishlist', href: '/account?tab=wishlist' },
                    { label: 'Reminders', href: '/account?tab=reminders' },
                  ].map(item => (
                    <Link key={item.href} href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-3 border-b border-[#EFE8E4] flex items-center justify-between text-[#262626]">
                      {item.label}
                    </Link>
                  ))}
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="py-3 flex items-center gap-2 text-[#D98C95] w-full">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}
                  className="py-3 flex items-center gap-2 font-bold"
                  style={{ color: '#D98C95' }}>
                  <LogIn className="w-4 h-4" /> Sign In / Create Account
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Backdrop to close user menu */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
      )}
    </>
  );
}

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import BloomoraAiWrapper from '../ai/BloomoraAiWrapper';
import GiftFinderTrigger from '../gift-finder/GiftFinderTrigger';
import RoleGatewayModal from '../auth/RoleGatewayModal';

export default function CustomerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPartnerRoute = pathname?.startsWith('/partner');
  const isAuthRoute = pathname?.startsWith('/auth');

  if (isPartnerRoute || isAuthRoute) {
    // Isolated pages: /partner (Seller Portal) and /auth (Login, Register, Forgot Password)
    // Completely isolated from customer headers, footers, bottom nav, and floating widgets
    return <main className="flex-grow">{children}</main>;
  }

  // Customer Site: Standard customer experience
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <BottomNav />
      <BloomoraAiWrapper />
      <GiftFinderTrigger />
      <RoleGatewayModal />
    </>
  );
}

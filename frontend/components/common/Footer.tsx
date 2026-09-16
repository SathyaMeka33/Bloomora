'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, ShieldCheck, Truck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#262626] text-[#FCF6F2] pt-16 pb-20 border-t border-[#E8C8C1]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#E8C8C1]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif-heading text-base font-semibold">AI-Guided Curation</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Personalized gift recommendations created around your budget, occasion, and relationship.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#E8C8C1]">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-serif-heading text-base font-semibold">Meet Me There Pickup</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Travel stress-free. Collect your prepared gift at destination partner hubs along your route.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#E8C8C1]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif-heading text-base font-semibold">Italian Packaging</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Fresh flowers, hand-wrapped velvet ribbons, rigid boxes, and gold foil greeting cards.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#E8C8C1]">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-serif-heading text-base font-semibold">Hyperlocal Delivery</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Express local doorstep delivery with live ETA tracking and photo verification.
            </p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-3">
            <span className="font-serif-heading text-2xl font-bold tracking-tight text-white">
              BLOOMORA
            </span>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              India’s First AI-Powered Hyperlocal Premium Gifting Platform. We do not sell flowers or generic products — we turn emotions into unforgettable moments.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h5 className="font-serif-heading text-sm font-semibold text-[#E8C8C1] uppercase tracking-wider">Navigation</h5>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/ai-concierge" className="hover:text-white transition-colors">Gift Finder</Link></li>
              <li><Link href="/meet-me-there" className="hover:text-white transition-colors">Meet Me There</Link></li>
              <li><Link href="/custom-builder" className="hover:text-white transition-colors">Custom Studio</Link></li>
              <li><Link href="/catalog" className="hover:text-white transition-colors">Collections</Link></li>
            </ul>
          </div>

          {/* Destination Cities */}
          <div className="space-y-3 text-xs">
            <h5 className="font-serif-heading text-sm font-semibold text-[#E8C8C1] uppercase tracking-wider">Destination Hubs</h5>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/meet-me-there" className="hover:text-white transition-colors">Surampalem</Link></li>
              <li><Link href="/meet-me-there" className="hover:text-white transition-colors">Rajahmundry</Link></li>
              <li><Link href="/meet-me-there" className="hover:text-white transition-colors">Vijayawada</Link></li>
              <li><Link href="/meet-me-there" className="hover:text-white transition-colors">Kakinada</Link></li>
            </ul>
          </div>

          {/* Platform Links */}
          <div className="space-y-3 text-xs">
            <h5 className="font-serif-heading text-sm font-semibold text-[#E8C8C1] uppercase tracking-wider">Platform</h5>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/partner" className="hover:text-white transition-colors">Become a Partner</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
              <li><Link href="/account" className="hover:text-white transition-colors">My Account</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Bloomora. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-gray-400">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-400">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

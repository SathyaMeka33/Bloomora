'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface BloomoraAiTriggerProps {
  onClick: () => void;
}

export default function BloomoraAiTrigger({ onClick }: BloomoraAiTriggerProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 group flex items-center gap-2 bg-[#3B172D] hover:bg-[#B58A4B] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-lg border border-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105"
      aria-label="Open Bloomora AI Gifting Concierge"
      title="Bloomora AI Concierge"
    >
      <div className="w-5 h-5 rounded-full bg-[#B58A4B]/30 flex items-center justify-center text-[#D4AF37] group-hover:text-white transition-colors">
        <Sparkles className="w-3.5 h-3.5" />
      </div>
      <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline text-[#FFFDFC]">
        Bloomora AI
      </span>
    </button>
  );
}

'use client';

import React, { useState } from 'react';
import BloomoraAiTrigger from './BloomoraAiTrigger';
import BloomoraAiChat from './BloomoraAiChat';

export default function BloomoraAiWrapper() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <BloomoraAiTrigger onClick={() => setIsChatOpen(true)} />
      <BloomoraAiChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}

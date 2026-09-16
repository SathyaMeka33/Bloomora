'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Send, X, ArrowRight, Bot, RefreshCw, ShoppingBag } from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  action?: {
    label: string;
    href: string;
  };
  timestamp: string;
}

interface BloomoraAiChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTED_PROMPTS = [
  'Help me find a birthday gift',
  'I need a gift under ₹1500',
  'Plan a surprise',
  'Tell me about Bloomora',
];

export default function BloomoraAiChat({ isOpen, onClose }: BloomoraAiChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const historyForApi = messages.map((m) => ({
        role: m.role,
        content: m.text,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: historyForApi,
          query: textToSend,
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: data.text || 'Bloomora AI is temporarily unavailable. You can continue exploring Bloomora and our gifting collections.',
        action: data.action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Failed to get Bloomora AI response:', err);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        text: 'Bloomora AI is temporarily unavailable. You can continue exploring Bloomora and our gifting collections.',
        action: { label: 'Explore Gift Catalog', href: '/catalog' },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Backdrop for Mobile / Tablet Overlay */}
      <div
        className="fixed inset-0 bg-[#1B1816]/40 backdrop-blur-xs z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Responsive Container: Mobile Bottom Sheet / Desktop Floating Card Drawer */}
      <div
        className="fixed z-50 bg-[#FFF8F5] flex flex-col shadow-2xl transition-all duration-300 ease-out border border-[#E8C8C1]/60
          inset-x-0 bottom-0 max-h-[90vh] rounded-t-3xl
          sm:bottom-6 sm:right-6 sm:left-auto sm:w-[420px] sm:max-w-[calc(100vw-2rem)] sm:h-[620px] sm:max-h-[calc(100vh-5rem)] sm:rounded-3xl"
        role="dialog"
        aria-label="Bloomora AI Concierge Assistant"
      >
        {/* Header */}
        <div className="bg-[#3B172D] text-white px-5 py-4 rounded-t-3xl sm:rounded-t-[22px] flex items-center justify-between border-b border-[#D4AF37]/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#B58A4B]/20 border border-[#B58A4B]/40 flex items-center justify-center text-[#B58A4B]">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="font-serif-heading font-bold text-base tracking-wide text-[#FFFDFC]">
                Bloomora AI
              </h2>
              <p className="text-[11px] text-[#E8C8C1] tracking-wider font-light">
                Virtual Gifting Concierge
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-full text-[#E8C8C1] hover:text-white hover:bg-white/10 transition-colors"
                title="Reset Conversation"
                aria-label="Reset Conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#E8C8C1] hover:text-white hover:bg-white/10 transition-colors"
              title="Close Concierge"
              aria-label="Close Concierge"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body / Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
          {/* Welcome Screen when conversation is fresh */}
          {messages.length === 0 && (
            <div className="py-6 text-center space-y-5 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-full bg-[#FFFDFC] border border-[#E8C8C1] flex items-center justify-center mx-auto shadow-xs text-[#3B172D]">
                <Bot className="w-7 h-7 stroke-[1.5] text-[#3B172D]" />
              </div>

              <div className="space-y-1.5 max-w-xs mx-auto">
                <h3 className="font-serif-heading text-lg font-semibold text-[#1B1816]">
                  Bloomora AI
                </h3>
                <p className="text-xs text-[#666666] leading-relaxed">
                  How can I help you find the perfect gift?
                </p>
              </div>

              {/* Suggested Prompts Grid */}
              <div className="pt-2 grid grid-cols-1 gap-2 text-left max-w-sm mx-auto">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B58A4B] px-1">
                  Suggested Prompts
                </span>
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="p-3 rounded-2xl bg-[#FFFDFC] hover:bg-[#FCF6F2] border border-[#EFE8E4] hover:border-[#E8C8C1] text-xs text-[#1B1816] transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <span>{prompt}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B58A4B] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Stream */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#3B172D] text-white rounded-br-none shadow-2xs'
                    : 'bg-[#FFFDFC] text-[#1B1816] border border-[#EFE8E4] rounded-bl-none editorial-card-shadow'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Optional Action Button */}
                {msg.action && (
                  <div className="mt-3 pt-2.5 border-t border-[#EFE8E4]">
                    <Link
                      href={msg.action.href}
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#3B172D] bg-[#F8F4EE] hover:bg-[#3B172D] hover:text-white border border-[#E8C8C1] px-3 py-1.5 rounded-full transition-all"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{msg.action.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>

              <span className="text-[9px] text-[#8B8B8B] mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#666666] bg-[#FFFDFC] border border-[#EFE8E4] px-4 py-3 rounded-2xl rounded-bl-none w-fit">
              <Sparkles className="w-3.5 h-3.5 text-[#B58A4B] animate-spin" />
              <span>Bloomora AI is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-[#FFFDFC] border-t border-[#EFE8E4] rounded-b-3xl sm:rounded-b-[22px] flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask Bloomora AI..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-[#FFF8F5] border border-[#E8C8C1]/60 rounded-full px-4 py-2.5 text-xs text-[#1B1816] placeholder-[#8B8B8B] focus:outline-none focus:border-[#B58A4B] transition-colors"
          />

          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="w-9 h-9 rounded-full bg-[#3B172D] hover:bg-[#B58A4B] disabled:bg-[#EFE8E4] disabled:text-[#8B8B8B] text-white flex items-center justify-center transition-colors shadow-2xs"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </>
  );
}

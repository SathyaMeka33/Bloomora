'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { Store, ArrowRight, ShieldCheck, Mail, Lock, User, Building, Phone, MapPin, Loader2, KeyRound } from 'lucide-react';

interface PartnerLoginProps {
  onSuccess?: () => void;
}

export default function PartnerLogin({ onSuccess }: PartnerLoginProps) {
  const { signInWithEmail, signUpWithEmail, signInAsDemoUser } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Rajahmundry');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
        if (onSuccess) onSuccess();
      } else if (mode === 'signup') {
        if (!email || !password || !name) {
          setError('Please fill in all required fields.');
          setLoading(false);
          return;
        }
        await signUpWithEmail(email, password, name);
        // Default new seller sign-up to partner role
        if (onSuccess) onSuccess();
      } else if (mode === 'forgot') {
        if (!email) {
          setError('Please enter your partner account email address.');
          setLoading(false);
          return;
        }
        setSuccessMsg('Password reset instructions have been dispatched to your email address.');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication operation failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoPartnerLogin = () => {
    signInAsDemoUser('partner', 'Rajahmundry Artisanal Shop', 'partner@bloomora.com');
    if (onSuccess) onSuccess();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-12 bg-[#F8F4EE]">
      <div className="w-full max-w-md space-y-8 bg-white rounded-3xl p-8 sm:p-10 border border-[#E9C9C7]/40 shadow-xs">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#3B172D] text-[#B58A4B] shadow-sm mb-2">
            <Store className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1B1816]">
            Bloomora Partners
          </h1>
          <p className="text-xs text-[#746E68] max-w-sm mx-auto leading-relaxed">
            Bring your craft to beautiful gifting experiences.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-[#F4E8E5] p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signin' ? 'bg-white text-[#3B172D] shadow-xs' : 'text-[#746E68] hover:text-[#1B1816]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signup' ? 'bg-white text-[#3B172D] shadow-xs' : 'text-[#746E68] hover:text-[#1B1816]'
            }`}
          >
            Create Partner Account
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-[#A73A4A]/10 border border-[#A73A4A]/30 text-[#A73A4A] text-xs font-medium">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-[#526D55]/10 border border-[#526D55]/30 text-[#526D55] text-xs font-medium">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1B1816] block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#746E68] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sriram Reddy"
                    className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#1B1816] focus:outline-none focus:border-[#3B172D]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1B1816] block">Brand / Business Name</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#746E68] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Artisanal Gifting Studio"
                    className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#1B1816] focus:outline-none focus:border-[#3B172D]"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1B1816] block">Partner Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#746E68] absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="partner@bloomora.com"
                className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#1B1816] focus:outline-none focus:border-[#3B172D]"
                required
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1B1816]">Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-[#B58A4B] font-semibold hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#746E68] absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#1B1816] focus:outline-none focus:border-[#3B172D]"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3B172D] text-[#FFFDFC] py-3.5 rounded-full text-xs font-bold hover:bg-[#1B1816] transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#B58A4B]" />
            ) : (
              <>
                {mode === 'signin' ? 'Sign In to Partner Portal' : mode === 'signup' ? 'Create Partner Account' : 'Send Reset Link'}
                <ArrowRight className="w-4 h-4 text-[#B58A4B]" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Track */}
        <div className="pt-4 border-t border-[#F4E8E5] text-center space-y-3">
          <span className="text-[11px] text-[#746E68] block">Demonstration & Partner Testing</span>
          <button
            type="button"
            onClick={handleDemoPartnerLogin}
            className="w-full bg-[#F4E8E5] text-[#3B172D] py-2.5 rounded-full text-xs font-bold border border-[#E9C9C7]/50 hover:bg-[#E9C9C7]/40 transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#B58A4B]" />
            Sign In with Demo Partner Credentials
          </button>
        </div>
      </div>
    </div>
  );
}

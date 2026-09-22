'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Sparkles, Mail, Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBloomoraAuth } from '@/lib/hooks/useBloomoraAuth';
import { useSellerStore, authenticateSeller } from '@/lib/sellerStore';
import { Store, ShoppingBag } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const { login } = useBloomoraAuth();
  const { setActiveRole } = useSellerStore();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'seller'>(
    roleParam === 'seller' ? 'seller' : 'customer'
  );

  useEffect(() => {
    if (roleParam === 'seller') {
      setSelectedRole('seller');
    } else if (roleParam === 'customer') {
      setSelectedRole('customer');
    }
  }, [roleParam]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  /* ─ focus styles ─ */
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.parentElement!.style.borderColor = '#D98C95';
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.parentElement!.style.borderColor = '#EFE8E4';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');

    if (selectedRole === 'seller') {
      // Authenticate seller against registered/verified credentials (both Django DB and store)
      const res = await authenticateSeller(email, password);
      if (!res.success) {
        setError(res.error || 'Invalid merchant credentials. Please check your seller email and password.');
        setLoading(false);
        return;
      }
      setActiveRole('seller');
      setSuccess(true);
      setTimeout(() => {
        router.push('/partner');
      }, 800);
      return;
    }

    try {
      await login(email.trim(), password);
      const { authApiService } = await import('@/lib/api');
      const me = await authApiService.getMe();

      if (me.role === 'seller') {
        setActiveRole('seller');
        if (typeof window !== 'undefined') {
          localStorage.setItem('bloomora_role_chosen', 'seller');
          localStorage.setItem('bloomora_seller_authenticated', 'true');
        }
        setSuccess(true);
        setTimeout(() => {
          router.push('/partner');
        }, 800);
        return;
      }

      setActiveRole('customer');
      if (typeof window !== 'undefined') {
        localStorage.setItem('bloomora_role_chosen', 'customer');
      }
      setSuccess(true);
      setTimeout(() => {
        const defaultNext = '/account';
        const redirect = new URLSearchParams(window.location.search).get('next') || defaultNext;
        router.push(redirect);
      }, 900);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || '';
      if (msg.includes('400') || msg.includes('401') || msg.includes('Invalid')) {
        setError('Invalid email or password. Please try again.');
      } else if (msg.includes('Network') || msg.includes('fetch')) {
        setError('Unable to connect. Please ensure the backend is running.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputWrapper: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '12px',
    background: '#FFFFFF', border: '1.5px solid #EFE8E4',
    borderRadius: '14px', padding: '0 16px',
    transition: 'border-color 0.2s',
  };

  const inputEl: React.CSSProperties = {
    flex: 1, border: 'none', outline: 'none', padding: '16px 0',
    fontSize: '15px', color: '#262626', background: 'transparent',
    fontFamily: 'inherit',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F5', display: 'flex', alignItems: 'stretch' }}>
      {/* ─ LEFT PANEL (hidden on mobile) ─ */}
      <div style={{ flex: 1, display: 'none', position: 'relative', overflow: 'hidden' }}
        className="auth-left-panel">
        <img
          src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=85"
          alt="Bloomora luxury gifting"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.03) saturate(0.9) sepia(0.06)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(38,38,38,0.5) 0%, rgba(38,38,38,0.2) 50%, rgba(38,38,38,0.7) 100%)' }} />
        <div style={{ position: 'absolute', bottom: '48px', left: '48px', right: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '6px 16px', marginBottom: '16px' }}>
            <Sparkles size={12} color="#E8C8C1" />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E8C8C1' }}>India's First AI Gifting Platform</span>
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '12px', fontFamily: 'var(--font-playfair), serif' }}>
            Gifts that make<br />people feel seen.
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: '340px' }}>
            AI-powered gift curation. Hyperlocal pickup. Emotion-first recommendations. From ₹149.
          </p>
        </div>
      </div>

      {/* ─ RIGHT PANEL (form) ─ */}
      <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 32px', minHeight: '100vh' }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '32px' }}>
          <span style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '28px', fontWeight: 800, color: '#262626', letterSpacing: '-0.02em' }}>
            BLOOMORA
          </span>
        </Link>

        {/* Role Toggle Selector */}
        <div style={{ display: 'flex', background: '#F4E8E5', padding: '4px', borderRadius: '16px', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => setSelectedRole('customer')}
            style={{
              flex: 1, padding: '10px 14px', borderRadius: '12px', border: 'none',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              background: selectedRole === 'customer' ? '#FFFFFF' : 'transparent',
              color: selectedRole === 'customer' ? '#262626' : '#746E68',
              boxShadow: selectedRole === 'customer' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <ShoppingBag size={14} color={selectedRole === 'customer' ? '#D98C95' : '#746E68'} />
            Customer
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('seller')}
            style={{
              flex: 1, padding: '10px 14px', borderRadius: '12px', border: 'none',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              background: selectedRole === 'seller' ? '#3B172D' : 'transparent',
              color: selectedRole === 'seller' ? '#FFFFFF' : '#746E68',
              boxShadow: selectedRole === 'seller' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Store size={14} color={selectedRole === 'seller' ? '#B58A4B' : '#746E68'} />
            Seller Portal
          </button>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '48px 0' }}>
              <CheckCircle size={52} style={{ color: '#5A9E7B', margin: '0 auto 20px', display: 'block' }} />
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#262626', marginBottom: '8px', fontFamily: 'var(--font-playfair), serif' }}>Welcome back!</h2>
              <p style={{ color: '#8B8B8B' }}>Signing you in to Bloomora...</p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#262626', marginBottom: '6px', fontFamily: 'var(--font-playfair), serif' }}>
                  {selectedRole === 'seller' ? 'Seller Merchant Portal' : 'Sign in to Bloomora'}
                </h1>
                <p style={{ fontSize: '13px', color: '#8B8B8B' }}>
                  {selectedRole === 'seller' ? (
                    <>
                      Partner Merchant Studio. Need an account?{' '}
                      <Link href="/auth/register?role=seller" style={{ color: '#B58A4B', fontWeight: 700, textDecoration: 'none' }}>
                        Register as Seller
                      </Link>
                    </>
                  ) : (
                    <>
                      New to Bloomora?{' '}
                      <Link href="/auth/register" style={{ color: '#D98C95', fontWeight: 700, textDecoration: 'none' }}>
                        Create account
                      </Link>
                    </>
                  )}
                </p>
              </div>

              {/* Error alert */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#FEF0F0', border: '1px solid #F5C6CC', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px' }}>
                    <AlertCircle size={16} color="#D98C95" style={{ flexShrink: 0, marginTop: '1px' }} />
                    <p style={{ fontSize: '13px', color: '#D98C95', fontWeight: 500 }}>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Email */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#262626', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
                    {selectedRole === 'seller' ? 'Seller Email Address' : 'Email address'}
                  </label>
                  <div style={inputWrapper}>
                    <Mail size={16} color="#B0B0B0" style={{ flexShrink: 0 }} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder={selectedRole === 'seller' ? 'seller@bloomora.com' : 'you@example.com'}
                      style={inputEl} onFocus={onFocus} onBlur={onBlur} autoComplete="email" required />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#262626', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
                    {selectedRole === 'seller' ? 'Seller Account Password' : 'Password'}
                  </label>
                  <div style={inputWrapper}>
                    <Lock size={16} color="#B0B0B0" style={{ flexShrink: 0 }} />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Your password" style={inputEl} onFocus={onFocus} onBlur={onBlur} autoComplete="current-password" required />
                    <button type="button" onClick={() => setShowPassword(s => !s)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B0B0B0', display: 'flex', padding: '4px' }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Forgot */}
                <div style={{ textAlign: 'right', marginTop: '-4px' }}>
                  <Link href="/auth/forgot-password" style={{ fontSize: '12px', color: '#D98C95', textDecoration: 'none', fontWeight: 600 }}>Forgot password?</Link>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading || !email || !password}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    background: loading || !email || !password
                      ? '#CCCCCC'
                      : selectedRole === 'seller' ? '#3B172D' : '#262626',
                    color: 'white', border: 'none', borderRadius: '100px',
                    padding: '18px 32px', fontSize: '15px', fontWeight: 700,
                    cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
                    transition: 'all 0.25s', marginTop: '8px',
                  }}
                  onMouseEnter={e => {
                    if (!loading && email && password) {
                      (e.currentTarget as HTMLButtonElement).style.background = selectedRole === 'seller' ? '#B58A4B' : '#D98C95';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!loading && email && password) {
                      (e.currentTarget as HTMLButtonElement).style.background = selectedRole === 'seller' ? '#3B172D' : '#262626';
                    }
                  }}>
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" /> Verifying Credentials...</>
                  ) : (
                    <>{selectedRole === 'seller' ? 'Sign in to Seller Studio' : 'Sign in'} <ArrowRight size={16} /></>
                  )}
                </button>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
                  <div style={{ flex: 1, height: '1px', background: '#EFE8E4' }} />
                  <span style={{ fontSize: '12px', color: '#B0B0B0' }}>or test with demo credentials</span>
                  <div style={{ flex: 1, height: '1px', background: '#EFE8E4' }} />
                </div>

                {/* Demo accounts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Customer Demo', email: 'customer@bloomora.com', password: 'Bloomora@2026', role: 'customer' as const, badge: '🛍️' },
                    { label: 'Seller Demo', email: 'seller@bloomora.com', password: 'Bloomora@2026', role: 'seller' as const, badge: '🏪' },
                  ].map(demo => (
                    <button key={demo.email} type="button"
                      onClick={() => {
                        setEmail(demo.email);
                        setPassword(demo.password);
                        setSelectedRole(demo.role);
                        setError('');
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        background: '#FFFFFF', border: '1.5px solid #EFE8E4',
                        borderRadius: '12px', padding: '12px 16px', cursor: 'pointer',
                        transition: 'all 0.2s', textAlign: 'left',
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = demo.role === 'seller' ? '#B58A4B' : '#D98C95'}
                      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = '#EFE8E4'}>
                      <span style={{ fontSize: '18px' }}>{demo.badge}</span>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#262626' }}>{demo.label}</div>
                        <div style={{ fontSize: '11px', color: '#8B8B8B' }}>{demo.email} • Click to populate, then click sign in</div>
                      </div>
                    </button>
                  ))}
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <p style={{ marginTop: 'auto', paddingTop: '40px', fontSize: '12px', color: '#B0B0B0', textAlign: 'center', lineHeight: 1.6 }}>
          By signing in you agree to our{' '}
          <Link href="/terms" style={{ color: '#8B8B8B', textDecoration: 'none' }}>Terms</Link> &amp;{' '}
          <Link href="/privacy" style={{ color: '#8B8B8B', textDecoration: 'none' }}>Privacy Policy</Link>
        </p>
      </div>

      {/* Responsive CSS for left panel */}
      <style>{`
        @media (min-width: 900px) {
          .auth-left-panel { display: block !important; }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#FFF8F5' }} />}>
      <LoginContent />
    </Suspense>
  );
}

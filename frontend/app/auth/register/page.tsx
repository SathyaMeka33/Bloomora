'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Sparkles, Mail, Lock, User, Phone, Loader2, CheckCircle, AlertCircle, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSellerStore, saveRegisteredSellerAccount, clearSellerAuthentication } from '@/lib/sellerStore';
import { Store, ShoppingBag } from 'lucide-react';

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
];

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const { setActiveRole, updateStoreProfile } = useSellerStore();
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

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    storeName: '',
    city: 'Surampalem / Rajahmundry',
    storeCategory: 'Artisanal Bakery & Floral Atelier',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [agree, setAgree] = useState(false);

  const set = (k: keyof typeof form, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setError('');
  };
  const update = set;

  const passwordStrength = PASSWORD_RULES.filter(r => r.test(form.password)).length;
  const strengthColors = ['#EFE8E4', '#D98C95', '#C8A46A', '#5A9E7B'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];

  const valid = Boolean(
    (selectedRole === 'seller' ? (form.storeName.trim() && form.firstName.trim()) : form.firstName.trim()) &&
    form.email.trim() &&
    form.password.length >= 8 &&
    form.password === form.confirmPassword &&
    agree
  );

  const inputWrapper = (hasError = false): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '12px',
    background: '#FFFFFF',
    border: `1.5px solid ${hasError ? '#D98C95' : '#EFE8E4'}`,
    borderRadius: '14px', padding: '0 16px',
    transition: 'border-color 0.2s',
  });

  const inputEl: React.CSSProperties = {
    flex: 1, border: 'none', outline: 'none', padding: '16px 0',
    fontSize: '15px', color: '#262626', background: 'transparent', fontFamily: 'inherit',
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.parentElement!.style.borderColor = '#D98C95';
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.parentElement!.style.borderColor = '#EFE8E4';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'customer' && (!form.firstName.trim() || !form.lastName.trim())) {
      setError('Please enter your full name.');
      return;
    }
    if (selectedRole === 'seller' && (!form.storeName.trim() || !form.firstName.trim())) {
      setError('Please enter your store name and owner name.');
      return;
    }
    if (!form.email.trim() || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    const passwordValid = PASSWORD_RULES.every(r => r.test(form.password));
    if (!passwordValid) return;
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    try {
      if (selectedRole === 'seller') {
        // 1. Create seller in Django backend with explicit role: 'seller'
        const { authApiService } = await import('@/lib/api');
        await authApiService.register({
          email: form.email.trim(),
          password: form.password,
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          phone_number: form.phone.trim() || undefined,
          role: 'seller',
          store_name: form.storeName.trim() || undefined,
          city: form.city.trim() || undefined,
        });

        // 2. Register credentials and store profile in local store
        const storeName = form.storeName.trim() || `${form.firstName}'s Artisan Studio`;
        const ownerName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
        const email = form.email.trim();
        const phone = form.phone.trim() || '+91 98765 43210';
        const city = form.city.trim() || 'Surampalem / Rajahmundry';

        saveRegisteredSellerAccount({
          email,
          password: form.password,
          storeName,
          ownerName,
          phone,
          city,
          storeCategory: form.storeCategory,
        });

        updateStoreProfile({
          storeName,
          ownerName,
          email,
          phone,
          city,
          storeCategory: form.storeCategory,
        });

        // Do not bypass authentication - require explicit login with newly registered credentials
        clearSellerAuthentication();
        setActiveRole('seller');

        setSuccess(true);
        setTimeout(() => router.push('/auth/login?role=seller'), 1200);
      } else {
        // Customer Account Creation
        const { authApiService } = await import('@/lib/api');
        await authApiService.register({
          email: form.email.trim(),
          password: form.password,
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          phone_number: form.phone.trim() || undefined,
          role: 'customer',
        });
        setSuccess(true);
        setTimeout(() => router.push('/account'), 1500);
      }
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || '';
      if (msg.includes('email') || msg.includes('400')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (msg.includes('Network') || msg.includes('fetch')) {
        setError('Unable to connect. Please ensure the backend is running.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F5', display: 'flex', alignItems: 'stretch' }}>
      {/* ─ LEFT PANEL ─ */}
      <div style={{ flex: 1, display: 'none', position: 'relative', overflow: 'hidden' }} className="auth-left-panel">
        <img src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=900&q=85"
          alt="Bloomora" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.03) saturate(0.9) sepia(0.06)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(38,38,38,0.5) 0%, rgba(38,38,38,0.2) 50%, rgba(38,38,38,0.75) 100%)' }} />
        <div style={{ position: 'absolute', bottom: '48px', left: '48px', right: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '6px 16px', marginBottom: '16px' }}>
            <Sparkles size={12} color="#E8C8C1" />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E8C8C1' }}>Join Bloomora</span>
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '12px', fontFamily: 'var(--font-playfair), serif' }}>
            Start gifting<br />with intention.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
            {[
              { icon: '✨', text: 'AI Gift Finder with Gift Fit Score™' },
              { icon: '🔔', text: 'Occasion reminders & Gift DNA profiles' },
              { icon: '⚡', text: 'Same-day hyperlocal delivery from ₹149' },
            ].map(p => (
              <div key={p.text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px' }}>{p.icon}</span>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─ RIGHT PANEL (form) ─ */}
      <div style={{ width: '100%', maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 32px', minHeight: '100vh', overflowY: 'auto' }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '36px' }}>
          <span style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '26px', fontWeight: 800, color: '#262626' }}>BLOOMORA</span>
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
            Customer Account
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
            Seller / Merchant
          </button>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '48px 0' }}>
              <CheckCircle size={52} style={{ color: '#5A9E7B', margin: '0 auto 20px', display: 'block' }} />
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#262626', marginBottom: '8px', fontFamily: 'var(--font-playfair), serif' }}>
                {selectedRole === 'seller' ? 'Welcome, Merchant Partner!' : 'Welcome to Bloomora!'}
              </h2>
              <p style={{ color: '#8B8B8B' }}>
                {selectedRole === 'seller'
                  ? 'Your seller studio has been registered! Redirecting to merchant login to authenticate with your credentials...'
                  : 'Your account has been created. Redirecting...'}
              </p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#262626', marginBottom: '6px', fontFamily: 'var(--font-playfair), serif' }}>
                  {selectedRole === 'seller' ? 'Register as Seller Partner' : 'Create your account'}
                </h1>
                <p style={{ fontSize: '14px', color: '#8B8B8B' }}>
                  Already a member?{' '}
                  <Link href={`/auth/login?role=${selectedRole}`} style={{ color: '#D98C95', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
                </p>
              </div>

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
                {/* Seller Specific: Store Business Name & Category */}
                {selectedRole === 'seller' && (
                  <>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#262626', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '7px' }}>
                        Store / Business Name *
                      </label>
                      <div style={inputWrapper()}>
                        <Store size={15} color="#B0B0B0" style={{ flexShrink: 0 }} />
                        <input
                          type="text"
                          placeholder="e.g. Royal Rose & Bakers Studio"
                          value={form.storeName}
                          onChange={e => set('storeName', e.target.value)}
                          style={inputEl}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#262626', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '7px' }}>
                          Workshop City / Hub *
                        </label>
                        <div style={inputWrapper()}>
                          <input
                            type="text"
                            placeholder="Surampalem / Rajahmundry"
                            value={form.city}
                            onChange={e => set('city', e.target.value)}
                            style={inputEl}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#262626', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '7px' }}>
                          Artisan Specialty *
                        </label>
                        <div style={inputWrapper()}>
                          <select
                            value={form.storeCategory}
                            onChange={e => set('storeCategory', e.target.value)}
                            style={{ ...inputEl, cursor: 'pointer' }}
                            onFocus={onFocus}
                            onBlur={onBlur}
                          >
                            <option value="Artisanal Bakery & Floral Atelier">Bakery & Floral Atelier</option>
                            <option value="Gourmet Chocolates & Bouquets">Chocolates & Bouquets</option>
                            <option value="Luxury Gift Hampers">Luxury Gift Hampers</option>
                            <option value="Personalized Keepsakes">Personalized Keepsakes</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Name row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { label: selectedRole === 'seller' ? 'Owner First name *' : 'First name *', key: 'firstName', placeholder: 'Venkatesh' },
                    { label: selectedRole === 'seller' ? 'Owner Last name' : 'Last name', key: 'lastName', placeholder: 'Rao' },
                  ].map(field => (
                    <div key={field.key}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#262626', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '7px' }}>{field.label}</label>
                      <div style={inputWrapper()}>
                        <User size={15} color="#B0B0B0" style={{ flexShrink: 0 }} />
                        <input type="text" placeholder={field.placeholder} value={(form as Record<string, string>)[field.key]}
                          onChange={e => set(field.key as keyof typeof form, e.target.value)}
                          style={inputEl} onFocus={onFocus} onBlur={onBlur} autoComplete={field.key === 'firstName' ? 'given-name' : 'family-name'} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Email */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#262626', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '7px' }}>Email address *</label>
                  <div style={inputWrapper()}>
                    <Mail size={15} color="#B0B0B0" style={{ flexShrink: 0 }} />
                    <input type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)}
                      style={inputEl} onFocus={onFocus} onBlur={onBlur} autoComplete="email" required />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#262626', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '7px' }}>
                    Mobile number <span style={{ fontWeight: 400, color: '#B0B0B0', textTransform: 'none', fontSize: '11px' }}>(optional)</span>
                  </label>
                  <div style={inputWrapper()}>
                    <Phone size={15} color="#B0B0B0" style={{ flexShrink: 0 }} />
                    <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)}
                      style={inputEl} onFocus={onFocus} onBlur={onBlur} autoComplete="tel" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#262626', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '7px' }}>Password *</label>
                  <div style={inputWrapper()}>
                    <Lock size={15} color="#B0B0B0" style={{ flexShrink: 0 }} />
                    <input type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password} onChange={e => set('password', e.target.value)}
                      style={inputEl} onFocus={onFocus} onBlur={onBlur} autoComplete="new-password" required />
                    <button type="button" onClick={() => setShowPassword(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B0B0B0', display: 'flex', padding: '4px' }}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {form.password && (
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                        {[1, 2, 3].map(i => (
                          <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= passwordStrength ? strengthColors[passwordStrength] : '#EFE8E4', transition: 'background 0.3s' }} />
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: strengthColors[passwordStrength], fontWeight: 600 }}>{strengthLabels[passwordStrength]}</span>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          {PASSWORD_RULES.map(r => (
                            <span key={r.label} style={{ fontSize: '10px', color: r.test(form.password) ? '#5A9E7B' : '#B0B0B0', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Check size={9} /> {r.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#262626', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '7px' }}>Confirm password *</label>
                  <div style={inputWrapper(!!form.confirmPassword && form.password !== form.confirmPassword)}>
                    <Lock size={15} color="#B0B0B0" style={{ flexShrink: 0 }} />
                    <input type={showConfirm ? 'text' : 'password'} placeholder="Re-enter your password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
                      style={inputEl} onFocus={onFocus} onBlur={onBlur} autoComplete="new-password" required />
                    <button type="button" onClick={() => setShowConfirm(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B0B0B0', display: 'flex', padding: '4px' }}>
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p style={{ fontSize: '12px', color: '#D98C95', marginTop: '6px' }}>Passwords don't match</p>
                  )}
                </div>

                {/* Terms */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                  <div onClick={() => setAgree(a => !a)} style={{
                    width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0, marginTop: '1px',
                    background: agree ? '#D98C95' : '#FFFFFF',
                    border: `2px solid ${agree ? '#D98C95' : '#EFE8E4'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s', cursor: 'pointer',
                  }}>
                    {agree && <Check size={11} color="white" strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: '13px', color: '#666666', lineHeight: 1.5 }}>
                    I agree to Bloomora's{' '}
                    <Link href="/terms" style={{ color: '#D98C95', textDecoration: 'none', fontWeight: 600 }}>Terms of Service</Link> and{' '}
                    <Link href="/privacy" style={{ color: '#D98C95', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link>
                  </span>
                </label>

                {/* Submit */}
                <button type="submit" disabled={!valid || loading}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    background: !valid || loading ? '#CCCCCC' : selectedRole === 'seller' ? '#3B172D' : '#D98C95',
                    color: 'white', border: 'none', borderRadius: '100px',
                    padding: '18px 32px', fontSize: '15px', fontWeight: 700,
                    cursor: !valid || loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.25s', marginTop: '4px',
                    boxShadow: valid && !loading ? '0 6px 24px rgba(0,0,0,0.15)' : 'none',
                  }}
                  onMouseEnter={e => {
                    if (valid && !loading) {
                      (e.currentTarget as HTMLButtonElement).style.background = selectedRole === 'seller' ? '#1B1816' : '#C9838B';
                    }
                  }}
                  onMouseLeave={e => {
                    if (valid && !loading) {
                      (e.currentTarget as HTMLButtonElement).style.background = selectedRole === 'seller' ? '#3B172D' : '#D98C95';
                    }
                  }}>
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" /> {selectedRole === 'seller' ? 'Registering merchant...' : 'Creating account...'}</>
                  ) : (
                    <>{selectedRole === 'seller' ? 'Register Merchant Partner & Open Dashboard' : 'Create Account'} <ArrowRight size={16} /></>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <p style={{ marginTop: '32px', fontSize: '12px', color: '#B0B0B0', textAlign: 'center' }}>
          Your information is safe with us. We never share your data.
        </p>
      </div>

      <style>{`
        @media (min-width: 900px) { .auth-left-panel { display: block !important; } }
      `}</style>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#FFF8F5' }} />}>
      <RegisterContent />
    </Suspense>
  );
}

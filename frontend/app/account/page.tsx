'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Package, Heart, Bell, Dna, MapPin, User as UserIcon,
  Plus, Trash2, Edit2, ArrowRight, CheckCircle, AlertCircle,
  ShoppingBag, Loader2, X, Calendar, Gift, Sparkles, LogIn,
} from 'lucide-react';
import { useBloomoraAuth } from '@/lib/hooks/useBloomoraAuth';
import { useBloomoraStore } from '@/lib/store';
import { PRODUCTS, Product } from '@/lib/mockData';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── colour tokens ─── */
const C = {
  bg: '#FFF8F5', card: '#FFFFFF', border: '#EFE8E4',
  rose: '#D98C95', gold: '#C8A46A', text: '#262626',
  muted: '#8B8B8B', soft: '#FCF6F2', green: '#5A9E7B',
};

/* ─── Helpers ─── */
const btn = (variant: 'primary' | 'ghost' | 'danger', extra = {}): React.CSSProperties => {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    borderRadius: '100px', padding: '12px 22px',
    fontSize: '13px', fontWeight: 700, cursor: 'pointer',
    border: 'none', transition: 'all 0.2s', ...extra,
  };
  if (variant === 'primary') return { ...base, background: C.rose, color: 'white' };
  if (variant === 'ghost') return { ...base, background: 'white', color: C.text, border: `1.5px solid ${C.border}` };
  return { ...base, background: '#FEF0F0', color: C.rose, border: `1px solid #F5C6CC` };
};

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'white', border: `1.5px solid ${C.border}`,
  borderRadius: '12px', padding: '13px 16px',
  fontSize: '14px', color: C.text, outline: 'none', fontFamily: 'inherit',
  transition: 'border-color 0.2s',
};

/* ─── Section label ─── */
function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 800, color: C.text, fontFamily: 'var(--font-playfair), serif', marginBottom: '4px' }}>{title}</h2>
      {sub && <p style={{ fontSize: '14px', color: C.muted }}>{sub}</p>}
    </div>
  );
}

/* ─── Toast ─── */
function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
      style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '10px', background: ok ? '#EFF7F3' : '#FEF0F0', border: `1px solid ${ok ? '#A8D5BF' : '#F5C6CC'}`, borderRadius: '100px', padding: '12px 20px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', fontSize: '13px', fontWeight: 600, color: ok ? C.green : C.rose, whiteSpace: 'nowrap' }}>
      {ok ? <CheckCircle size={15} /> : <AlertCircle size={15} />} {msg}
    </motion.div>
  );
}

/* ─── ORDERS TAB ─── */
function OrdersTab() {
  const [orders, setOrders] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { orderApiService } = await import('@/lib/api');
        const data = await orderApiService.getOrders();
        setOrders(Array.isArray(data) ? data : (data as { results?: unknown[] }).results || []);
      } catch { /* silent */ } finally { setLoading(false); }
    })();
  }, []);

  const STATUS_COLORS: Record<string, string> = {
    pending: '#C8A46A', confirmed: '#5B8AC5', processing: '#8B6BAE',
    shipped: '#5A9E7B', delivered: '#5A9E7B', cancelled: '#D98C95',
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: C.muted }}><Loader2 size={28} style={{ margin: '0 auto' }} className="animate-spin" /></div>;

  if (!orders.length) return (
    <div style={{ textAlign: 'center', padding: '60px 24px', background: 'white', borderRadius: '20px', border: `1px solid ${C.border}` }}>
      <Package size={40} style={{ color: C.rose, margin: '0 auto 16px' }} />
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.text, marginBottom: '8px' }}>No orders yet</h3>
      <p style={{ color: C.muted, marginBottom: '24px' }}>Your placed orders will appear here.</p>
      <Link href="/catalog" style={{ ...btn('primary'), textDecoration: 'none' }}>
        <ShoppingBag size={14} /> Shop Now
      </Link>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {orders.map((order: unknown) => {
        const o = order as Record<string, unknown>;
        const status = String(o.status || 'pending');
        return (
          <div key={String(o.id)} style={{ background: 'white', border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: C.text }}>#{String(o.id)}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', background: `${STATUS_COLORS[status]}22`, color: STATUS_COLORS[status], textTransform: 'capitalize' }}>{status}</span>
              </div>
              <p style={{ fontSize: '13px', color: C.muted, marginBottom: '4px' }}>
                {new Date(String(o.created_at || '')).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p style={{ fontSize: '15px', fontWeight: 800, color: C.text }}>₹{String(o.total_amount || o.total || 0)}</p>
            </div>
            <Link href={`/order/${o.id}`} style={{ ...btn('ghost'), textDecoration: 'none', flexShrink: 0 }}>
              View <ArrowRight size={13} />
            </Link>
          </div>
        );
      })}
    </div>
  );
}

/* ─── WISHLIST TAB ─── */
function WishlistTab() {
  const { wishlist, toggleWishlist, addToCart } = useBloomoraStore();
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  const wishlistedProducts = wishlist
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const handleAdd = (p: Product) => {
    addToCart(p, 1);
    showToast(`Added "${p.name}" to cart!`);
  };

  if (!wishlistedProducts.length) return (
    <div style={{ textAlign: 'center', padding: '60px 24px', background: 'white', borderRadius: '20px', border: `1px solid ${C.border}` }}>
      <Heart size={40} style={{ color: C.rose, margin: '0 auto 16px' }} />
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.text, marginBottom: '8px' }}>Your wishlist is empty</h3>
      <p style={{ color: C.muted, marginBottom: '24px' }}>Heart products while browsing to save them here for special celebrations.</p>
      <Link href="/catalog" style={{ ...btn('primary'), textDecoration: 'none' }}>Browse Gift Catalog</Link>
    </div>
  );

  return (
    <>
      <AnimatePresence>{toast && <Toast msg={toast.msg} ok={toast.ok} />}</AnimatePresence>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '18px' }}>
        {wishlistedProducts.map((p) => (
          <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ background: 'white', border: `1px solid ${C.border}`, borderRadius: '18px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', aspectRatio: '4/3', background: C.bg }}>
              <Link href={`/product/${p.id}`}>
                <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=70'} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Link>
              <button onClick={() => { toggleWishlist(p.id); showToast('Removed from wishlist'); }}
                title="Remove from wishlist"
                style={{ position: 'absolute', top: '10px', right: '10px', width: '32px', height: '32px', background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <X size={14} color={C.rose} />
              </button>
              <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#262626', color: 'white', fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {p.category.replace('-', ' ')}
              </span>
            </div>
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
              <div>
                <Link href={`/product/${p.id}`} style={{ textDecoration: 'none' }}>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: C.text, marginBottom: '6px', lineHeight: 1.3 }}>{p.name}</p>
                </Link>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '17px', fontWeight: 800, color: C.text }}>₹{p.price}</span>
                  {p.originalPrice && <span style={{ fontSize: '12px', color: '#A0A0A0', textDecoration: 'line-through' }}>₹{p.originalPrice}</span>}
                </div>
              </div>
              <button onClick={() => handleAdd(p)}
                style={{ ...btn('primary'), width: '100%', justifyContent: 'center', padding: '11px', fontSize: '12px' }}>
                <ShoppingBag size={13} /> Add to Bag
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

/* ─── REMINDERS TAB ─── */
const OCCASIONS_LIST = ['Birthday', 'Anniversary', 'Love', 'Thank You', 'Congratulations', 'Sorry', 'Graduation', 'Wedding', 'Friendship'];
const RELATIONSHIPS_LIST = ['Partner', 'Mother', 'Father', 'Sibling', 'Friend', 'Colleague', 'Teacher', 'Other'];

function RemindersTab() {
  const { reminders, addReminder, deleteReminder } = useBloomoraStore();
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [form, setForm] = useState({
    recipient_name: '', relationship: '', occasion: '',
    reminder_date: '', days_before: 3, budget: 500, notes: '',
  });

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const showToast = (msg: string, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 2500); };

  const handleCreate = () => {
    if (!form.recipient_name.trim() || !form.occasion.trim() || !form.reminder_date) {
      showToast('Please fill in recipient name, occasion and celebration date.', false);
      return;
    }
    addReminder({
      recipient_name: form.recipient_name.trim(),
      relationship: form.relationship || 'Friend',
      occasion: form.occasion,
      reminder_date: form.reminder_date,
      days_before: Number(form.days_before) || 3,
      budget: Number(form.budget) || 500,
      notes: form.notes.trim(),
      is_active: true,
    });
    showToast('Celebration reminder saved successfully!');
    setShowForm(false);
    setForm({ recipient_name: '', relationship: '', occasion: '', reminder_date: '', days_before: 3, budget: 500, notes: '' });
  };

  const urgencyColor = (days: number) => days <= 7 ? '#D98C95' : days <= 30 ? '#C8A46A' : '#5A9E7B';
  const urgencyLabel = (days: number) => days <= 0 ? 'Today!' : days === 1 ? 'Tomorrow' : `${days} days away`;

  return (
    <>
      <AnimatePresence>{toast && <Toast msg={toast.msg} ok={toast.ok} />}</AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <p style={{ fontSize: '13px', color: C.muted }}>Automated countdowns and gift inspirations for your loved ones.</p>
        <button onClick={() => setShowForm(f => !f)} style={btn('primary')}>
          <Plus size={15} /> {showForm ? 'Close Form' : 'New Reminder'}
        </button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: '24px' }}>
            <div style={{ background: 'white', border: `1px solid ${C.border}`, borderRadius: '20px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: C.text, marginBottom: '20px' }}>Add Occasion Reminder</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '7px' }}>Recipient's Name *</label>
                  <input style={inputStyle} placeholder="e.g. Priya Sharma" value={form.recipient_name} onChange={e => set('recipient_name', e.target.value)}
                    onFocus={e => e.target.style.borderColor = C.rose} onBlur={e => e.target.style.borderColor = C.border} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '7px' }}>Relationship</label>
                  <select style={{ ...inputStyle }} value={form.relationship} onChange={e => set('relationship', e.target.value)}>
                    <option value="">Choose relationship...</option>
                    {RELATIONSHIPS_LIST.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '7px' }}>Occasion *</label>
                  <select style={{ ...inputStyle }} value={form.occasion} onChange={e => set('occasion', e.target.value)}>
                    <option value="">Choose occasion...</option>
                    {OCCASIONS_LIST.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '7px' }}>Celebration Date *</label>
                  <input type="date" style={inputStyle} value={form.reminder_date} onChange={e => set('reminder_date', e.target.value)}
                    onFocus={e => e.target.style.borderColor = C.rose} onBlur={e => e.target.style.borderColor = C.border} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '7px' }}>Planned Budget (₹)</label>
                  <input type="number" style={inputStyle} value={form.budget} onChange={e => set('budget', Number(e.target.value))}
                    onFocus={e => e.target.style.borderColor = C.rose} onBlur={e => e.target.style.borderColor = C.border} min={0} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '7px' }}>Remind me N days before</label>
                  <select style={{ ...inputStyle }} value={form.days_before} onChange={e => set('days_before', Number(e.target.value))}>
                    {[1, 3, 5, 7, 14, 30].map(d => <option key={d} value={d}>{d} day{d > 1 ? 's' : ''} before</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '7px' }}>Notes (optional)</label>
                <textarea style={{ ...inputStyle, height: '80px', resize: 'none' }} placeholder="Preferences (e.g. loves lilies, allergic to peanuts, favorite chocolate)..." value={form.notes} onChange={e => set('notes', e.target.value)}
                  onFocus={e => e.target.style.borderColor = C.rose} onBlur={e => e.target.style.borderColor = C.border} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowForm(false)} style={btn('ghost')}>Cancel</button>
                <button onClick={handleCreate} style={btn('primary')}>
                  <CheckCircle size={13} /> Save Reminder
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reminders list */}
      {reminders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', background: 'white', borderRadius: '20px', border: `1px solid ${C.border}` }}>
          <Bell size={40} style={{ color: C.rose, margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.text, marginBottom: '8px' }}>No reminders saved yet</h3>
          <p style={{ color: C.muted, marginBottom: '20px' }}>Save birthdays, anniversaries, and never miss a special celebration.</p>
          <button onClick={() => setShowForm(true)} style={btn('primary')}>
            <Plus size={14} /> Add First Reminder
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reminders.map(r => (
            <motion.div key={r.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: 'white', border: `1px solid ${C.border}`, borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `${urgencyColor(r.days_until ?? 99)}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Calendar size={20} color={urgencyColor(r.days_until ?? 99)} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: C.text }}>{r.recipient_name}</span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '100px', background: `${urgencyColor(r.days_until ?? 99)}22`, color: urgencyColor(r.days_until ?? 99), fontWeight: 700 }}>
                    {urgencyLabel(r.days_until ?? 99)}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: C.muted, marginBottom: '4px', textTransform: 'capitalize' }}>
                  {r.occasion} ({r.relationship}) · {new Date(r.reminder_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                {r.budget && <p style={{ fontSize: '12px', color: C.gold, fontWeight: 700 }}>Budget: ₹{r.budget}</p>}
                {r.notes && <p style={{ fontSize: '11px', color: '#666', marginTop: '2px', fontStyle: 'italic' }}>Note: {r.notes}</p>}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <Link href={`/catalog?occasion=${encodeURIComponent(r.occasion.toLowerCase())}`}
                  style={{ ...btn('ghost'), padding: '8px 14px', fontSize: '11px', textDecoration: 'none' }}>
                  <Gift size={12} /> Find Gift
                </Link>
                <button onClick={() => { deleteReminder(r.id); showToast('Reminder deleted'); }} style={{ ...btn('danger'), padding: '8px 10px' }} title="Delete Reminder">
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}

/* ─── ADDRESSES TAB ─── */
function AddressesTab() {
  const { addresses, addAddress, deleteAddress, setDefaultAddress } = useBloomoraStore();
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [form, setForm] = useState({
    label: 'Home',
    line1: '',
    line2: '',
    city: '',
    state: 'Andhra Pradesh',
    pincode: '',
    is_default: false,
  });

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const showToast = (msg: string, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 2500); };

  const handleCreate = () => {
    if (!form.line1.trim() || !form.city.trim() || !form.pincode.trim()) {
      showToast('Please fill in address line 1, city and pincode.', false);
      return;
    }
    addAddress({
      label: form.label.trim() || 'Home',
      line1: form.line1.trim(),
      line2: form.line2.trim(),
      city: form.city.trim(),
      state: form.state.trim() || 'Andhra Pradesh',
      pincode: form.pincode.trim(),
      is_default: Boolean(form.is_default),
    });
    showToast('Delivery address saved successfully!');
    setShowForm(false);
    setForm({ label: 'Home', line1: '', line2: '', city: '', state: 'Andhra Pradesh', pincode: '', is_default: false });
  };

  return (
    <>
      <AnimatePresence>{toast && <Toast msg={toast.msg} ok={toast.ok} />}</AnimatePresence>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <p style={{ fontSize: '13px', color: C.muted }}>Saved destination hubs and home delivery addresses.</p>
        <button onClick={() => setShowForm(f => !f)} style={btn('primary')}>
          <Plus size={15} /> {showForm ? 'Close Form' : 'Add Delivery Address'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: '20px' }}>
            <div style={{ background: 'white', border: `1px solid ${C.border}`, borderRadius: '20px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: C.text, marginBottom: '18px' }}>New Delivery Address</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                {[
                  { k: 'label', label: 'Address Label', placeholder: 'Home / Campus / Office / Hostel' },
                  { k: 'line1', label: 'Address Line 1 *', placeholder: '21, Rose Street, Near Main Gate' },
                  { k: 'line2', label: 'Address Line 2', placeholder: 'Flat / Room / Hostel Name (optional)' },
                  { k: 'city', label: 'City / Town *', placeholder: 'Rajahmundry / Surampalem' },
                  { k: 'state', label: 'State', placeholder: 'Andhra Pradesh' },
                  { k: 'pincode', label: 'Pincode *', placeholder: '533103' },
                ].map(field => (
                  <div key={field.k}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '7px' }}>{field.label}</label>
                    <input style={inputStyle} placeholder={field.placeholder} value={(form as Record<string, string | boolean>)[field.k] as string}
                      onChange={e => set(field.k, e.target.value)}
                      onFocus={e => e.target.style.borderColor = C.rose} onBlur={e => e.target.style.borderColor = C.border} />
                  </div>
                ))}
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '16px' }}>
                <div onClick={() => set('is_default', !form.is_default)} style={{ width: '18px', height: '18px', borderRadius: '5px', background: form.is_default ? C.rose : 'white', border: `2px solid ${form.is_default ? C.rose : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  {form.is_default && <CheckCircle size={10} color="white" />}
                </div>
                <span style={{ fontSize: '13px', color: C.text, fontWeight: 500 }}>Set as default delivery address</span>
              </label>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowForm(false)} style={btn('ghost')}>Cancel</button>
                <button onClick={handleCreate} style={btn('primary')}>
                  <CheckCircle size={13} /> Save Address
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {addresses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', background: 'white', borderRadius: '20px', border: `1px solid ${C.border}` }}>
          <MapPin size={40} style={{ color: C.rose, margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.text, marginBottom: '8px' }}>No addresses saved yet</h3>
          <p style={{ color: C.muted, marginBottom: '20px' }}>Add your destination address or campus room for swift 1-click checkout.</p>
          <button onClick={() => setShowForm(true)} style={btn('primary')}>
            <Plus size={14} /> Add First Address
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {addresses.map((a) => {
            return (
              <div key={a.id} style={{ background: 'white', border: `1.5px solid ${a.is_default ? C.rose : C.border}`, borderRadius: '16px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: a.is_default ? '0 4px 18px rgba(217,140,149,0.12)' : 'none' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: a.is_default ? C.rose : C.muted }}>{a.label || 'Address'}</span>
                    {a.is_default ? (
                      <span style={{ fontSize: '10px', color: C.rose, background: '#FEF0F0', padding: '2px 8px', borderRadius: '100px', fontWeight: 700 }}>Default</span>
                    ) : (
                      <button onClick={() => { setDefaultAddress(a.id); showToast('Set as default delivery address'); }} style={{ fontSize: '11px', color: C.gold, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                        Make Default
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: C.text, lineHeight: 1.5, marginBottom: '14px' }}>
                    {a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />
                    {a.city}{a.state ? `, ${a.state}` : ''} — {a.pincode}
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: `1px solid ${C.border}`, paddingTop: '10px' }}>
                  <button onClick={() => { deleteAddress(a.id); showToast('Address deleted'); }} style={{ ...btn('danger'), padding: '6px 12px', fontSize: '11px' }}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

/* ─── PROFILE TAB ─── */
function ProfileTab() {
  const { user, refreshUser } = useBloomoraAuth();
  const [form, setForm] = useState({ first_name: user?.first_name || '', last_name: user?.last_name || '', phone_number: user?.phone_number || '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const showToast = (msg: string, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 2500); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { authApiService } = await import('@/lib/api');
      await authApiService.updateMe(form);
      await refreshUser();
      showToast('Profile updated!');
    } catch { showToast('Could not update profile.', false); } finally { setSaving(false); }
  };

  return (
    <>
      <AnimatePresence>{toast && <Toast msg={toast.msg} ok={toast.ok} />}</AnimatePresence>
      <div style={{ background: 'white', border: `1px solid ${C.border}`, borderRadius: '20px', padding: '32px', maxWidth: '500px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: `linear-gradient(135deg, #E8C8C1, #D98C95)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: 800, color: 'white' }}>
            {user?.first_name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p style={{ fontSize: '18px', fontWeight: 800, color: C.text }}>{user?.full_name || user?.first_name}</p>
            <p style={{ fontSize: '13px', color: C.muted }}>{user?.email}</p>
            <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '100px', background: '#EFF7F3', color: C.green, fontWeight: 700, textTransform: 'capitalize' }}>{user?.role}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { k: 'first_name', label: 'First Name' },
            { k: 'last_name', label: 'Last Name' },
            { k: 'phone_number', label: 'Mobile Number' },
          ].map(field => (
            <div key={field.k}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '7px' }}>{field.label}</label>
              <input style={inputStyle} value={(form as Record<string, string>)[field.k]} onChange={e => set(field.k, e.target.value)}
                onFocus={e => e.target.style.borderColor = C.rose} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '7px' }}>Email (cannot change)</label>
            <input style={{ ...inputStyle, background: C.bg, color: C.muted }} value={user?.email || ''} readOnly />
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} style={{ ...btn('primary'), marginTop: '24px' }}>
          {saving ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </>
  );
}

/* ─── MAIN PAGE ─── */
const TABS = [
  { id: 'overview', label: 'Overview', icon: UserIcon },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'reminders', label: 'Reminders', icon: Bell },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'profile', label: 'Profile', icon: Edit2 },
];

function AccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoggedIn, loading } = useBloomoraAuth();
  const { wishlist, reminders, addresses } = useBloomoraStore();
  const wishlistCount = wishlist.length;
  const remindersCount = reminders.length;
  const addressesCount = addresses.length;
  const [tab, setTab] = useState(searchParams.get('tab') || 'overview');

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t) setTab(t);
  }, [searchParams]);

  const switchTab = (id: string) => {
    setTab(id);
    router.replace(`/account?tab=${id}`, { scroll: false });
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={32} className="animate-spin" style={{ color: C.rose }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg, paddingTop: '96px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

        {/* Page header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 800, color: C.text, fontFamily: 'var(--font-playfair), serif', marginBottom: '4px' }}>
            {isLoggedIn ? `Welcome back, ${user?.first_name || 'Gifting Member'}! 👋` : 'Your Gifting Suite & Dashboard'}
          </h1>
          <p style={{ fontSize: '14px', color: C.muted }}>
            {isLoggedIn ? user?.email : 'Manage your saved wishlist, celebration reminders, and delivery destinations.'}
          </p>
        </div>

        {/* Guest Session Notification */}
        {!isLoggedIn && (
          <div style={{ background: '#FFF0F3', border: '1px solid #F5C6CC', borderRadius: '16px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={18} color={C.rose} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: C.text }}>Guest Session Active</p>
                <p style={{ fontSize: '12px', color: C.muted }}>Your wishlist items, reminders, and delivery addresses are saved locally on this device.</p>
              </div>
            </div>
            <Link href="/auth/login?next=/account" style={{ ...btn('primary'), padding: '8px 18px', fontSize: '12px', textDecoration: 'none' }}>
              <LogIn size={13} /> Sign In to Sync
            </Link>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '28px', alignItems: 'start' }}>

          {/* Sidebar nav */}
          <div style={{ background: 'white', border: `1px solid ${C.border}`, borderRadius: '20px', overflow: 'hidden', position: 'sticky', top: '100px' }}>
            {TABS.map(t => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => switchTab(t.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px 18px', border: 'none', background: active ? '#FEF0F0' : 'transparent', color: active ? C.rose : C.text, fontSize: '13px', fontWeight: active ? 700 : 500, cursor: 'pointer', transition: 'all 0.2s', borderLeft: active ? `3px solid ${C.rose}` : '3px solid transparent', textAlign: 'left' }}>
                  <Icon size={16} /> {t.label}
                  {t.id === 'wishlist' && wishlistCount > 0 && <span style={{ marginLeft: 'auto', fontSize: '11px', background: C.rose, color: 'white', borderRadius: '100px', padding: '2px 7px', fontWeight: 700 }}>{wishlistCount}</span>}
                  {t.id === 'reminders' && remindersCount > 0 && <span style={{ marginLeft: 'auto', fontSize: '11px', background: C.rose, color: 'white', borderRadius: '100px', padding: '2px 7px', fontWeight: 700 }}>{remindersCount}</span>}
                  {t.id === 'addresses' && addressesCount > 0 && <span style={{ marginLeft: 'auto', fontSize: '11px', background: '#5A9E7B', color: 'white', borderRadius: '100px', padding: '2px 7px', fontWeight: 700 }}>{addressesCount}</span>}
                </button>
              );
            })}
          </div>

          {/* Main content */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {tab === 'overview' && (
                  <div>
                    <SectionTitle title="Your Dashboard" sub="Everything at a glance" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                      {[
                        { label: 'Orders', icon: Package, tab: 'orders', color: '#5B8AC5' },
                        { label: 'Wishlist', icon: Heart, tab: 'wishlist', count: wishlistCount, color: C.rose },
                        { label: 'Reminders', icon: Bell, tab: 'reminders', count: remindersCount, color: C.gold },
                        { label: 'Addresses', icon: MapPin, tab: 'addresses', count: addressesCount, color: C.green },
                        { label: 'AI Gift Finder', icon: Dna, href: '/gift-finder', color: '#8B6BAE' },
                        { label: 'Profile', icon: UserIcon, tab: 'profile', color: C.text },
                      ].map(card => {
                        const Icon = card.icon;
                        return (
                          <button key={card.label}
                            onClick={() => card.href ? router.push(card.href) : switchTab(card.tab!)}
                            style={{ background: 'white', border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = card.color; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 16px ${card.color}22`; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.border; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}>
                            <Icon size={22} style={{ color: card.color, marginBottom: '10px' }} />
                            <p style={{ fontSize: '14px', fontWeight: 700, color: C.text }}>{card.label}</p>
                            {card.count !== undefined && <p style={{ fontSize: '22px', fontWeight: 800, color: card.color, marginTop: '4px' }}>{card.count}</p>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {tab === 'orders' && (
                  <>
                    <SectionTitle title="My Orders" sub="Your complete order history" />
                    {!isLoggedIn ? (
                      <div style={{ textAlign: 'center', padding: '60px 24px', background: 'white', borderRadius: '20px', border: `1px solid ${C.border}` }}>
                        <Package size={40} style={{ color: C.rose, margin: '0 auto 16px' }} />
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.text, marginBottom: '8px' }}>Sign in to view orders</h3>
                        <p style={{ color: C.muted, marginBottom: '24px' }}>Please log in to track deliveries, view receipts, and review past orders.</p>
                        <Link href="/auth/login?next=/account?tab=orders" style={{ ...btn('primary'), textDecoration: 'none' }}>
                          <LogIn size={14} /> Sign In
                        </Link>
                      </div>
                    ) : (
                      <OrdersTab />
                    )}
                  </>
                )}
                {tab === 'wishlist' && (<><SectionTitle title="My Wishlist" sub="Products you've saved for later" /><WishlistTab /></>)}
                {tab === 'reminders' && (<><SectionTitle title="Occasion Reminders" sub="Never miss a special celebration" /><RemindersTab /></>)}
                {tab === 'addresses' && (<><SectionTitle title="Saved Addresses" sub="Manage your destination and delivery addresses" /><AddressesTab /></>)}
                {tab === 'profile' && (
                  <>
                    <SectionTitle title="My Profile" sub="Update your personal information" />
                    {!isLoggedIn ? (
                      <div style={{ textAlign: 'center', padding: '60px 24px', background: 'white', borderRadius: '20px', border: `1px solid ${C.border}` }}>
                        <UserIcon size={40} style={{ color: C.rose, margin: '0 auto 16px' }} />
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.text, marginBottom: '8px' }}>Sign in to view profile</h3>
                        <p style={{ color: C.muted, marginBottom: '24px' }}>Create an account or sign in to manage your contact details and security preferences.</p>
                        <Link href="/auth/login?next=/account?tab=profile" style={{ ...btn('primary'), textDecoration: 'none' }}>
                          <LogIn size={14} /> Sign In
                        </Link>
                      </div>
                    ) : (
                      <ProfileTab />
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile tab bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-around', padding: '8px 0', zIndex: 40 }} className="lg:hidden">
        {TABS.slice(0, 5).map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => switchTab(t.id)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', background: 'none', border: 'none', padding: '4px 8px', cursor: 'pointer', color: active ? C.rose : C.muted, fontSize: '9px', fontWeight: active ? 700 : 500 }}>
              <Icon size={18} />
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 size={32} className="animate-spin" style={{ color: '#D98C95' }} /></div>}>
      <AccountContent />
    </Suspense>
  );
}

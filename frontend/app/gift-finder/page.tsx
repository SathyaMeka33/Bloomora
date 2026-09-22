'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Sparkles, CheckCircle,
  ShoppingBag, ExternalLink, ChevronDown, ChevronUp, Brain,
  Zap, Star, Package, Heart, Loader2,
} from 'lucide-react';
import { aiApiService } from '@/lib/api';
import type { Recommendation } from '@/lib/api';
import Link from 'next/link';
import { useTaxonomy } from '@/lib/hooks/useTaxonomy';
import { PRODUCTS } from '@/lib/mockData';

/* ===========================
   WIZARD DATA
=========================== */
const GIFT_TYPES_STATIC = [
  { id: 'flowers', slug: 'flowers', name: 'Floral Arrangements', icon: '🌸' },
  { id: 'bouquets', slug: 'bouquets', name: 'Velvet Hatbox Bouquets', icon: '🎁' },
  { id: 'cakes', slug: 'cakes', name: 'Gourmet Bento Cakes', icon: '🎂' },
  { id: 'chocolate-bouquets', slug: 'chocolate-bouquets', name: 'Chocolate Bouquets', icon: '🍫' },
  { id: 'personalized', slug: 'personalized', name: 'Personalized Keepsakes', icon: '✨' },
  { id: 'custom-gifts', slug: 'custom-gifts', name: 'Handcrafted Ceramic Mugs', icon: '☕' },
  { id: 'jewellery', slug: 'jewellery', name: 'Fine Jewellery & Charms', icon: '👑' },
  { id: 'fragrances-candles', slug: 'fragrances-candles', name: 'Scented Candles & Aromas', icon: '🕯️' },
  { id: 'beauty-wellness', slug: 'beauty-wellness', name: 'Organic Spa & Self-Care', icon: '🛁' },
  { id: 'plants', slug: 'plants', name: 'Living Plants & Bonsai', icon: '🌿' },
  { id: 'books-stationery', slug: 'books-stationery', name: 'Leather Journals & Pens', icon: '📚' },
  { id: 'corporate-gifts', slug: 'corporate-gifts', name: 'Corporate & Executive Kits', icon: '💼' },
  { id: 'kids-gifting', slug: 'kids-gifting', name: 'Kids Art & Craft Hampers', icon: '🎨' },
  { id: 'baby-gifts', slug: 'baby-gifts', name: 'Baby & New Parent Hampers', icon: '👶' },
  { id: 'gourmet-hampers', slug: 'gourmet-hampers', name: 'Gourmet Dry Fruits & Sweets', icon: '🥜' },
  { id: 'premium-gifts', slug: 'premium-gifts', name: 'Royal Reserve Wooden Chests', icon: '🏆' },
  { id: 'mini-gifts', slug: 'mini-gifts', name: 'Pocket Surprises Under ₹199', icon: '🎈' },
];

// Fallback static data — overridden by taxonomy hook when loaded
const RELATIONSHIPS_STATIC = [
  { id: 'partner', label: 'Partner / Lover', emoji: '❤️' },
  { id: 'mother', label: 'Mother', emoji: '🌸' },
  { id: 'father', label: 'Father', emoji: '👔' },
  { id: 'sibling', label: 'Sibling', emoji: '🤝' },
  { id: 'friend', label: 'Best Friend', emoji: '🌟' },
  { id: 'colleague', label: 'Colleague', emoji: '💼' },
  { id: 'teacher', label: 'Teacher / Mentor', emoji: '📚' },
  { id: 'neighbour', label: 'Neighbour', emoji: '🏠' },
];

const OCCASIONS_STATIC = [
  { id: 'birthday', label: 'Birthday', emoji: '🎂' },
  { id: 'anniversary', label: 'Anniversary', emoji: '💑' },
  { id: 'romance-love', label: 'Just Because', emoji: '❤️' },
  { id: 'thank-you', label: 'Thank You', emoji: '🙏' },
  { id: 'congratulations', label: 'Congratulations', emoji: '🎉' },
  { id: 'apology', label: 'Apology', emoji: '🌸' },
  { id: 'graduation', label: 'Graduation', emoji: '🎓' },
  { id: 'wedding', label: 'Wedding', emoji: '💒' },
  { id: 'mothers-day', label: "Mother's Day", emoji: '💐' },
  { id: 'fathers-day', label: "Father's Day", emoji: '👔' },
  { id: 'friendship', label: 'Friendship', emoji: '👫' },
  { id: 'festivals', label: 'Festival', emoji: '🎆' },
  { id: 'housewarming', label: 'Housewarming', emoji: '🏡' },
  { id: 'new-baby', label: 'New Baby', emoji: '👶' },
  { id: 'just-because', label: 'Just Because', emoji: '✨' },
];

const EMOTIONS = [
  { id: 'loved', label: 'Loved', color: '#D98C95', bg: '#FEF0F0', border: '#F5C6CC', emoji: '💕' },
  { id: 'appreciated', label: 'Appreciated', color: '#C8A46A', bg: '#FDF8EE', border: '#EDD9A3', emoji: '✨' },
  { id: 'surprised', label: 'Surprised', color: '#8B6BAE', bg: '#F4F0FA', border: '#C9B8E2', emoji: '🎊' },
  { id: 'celebrated', label: 'Celebrated', color: '#D4AF37', bg: '#FEFBEA', border: '#EDDC82', emoji: '🥂' },
  { id: 'cherished', label: 'Cherished', color: '#5A9E7B', bg: '#EFF7F3', border: '#A8D5BF', emoji: '🌿' },
  { id: 'remembered', label: 'Remembered', color: '#5B8AC5', bg: '#EDF3FB', border: '#A5C0E0', emoji: '💙' },
];

const INTERESTS = [
  { id: 'flowers', label: 'Flowers', emoji: '🌸' },
  { id: 'chocolate', label: 'Chocolates', emoji: '🍫' },
  { id: 'books', label: 'Books', emoji: '📚' },
  { id: 'coffee', label: 'Coffee & Tea', emoji: '☕' },
  { id: 'art', label: 'Art & Craft', emoji: '🎨' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'fitness', label: 'Fitness', emoji: '💪' },
  { id: 'home-decor', label: 'Home Décor', emoji: '🏡' },
  { id: 'photography', label: 'Photography', emoji: '📸' },
  { id: 'food', label: 'Food & Cooking', emoji: '🍳' },
  { id: 'travel', label: 'Travel', emoji: '✈️' },
  { id: 'technology', label: 'Technology', emoji: '💻' },
];

const BUDGETS = [
  { id: 'under-199', label: 'Under ₹199', min: 0, max: 199, sub: 'Sweet pocket gestures' },
  { id: '200-299', label: '₹200 – ₹299', min: 200, max: 299, sub: 'Perfect for most occasions' },
  { id: '300-499', label: '₹300 – ₹499', min: 300, max: 499, sub: 'Curated combinations' },
  { id: '500-999', label: '₹500 – ₹999', min: 500, max: 999, sub: 'Premium quality gifts' },
  { id: '1000-plus', label: '₹1000 & above', min: 1000, max: 9999, sub: 'Luxury & keepsakes' },
];

const URGENCY = [
  { id: 'today', label: 'Today', sub: 'Same-day delivery', emoji: '⚡' },
  { id: 'week', label: 'This week', sub: 'Within 7 days', emoji: '📅' },
  { id: 'month', label: 'This month', sub: 'No rush at all', emoji: '🗓️' },
  { id: 'flexible', label: 'Flexible', sub: "I'll decide later", emoji: '✨' },
];

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface FormData {
  recipientName: string;
  relationship: string;
  occasion: string;
  giftType: string;
  emotion: string;
  interests: string[];
  budget: { id: string; min: number; max: number } | null;
  urgency: string;
  extraNote: string;
}

/* ===========================
   GIFT FIT BADGE
=========================== */
function GiftFitBadge({ score }: { score: number }) {
  const color = score >= 85 ? '#5A9E7B' : score >= 70 ? '#C8A46A' : '#D98C95';
  const label = score >= 85 ? 'Excellent' : score >= 70 ? 'Good Fit' : 'Possible';
  return (
    <div style={{
      position: 'absolute', top: 12, right: 12,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(8px)',
      borderRadius: '12px',
      padding: '6px 10px',
      border: `1px solid ${color}44`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
      <span style={{ fontSize: '16px', fontWeight: 900, color, lineHeight: 1 }}>{score}%</span>
      <span style={{ fontSize: '9px', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
    </div>
  );
}

/* ===========================
   RECOMMENDATION CARD
=========================== */
function RecommendationCard({ rec, rank }: { rec: Recommendation; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const [added, setAdded] = useState(false);
  const product = rec.product;
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80';

  const handleAdd = async () => {
    try {
      const { cartApiService } = await import('@/lib/api');
      await cartApiService.addItem(product.id);
    } catch { /* graceful */ }
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.08 }}
      whileHover={{ y: -4 }}
      style={{
        background: '#FFFFFF',
        border: '1px solid #EFE8E4',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#FFF8F5' }}>
        <img src={image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <GiftFitBadge score={rec.fit_score} />
        <div style={{
          position: 'absolute', top: 12, left: 12,
          background: 'rgba(255,255,255,0.92)',
          borderRadius: '8px', padding: '4px 10px',
          fontSize: '11px', fontWeight: 700, color: '#8B8B8B',
        }}>
          #{rank}
        </div>
        {product.same_day_available && (
          <div style={{
            position: 'absolute', bottom: 12, left: 12,
            background: '#EFF7F3', border: '1px solid #A8D5BF',
            borderRadius: '100px', padding: '4px 10px',
            fontSize: '10px', fontWeight: 700, color: '#5A9E7B',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            <Zap size={9} /> Same-day
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D98C95', marginBottom: '5px' }}>
          {product.seller_name}
        </div>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#262626', lineHeight: 1.3, marginBottom: '4px' }}>{product.name}</h3>
        {product.subtitle && <p style={{ fontSize: '12px', color: '#8B8B8B', marginBottom: '10px', lineHeight: 1.4 }}>{product.subtitle}</p>}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#262626' }}>₹{product.price}</span>
          {product.original_price && (
            <span style={{ fontSize: '12px', color: '#B0B0B0', textDecoration: 'line-through' }}>₹{product.original_price}</span>
          )}
          {product.is_best_seller && (
            <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: 700, color: '#C8A46A', background: '#FDF8EE', border: '1px solid #EDD9A3', borderRadius: '100px', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Star size={8} fill="#C8A46A" /> Bestseller
            </span>
          )}
        </div>

        {/* Why this gift */}
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', width: '100%',
            background: '#FFF8F5', border: '1px solid #EFE8E4', borderRadius: '10px',
            padding: '10px 12px', cursor: 'pointer', marginBottom: '12px',
            fontSize: '12px', fontWeight: 600, color: '#666666',
          }}
        >
          <Brain size={13} color="#D98C95" />
          <span style={{ flex: 1, textAlign: 'left' }}>Why this gift?</span>
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden', marginBottom: '12px' }}>
              <div style={{ background: '#FFF8F5', border: '1px solid #EFE8E4', borderRadius: '10px', padding: '12px', borderLeft: '3px solid #D98C95' }}>
                <p style={{ fontSize: '12px', color: '#666666', lineHeight: 1.6 }}>{rec.why_this_gift}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
          {product.customizable && <span style={{ fontSize: '10px', background: '#F4F0FA', color: '#8B6BAE', borderRadius: '100px', padding: '4px 10px', fontWeight: 600 }}>✏️ Personalizable</span>}
          {(product.delivery_time_hours || 0) <= 4 && <span style={{ fontSize: '10px', background: '#EFF7F3', color: '#5A9E7B', borderRadius: '100px', padding: '4px 10px', fontWeight: 600 }}>⚡ Express</span>}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleAdd} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
            background: added ? '#EFF7F3' : '#262626',
            color: added ? '#5A9E7B' : 'white',
            border: 'none', borderRadius: '100px', padding: '12px',
            fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}>
            {added ? <><CheckCircle size={14} /> Added!</> : <><ShoppingBag size={14} /> Add to Cart</>}
          </button>
          <Link
            href={`/product/${product.id}?fit_score=${rec.fit_score}&why=${encodeURIComponent(rec.why_this_gift)}&delivery=${encodeURIComponent(rec.delivery_estimate || '')}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              background: '#FFF8F5', border: '1px solid #EFE8E4',
              borderRadius: '100px', padding: '12px 14px',
              fontSize: '12px', fontWeight: 600, color: '#666666',
              textDecoration: 'none', transition: 'all 0.2s',
            }}
          >
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ===========================
   THINKING ANIMATION
=========================== */
function BloomoraThinking() {
  const thoughts = [
    'Analysing your gift intent...',
    'Scoring products by personality match...',
    'Calculating Gift Fit Scores...',
    'Checking local availability...',
    'Curating your perfect matches...',
  ];
  const [idx, setIdx] = useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % thoughts.length), 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '40px 24px' }}>
      <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #E8C8C1, #D98C95)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px', boxShadow: '0 8px 32px rgba(217,140,149,0.3)' }}>
        <Sparkles size={32} color="white" />
      </motion.div>
      <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#262626', marginBottom: '10px', fontFamily: 'var(--font-playfair), serif' }}>Finding your perfect gift...</h2>
      <AnimatePresence mode="wait">
        <motion.p key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
          style={{ fontSize: '14px', color: '#8B8B8B', marginBottom: '32px' }}>
          {thoughts[idx]}
        </motion.p>
      </AnimatePresence>
      <div style={{ display: 'flex', gap: '8px' }}>
        {[0, 1, 2].map(i => (
          <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3], y: [0, -5, 0] }} transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
            style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D98C95' }} />
        ))}
      </div>
    </div>
  );
}

/* ===========================
   STEP PROGRESS BAR
=========================== */
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ marginBottom: '36px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#D98C95', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Step {step} of {total}</span>
        <span style={{ fontSize: '12px', color: '#8B8B8B' }}>{Math.round(((step - 1) / (total - 1)) * 100)}% complete</span>
      </div>
      <div style={{ height: '4px', background: '#EFE8E4', borderRadius: '2px', overflow: 'hidden' }}>
        <motion.div animate={{ width: `${((step - 1) / (total - 1)) * 100}%` }} transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ height: '100%', background: 'linear-gradient(90deg, #E8C8C1, #D98C95)', borderRadius: '2px' }} />
      </div>
    </div>
  );
}

/* ===========================
   OPTION BUTTON
=========================== */
function OptionBtn({ selected, onClick, emoji, label, sub }: { selected: boolean; onClick: () => void; emoji?: string; label: string; sub?: string }) {
  return (
    <button onClick={onClick} style={{
      background: selected ? '#FEF0F0' : '#FFFFFF',
      border: selected ? '2px solid #D98C95' : '1.5px solid #EFE8E4',
      borderRadius: '14px',
      padding: sub ? '16px' : '14px 16px',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'all 0.2s ease',
      display: 'flex', flexDirection: 'column', gap: '4px',
    }}>
      {emoji && <span style={{ fontSize: '22px' }}>{emoji}</span>}
      <span style={{ fontSize: '13px', fontWeight: 700, color: selected ? '#D98C95' : '#262626' }}>{label}</span>
      {sub && <span style={{ fontSize: '11px', color: '#8B8B8B' }}>{sub}</span>}
    </button>
  );
}

/* ===========================
   MAIN PAGE
=========================== */
export default function GiftFinderPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>({
    recipientName: '', relationship: '', occasion: '', giftType: '', emotion: '',
    interests: [], budget: null, urgency: 'week', extraNote: '',
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Recommendation[]>([]);
  const [error, setError] = useState('');

  // Live taxonomy from Django
  const { recipient_types, occasion_types, gift_types, loading: taxLoading } = useTaxonomy();
  // Merge with static fallbacks so the page works even before taxonomy loads
  const relationships = recipient_types.length ? recipient_types.map(r => ({ id: r.slug, label: r.name, emoji: r.emoji || '🎁' })) : RELATIONSHIPS_STATIC;
  const occasions = occasion_types.length ? occasion_types.map(o => ({ id: o.slug, label: o.name, emoji: o.emoji || '🎁' })) : OCCASIONS_STATIC;
  const giftTypes = gift_types.length
    ? gift_types.map(g => ({ id: g.slug, slug: g.slug, name: g.name, icon: g.icon || '🎁' }))
    : GIFT_TYPES_STATIC;

  const STEPS = 7;
  const next = () => setStep(s => Math.min(s + 1, 8) as Step);
  const back = () => setStep(s => Math.max(s - 1, 1) as Step);
  const toggle = (id: string) => setForm(f => ({ ...f, interests: f.interests.includes(id) ? f.interests.filter(x => x !== id) : [...f.interests, id] }));

  const canNext = () => {
    if (step === 1) return form.recipientName.trim().length > 0;
    if (step === 2) return !!form.relationship;
    if (step === 3) return !!form.occasion;
    if (step === 4) return true; // gift type optional
    if (step === 5) return !!form.emotion;
    if (step === 6) return true;
    if (step === 7) return !!form.budget;
    return true;
  };

  const computeClientRecommendations = (currentForm: FormData): Recommendation[] => {
    const reqGiftType = currentForm.giftType?.toLowerCase() || '';
    const rel = currentForm.relationship?.toLowerCase() || '';
    const occ = currentForm.occasion?.toLowerCase() || '';
    const emo = currentForm.emotion?.toLowerCase() || '';
    const interests = currentForm.interests || [];
    const bMax = currentForm.budget?.max;
    const bMin = currentForm.budget?.min;

    const scored = PRODUCTS.map(p => {
      let score = 45;
      const reasons: string[] = [];

      // 1. Gift type match
      if (reqGiftType) {
        if (p.category === reqGiftType || p.tags?.includes(reqGiftType)) {
          score += 35;
          reasons.push(`matches your desired ${reqGiftType.replace('-', ' ')} category`);
        } else {
          score -= 30;
        }
      }

      // 2. Relationship match
      const relKeywords: Record<string, string[]> = {
        partner: ['for-her', 'for-him', 'partner', 'love', 'romantic', 'anniversary'],
        mother: ['for-parents', 'for-her', 'mother', 'mom'],
        father: ['for-parents', 'for-him', 'father', 'dad'],
        sibling: ['sibling', 'brother', 'sister', 'for-friends'],
        friend: ['for-friends', 'friend', 'best-friend'],
        colleague: ['for-colleagues', 'corporate', 'executive'],
        child: ['kids-gifting', 'baby-gifts', 'child'],
      };
      const matchingTags = relKeywords[rel] || [rel];
      if (matchingTags.some(t => p.recipientTag === t || p.tags?.includes(t) || p.description.toLowerCase().includes(t))) {
        score += 22;
        reasons.push(`curated thoughtfully for your ${currentForm.relationship}`);
      }

      // 3. Occasion match
      if (occ) {
        const occClean = occ.replace('-', ' ');
        if (p.occasion?.some(o => o.includes(occClean) || occClean.includes(o)) || p.tags?.includes(occ)) {
          score += 20;
          reasons.push(`perfectly suited for ${currentForm.occasion}`);
        }
      }

      // 4. Emotion match
      if (emo && (p.tags?.includes(emo) || p.aiRecommendationReason?.toLowerCase().includes(emo))) {
        score += 15;
        reasons.push(`evokes a genuine feeling of being ${emo}`);
      }

      // 5. Interests match
      if (interests.length) {
        const matched = interests.filter(i => p.tags?.includes(i) || p.description.toLowerCase().includes(i));
        if (matched.length) {
          score += Math.min(16, matched.length * 8);
          reasons.push(`aligns with interests in ${matched.slice(0, 2).join(', ')}`);
        }
      }

      // 6. Budget match
      if (bMax) {
        if (p.price <= bMax) {
          score += 12;
          if (bMin && p.price >= bMin) {
            score += 8;
            reasons.push(`ideal fit for your ₹${bMin}–₹${bMax} budget`);
          } else {
            reasons.push(`well within your ₹${bMax} budget`);
          }
        } else if (p.price <= bMax * 1.15) {
          score -= 4;
        } else {
          score -= 22;
        }
      }

      score = Math.max(30, Math.min(98, score));
      const recipientName = currentForm.recipientName || 'them';
      const why = `Chosen for ${recipientName}: ${(reasons.length ? reasons.slice(0, 3) : ['hand-selected by Bloomora Gift Intelligence']).join(', ')}.`;

      return {
        product: {
          id: p.id as any,
          name: p.name,
          subtitle: p.subtitle,
          price: p.price,
          original_price: p.originalPrice,
          images: p.images,
          seller_name: 'Bloomora Signature Collection',
          customizable: p.customizable,
          same_day_available: true,
          delivery_time_hours: p.preparationTimeMinutes <= 15 ? 2 : 4,
          is_best_seller: p.isBestSeller,
        } as any,
        fit_score: score,
        confidence: Math.round(score) / 100,
        why_this_gift: why,
        delivery_estimate: p.preparationTimeMinutes <= 15 ? '2h - 4h' : '24h',
        personalization_available: Boolean(p.customizable),
        rank: 1,
      };
    });

    scored.sort((a, b) => b.fit_score - a.fit_score);
    return scored.slice(0, 8).map((item, idx) => ({ ...item, rank: idx + 1 }));
  };

  const handleFind = useCallback(async () => {
    setLoading(true); setError(''); setResults([]);
    try {
      const res = await aiApiService.findGifts({
        recipient: { name: form.recipientName },
        relationship: form.relationship,
        occasion: form.occasion,
        gift_type: form.giftType,
        emotion: form.emotion,
        interests: form.interests,
        budget: form.budget?.max,
        budget_min: form.budget?.min,
        urgency: form.urgency,
        free_text: [
          form.extraNote,
          form.giftType ? `Gift type preference: ${form.giftType}` : '',
        ].filter(Boolean).join('. '),
      });
      if (res && res.recommendations && res.recommendations.length > 0) {
        setResults(res.recommendations);
        setStep(8);
        return;
      }
      const localRecs = computeClientRecommendations(form);
      setResults(localRecs);
      setStep(8);
    } catch {
      const localRecs = computeClientRecommendations(form);
      if (localRecs.length > 0) {
        setResults(localRecs);
        setStep(8);
      } else {
        setError('Could not reach the Bloomora API. Please ensure the backend is running on port 8000.');
      }
    } finally { setLoading(false); }
  }, [form]);

  const cardStyle: React.CSSProperties = {
    background: '#FFFFFF',
    border: '1px solid #EFE8E4',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: '#FFFFFF', border: '1.5px solid #EFE8E4',
    borderRadius: '14px', padding: '16px 18px',
    fontSize: '16px', color: '#262626', outline: 'none',
    fontFamily: 'inherit', transition: 'border-color 0.2s',
  };

  const primaryBtnStyle: React.CSSProperties = {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
    background: '#262626', color: 'white',
    border: 'none', borderRadius: '100px', padding: '16px 28px',
    fontSize: '15px', fontWeight: 700, cursor: 'pointer',
    transition: 'all 0.25s',
  };

  const ghostBtnStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: '#FFFFFF', color: '#666666',
    border: '1.5px solid #EFE8E4', borderRadius: '100px', padding: '14px 22px',
    fontSize: '14px', fontWeight: 600, cursor: 'pointer',
    transition: 'all 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F5', paddingBottom: '80px', paddingTop: '96px' }}>
      {/* ── PAGE HEADER ── */}
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 24px 32px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#8B8B8B', textDecoration: 'none', marginBottom: '20px', fontWeight: 500 }}>
          <ArrowLeft size={14} /> Back to Bloomora
        </Link>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FEF0F0', border: '1px solid #F5C6CC', borderRadius: '100px', padding: '6px 16px', marginBottom: '16px' }}>
          <Sparkles size={13} color="#D98C95" />
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D98C95' }}>AI Gift Intelligence</span>
        </div>
        <h1 style={{ fontSize: 'clamp(26px, 5vw, 38px)', fontWeight: 800, color: '#262626', lineHeight: 1.15, marginBottom: '8px', fontFamily: 'var(--font-playfair), serif' }}>
          Find the Perfect Gift
        </h1>
        <p style={{ fontSize: '15px', color: '#8B8B8B', lineHeight: 1.6 }}>
          Answer 6 simple questions — Bloomora's AI scores every product and finds your best matches.
        </p>
      </div>

      {/* ── LOADING ── */}
      {loading && <BloomoraThinking />}

      {/* ── RESULTS ── */}
      {!loading && step === 8 && (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          {results.length > 0 ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: '#262626', marginBottom: '8px', fontFamily: 'var(--font-playfair), serif' }}>
                  {results.length} gifts found for {form.recipientName || 'them'} ✨
                </h2>
                <p style={{ fontSize: '14px', color: '#8B8B8B' }}>Ranked by Gift Fit Score™ — the closer to 100%, the better the match</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {results.map((rec, i) => <RecommendationCard key={rec.product.id} rec={rec} rank={i + 1} />)}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <Package size={40} style={{ color: '#D98C95', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#262626', marginBottom: '8px' }}>No matches found</h3>
              <p style={{ color: '#8B8B8B', marginBottom: '24px' }}>Try a wider budget or fewer filters.</p>
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => { setStep(1); setForm({ recipientName: '', relationship: '', occasion: '', giftType: '', emotion: '', interests: [], budget: null, urgency: 'week', extraNote: '' }); setResults([]); }}
              style={{ ...ghostBtnStyle, margin: '0 auto' }}>
              ← Find another gift
            </button>
          </div>
        </div>
      )}

      {/* ── WIZARD ── */}
      {!loading && step < 8 && (
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 24px' }}>
          <ProgressBar step={step} total={STEPS} />

          {error && (
            <div style={{ background: '#FEF0F0', border: '1px solid #F5C6CC', borderRadius: '14px', padding: '14px 18px', marginBottom: '20px', fontSize: '13px', color: '#D98C95' }}>
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>

              {/* STEP 1 – Recipient name */}
              {step === 1 && (
                <div style={cardStyle}>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#262626', marginBottom: '8px', fontFamily: 'var(--font-playfair), serif' }}>Who are you shopping for?</h2>
                  <p style={{ fontSize: '14px', color: '#8B8B8B', marginBottom: '24px' }}>We'll use this to personalise their gift message.</p>
                  <input style={inputStyle} placeholder="Their name — e.g. Priya" value={form.recipientName}
                    onChange={e => setForm(f => ({ ...f, recipientName: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && canNext() && next()} autoFocus
                    onFocus={e => e.target.style.borderColor = '#D98C95'}
                    onBlur={e => e.target.style.borderColor = '#EFE8E4'} />
                </div>
              )}

              {/* STEP 2 – Relationship */}
              {step === 2 && (
                <div style={cardStyle}>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#262626', marginBottom: '8px', fontFamily: 'var(--font-playfair), serif' }}>Your relationship with {form.recipientName}?</h2>
                  <p style={{ fontSize: '14px', color: '#8B8B8B', marginBottom: '24px' }}>This helps us match the right emotional tone.</p>
                  {taxLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: '#D98C95' }} /></div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                      {relationships.map(r => (
                        <OptionBtn key={r.id} selected={form.relationship === r.id} emoji={r.emoji} label={r.label}
                          onClick={() => { setForm(f => ({ ...f, relationship: r.id })); next(); }} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3 – Occasion */}
              {step === 3 && (
                <div style={cardStyle}>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#262626', marginBottom: '8px', fontFamily: 'var(--font-playfair), serif' }}>What's the occasion?</h2>
                  <p style={{ fontSize: '14px', color: '#8B8B8B', marginBottom: '24px' }}>Occasions shape what makes a gift feel meaningful.</p>
                  {taxLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: '#D98C95' }} /></div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                      {occasions.map(o => (
                        <OptionBtn key={o.id} selected={form.occasion === o.id} emoji={o.emoji} label={o.label}
                          onClick={() => { setForm(f => ({ ...f, occasion: o.id })); next(); }} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4 – Gift Type (NEW — taxonomy-driven) */}
              {step === 4 && (
                <div style={cardStyle}>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#262626', marginBottom: '4px', fontFamily: 'var(--font-playfair), serif' }}>What kind of gift?</h2>
                  <p style={{ fontSize: '14px', color: '#8B8B8B', marginBottom: '6px' }}>Optional — the type of gift you have in mind.</p>
                  <p style={{ fontSize: '12px', color: '#D98C95', marginBottom: '20px', fontWeight: 600 }}>You can skip this if you want full AI surprise. ✨</p>
                  {taxLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: '#D98C95' }} /></div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                      {giftTypes.map(g => (
                        <button key={g.id} onClick={() => setForm(f => ({ ...f, giftType: f.giftType === g.slug ? '' : g.slug }))} style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          background: form.giftType === g.slug ? '#FEF0F0' : '#FFFFFF',
                          border: `1.5px solid ${form.giftType === g.slug ? '#D98C95' : '#EFE8E4'}`,
                          borderRadius: '14px', padding: '14px 16px',
                          cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                        }}>
                          <span style={{ fontSize: '22px' }}>{g.icon}</span>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: form.giftType === g.slug ? '#D98C95' : '#262626' }}>{g.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5 – Emotion */}
              {step === 5 && (
                <div style={cardStyle}>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#262626', marginBottom: '8px', fontFamily: 'var(--font-playfair), serif' }}>How do you want {form.recipientName} to feel?</h2>
                  <p style={{ fontSize: '14px', color: '#8B8B8B', marginBottom: '24px' }}>The emotion drives every recommendation we make.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    {EMOTIONS.map(em => (
                      <button key={em.id} onClick={() => { setForm(f => ({ ...f, emotion: em.id })); next(); }} style={{
                        background: form.emotion === em.id ? em.bg : '#FFFFFF',
                        border: `2px solid ${form.emotion === em.id ? em.color : '#EFE8E4'}`,
                        borderRadius: '14px', padding: '18px 16px', cursor: 'pointer',
                        textAlign: 'left', transition: 'all 0.2s',
                      }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>{em.emoji}</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: form.emotion === em.id ? em.color : '#262626' }}>{em.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6 – Interests */}
              {step === 6 && (
                <div style={cardStyle}>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#262626', marginBottom: '4px', fontFamily: 'var(--font-playfair), serif' }}>What are their interests?</h2>
                  <p style={{ fontSize: '14px', color: '#8B8B8B', marginBottom: '6px' }}>Optional — pick any that apply.</p>
                  <p style={{ fontSize: '12px', color: '#D98C95', marginBottom: '20px', fontWeight: 600 }}>You can skip this step if unsure.</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {INTERESTS.map(int => (
                      <button key={int.id} onClick={() => toggle(int.id)} style={{
                        display: 'flex', alignItems: 'center', gap: '7px',
                        background: form.interests.includes(int.id) ? '#FEF0F0' : '#FFFFFF',
                        border: `1.5px solid ${form.interests.includes(int.id) ? '#D98C95' : '#EFE8E4'}`,
                        borderRadius: '100px', padding: '10px 18px',
                        fontSize: '13px', fontWeight: 600,
                        color: form.interests.includes(int.id) ? '#D98C95' : '#666666',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}>
                        <span>{int.emoji}</span> {int.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 7 – Budget + urgency + note */}
              {step === 7 && (
                <div style={cardStyle}>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#262626', marginBottom: '8px', fontFamily: 'var(--font-playfair), serif' }}>What's your budget?</h2>
                  <p style={{ fontSize: '14px', color: '#8B8B8B', marginBottom: '20px' }}>There is no minimum price for thoughtfulness.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
                    {BUDGETS.map(b => (
                      <button key={b.id} onClick={() => setForm(f => ({ ...f, budget: b }))} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: form.budget?.id === b.id ? '#FEF0F0' : '#FFFFFF',
                        border: `1.5px solid ${form.budget?.id === b.id ? '#D98C95' : '#EFE8E4'}`,
                        borderRadius: '14px', padding: '16px 18px', cursor: 'pointer', transition: 'all 0.2s',
                      }}>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: form.budget?.id === b.id ? '#D98C95' : '#262626' }}>{b.label}</div>
                          <div style={{ fontSize: '12px', color: '#8B8B8B', marginTop: '2px' }}>{b.sub}</div>
                        </div>
                        {form.budget?.id === b.id && <CheckCircle size={18} color="#D98C95" />}
                      </button>
                    ))}
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#262626', marginBottom: '12px' }}>When do you need it?</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '24px' }}>
                    {URGENCY.map(u => (
                      <OptionBtn key={u.id} selected={form.urgency === u.id} emoji={u.emoji} label={u.label} sub={u.sub}
                        onClick={() => setForm(f => ({ ...f, urgency: u.id }))} />
                    ))}
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#262626', marginBottom: '8px' }}>Anything else to know? <span style={{ fontWeight: 400, color: '#8B8B8B', fontSize: '13px' }}>(optional)</span></h3>
                  <textarea
                    value={form.extraNote}
                    onChange={e => setForm(f => ({ ...f, extraNote: e.target.value }))}
                    placeholder='e.g. "She loves minimalist designs and hates synthetic fragrances..."'
                    style={{ ...inputStyle, height: '90px', resize: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#D98C95'}
                    onBlur={e => e.target.style.borderColor = '#EFE8E4'}
                  />
                </div>
              )}

              {/* NAV BUTTONS */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                {step > 1 && <button style={ghostBtnStyle} onClick={back}><ArrowLeft size={15} /> Back</button>}
                {step < 7 && (
                  <button style={{ ...primaryBtnStyle, opacity: canNext() ? 1 : 0.5 }} disabled={!canNext()} onClick={next}
                    onMouseEnter={e => canNext() && ((e.currentTarget as HTMLButtonElement).style.background = '#D98C95')}
                    onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = '#262626')}>
                    Continue <ArrowRight size={16} />
                  </button>
                )}
                {step === 7 && (
                  <button style={{ ...primaryBtnStyle, background: form.budget ? '#D98C95' : '#CCCCCC', opacity: form.budget ? 1 : 0.6, boxShadow: form.budget ? '0 6px 24px rgba(217,140,149,0.4)' : 'none' }}
                    disabled={!form.budget} onClick={handleFind}
                    onMouseEnter={e => form.budget && ((e.currentTarget as HTMLButtonElement).style.background = '#C9838B')}
                    onMouseLeave={e => form.budget && ((e.currentTarget as HTMLButtonElement).style.background = '#D98C95')}>
                    <Sparkles size={17} /> Find Perfect Gifts
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

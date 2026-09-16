'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Check, Heart, User, Calendar, Tag, Clock, Gift, RefreshCw } from 'lucide-react';
import { generateAIGiftRecommendations, AIConciergeInput } from '@/lib/gemini';
import { PRODUCTS, GiftComboRecommendation } from '@/lib/mockData';
import { useBloomoraStore } from '@/lib/store';

export default function AIConciergePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<GiftComboRecommendation | null>(null);
  const [suggestedMessage, setSuggestedMessage] = useState<string>('');

  const [formData, setFormData] = useState<AIConciergeInput>({
    recipient: '',
    relationship: 'Sister',
    occasion: 'Birthday',
    budget: 499,
    deliveryTime: 'Today',
    city: 'Rajahmundry',
    notes: '',
  });

  const relationships = [
    { id: 'Sister', label: 'Sister', desc: 'Heartfelt, sweet & playful memories', icon: '👧' },
    { id: 'Mom', label: 'Mother', desc: 'Pure warmth, care & lifelong gratitude', icon: '👩' },
    { id: 'Wife', label: 'Wife / Partner', desc: 'Deep romance, elegance & devotion', icon: '💍' },
    { id: 'Girlfriend', label: 'Girlfriend', desc: 'Passionate, charming & thoughtful surprises', icon: '❤️' },
    { id: 'Brother', label: 'Brother', desc: 'Protective bond & joyful celebrations', icon: '👦' },
    { id: 'Dad', label: 'Father', desc: 'Respect, gratitude & refined keepsakes', icon: '👨' },
    { id: 'Best Friend', label: 'Best Friend', desc: 'Laughter, sweet treats & fun memories', icon: '🌟' },
    { id: 'Colleague', label: 'Office Colleague', desc: 'Professional elegance & appreciation', icon: '💼' },
  ];

  const occasions = [
    { id: 'Birthday', label: 'Birthday', desc: 'Celebrate another year of joy', icon: '🎂' },
    { id: 'Anniversary', label: 'Anniversary', desc: 'Honor milestone love and togetherness', icon: '🥂' },
    { id: 'Raksha Bandhan', label: 'Raksha Bandhan', desc: 'Sacred thread of sibling bond', icon: '🪡' },
    { id: 'Love & Romance', label: 'Love & Romance', desc: 'Express passion and timeless affection', icon: '💖' },
    { id: 'Apology / Sorry', label: 'Apology / Sorry', desc: 'Mend hearts with soft roses & chocolates', icon: '🌸' },
    { id: 'Congratulations', label: 'Congratulations', desc: 'Celebrate achievements and big wins', icon: '🎉' },
    { id: 'Thank You', label: 'Thank You', desc: 'Express warm heartfelt appreciation', icon: '🙏' },
  ];

  const budgets = [
    { value: 199, label: 'Under ₹199', desc: 'Tiny Surprises & Pocket Gestures' },
    { value: 299, label: '₹200 – ₹299', desc: 'Chocolate Moments & Velvet Wrap' },
    { value: 499, label: '₹300 – ₹499', desc: 'Romantic Classics (Most Popular)' },
    { value: 899, label: '₹500 – ₹999', desc: 'Grand Celebration Hampers' },
    { value: 1499, label: '₹1000+', desc: 'Royal Preserved Rose Chests' },
  ];

  const deliveryTimes = [
    { id: 'Today', label: 'Today (Same Day)', desc: 'Handcrafted and delivered in hours' },
    { id: 'Tomorrow', label: 'Tomorrow', desc: 'Scheduled delivery to home or office' },
    { id: 'Meet Me There', label: 'Meet Me There (₹10 Pickup)', desc: 'Collect along your travel route' },
  ];

  const handleNextStep = () => {
    if (step < 5) {
      setStep((prev) => prev + 1);
    } else {
      generateStoryResult();
    }
  };

  const generateStoryResult = async () => {
    setLoading(true);
    try {
      const res = await generateAIGiftRecommendations(formData);
      setGeneratedStory(res.recommendation);
      setSuggestedMessage(res.greetingMessage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-[#F9EDE8] text-[#262626] border border-[#E8C8C1]/40 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Bloomora Concierge Studio
        </div>
        <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold text-[#262626]">
          Your Personal Gifting Consultant
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-lg mx-auto leading-relaxed">
          No generic product grids. We ask a few human questions to craft a bespoke memory tailored to your emotion and budget.
        </p>
      </div>

      {!generatedStory && !loading && (
        <div className="bg-white rounded-[32px] p-6 sm:p-12 border border-[#E8C8C1]/40 editorial-card-shadow space-y-8">
          {/* Progress Tracker */}
          <div className="flex items-center justify-between border-b border-[#F9EDE8] pb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
              Question {step} of 5
            </span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i <= step ? 'w-8 bg-[#E8C8C1]' : 'w-2 bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* STEP 1: WHO IS IT FOR? */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h3 className="font-serif-heading text-2xl font-bold text-[#262626]">Who are you surprising today?</h3>
                <p className="text-xs text-[#6B6B6B]">Select the relationship so we can tune the emotional depth.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {relationships.map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => {
                      setFormData({ ...formData, relationship: rel.id });
                    }}
                    className={`p-5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      formData.relationship === rel.id
                        ? 'border-[#D4AF37] bg-[#F9EDE8]/60 shadow-xs font-bold'
                        : 'border-[#E8C8C1]/40 hover:border-[#E8C8C1] bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{rel.icon}</span>
                      <div>
                        <h4 className="text-sm font-bold text-[#262626]">{rel.label}</h4>
                        <p className="text-[11px] text-[#6B6B6B]">{rel.desc}</p>
                      </div>
                    </div>
                    {formData.relationship === rel.id && <Check className="w-5 h-5 text-[#D4AF37]" />}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-[#262626] mb-2">Recipient's Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Ananya"
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  className="w-full bg-[#FFF8F5] border border-[#E8C8C1]/50 rounded-2xl px-4 py-3 text-xs text-[#262626] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          )}

          {/* STEP 2: OCCASION? */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h3 className="font-serif-heading text-2xl font-bold text-[#262626]">What is the occasion?</h3>
                <p className="text-xs text-[#6B6B6B]">We curate the gift elements based on the celebration tone.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {occasions.map((occ) => (
                  <button
                    key={occ.id}
                    onClick={() => setFormData({ ...formData, occasion: occ.id })}
                    className={`p-5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      formData.occasion === occ.id
                        ? 'border-[#D4AF37] bg-[#F9EDE8]/60 shadow-xs font-bold'
                        : 'border-[#E8C8C1]/40 hover:border-[#E8C8C1] bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{occ.icon}</span>
                      <div>
                        <h4 className="text-sm font-bold text-[#262626]">{occ.label}</h4>
                        <p className="text-[11px] text-[#6B6B6B]">{occ.desc}</p>
                      </div>
                    </div>
                    {formData.occasion === occ.id && <Check className="w-5 h-5 text-[#D4AF37]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: BUDGET? */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h3 className="font-serif-heading text-2xl font-bold text-[#262626]">What’s your budget preference?</h3>
                <p className="text-xs text-[#6B6B6B]">Bloomora maximizes luxury packaging regardless of budget size.</p>
              </div>

              <div className="space-y-3">
                {budgets.map((b) => (
                  <button
                    key={b.value}
                    onClick={() => setFormData({ ...formData, budget: b.value })}
                    className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      formData.budget === b.value
                        ? 'border-[#D4AF37] bg-[#F9EDE8]/60 shadow-xs font-bold'
                        : 'border-[#E8C8C1]/40 hover:border-[#E8C8C1] bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-sm font-bold text-[#262626]">{b.label}</span>
                      <p className="text-xs text-[#6B6B6B]">{b.desc}</p>
                    </div>
                    {formData.budget === b.value && <Check className="w-5 h-5 text-[#D4AF37]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: DELIVERY DATE & SPEED */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h3 className="font-serif-heading text-2xl font-bold text-[#262626]">When do you need the gift?</h3>
                <p className="text-xs text-[#6B6B6B]">Select delivery speed or pickup at nearby partner store.</p>
              </div>

              <div className="space-y-3">
                {deliveryTimes.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setFormData({ ...formData, deliveryTime: d.id })}
                    className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      formData.deliveryTime === d.id
                        ? 'border-[#D4AF37] bg-[#F9EDE8]/60 shadow-xs font-bold'
                        : 'border-[#E8C8C1]/40 hover:border-[#E8C8C1] bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-sm font-bold text-[#262626]">{d.label}</span>
                      <p className="text-xs text-[#6B6B6B]">{d.desc}</p>
                    </div>
                    {formData.deliveryTime === d.id && <Check className="w-5 h-5 text-[#D4AF37]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: PERSONAL NOTE */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h3 className="font-serif-heading text-2xl font-bold text-[#262626]">Any personal message or note?</h3>
                <p className="text-xs text-[#6B6B6B]">Our AI will refine your sentiment into a 350 GSM embossed card message.</p>
              </div>

              <textarea
                rows={4}
                placeholder="e.g. Happy Birthday sister! Stay blessed and keep smiling always..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-[#FFF8F5] border border-[#E8C8C1]/50 rounded-2xl p-4 text-xs text-[#262626] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-[#F9EDE8]">
            {step > 1 ? (
              <button
                onClick={() => setStep((prev) => prev - 1)}
                className="text-xs font-semibold text-[#6B6B6B] hover:text-[#262626]"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNextStep}
              className="bg-[#262626] hover:bg-[#D4AF37] text-white hover:text-[#262626] font-semibold px-8 py-3.5 rounded-full text-xs transition-colors flex items-center gap-2 shadow-sm"
            >
              {step === 5 ? 'Synthesize Gift Story ✨' : 'Continue Question →'}
            </button>
          </div>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="bg-white rounded-[32px] p-16 text-center space-y-6 border border-[#E8C8C1]/40 editorial-card-shadow">
          <div className="w-16 h-16 rounded-full bg-[#F9EDE8] text-[#D4AF37] flex items-center justify-center mx-auto animate-spin">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-serif-heading text-3xl font-bold text-[#262626]">
            Crafting Your Bespoke Gift Story...
          </h3>
          <p className="text-xs text-[#6B6B6B] max-w-md mx-auto leading-relaxed">
            Matching fresh floral stem count, luxury wrapping wrap, and AI handwritten card note for {formData.relationship}...
          </p>
        </div>
      )}

      {/* GENERATED GIFT STORY RESULT */}
      {generatedStory && !loading && (
        <div className="bg-white rounded-[32px] p-8 sm:p-12 border border-[#D4AF37]/50 editorial-card-shadow space-y-8 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between border-b border-[#F9EDE8] pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> AI Curated Gift Story Generated
            </div>
            <button
              onClick={() => {
                setGeneratedStory(null);
                setStep(1);
              }}
              className="text-xs text-[#6B6B6B] hover:text-[#262626] flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Start Over
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 relative rounded-2xl overflow-hidden shadow-sm border-2 border-[#E8C8C1]/30">
              <img
                src={PRODUCTS[0].images[0]}
                alt={generatedStory.title}
                className="w-full h-72 object-cover editorial-image"
              />
              <div className="absolute top-3 left-3 bg-[#262626] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                ₹{generatedStory.totalPrice} Total
              </div>
            </div>

            <div className="md:col-span-7 space-y-5">
              <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#262626]">
                "{generatedStory.title}"
              </h2>

              <p className="text-xs text-[#6B6B6B] leading-relaxed italic border-l-2 border-[#D4AF37] pl-3 py-0.5">
                "{generatedStory.reasoning}"
              </p>

              <div className="bg-[#F9EDE8] p-4 rounded-2xl border border-[#E8C8C1]/40 text-xs space-y-1">
                <span className="font-bold text-[#262626]">AI Card Message Preview:</span>
                <p className="text-[#6B6B6B] italic font-serif">"{suggestedMessage}"</p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href={`/product/prod-1`}
                  className="bg-[#262626] hover:bg-[#D4AF37] text-white hover:text-[#262626] font-semibold px-7 py-3.5 rounded-full text-xs transition-colors flex items-center gap-2 shadow-sm"
                >
                  Explore Gift Story Page <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

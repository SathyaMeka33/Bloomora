'use client';

import React, { useState, useEffect } from 'react';
import { getSurpriseExperiences, saveSurpriseExperience } from '@/lib/services/surpriseService';
import {
  FirestoreSurpriseExperienceDoc,
  FirestoreSurprisePackageDoc,
  SurpriseOccasionType,
  PackageTier,
} from '@/lib/types/models';
import {
  Gift,
  Plus,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Save,
  Clock,
  MapPin,
  Loader2,
  Trash2,
  Sparkles,
} from 'lucide-react';

export default function AdminSurpriseManager() {
  const [experiences, setExperiences] = useState<FirestoreSurpriseExperienceDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingExp, setEditingExp] = useState<FirestoreSurpriseExperienceDoc | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Experience form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [occasion, setOccasion] = useState<SurpriseOccasionType>('Birthday Surprise');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Birthday');
  const [packages, setPackages] = useState<FirestoreSurprisePackageDoc[]>([]);

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    setLoading(true);
    const list = await getSurpriseExperiences();
    setExperiences(list);
    setLoading(false);
  };

  const handleEditClick = (exp: FirestoreSurpriseExperienceDoc) => {
    setEditingExp(exp);
    setTitle(exp.title);
    setSubtitle(exp.subtitle || '');
    setDescription(exp.description || '');
    setOccasion(exp.occasion);
    setImage(exp.image);
    setCategory(exp.category || 'Surprise');
    setPackages(exp.packages || []);
  };

  const handleNewExperienceClick = () => {
    const newId = `EXP-SURPRISE-${Date.now()}`;
    const newExp: FirestoreSurpriseExperienceDoc = {
      id: newId,
      title: 'New Surprise Experience',
      slug: 'new-surprise-experience',
      subtitle: 'Memorable gifting experience',
      description: 'Exclusive surprise package carefully curated for special moments.',
      occasion: 'Birthday Surprise',
      image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800',
      category: 'Celebration',
      active: true,
      packages: [
        {
          id: `PKG-${newId}-MINI`,
          experienceId: newId,
          tier: 'mini',
          name: 'Mini Celebration Surprise',
          price: 1899,
          description: 'Essential surprise bundle',
          contents: ['Handcrafted Bouquet', 'Personalized Gift Card', 'Gourmet Chocolates'],
          active: true,
        },
        {
          id: `PKG-${newId}-SIGNATURE`,
          experienceId: newId,
          tier: 'signature',
          name: 'Signature Luxe Experience',
          price: 3499,
          description: 'Premium curated experience with doorstep setup',
          contents: ['Luxury Rose Box', 'Customized Photo Frame', 'Belgian Truffles', 'Handwritten Card'],
          active: true,
        },
      ],
    };
    handleEditClick(newExp);
  };

  const handlePackageChange = (index: number, field: keyof FirestoreSurprisePackageDoc, val: any) => {
    const updated = [...packages];
    updated[index] = { ...updated[index], [field]: val };
    setPackages(updated);
  };

  const handleAddPackageTier = () => {
    if (!editingExp) return;
    const newPkg: FirestoreSurprisePackageDoc = {
      id: `PKG-${editingExp.id}-${Date.now()}`,
      experienceId: editingExp.id,
      tier: 'grand',
      name: 'Grand Royal Experience',
      price: 5999,
      description: 'Ultra luxury surprise setup with personalized decor',
      contents: ['Grand Floral Installation', 'Gourmet Hamper', 'Personalized Gift', 'Setup Specialist'],
      active: true,
    };
    setPackages([...packages, newPkg]);
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;
    setSaving(true);
    try {
      const updatedDoc: FirestoreSurpriseExperienceDoc = {
        ...editingExp,
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        subtitle,
        description,
        occasion,
        image,
        category,
        packages,
        active: true,
      };

      await saveSurpriseExperience(updatedDoc);
      await loadExperiences();
      setSaving(false);
      setEditingExp(null);
      setSuccessMsg('Surprise experience package updated successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Failed to save surprise experience:', err);
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-xs text-[#746E68]">Retrieving Bloomora Surprise Experiences...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F4E8E5] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#B58A4B] uppercase tracking-widest block">
            Premium Experience Catalog
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#1B1816]">
            Bloomora Surprise Packages & Tier Manager
          </h1>
        </div>

        <button
          type="button"
          onClick={handleNewExperienceClick}
          className="min-h-[44px] px-4 py-2.5 rounded-full bg-[#3B172D] text-[#FFFDFC] text-xs font-bold hover:bg-[#1B1816] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#B58A4B]" /> + Add Surprise Experience
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#526D55]/10 border border-[#526D55]/30 text-[#526D55] text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#526D55]" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Editor Drawer / Form Modal */}
      {editingExp && (
        <form onSubmit={handleSaveExperience} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9C9C7] shadow-xl space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-between border-b border-[#F4E8E5] pb-3">
            <h2 className="font-serif text-xl font-bold text-[#1B1816]">Configure Surprise Experience Package</h2>
            <button
              type="button"
              onClick={() => setEditingExp(null)}
              className="w-8 h-8 rounded-full bg-[#F4E8E5] text-[#746E68] font-bold hover:bg-[#E9C9C7]"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1B1816]">Experience Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2 text-xs text-[#1B1816]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1B1816]">Occasion Category *</label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value as SurpriseOccasionType)}
                className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2 text-xs text-[#1B1816]"
              >
                <option value="Birthday Surprise">Birthday Surprise</option>
                <option value="Anniversary Surprise">Anniversary Surprise</option>
                <option value="Romantic Surprise">Romantic Surprise</option>
                <option value="Workplace Birthday Surprise">Workplace Birthday Surprise</option>
                <option value="Formal / Corporate Surprise">Formal / Corporate Surprise</option>
                <option value="Friendship Surprise">Friendship Surprise</option>
                <option value="Congratulations">Congratulations</option>
                <option value="Custom Surprise">Custom Surprise</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1B1816]">Subtitle</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2 text-xs text-[#1B1816]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1B1816]">Full Experience Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2 text-xs text-[#1B1816]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1B1816]">Experience Image URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2 text-xs text-[#1B1816]"
            />
          </div>

          {/* Package Tiers Manager */}
          <div className="space-y-4 pt-2 border-t border-[#F4E8E5]">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-[#1B1816]">Configured Package Tiers</h3>
              <button
                type="button"
                onClick={handleAddPackageTier}
                className="text-xs font-bold text-[#B58A4B] hover:underline"
              >
                + Add Package Tier
              </button>
            </div>

            <div className="space-y-4">
              {packages.map((pkg, idx) => (
                <div key={pkg.id || idx} className="bg-[#FFFDFC] p-4 rounded-2xl border border-[#D9D4CE] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-[#746E68]">Tier Name</label>
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => handlePackageChange(idx, 'name', e.target.value)}
                        className="w-full bg-white border border-[#D9D4CE] rounded-lg px-2.5 py-1 text-xs font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-[#746E68]">Price (₹)</label>
                      <input
                        type="number"
                        value={pkg.price}
                        onChange={(e) => handlePackageChange(idx, 'price', Number(e.target.value))}
                        className="w-full bg-white border border-[#D9D4CE] rounded-lg px-2.5 py-1 text-xs font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-[#746E68]">Tier Type</label>
                      <select
                        value={pkg.tier}
                        onChange={(e) => handlePackageChange(idx, 'tier', e.target.value as PackageTier)}
                        className="w-full bg-white border border-[#D9D4CE] rounded-lg px-2.5 py-1 text-xs font-bold"
                      >
                        <option value="mini">mini (₹1500–₹3000)</option>
                        <option value="signature">signature (₹3000+)</option>
                        <option value="grand">grand (Premium)</option>
                        <option value="custom">custom</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-[#746E68]">Tier Description</label>
                    <input
                      type="text"
                      value={pkg.description}
                      onChange={(e) => handlePackageChange(idx, 'description', e.target.value)}
                      className="w-full bg-white border border-[#D9D4CE] rounded-lg px-2.5 py-1 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#3B172D] text-[#FFFDFC] py-3 rounded-full text-xs font-bold hover:bg-[#1B1816] transition-colors flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin text-[#B58A4B]" /> : <><Save className="w-4 h-4 text-[#B58A4B]" /> Save Experience</>}
            </button>
            <button
              type="button"
              onClick={() => setEditingExp(null)}
              className="px-6 bg-[#F4E8E5] text-[#1B1816] py-3 rounded-full text-xs font-bold hover:bg-[#E9C9C7]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Main Experiences List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="bg-white rounded-3xl p-6 border border-[#E9C9C7]/40 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#F4E8E5] pb-3">
                <div>
                  <span className="text-[10px] font-bold text-[#B58A4B] uppercase block">{exp.occasion}</span>
                  <h3 className="font-serif text-lg font-bold text-[#1B1816]">{exp.title}</h3>
                </div>
                <span className="bg-[#526D55]/10 text-[#526D55] text-[10px] font-bold px-2.5 py-1 rounded-full">
                  Active
                </span>
              </div>

              <p className="text-xs text-[#746E68] leading-relaxed line-clamp-2">{exp.description}</p>

              {/* Package Tiers Breakdown */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-[#1B1816] uppercase block">Package Tiers:</span>
                <div className="grid grid-cols-3 gap-2">
                  {exp.packages.map((pkg) => (
                    <div key={pkg.id} className="bg-[#FFFDFC] p-3 rounded-xl border border-[#D9D4CE]/60 text-center space-y-0.5">
                      <span className="text-[9px] font-bold uppercase text-[#B58A4B] block">{pkg.tier}</span>
                      <span className="text-xs font-bold text-[#1B1816] block">₹{pkg.price}</span>
                      <span className="text-[9px] text-[#746E68] block truncate">{pkg.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F4E8E5] flex justify-end">
              <button
                type="button"
                onClick={() => handleEditClick(exp)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[#F4E8E5] text-[#3B172D] text-xs font-bold hover:bg-[#E9C9C7] flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Package Configuration
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import {
  submitPartnerApplication,
  getPartnerApplications,
} from '@/lib/services/partnerService';
import { FirestorePartnerApplicationDoc, PartnerApplicationStatus } from '@/lib/types/models';
import {
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Ban,
  ShieldCheck,
  Loader2,
  Send,
} from 'lucide-react';

export default function PartnerOnboardingForm() {
  const { user } = useAuth();
  const [existingApp, setExistingApp] = useState<FirestorePartnerApplicationDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessType, setBusinessType] = useState('Flower Shop');
  const [description, setDescription] = useState('');
  const [serviceLocations, setServiceLocations] = useState('Rajahmundry, Kakinada, Vijayawada');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Rajahmundry');
  const [state, setState] = useState('Andhra Pradesh');
  const [pincode, setPincode] = useState('533101');
  const [gstNumber, setGstNumber] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankIfscCode, setBankIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    loadPartnerApplication();
  }, [user]);

  const loadPartnerApplication = async () => {
    setLoading(true);
    const userEmail = user?.email || 'partner@bloomora.com';
    const apps = await getPartnerApplications();
    const myApp = apps.find((a) => a.email.toLowerCase() === userEmail.toLowerCase()) || null;
    if (myApp) {
      setExistingApp(myApp);
      setBusinessName(myApp.businessName || '');
      setContactName(myApp.contactName || '');
      setOwnerName(myApp.ownerName || myApp.contactName || '');
      setEmail(myApp.email || '');
      setPhone(myApp.phone || '');
      setBusinessType(myApp.businessType || 'Flower Shop');
      setDescription(myApp.description || '');
      setAddress(myApp.address || '');
      setCity(myApp.city || 'Rajahmundry');
      setState(myApp.state || 'Andhra Pradesh');
      setPincode(myApp.pincode || '');
      setGstNumber(myApp.gstNumber || '');
      setBankAccountNumber(myApp.bankAccountNumber || '');
      setBankIfscCode(myApp.bankIfscCode || '');
      setBankName(myApp.bankName || '');
      setLogoUrl(myApp.logoUrl || '');
      if (myApp.serviceLocations && Array.isArray(myApp.serviceLocations)) {
        setServiceLocations(myApp.serviceLocations.join(', '));
      }
    } else {
      setEmail(userEmail);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const locationsArr = serviceLocations.split(',').map((l) => l.trim()).filter(Boolean);
      await submitPartnerApplication({
        businessName,
        contactName,
        ownerName,
        email: email || user?.email || 'partner@bloomora.com',
        phone,
        city,
        state,
        pincode,
        businessType,
        address,
        description,
        serviceLocations: locationsArr,
        gstNumber,
        bankAccountNumber,
        bankIfscCode,
        bankName,
        logoUrl,
      });

      setSubmittedSuccess(true);
      await loadPartnerApplication();
      setTimeout(() => setSubmittedSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to submit onboarding application:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-xs text-[#746E68]">Retrieving partner business application...</div>;
  }

  const appStatus: PartnerApplicationStatus = existingApp?.status || 'draft';

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9C9C7]/40 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F4E8E5] pb-4">
          <div>
            <span className="text-[10px] font-bold text-[#B58A4B] uppercase tracking-widest block">
              Partner Accreditation & Verification
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#1B1816]">
              Business Profile & Merchant Onboarding
            </h1>
          </div>

          {/* Application Status Badge */}
          <div className="flex items-center gap-2">
            {appStatus === 'approved' && (
              <span className="bg-[#526D55]/10 text-[#526D55] border border-[#526D55]/30 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> APPROVED PARTNER
              </span>
            )}
            {appStatus === 'pending' && (
              <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" /> PENDING REVIEW
              </span>
            )}
            {appStatus === 'rejected' && (
              <span className="bg-[#A73A4A]/10 text-[#A73A4A] border border-[#A73A4A]/30 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> APPLICATION REJECTED
              </span>
            )}
            {appStatus === 'suspended' && (
              <span className="bg-[#A73A4A]/10 text-[#A73A4A] border border-[#A73A4A]/30 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Ban className="w-4 h-4" /> ACCOUNT SUSPENDED
              </span>
            )}
            {appStatus === 'draft' && (
              <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full">
                APPLICATION DRAFT
              </span>
            )}
          </div>
        </div>

        {/* Rejection Reason Notice */}
        {appStatus === 'rejected' && existingApp?.rejectionReason && (
          <div className="p-4 rounded-2xl bg-[#A73A4A]/10 border border-[#A73A4A]/30 text-[#A73A4A] text-xs space-y-1">
            <div className="font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Rejection Reason from Admin Review:
            </div>
            <p className="pl-6 text-[#1B1816] font-medium">{existingApp.rejectionReason}</p>
            <p className="pl-6 text-[11px] text-[#746E68]">Please update your business verification information below and resubmit for review.</p>
          </div>
        )}

        {submittedSuccess && (
          <div className="p-4 rounded-2xl bg-[#526D55]/10 border border-[#526D55]/30 text-[#526D55] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#526D55] shrink-0" />
            <span>Application submitted successfully! Our merchant curation team will review your business credentials.</span>
          </div>
        )}
      </div>

      {/* Main Onboarding Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9C9C7]/40 shadow-xs space-y-8">
        {/* Section 1: Business Identity */}
        <div className="space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#1B1816] flex items-center gap-2 border-b border-[#F4E8E5] pb-2">
            <Building className="w-5 h-5 text-[#B58A4B]" /> 1. Business & Craft Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1B1816]">Business / Brand Name *</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Rajahmundry Artisanal Chocolates"
                className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#1B1816]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1B1816]">Owner / Lead Creator Name *</label>
              <input
                type="text"
                value={ownerName || contactName}
                onChange={(e) => { setOwnerName(e.target.value); setContactName(e.target.value); }}
                placeholder="e.g. Sriram Reddy"
                className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#1B1816]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1B1816]">Business Category *</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#1B1816]"
              >
                <option value="Flower Shop">Florist / Flower Studio</option>
                <option value="Bakery">Artisanal Bakery & Confectionery</option>
                <option value="Gift Store">Curated Gift & Hamper Studio</option>
                <option value="Chocolatier">Handcrafted Chocolatier</option>
                <option value="Cafe">Boutique Cafe</option>
                <option value="Stationery">Stationery & Print Maker</option>
                <option value="Decorator">Surprise Experience Decorator</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1B1816]">Logo / Brand Image URL</label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://image-url.com/logo.jpg"
                className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#1B1816]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1B1816]">Craft & Brand Story / Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your brand heritage, materials, specialty gifts, and craftsmanship..."
              rows={3}
              className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#1B1816]"
            />
          </div>
        </div>

        {/* Section 2: Contact & Location */}
        <div className="space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#1B1816] flex items-center gap-2 border-b border-[#F4E8E5] pb-2">
            <MapPin className="w-5 h-5 text-[#B58A4B]" /> 2. Location & Service Areas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1B1816]">Contact Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#1B1816]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1B1816]">Phone Number *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#1B1816]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1B1816]">City *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#1B1816]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-[#1B1816]">Street Address & Landmark *</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Door No, Street Name, Landmark"
                className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#1B1816]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1B1816]">Pincode *</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="533101"
                className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#1B1816]"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1B1816]">Fulfilment & Delivery Cities / Pincodes (Comma separated)</label>
            <input
              type="text"
              value={serviceLocations}
              onChange={(e) => setServiceLocations(e.target.value)}
              placeholder="Rajahmundry, Kakinada, Tanuku"
              className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#1B1816]"
            />
          </div>
        </div>

        {/* Section 3: Verification & Banking */}
        <div className="space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#1B1816] flex items-center gap-2 border-b border-[#F4E8E5] pb-2">
            <CreditCard className="w-5 h-5 text-[#B58A4B]" /> 3. Verification & Payout Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1B1816]">GSTIN / Registration Number (Optional)</label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                placeholder="37AAAAA0000A1Z5"
                className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#1B1816]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1B1816]">Bank Name for Payouts</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="HDFC Bank"
                className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#1B1816]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1B1816]">Bank Account Number</label>
              <input
                type="text"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                placeholder="501000000000"
                className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#1B1816]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1B1816]">IFSC Code</label>
              <input
                type="text"
                value={bankIfscCode}
                onChange={(e) => setBankIfscCode(e.target.value)}
                placeholder="HDFC0001234"
                className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#1B1816]"
              />
            </div>
          </div>
        </div>

        {/* Submit Action Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#3B172D] text-[#FFFDFC] py-3.5 rounded-full text-xs font-bold hover:bg-[#1B1816] transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#B58A4B]" />
          ) : (
            <>
              <Send className="w-4 h-4 text-[#B58A4B]" />
              {appStatus === 'approved' ? 'Update Business Profile' : 'Submit Onboarding Application for Review'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}

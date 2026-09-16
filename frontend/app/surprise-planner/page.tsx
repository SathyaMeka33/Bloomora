'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Loader2,
  FileText,
  PhoneCall,
  User,
  Users,
} from 'lucide-react';
import { SurpriseOccasionType } from '@/lib/types/models';

export default function SurprisePlannerPage() {
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [occasion, setOccasion] = useState<SurpriseOccasionType>('Birthday Surprise');
  const [relationship, setRelationship] = useState('Partner / Spouse');
  const [recipientName, setRecipientName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Evening (6 PM - 9 PM)');
  const [city, setCity] = useState('Rajahmundry');
  const [locationDetails, setLocationDetails] = useState('');
  const [typeOfSurprise, setTypeOfSurprise] = useState('Workplace Birthday Surprise');
  const [numberOfPeople, setNumberOfPeople] = useState<number>(10);
  const [budget, setBudget] = useState<number>(5000);

  // Requirements Selection
  const [requiredItems, setRequiredItems] = useState<string[]>([
    'Artisanal Cake',
    'Fresh Floral Arrangement',
    'Surprise Setup / Decor',
  ]);
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);
  const [isUrgentDateWarning, setIsUrgentDateWarning] = useState(false);

  const occasionsList: SurpriseOccasionType[] = [
    'Birthday Surprise',
    'Anniversary Surprise',
    'Romantic Surprise',
    'Partner Surprise',
    'Friendship Surprise',
    'Workplace Birthday Surprise',
    'Congratulations',
    'Thank You',
    'Formal / Corporate Surprise',
    'Custom Surprise',
  ];

  const availableItemsList = [
    'Artisanal Cake',
    'Fresh Floral Arrangement',
    'Belgian Chocolates / Truffles',
    'Surprise Setup / Decor',
    'Keepsake / Customized Gift',
    'Greeting Card & Packaging',
    'Photography / Video Capture',
  ];

  const toggleRequiredItem = (item: string) => {
    if (requiredItems.includes(item)) {
      setRequiredItems(requiredItems.filter((i) => i !== item));
    } else {
      setRequiredItems([...requiredItems, item]);
    }
  };

  const handleDateChange = (val: string) => {
    setEventDate(val);
    if (val) {
      const selected = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const diffTime = selected.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 3) {
        setIsUrgentDateWarning(true);
      } else {
        setIsUrgentDateWarning(false);
      }
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/surprise-planner/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          occasion,
          relationship,
          recipientName,
          eventDate,
          preferredTime,
          city,
          locationDetails,
          typeOfSurprise,
          numberOfPeople,
          budget,
          requiredItems,
          notes: additionalNotes,
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        setSubmittedRequestId(resData.requestId);
      } else {
        alert(resData.error || 'Failed to submit surprise request.');
      }
    } catch (err) {
      console.error('Failed to submit surprise planner request:', err);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[#B58A4B] uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Bespoke Surprise Execution
        </span>
        <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold text-[#1B1816]">
          Bloomora Surprise Planner
        </h1>
        <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
          Have a unique surprise vision? Submit your custom planning request below. The Bloomora team will review your requirements, verify local partner availability, and contact you with custom arrangements and pricing.
        </p>
      </div>

      {/* Prominent 3-Day Notice Rule Banner */}
      <div className="bg-[#FFF8F5] border border-[#E8C8C1] p-4 sm:p-5 rounded-2xl flex items-start gap-3.5 text-xs text-[#1B1816]">
        <Calendar className="w-5 h-5 text-[#B58A4B] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-[#3B172D] uppercase tracking-wider block">Important Planning Notice</span>
          <p className="text-[#666666]">
            Please submit your surprise planning request at least <strong>3 days before the event</strong> so our team can coordinate the arrangements with verified local bakers, florists, and setup specialists.
          </p>
        </div>
      </div>

      {/* Post-Submission Success View */}
      {submittedRequestId ? (
        <div className="bg-[#FFFDFC] rounded-3xl p-8 sm:p-12 border border-[#B58A4B] editorial-card-shadow text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-[#FFF8F5] text-[#3B172D] border border-[#E8C8C1] flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8 text-[#B58A4B]" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <span className="text-xs font-bold text-[#B58A4B] uppercase tracking-widest">Reference ID: #{submittedRequestId}</span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1B1816]">
              Surprise Request Received
            </h2>
            <p className="text-xs text-[#666666] leading-relaxed">
              Your request has been sent to the Bloomora team. Our team will contact you to discuss availability, arrangements and final pricing.
            </p>
          </div>

          <div className="bg-[#FFF8F5] p-5 rounded-2xl border border-[#E8C8C1]/60 text-xs max-w-lg mx-auto text-left space-y-2">
            <div className="flex items-center justify-between border-b border-[#EFE8E4] pb-2">
              <span className="font-bold text-[#1B1816]">Occasion: {occasion}</span>
              <span className="text-[#B58A4B] font-semibold">Date: {eventDate}</span>
            </div>
            <p className="text-[#666666]">Recipient: {recipientName} ({relationship}) in {city}</p>
            <p className="text-[#666666]">Approximate Budget: ₹{budget.toLocaleString()}</p>
          </div>

          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={() => {
                setSubmittedRequestId(null);
                setCustomerName('');
                setLocationDetails('');
              }}
              className="bg-[#3B172D] text-white px-6 py-3 rounded-full text-xs font-semibold hover:bg-[#B58A4B] hover:text-[#1B1816] transition-colors"
            >
              Submit Another Request
            </button>

            <Link
              href="/surprises"
              className="bg-[#FFF8F5] text-[#1B1816] border border-[#E8C8C1] px-6 py-3 rounded-full text-xs font-semibold hover:bg-[#EFE8E4] transition-colors"
            >
              Explore Ready Packages
            </Link>
          </div>
        </div>
      ) : (
        /* Custom Planning Request Form */
        <form
          onSubmit={handleSubmitRequest}
          className="bg-[#FFFDFC] rounded-3xl p-6 sm:p-10 border border-[#EFE8E4] editorial-card-shadow space-y-8"
        >
          <div className="border-b border-[#EFE8E4] pb-4">
            <h2 className="font-serif-heading text-xl font-bold text-[#1B1816]">
              Custom Surprise Request Details
            </h2>
            <p className="text-xs text-[#666666]">
              Provide details about your surprise vision so our team can prepare a custom quotation.
            </p>
          </div>

          {/* Urgent Date Warning Banner */}
          {isUrgentDateWarning && (
            <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">Event Date is within 3 Days</span>
                <p>
                  For urgent surprises within 3 days, please contact the Bloomora team directly via phone or WhatsApp for immediate availability verification.
                </p>
              </div>
            </div>
          )}

          {/* Customer Contact Details */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#B58A4B] uppercase tracking-widest block">
              1. Customer Contact Information
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1B1816]">Your Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Sriram Reddy"
                  className="w-full bg-[#FFF8F5] border border-[#E8C8C1]/60 rounded-xl px-3.5 py-3 min-h-[44px] text-xs text-[#1B1816] focus:outline-none focus:border-[#B58A4B]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1B1816]">Phone Number *</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-[#FFF8F5] border border-[#E8C8C1]/60 rounded-xl px-3.5 py-3 min-h-[44px] text-xs text-[#1B1816] focus:outline-none focus:border-[#B58A4B]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1B1816]">Email Address</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. name@example.com"
                  className="w-full bg-[#FFF8F5] border border-[#E8C8C1]/60 rounded-xl px-3.5 py-3 min-h-[44px] text-xs text-[#1B1816] focus:outline-none focus:border-[#B58A4B]"
                />
              </div>
            </div>
          </div>

          {/* Event & Recipient Parameters */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#B58A4B] uppercase tracking-widest block">
              2. Surprise & Recipient Parameters
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1B1816]">Occasion *</label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value as SurpriseOccasionType)}
                  className="w-full bg-[#FFF8F5] border border-[#E8C8C1]/60 rounded-xl px-3.5 py-3 min-h-[44px] text-xs text-[#1B1816] focus:outline-none focus:border-[#B58A4B]"
                >
                  {occasionsList.map((occ) => (
                    <option key={occ} value={occ}>
                      {occ}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1B1816]">Recipient Name *</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Ananya"
                  className="w-full bg-[#FFF8F5] border border-[#E8C8C1]/60 rounded-xl px-3.5 py-3 min-h-[44px] text-xs text-[#1B1816] focus:outline-none focus:border-[#B58A4B]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1B1816]">Relationship *</label>
                <input
                  type="text"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  placeholder="e.g. Partner, Wife, Colleague"
                  className="w-full bg-[#FFF8F5] border border-[#E8C8C1]/60 rounded-xl px-3.5 py-3 min-h-[44px] text-xs text-[#1B1816] focus:outline-none focus:border-[#B58A4B]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1B1816]">Event Date *</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full bg-[#FFF8F5] border border-[#E8C8C1]/60 rounded-xl px-3.5 py-3 min-h-[44px] text-xs text-[#1B1816] focus:outline-none focus:border-[#B58A4B]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1B1816]">Preferred Time</label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-[#FFF8F5] border border-[#E8C8C1]/60 rounded-xl px-3.5 py-3 min-h-[44px] text-xs text-[#1B1816] focus:outline-none focus:border-[#B58A4B]"
                >
                  <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                  <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                  <option value="Evening (6 PM - 9 PM)">Evening (6 PM - 9 PM)</option>
                  <option value="Midnight (11:45 PM)">Midnight (11:45 PM)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1B1816]">City *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Rajahmundry, Vijayawada"
                  className="w-full bg-[#FFF8F5] border border-[#E8C8C1]/60 rounded-xl px-3.5 py-3 min-h-[44px] text-xs text-[#1B1816] focus:outline-none focus:border-[#B58A4B]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1B1816]">Approx. Budget (₹)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  placeholder="e.g. 5000"
                  step="500"
                  className="w-full bg-[#FFF8F5] border border-[#E8C8C1]/60 rounded-xl px-3.5 py-3 min-h-[44px] text-xs text-[#1B1816] focus:outline-none focus:border-[#B58A4B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1B1816]">Surprise Location / Venue Details *</label>
                <input
                  type="text"
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  placeholder="e.g. Workplace office desk, restaurant, home address..."
                  className="w-full bg-[#FFF8F5] border border-[#E8C8C1]/60 rounded-xl px-3.5 py-3 min-h-[44px] text-xs text-[#1B1816] focus:outline-none focus:border-[#B58A4B]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1B1816]">Type of Surprise & Attendees</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={typeOfSurprise}
                    onChange={(e) => setTypeOfSurprise(e.target.value)}
                    placeholder="e.g. Workplace desk surprise"
                    className="flex-1 bg-[#FFF8F5] border border-[#E8C8C1]/60 rounded-xl px-3.5 py-3 min-h-[44px] text-xs text-[#1B1816] focus:outline-none focus:border-[#B58A4B]"
                  />
                  <input
                    type="number"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(Number(e.target.value))}
                    placeholder="People count"
                    className="w-28 bg-[#FFF8F5] border border-[#E8C8C1]/60 rounded-xl px-3 py-3 min-h-[44px] text-xs text-[#1B1816]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Requirements Selection */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#B58A4B] uppercase tracking-widest block">
              3. Select Required Items / Services
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {availableItemsList.map((item) => {
                const isSelected = requiredItems.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleRequiredItem(item)}
                    className={`p-3.5 min-h-[44px] rounded-2xl border text-left text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#B58A4B] bg-[#FFF8F5] font-semibold text-[#1B1816]'
                        : 'border-[#EFE8E4] bg-white text-[#666666] hover:border-[#E8C8C1]'
                    }`}
                  >
                    <span>{item}</span>
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${isSelected ? 'bg-[#3B172D] border-[#3B172D] text-white' : 'border-[#E8C8C1]'}`}>
                      {isSelected && <CheckCircle2 className="w-3 h-3 text-[#B58A4B]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1B1816]">Additional Notes & Instructions</label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g. Specific favorite colors, dietary cake needs, secret entry instructions..."
              rows={3}
              className="w-full bg-[#FFF8F5] border border-[#E8C8C1]/60 rounded-xl px-3.5 py-3 min-h-[44px] text-xs text-[#1B1816] focus:outline-none focus:border-[#B58A4B]"
            />
          </div>

          {/* Submission Action */}
          <div className="pt-4 border-t border-[#EFE8E4]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#3B172D] hover:bg-[#B58A4B] text-white hover:text-[#1B1816] font-semibold py-4 min-h-[48px] rounded-full text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#B58A4B]" /> Submitting Planning Request...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#B58A4B]" /> Send Request to Bloomora
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

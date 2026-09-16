'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Plus, Sparkles, Trash2, Heart } from 'lucide-react';
import { useBloomoraStore } from '@/lib/store';

export default function RemindersPage() {
  const { reminders, addReminder, deleteReminder } = useBloomoraStore();

  const [newTitle, setNewTitle] = useState('');
  const [newRecipient, setNewRecipient] = useState('');
  const [newRel, setNewRel] = useState('Friend');
  const [newDate, setNewDate] = useState('');
  const [newBudget, setNewBudget] = useState(300);

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient.trim() || !newDate) return;

    addReminder({
      title: newTitle || `${newRecipient}'s Celebration`,
      recipient_name: newRecipient,
      relationship: newRel,
      reminder_date: newDate,
      budget: newBudget,
      occasion: 'Birthday',
      days_before: 3,
      is_active: true,
    });

    setNewTitle('');
    setNewRecipient('');
  };

  const handleDelete = (id: string) => {
    deleteReminder(id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs text-[#D4AF37] font-bold uppercase tracking-widest">Never Miss A Moment</span>
        <h1 className="font-serif-heading text-4xl font-bold text-[#1A1A1A]">
          Gifting Reminder Calendar
        </h1>
        <p className="text-xs text-gray-500">
          Bloomora AI will notify you 3 days prior and pre-select the perfect luxury gift set within your budget.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#EFE8E5] luxury-card-shadow space-y-4">
          <h3 className="font-serif-heading text-lg font-bold text-[#1A1A1A] border-b border-gray-100 pb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#D4AF37]" /> Add New Event Reminder
          </h3>

          <form onSubmit={handleAddReminder} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-[#1A1A1A] block mb-1">Event Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Rahul's Graduation"
                className="w-full bg-[#FFF8F5] border border-gray-200 rounded-xl p-2.5 font-medium focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Recipient</label>
                <input
                  type="text"
                  required
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  placeholder="e.g. Rahul"
                  className="w-full bg-[#FFF8F5] border border-gray-200 rounded-xl p-2.5 font-medium focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Event Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-[#FFF8F5] border border-gray-200 rounded-xl p-2.5 font-medium focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#1A1A1A] block mb-1">Target Gift Budget: ₹{newBudget}</label>
              <input
                type="range"
                min={150}
                max={1500}
                step={50}
                value={newBudget}
                onChange={(e) => setNewBudget(Number(e.target.value))}
                className="w-full accent-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1A1A1A] hover:bg-[#D4AF37] text-white hover:text-[#1A1A1A] font-bold py-3 rounded-xl transition-all shadow-md"
            >
              Save Event Reminder
            </button>
          </form>
        </div>

        {/* Saved Reminders list */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#EFE8E5] luxury-card-shadow space-y-4">
          <h3 className="font-serif-heading text-xl font-bold text-[#1A1A1A] border-b border-gray-100 pb-3">
            Active Reminders ({reminders.length})
          </h3>

          <div className="space-y-3 text-xs">
            {reminders.map((r) => (
              <div key={r.id} className="p-4 bg-[#FFF8F5] rounded-2xl border border-gray-100 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-bold text-sm text-[#1A1A1A]">{r.title || `${r.recipient_name}'s Celebration`}</p>
                  <p className="text-gray-500">Recipient: {r.recipient_name} ({r.relationship}) • Budget: ₹{r.budget}</p>
                  <p className="text-[#D4AF37] font-bold text-[11px]">🗓 Date: {r.reminder_date}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/catalog?occasion=${encodeURIComponent(r.occasion.toLowerCase())}`}
                    className="bg-[#1A1A1A] text-white hover:bg-[#D4AF37] hover:text-[#1A1A1A] px-3 py-1.5 rounded-xl font-bold text-[10px] flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Find Gift
                  </Link>

                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

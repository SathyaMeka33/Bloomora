'use client';

import React, { useState, useEffect } from 'react';
import {
  getPartnerApplications,
  updatePartnerApplicationStatus,
} from '@/lib/services/partnerService';
import { FirestorePartnerApplicationDoc, PartnerApplicationStatus } from '@/lib/types/models';
import {
  Users,
  Store,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Ban,
  Search,
  Check,
  X,
  FileText,
  Building,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Loader2,
  Eye,
} from 'lucide-react';

export default function AdminPartnerManager() {
  const [apps, setApps] = useState<FirestorePartnerApplicationDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'suspended'>('all');
  const [selectedApp, setSelectedApp] = useState<FirestorePartnerApplicationDoc | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    const list = await getPartnerApplications();
    setApps(list);
    setLoading(false);
  };

  const handleUpdateStatus = async (appId: string, status: 'approved' | 'rejected' | 'pending' | 'suspended') => {
    setUpdatingId(appId);
    const reason = rejectionReasonInput[appId] || 'Application does not meet Bloomora partner accreditation guidelines.';
    await updatePartnerApplicationStatus(appId, status, status === 'rejected' ? reason : undefined);
    await loadApplications();
    setUpdatingId(null);
  };

  const filteredApps = apps.filter((app) => {
    const bus = (app.businessName || '').toLowerCase();
    const name = (app.contactName || app.ownerName || '').toLowerCase();
    const city = (app.city || '').toLowerCase();
    const matchesSearch = bus.includes(searchQuery.toLowerCase()) || name.includes(searchQuery.toLowerCase()) || city.includes(searchQuery.toLowerCase());

    if (statusFilter !== 'all') return matchesSearch && app.status === statusFilter;
    return matchesSearch;
  });

  if (loading) {
    return <div className="text-center py-16 text-xs text-[#746E68]">Retrieving partner merchant applications...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F4E8E5] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#B58A4B] uppercase tracking-widest block">
            Partner Curation & Governance
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#1B1816]">
            Partner Applications & Merchant Directory
          </h1>
        </div>

        <div className="text-xs text-[#746E68]">
          Total Applications: <strong className="text-[#1B1816]">{apps.length}</strong>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E9C9C7]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#746E68] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by business name, owner or city..."
            className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl pl-10 pr-3 py-2 text-xs text-[#1B1816]"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {(['all', 'pending', 'approved', 'rejected', 'suspended'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-colors uppercase ${
                statusFilter === st
                  ? 'bg-[#3B172D] text-[#FFFDFC]'
                  : 'bg-[#F4E8E5] text-[#746E68] hover:text-[#1B1816]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-xl max-h-[90vh] overflow-y-auto border border-[#E9C9C7]">
            <div className="flex items-center justify-between border-b border-[#F4E8E5] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#B58A4B] uppercase block">Partner Profile Details</span>
                <h3 className="font-serif text-xl font-bold text-[#1B1816]">{selectedApp.businessName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="w-8 h-8 rounded-full bg-[#F4E8E5] text-[#746E68] font-bold hover:bg-[#E9C9C7]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#FFFDFC] p-4 rounded-2xl border border-[#D9D4CE]/60">
                <div>
                  <span className="text-[10px] text-[#746E68] uppercase font-bold block">Owner Name</span>
                  <span className="font-bold text-[#1B1816]">{selectedApp.contactName || selectedApp.ownerName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#746E68] uppercase font-bold block">Business Category</span>
                  <span className="font-bold text-[#1B1816]">{selectedApp.businessType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#746E68] uppercase font-bold block">Email</span>
                  <span className="font-mono text-[#1B1816]">{selectedApp.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#746E68] uppercase font-bold block">Phone</span>
                  <span className="font-mono text-[#1B1816]">{selectedApp.phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-[#746E68] uppercase font-bold block">Address & City</span>
                  <span className="text-[#1B1816]">{selectedApp.address}, {selectedApp.city} ({selectedApp.pincode || 'N/A'})</span>
                </div>
              </div>

              {selectedApp.description && (
                <div className="bg-[#FFFDFC] p-4 rounded-2xl border border-[#D9D4CE]/60 space-y-1">
                  <span className="text-[10px] text-[#746E68] uppercase font-bold block">Craft Description</span>
                  <p className="text-[#1B1816] leading-relaxed">{selectedApp.description}</p>
                </div>
              )}

              {selectedApp.gstNumber && (
                <div className="bg-[#FFFDFC] p-4 rounded-2xl border border-[#D9D4CE]/60 space-y-1">
                  <span className="text-[10px] text-[#746E68] uppercase font-bold block">GST Registration</span>
                  <p className="font-mono font-bold text-[#1B1816]">{selectedApp.gstNumber}</p>
                </div>
              )}

              {selectedApp.rejectionReason && (
                <div className="p-4 rounded-2xl bg-[#A73A4A]/10 border border-[#A73A4A]/30 text-[#A73A4A] space-y-1">
                  <strong className="block font-bold">Rejection Reason Note:</strong>
                  <p>{selectedApp.rejectionReason}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="min-h-[44px] px-5 py-2 rounded-full bg-[#3B172D] text-[#FFFDFC] text-xs font-bold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Applications Table */}
      <div className="bg-white rounded-3xl border border-[#E9C9C7]/40 shadow-xs overflow-hidden">
        {filteredApps.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#746E68] space-y-1">
            <Store className="w-8 h-8 text-[#D9D4CE] mx-auto" />
            <p>No partner applications found in this queue view.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4E8E5]/60 border-b border-[#E9C9C7]/40 text-[#746E68] uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4">Business & Owner</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Rejection Feedback</th>
                  <th className="py-3.5 px-4">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4E8E5] text-[#1B1816]">
                {filteredApps.map((app) => {
                  const isUpdating = updatingId === app.id;
                  return (
                    <tr key={app.id}>
                      <td className="py-4 px-4 font-bold">
                        <div className="space-y-0.5">
                          <span className="text-[#1B1816] block">{app.businessName}</span>
                          <span className="text-[10px] text-[#746E68] font-normal">By: {app.contactName || app.ownerName}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 uppercase text-[10px] font-medium text-[#746E68]">
                        {app.businessType}
                      </td>

                      <td className="py-4 px-4">
                        <span className="block font-mono text-[11px]">{app.email}</span>
                        <span className="text-[10px] text-[#746E68] font-mono">{app.phone}</span>
                      </td>

                      <td className="py-4 px-4">{app.city}</td>

                      <td className="py-4 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                            app.status === 'approved'
                              ? 'bg-[#526D55]/10 text-[#526D55] border border-[#526D55]/30'
                              : app.status === 'rejected'
                              ? 'bg-[#A73A4A]/10 text-[#A73A4A] border border-[#A73A4A]/30'
                              : app.status === 'suspended'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 min-w-[200px]">
                        <input
                          type="text"
                          value={rejectionReasonInput[app.id] || ''}
                          onChange={(e) => setRejectionReasonInput({ ...rejectionReasonInput, [app.id]: e.target.value })}
                          placeholder="Feedback if rejecting..."
                          className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-2.5 py-1 text-xs text-[#1B1816]"
                        />
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedApp(app)}
                            className="p-2 rounded-lg bg-[#F4E8E5] text-[#1B1816] hover:bg-[#E9C9C7]"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {app.status !== 'approved' && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleUpdateStatus(app.id, 'approved')}
                              className="min-h-[36px] px-3 py-1 rounded-xl bg-[#526D55] text-white text-[11px] font-bold hover:bg-[#3B172D] transition-colors flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                          )}

                          {app.status !== 'rejected' && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleUpdateStatus(app.id, 'rejected')}
                              className="min-h-[36px] px-3 py-1 rounded-xl bg-[#A73A4A] text-white text-[11px] font-bold hover:bg-[#1B1816] transition-colors flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          )}

                          {app.status === 'approved' && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleUpdateStatus(app.id, 'suspended')}
                              className="min-h-[36px] px-2.5 py-1 rounded-xl bg-purple-900 text-white text-[11px] font-bold hover:bg-black transition-colors"
                            >
                              Suspend
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

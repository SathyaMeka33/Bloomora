'use client';

import React, { useState, useEffect } from 'react';
import {
  getSurprisePlannerRequests,
  updateSurprisePlannerRequestStatus,
} from '@/lib/services/surpriseService';
import {
  FirestoreSurprisePlannerRequestDoc,
  SurprisePlannerRequestStatus,
} from '@/lib/types/models';
import {
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  DollarSign,
  FileText,
  Loader2,
  Edit3,
  Check,
  X,
} from 'lucide-react';

const STATUS_LIST: SurprisePlannerRequestStatus[] = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'CONTACTED',
  'PLANNING',
  'QUOTED',
  'CUSTOMER_CONFIRMED',
  'SCHEDULED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
];

export default function AdminSurpriseRequestsManager() {
  const [requests, setRequests] = useState<FirestoreSurprisePlannerRequestDoc[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

  // Selected Request Modal/Drawer
  const [selectedReq, setSelectedReq] = useState<FirestoreSurprisePlannerRequestDoc | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [quotationInput, setQuotationInput] = useState<number>(0);
  const [assignedPartnerInput, setAssignedPartnerInput] = useState('');
  const [assignedStaffInput, setAssignedStaffInput] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    const list = await getSurprisePlannerRequests();
    setRequests(list);
    setLoading(false);
  };

  const handleOpenDetail = (req: FirestoreSurprisePlannerRequestDoc) => {
    setSelectedReq(req);
    setAdminNotesInput(req.adminNotes || '');
    setQuotationInput(req.quotation || req.budget || 0);
    setAssignedPartnerInput(req.assignedPartnerId || '');
    setAssignedStaffInput(req.assignedStaff || '');
  };

  const handleStatusUpdate = async (newStatus: SurprisePlannerRequestStatus) => {
    if (!selectedReq) return;
    setUpdatingStatus(true);

    try {
      await updateSurprisePlannerRequestStatus(selectedReq.id, newStatus, {
        adminNotes: adminNotesInput,
        quotation: Number(quotationInput),
        assignedPartnerId: assignedPartnerInput,
        assignedStaff: assignedStaffInput,
      });

      setSuccessMsg(`Request #${selectedReq.id} updated to status: ${newStatus}`);
      await loadRequests();

      setSelectedReq({
        ...selectedReq,
        requestStatus: newStatus,
        adminNotes: adminNotesInput,
        quotation: Number(quotationInput),
        assignedPartnerId: assignedPartnerInput,
        assignedStaff: assignedStaffInput,
      });

      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Failed to update request status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredRequests = requests.filter((r) => {
    const cust = (r.customerName || '').toLowerCase();
    const city = (r.city || '').toLowerCase();
    const id = (r.id || '').toLowerCase();
    const occ = (r.occasion || '').toLowerCase();
    const q = searchQuery.toLowerCase();

    const matchesSearch = cust.includes(q) || city.includes(q) || id.includes(q) || occ.includes(q);
    const matchesStatus = selectedStatus === 'all' || r.requestStatus === selectedStatus;
    const matchesCity = cityFilter === 'all' || r.city?.toLowerCase() === cityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCity;
  });

  const citiesList = Array.from(new Set(requests.map((r) => r.city).filter(Boolean)));

  if (loading) {
    return <div className="text-center py-16 text-xs text-[#746E68]">Retrieving Custom Surprise Planner Requests...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F4E8E5] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#B58A4B] uppercase tracking-widest block">
            Custom Execution Requests
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#1B1816]">
            Bloomora Custom Surprise Planner Requests
          </h1>
        </div>

        <div className="text-xs text-[#746E68]">
          Total Requests: <strong className="text-[#1B1816]">{requests.length}</strong>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#526D55]/10 border border-[#526D55]/30 text-[#526D55] text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#526D55]" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-4 border border-[#E9C9C7]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#746E68] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, customer name, city, occasion..."
            className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl pl-10 pr-3 py-2 text-xs text-[#1B1816]"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#F4E8E5] text-[#1B1816] px-3 py-2 rounded-xl text-xs font-bold border border-[#E9C9C7]"
          >
            <option value="all">All Request Statuses</option>
            {STATUS_LIST.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {citiesList.length > 0 && (
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="bg-[#F4E8E5] text-[#1B1816] px-3 py-2 rounded-xl text-xs font-bold border border-[#E9C9C7]"
            >
              <option value="all">All Cities</option>
              {citiesList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Detail Modal / Drawer */}
      {selectedReq && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9C9C7] shadow-xl space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-[#F4E8E5] pb-3">
            <div>
              <span className="text-[10px] font-bold text-[#B58A4B] uppercase tracking-wider block">Request Ref #{selectedReq.id}</span>
              <h2 className="font-serif text-xl font-bold text-[#1B1816]">{selectedReq.occasion} for {selectedReq.recipientName}</h2>
            </div>
            <button
              onClick={() => setSelectedReq(null)}
              className="w-8 h-8 rounded-full bg-[#F4E8E5] text-[#746E68] font-bold hover:bg-[#E9C9C7]"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#1B1816]">
            {/* Customer & Event Details */}
            <div className="space-y-3 bg-[#FFFDFC] p-4 rounded-2xl border border-[#D9D4CE]/60">
              <span className="font-bold text-[#3B172D] uppercase tracking-wider block border-b border-gray-100 pb-1">Customer & Event Logistics</span>
              <p><strong>Customer Name:</strong> {selectedReq.customerName}</p>
              <p><strong>Phone:</strong> {selectedReq.customerPhone}</p>
              <p><strong>Email:</strong> {selectedReq.customerEmail}</p>
              <p><strong>Event Date:</strong> <span className="font-bold text-[#B58A4B]">{selectedReq.eventDate}</span> ({selectedReq.preferredTime})</p>
              <p><strong>City:</strong> {selectedReq.city}</p>
              <p><strong>Location Details:</strong> {selectedReq.locationDetails}</p>
            </div>

            {/* Recipient & Requirements */}
            <div className="space-y-3 bg-[#FFFDFC] p-4 rounded-2xl border border-[#D9D4CE]/60">
              <span className="font-bold text-[#3B172D] uppercase tracking-wider block border-b border-gray-100 pb-1">Surprise Scope & Requirements</span>
              <p><strong>Recipient Name:</strong> {selectedReq.recipientName} ({selectedReq.relationship})</p>
              <p><strong>Type of Surprise:</strong> {selectedReq.typeOfSurprise}</p>
              <p><strong>Approximate Budget:</strong> ₹{selectedReq.budget?.toLocaleString()}</p>
              <p><strong>Attendees:</strong> {selectedReq.numberOfPeople || 1} people</p>
              <div>
                <strong>Required Items:</strong>
                <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[#666666]">
                  {selectedReq.requiredItems?.map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ul>
              </div>
              {selectedReq.notes && <p><strong>Customer Notes:</strong> {selectedReq.notes}</p>}
            </div>
          </div>

          {/* Admin Management Controls */}
          <div className="space-y-4 pt-4 border-t border-[#F4E8E5]">
            <span className="text-xs font-bold text-[#3B172D] uppercase tracking-widest block">
              Admin Workflow & Quotation Management
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1B1816]">Final Quotation (₹)</label>
                <input
                  type="number"
                  value={quotationInput}
                  onChange={(e) => setQuotationInput(Number(e.target.value))}
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3 py-2 text-xs text-[#1B1816]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1B1816]">Assigned Partner Store ID</label>
                <input
                  type="text"
                  value={assignedPartnerInput}
                  onChange={(e) => setAssignedPartnerInput(e.target.value)}
                  placeholder="e.g. shop-rajahmundry-1"
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3 py-2 text-xs text-[#1B1816]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1B1816]">Assigned Staff / Executive</label>
                <input
                  type="text"
                  value={assignedStaffInput}
                  onChange={(e) => setAssignedStaffInput(e.target.value)}
                  placeholder="e.g. Team Lead Alex"
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3 py-2 text-xs text-[#1B1816]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1B1816]">Admin Internal Notes & Feedback</label>
              <textarea
                value={adminNotesInput}
                onChange={(e) => setAdminNotesInput(e.target.value)}
                placeholder="Notes on customer phone call, availability of cake/decor, assigned partner instructions..."
                rows={2}
                className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3 py-2 text-xs text-[#1B1816]"
              />
            </div>

            {/* Workflow Action Buttons */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#746E68] uppercase block">Transition Workflow Status:</span>
              <div className="flex flex-wrap gap-2">
                {STATUS_LIST.map((st) => {
                  const isCurrent = selectedReq.requestStatus === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      disabled={updatingStatus}
                      onClick={() => handleStatusUpdate(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-[#3B172D] text-[#FFFDFC] ring-2 ring-[#B58A4B]'
                          : 'bg-[#F4E8E5] text-[#1B1816] hover:bg-[#E9C9C7]'
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Request Container */}
      <div className="bg-white rounded-3xl border border-[#E9C9C7]/40 shadow-xs overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#746E68]">
            No surprise planner execution requests found matching current filter criteria.
          </div>
        ) : (
          <>
            {/* Mobile Stacked Cards */}
            <div className="md:hidden divide-y divide-[#F4E8E5]">
              {filteredRequests.map((req) => (
                <div key={req.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#1B1816]">Ref #{req.id}</span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#3B172D] text-[#FFFDFC]">
                      {req.requestStatus}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-[#1B1816]">
                    <p><strong>Customer:</strong> {req.customerName} ({req.customerPhone})</p>
                    <p><strong>Occasion:</strong> {req.occasion} for {req.recipientName} ({req.relationship})</p>
                    <p><strong>Date & City:</strong> <span className="text-[#B58A4B] font-bold">{req.eventDate}</span> in {req.city}</p>
                    <p><strong>Budget:</strong> ₹{req.budget?.toLocaleString()}</p>
                  </div>

                  <div className="pt-1 text-right">
                    <button
                      onClick={() => handleOpenDetail(req)}
                      className="w-full min-h-[44px] rounded-xl bg-[#F4E8E5] text-[#3B172D] font-bold text-xs hover:bg-[#E9C9C7] flex items-center justify-center"
                    >
                      Manage Request
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4E8E5]/60 border-b border-[#E9C9C7]/40 text-[#746E68] uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Ref ID</th>
                    <th className="py-3.5 px-4">Customer Contact</th>
                    <th className="py-3.5 px-4">Occasion & Recipient</th>
                    <th className="py-3.5 px-4">Event Date & City</th>
                    <th className="py-3.5 px-4">Budget</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4E8E5]">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-[#FFFDFC] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#1B1816]">#{req.id}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#1B1816] block">{req.customerName}</span>
                        <span className="text-[11px] text-[#666666]">{req.customerPhone}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#1B1816] block">{req.occasion}</span>
                        <span className="text-[11px] text-[#666666]">For: {req.recipientName} ({req.relationship})</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#B58A4B] block">{req.eventDate}</span>
                        <span className="text-[11px] text-[#666666]">{req.city}</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#1B1816]">₹{req.budget?.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#3B172D] text-[#FFFDFC]">
                          {req.requestStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenDetail(req)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#F4E8E5] text-[#3B172D] font-bold text-xs hover:bg-[#E9C9C7]"
                        >
                          Manage Request
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { getSellerProducts, updateProductFlags } from '@/lib/services/partnerService';
import { FirestoreProductDoc } from '@/lib/types/models';
import {
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

export default function PartnerPromotionsView() {
  const { user } = useAuth();
  const [products, setProducts] = useState<FirestoreProductDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadPromotions();
  }, [user]);

  const loadPromotions = async () => {
    setLoading(true);
    const partnerId = user?.uid || 'partner-demo';
    const data = await getSellerProducts(partnerId);
    setProducts(data);
    setLoading(false);
  };

  const handleApplySponsorship = async (productId: string, currentSponsored?: boolean) => {
    setRequestingId(productId);
    setSuccessMsg(null);
    // Request admin sponsorship
    await updateProductFlags(productId, { isSponsored: !currentSponsored });
    await loadPromotions();
    setRequestingId(null);
    setSuccessMsg(
      !currentSponsored
        ? 'Sponsorship request submitted to Bloomora Admin Curation team.'
        : 'Sponsorship placement removed.'
    );
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  if (loading) {
    return <div className="text-center py-16 text-xs text-[#746E68]">Loading promotion placements...</div>;
  }

  const sponsoredProducts = products.filter((p) => p.isSponsored);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F4E8E5] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#B58A4B] uppercase tracking-widest block">
            Partner Advertising & Featured Placements
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#1B1816]">
            Sponsored Product Applications
          </h1>
        </div>
      </div>

      {/* Curation Policy Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#E9C9C7]/40 space-y-2 shadow-xs">
        <div className="flex items-center gap-2 text-[#3B172D] font-serif font-bold text-base">
          <ShieldCheck className="w-5 h-5 text-[#B58A4B]" />
          <span>Bloomora Transparent Curation Policy</span>
        </div>
        <p className="text-xs text-[#746E68] leading-relaxed">
          Sponsored product placements enable sellers to feature their handcrafted items in relevant category showcases. Sponsored products are clearly identified as sponsored to preserve customer trust, and Bloomora curated experiences remain primary.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#526D55]/10 border border-[#526D55]/30 text-[#526D55] text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#526D55]" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Products Table / Promotions Action */}
      <div className="bg-white rounded-3xl border border-[#E9C9C7]/40 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#F4E8E5] flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-[#1B1816]">
            Your Product Catalog Placement Placements
          </h2>
          <span className="text-xs text-[#746E68]">
            {sponsoredProducts.length} Currently Sponsored
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4E8E5]/60 border-b border-[#E9C9C7]/40 text-[#746E68] uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Sponsorship Status</th>
                <th className="py-3.5 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4E8E5] text-[#1B1816]">
              {products.map((prod) => {
                const isSponsored = Boolean(prod.isSponsored);
                const isRequesting = requestingId === prod.id;

                let statusLabel = 'NOT_SPONSORED';
                let statusBadgeClass = 'bg-gray-100 text-gray-700';

                if (isSponsored) {
                  statusLabel = 'APPROVED';
                  statusBadgeClass = 'bg-[#526D55]/10 text-[#526D55] border border-[#526D55]/30';
                }

                return (
                  <tr key={prod.id}>
                    <td className="py-4 px-4 font-bold">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200'}
                          alt={prod.title}
                          className="w-10 h-10 rounded-xl object-cover border border-[#E9C9C7]/40 shrink-0"
                        />
                        <span>{prod.title}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 uppercase text-[10px] font-medium text-[#746E68]">
                      {prod.category}
                    </td>

                    <td className="py-4 px-4 font-bold">₹{prod.price}</td>

                    <td className="py-4 px-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${statusBadgeClass}`}>
                        {statusLabel}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <button
                        type="button"
                        disabled={isRequesting}
                        onClick={() => handleApplySponsorship(prod.id, isSponsored)}
                        className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                          isSponsored
                            ? 'bg-[#A73A4A]/10 text-[#A73A4A] border border-[#A73A4A]/30 hover:bg-[#A73A4A]/20'
                            : 'bg-[#3B172D] text-[#FFFDFC] hover:bg-[#1B1816]'
                        }`}
                      >
                        {isRequesting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B58A4B]" />
                        ) : isSponsored ? (
                          'Cancel Sponsorship'
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-[#B58A4B]" /> Request Sponsorship
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

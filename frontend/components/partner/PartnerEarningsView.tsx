'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { getSellerOrders, getPartnerApplications } from '@/lib/services/partnerService';
import { FirestoreOrderDoc, FirestorePartnerApplicationDoc } from '@/lib/types/models';
import {
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Building,
} from 'lucide-react';

export default function PartnerEarningsView() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<FirestoreOrderDoc[]>([]);
  const [app, setApp] = useState<FirestorePartnerApplicationDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarningsData();
  }, [user]);

  const loadEarningsData = async () => {
    setLoading(true);
    const partnerId = user?.uid || 'partner-demo';
    const userEmail = user?.email || 'partner@bloomora.com';

    const orderList = await getSellerOrders(partnerId);
    setOrders(orderList);

    const apps = await getPartnerApplications();
    const myApp = apps.find((a) => a.email.toLowerCase() === userEmail.toLowerCase()) || null;
    setApp(myApp);
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-16 text-xs text-[#746E68]">Calculating financial summaries...</div>;
  }

  // Financial aggregation
  const completedOrders = orders.filter(
    (o) => o.status === 'COMPLETED' || o.status === 'DELIVERED' || o.paymentStatus === 'paid'
  );
  const grossSales = completedOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const commissionRate = 0.12; // 12% Bloomora marketplace fee
  const marketplaceCommission = Math.round(grossSales * commissionRate);
  const fulfillmentFees = completedOrders.length * 40; // ₹40 per order packaging/handling fee
  const netEarnings = Math.max(0, grossSales - marketplaceCommission - fulfillmentFees);

  const isBankConfigured = Boolean(app?.bankAccountNumber && app?.bankIfscCode);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F4E8E5] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#B58A4B] uppercase tracking-widest block">
            Merchant Revenue & Settlements
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#1B1816]">
            Store Earnings & Payout Ledger
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {isBankConfigured ? (
            <span className="bg-[#526D55]/10 text-[#526D55] border border-[#526D55]/30 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Settlement Active
            </span>
          ) : (
            <span className="bg-[#A73A4A]/10 text-[#A73A4A] border border-[#A73A4A]/30 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Settlement configuration required
            </span>
          )}
        </div>
      </div>

      {/* Unconfigured Alert Banner */}
      {!isBankConfigured && (
        <div className="p-5 rounded-3xl bg-[#A73A4A]/10 border border-[#A73A4A]/30 text-[#1B1816] space-y-2">
          <div className="flex items-center gap-2 text-[#A73A4A] font-bold text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>Settlement configuration required</span>
          </div>
          <p className="text-xs text-[#746E68] pl-7">
            Your bank details and payout preferences are not fully configured. Please update your partner profile with a valid bank account number and IFSC code to receive automated payouts.
          </p>
        </div>
      )}

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-[#E9C9C7]/40 space-y-2 shadow-xs">
          <span className="text-xs text-[#746E68]">Gross Sales</span>
          <h3 className="text-2xl font-bold text-[#1B1816]">₹{grossSales.toLocaleString()}</h3>
          <span className="text-[10px] text-[#746E68]">From {completedOrders.length} completed orders</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E9C9C7]/40 space-y-2 shadow-xs">
          <span className="text-xs text-[#746E68]">Marketplace Commission (12%)</span>
          <h3 className="text-2xl font-bold text-[#3B172D]">₹{marketplaceCommission.toLocaleString()}</h3>
          <span className="text-[10px] text-[#746E68]">Bloomora platform curation</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E9C9C7]/40 space-y-2 shadow-xs">
          <span className="text-xs text-[#746E68]">Fulfilment & Packaging Fees</span>
          <h3 className="text-2xl font-bold text-[#746E68]">₹{fulfillmentFees.toLocaleString()}</h3>
          <span className="text-[10px] text-[#746E68]">Standard handling offsets</span>
        </div>

        <div className="bg-[#3B172D] text-[#FFFDFC] p-6 rounded-3xl border border-[#B58A4B]/40 space-y-2 shadow-sm">
          <span className="text-xs text-[#B58A4B] font-bold">Net Partner Earnings</span>
          <h3 className="text-3xl font-serif font-bold text-[#FFFDFC]">₹{netEarnings.toLocaleString()}</h3>
          <span className="text-[10px] text-[#FFFDFC]/70 block">Ready for settlement payout</span>
        </div>
      </div>

      {/* Bank Settlement Information Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9C9C7]/40 shadow-xs space-y-4">
        <h2 className="font-serif text-lg font-bold text-[#1B1816] flex items-center gap-2 border-b border-[#F4E8E5] pb-3">
          <CreditCard className="w-5 h-5 text-[#B58A4B]" /> Configured Bank Account Details
        </h2>

        {isBankConfigured ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#FFFDFC] p-4 rounded-2xl border border-[#D9D4CE]/60">
              <span className="text-[10px] text-[#746E68] uppercase font-bold block">Bank Name</span>
              <span className="font-bold text-[#1B1816] text-sm">{app?.bankName || 'Configured Bank'}</span>
            </div>

            <div className="bg-[#FFFDFC] p-4 rounded-2xl border border-[#D9D4CE]/60">
              <span className="text-[10px] text-[#746E68] uppercase font-bold block">Account Number</span>
              <span className="font-mono font-bold text-[#1B1816] text-sm">•••• {app?.bankAccountNumber?.slice(-4)}</span>
            </div>

            <div className="bg-[#FFFDFC] p-4 rounded-2xl border border-[#D9D4CE]/60">
              <span className="text-[10px] text-[#746E68] uppercase font-bold block">IFSC Code</span>
              <span className="font-mono font-bold text-[#1B1816] text-sm">{app?.bankIfscCode}</span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-[#746E68] italic py-2">
            No bank details provided. Go to Partner Profile to set up bank account details.
          </div>
        )}
      </div>

      {/* Recent Payout Settlements Ledger */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9C9C7]/40 shadow-xs space-y-4">
        <h2 className="font-serif text-lg font-bold text-[#1B1816] border-b border-[#F4E8E5] pb-3">
          Recent Settlement Transactions
        </h2>

        {completedOrders.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#746E68]">
            No settled transactions recorded yet. Completed orders will appear in your payout ledger.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4E8E5]/60 border-b border-[#E9C9C7]/40 text-[#746E68] uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Gross Total</th>
                  <th className="py-3 px-4">Commission</th>
                  <th className="py-3 px-4">Net Payout</th>
                  <th className="py-3 px-4">Payout Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4E8E5] text-[#1B1816]">
                {completedOrders.map((order) => {
                  const comm = Math.round(order.grandTotal * 0.12);
                  const net = order.grandTotal - comm - 40;
                  return (
                    <tr key={order.id}>
                      <td className="py-3.5 px-4 font-mono font-bold">#{order.id}</td>
                      <td className="py-3.5 px-4">{order.customerName}</td>
                      <td className="py-3.5 px-4 font-bold">₹{order.grandTotal}</td>
                      <td className="py-3.5 px-4 text-[#A73A4A]">-₹{comm}</td>
                      <td className="py-3.5 px-4 font-bold text-[#526D55]">₹{Math.max(0, net)}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-[#526D55]/10 text-[#526D55] text-[10px] font-bold px-2.5 py-1 rounded-full">
                          Settlement Completed
                        </span>
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

'use client';

import React, { useState, useEffect } from 'react';
import { getSellerOrders, updateSellerOrderStatus } from '@/lib/services/partnerService';
import { FirestoreOrderDoc, ExtendedOrderStatus, SellerOrderStatus } from '@/lib/types/models';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Eye,
  Loader2,
  RefreshCw,
} from 'lucide-react';

export default function AdminOrderManager() {
  const [orders, setOrders] = useState<FirestoreOrderDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<FirestoreOrderDoc | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const list = await getSellerOrders(); // Admin fetches all orders
    setOrders(list);
    setLoading(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateSellerOrderStatus(orderId, newStatus as SellerOrderStatus);
    await loadOrders();
  };

  const filteredOrders = orders.filter((o) => {
    const cust = (o.customerName || '').toLowerCase();
    const email = (o.customerEmail || '').toLowerCase();
    const idStr = (o.id || '').toLowerCase();
    const matchesSearch = cust.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase()) || idStr.includes(searchQuery.toLowerCase());

    if (statusFilter !== 'all') return matchesSearch && o.status === statusFilter;
    return matchesSearch;
  });

  if (loading) {
    return <div className="text-center py-16 text-xs text-[#746E68]">Retrieving platform orders...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F4E8E5] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#B58A4B] uppercase tracking-widest block">
            Global Fulfilment Governance
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#1B1816]">
            All Platform Orders & Fulfilment Control
          </h1>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-white border border-[#D9D4CE] text-xs font-bold text-[#1B1816] hover:bg-[#F4E8E5] flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4 text-[#B58A4B]" /> Refresh Orders
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E9C9C7]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#746E68] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, customer name or email..."
            className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl pl-10 pr-3 py-2 text-xs text-[#1B1816]"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {(['all', 'PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED', 'CANCELLED'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`min-h-[44px] px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors uppercase ${
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-xl max-h-[90vh] overflow-y-auto border border-[#E9C9C7]">
            <div className="flex items-center justify-between border-b border-[#F4E8E5] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#B58A4B] uppercase block">Order Audit Details</span>
                <h3 className="font-serif text-xl font-bold text-[#1B1816]">Order #{selectedOrder.id}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-[#F4E8E5] text-[#746E68] font-bold hover:bg-[#E9C9C7]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#FFFDFC] p-4 rounded-2xl border border-[#D9D4CE]/60">
                <div>
                  <span className="text-[10px] text-[#746E68] uppercase font-bold block">Customer Name</span>
                  <span className="font-bold text-[#1B1816]">{selectedOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#746E68] uppercase font-bold block">Customer Email</span>
                  <span className="font-mono text-[#1B1816]">{selectedOrder.customerEmail}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#746E68] uppercase font-bold block">Payment Method</span>
                  <span className="font-bold text-[#1B1816] uppercase">{selectedOrder.paymentMethod || 'razorpay'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#746E68] uppercase font-bold block">Payment Status</span>
                  <span className="font-bold text-[#526D55] uppercase">{selectedOrder.paymentStatus || 'paid'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-[#746E68] uppercase font-bold block">Delivery Address</span>
                  <span className="text-[#1B1816]">{selectedOrder.deliveryAddress || 'Pickup Locker / Meet Me There'}</span>
                </div>
              </div>

              {selectedOrder.giftStory && (
                <div className="bg-[#FFFDFC] p-4 rounded-2xl border border-[#D9D4CE]/60 space-y-1">
                  <span className="text-[10px] text-[#B58A4B] uppercase font-bold block">AI Gift Story</span>
                  <p className="font-serif font-bold text-[#1B1816]">{selectedOrder.giftStory.title}</p>
                  <p className="text-[#746E68]">{selectedOrder.giftStory.reasoning}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="min-h-[44px] px-5 py-2 rounded-full bg-[#3B172D] text-[#FFFDFC] text-xs font-bold"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E9C9C7]/40 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#746E68] space-y-1">
            <ShoppingBag className="w-8 h-8 text-[#D9D4CE] mx-auto" />
            <p>No orders match the selected filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4E8E5]/60 border-b border-[#E9C9C7]/40 text-[#746E68] uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Purchased Items</th>
                  <th className="py-3.5 px-4">Fulfillment</th>
                  <th className="py-3.5 px-4">Grand Total</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4">Lifecycle Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4E8E5] text-[#1B1816]">
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-4 px-4 font-mono font-bold">#{order.id}</td>
                    <td className="py-4 px-4 font-medium">{order.customerName}</td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-[#1B1816] block">{order.items[0]?.productName || 'Surprise Experience'}</span>
                      <span className="text-[10px] text-[#746E68]">Qty: {order.items[0]?.quantity || 1}</span>
                    </td>
                    <td className="py-4 px-4 uppercase text-[10px] font-bold text-[#B58A4B]">
                      {order.fulfillmentType || 'delivery'}
                    </td>
                    <td className="py-4 px-4 font-bold">₹{order.grandTotal}</td>
                    <td className="py-4 px-4">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#B58A4B]/20 text-[#3B172D] uppercase">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg bg-[#F4E8E5] text-[#1B1816] hover:bg-[#E9C9C7]"
                          title="View Order Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#1B1816]"
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PREPARING">PREPARING</option>
                          <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

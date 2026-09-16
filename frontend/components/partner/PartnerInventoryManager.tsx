'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { getSellerProducts, updatePartnerInventoryStock } from '@/lib/services/partnerService';
import { FirestoreProductDoc } from '@/lib/types/models';
import {
  Boxes,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  Loader2,
  PackageX,
  PackageCheck,
} from 'lucide-react';

export default function PartnerInventoryManager() {
  const { user } = useAuth();
  const [products, setProducts] = useState<FirestoreProductDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'low_stock' | 'sold_out' | 'active'>('all');

  useEffect(() => {
    loadInventory();
  }, [user]);

  const loadInventory = async () => {
    setLoading(true);
    const partnerId = user?.uid || 'partner-demo';
    const data = await getSellerProducts(partnerId);
    setProducts(data);
    setLoading(false);
  };

  const handleStockChange = async (productId: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    setUpdatingId(productId);
    await updatePartnerInventoryStock(productId, newStock);
    await loadInventory();
    setUpdatingId(null);
  };

  const handleToggleAvailability = async (productId: string, currentAvailability: boolean, currentStock: number) => {
    setUpdatingId(productId);
    const nextAvailability = !currentAvailability;
    await updatePartnerInventoryStock(productId, nextAvailability ? Math.max(1, currentStock) : 0, nextAvailability);
    await loadInventory();
    setUpdatingId(null);
  };

  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase());

    const stock = prod.inventory ?? 0;
    if (filterType === 'low_stock') return matchesSearch && stock > 0 && stock <= 5;
    if (filterType === 'sold_out') return matchesSearch && (stock === 0 || prod.inStock === false);
    if (filterType === 'active') return matchesSearch && stock > 0 && prod.inStock !== false;
    return matchesSearch;
  });

  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => (p.inventory ?? 0) > 0 && (p.inventory ?? 0) <= 5).length;
  const soldOutCount = products.filter((p) => (p.inventory ?? 0) === 0 || p.inStock === false).length;

  if (loading) {
    return <div className="text-center py-16 text-xs text-[#746E68]">Loading inventory records...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header & Metrics Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F4E8E5] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#B58A4B] uppercase tracking-widest block">
            Transactional Inventory Service
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#1B1816]">
            Stock & Inventory Controls
          </h1>
        </div>

        <button
          type="button"
          onClick={loadInventory}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-white border border-[#D9D4CE] text-xs font-bold text-[#1B1816] hover:bg-[#F4E8E5] transition-colors flex items-center gap-2 self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4 text-[#B58A4B]" />
          Refresh Stock
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setFilterType('all')}
          className={`cursor-pointer bg-white p-5 rounded-2xl border transition-all ${
            filterType === 'all' ? 'border-[#3B172D] shadow-xs' : 'border-[#E9C9C7]/40 hover:border-[#B58A4B]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#746E68]">Total Products</span>
            <Boxes className="w-4 h-4 text-[#B58A4B]" />
          </div>
          <h3 className="text-2xl font-bold text-[#1B1816] mt-1">{totalProducts}</h3>
          <span className="text-[10px] text-[#746E68]">Active items in catalog</span>
        </div>

        <div
          onClick={() => setFilterType('low_stock')}
          className={`cursor-pointer bg-white p-5 rounded-2xl border transition-all ${
            filterType === 'low_stock' ? 'border-amber-500 shadow-xs' : 'border-[#E9C9C7]/40 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-800">Low Stock Alert</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-2xl font-bold text-amber-900 mt-1">{lowStockCount}</h3>
          <span className="text-[10px] text-amber-700">Under 5 units remaining</span>
        </div>

        <div
          onClick={() => setFilterType('sold_out')}
          className={`cursor-pointer bg-white p-5 rounded-2xl border transition-all ${
            filterType === 'sold_out' ? 'border-[#A73A4A] shadow-xs' : 'border-[#E9C9C7]/40 hover:border-[#A73A4A]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#A73A4A]">Sold Out / Unavailable</span>
            <PackageX className="w-4 h-4 text-[#A73A4A]" />
          </div>
          <h3 className="text-2xl font-bold text-[#A73A4A] mt-1">{soldOutCount}</h3>
          <span className="text-[10px] text-[#A73A4A]">Requires restocking</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E9C9C7]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#746E68] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product title or category..."
            className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl pl-10 pr-3 py-2 text-xs text-[#1B1816]"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {(['all', 'active', 'low_stock', 'sold_out'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                filterType === type
                  ? 'bg-[#3B172D] text-[#FFFDFC]'
                  : 'bg-[#F4E8E5] text-[#746E68] hover:text-[#1B1816]'
              }`}
            >
              {type === 'all' && 'All Items'}
              {type === 'active' && 'In Stock'}
              {type === 'low_stock' && 'Low Stock'}
              {type === 'sold_out' && 'Sold Out'}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table / Responsive Cards */}
      <div className="bg-white rounded-3xl border border-[#E9C9C7]/40 shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#746E68] space-y-2">
            <Boxes className="w-8 h-8 text-[#D9D4CE] mx-auto" />
            <p>No inventory items match the current query filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4E8E5]/60 border-b border-[#E9C9C7]/40 text-[#746E68] uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4">Product Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Available Qty</th>
                  <th className="py-3.5 px-4">Stock Adjustments</th>
                  <th className="py-3.5 px-4">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4E8E5] text-[#1B1816]">
                {filteredProducts.map((prod) => {
                  const stock = prod.inventory ?? 0;
                  const isUpdating = updatingId === prod.id;
                  const isAvailable = prod.inStock !== false && prod.availability !== false && stock > 0;

                  return (
                    <tr key={prod.id} className="hover:bg-[#FFFDFC]">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200'}
                            alt={prod.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#E9C9C7]/40"
                          />
                          <div>
                            <span className="font-bold text-xs text-[#1B1816] block">{prod.title}</span>
                            <span className="text-[10px] font-mono text-[#746E68]">ID: {prod.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-medium text-[#746E68] uppercase text-[10px]">
                        {prod.category}
                      </td>

                      <td className="py-4 px-4 font-bold text-[#1B1816]">
                        ₹{prod.price}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-sm ${
                              stock === 0
                                ? 'text-[#A73A4A]'
                                : stock <= 5
                                ? 'text-amber-700'
                                : 'text-[#526D55]'
                            }`}
                          >
                            {stock} pcs
                          </span>
                          {stock <= 5 && stock > 0 && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                              Low Stock
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={isUpdating || stock <= 0}
                            onClick={() => handleStockChange(prod.id, stock, -1)}
                            className="w-8 h-8 rounded-lg bg-[#F4E8E5] text-[#3B172D] hover:bg-[#E9C9C7] flex items-center justify-center font-bold disabled:opacity-40"
                            aria-label="Decrease stock"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <span className="w-10 text-center font-mono font-bold text-xs">
                            {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto text-[#B58A4B]" /> : stock}
                          </span>

                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleStockChange(prod.id, stock, 1)}
                            className="w-8 h-8 rounded-lg bg-[#F4E8E5] text-[#3B172D] hover:bg-[#E9C9C7] flex items-center justify-center font-bold disabled:opacity-40"
                            aria-label="Increase stock"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleStockChange(prod.id, stock, 10)}
                            className="px-2 py-1 text-[10px] font-bold rounded-lg bg-white border border-[#D9D4CE] text-[#746E68] hover:bg-[#F4E8E5]"
                          >
                            +10
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleToggleAvailability(prod.id, isAvailable, stock)}
                          className={`min-h-[44px] px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors flex items-center gap-1.5 ${
                            isAvailable
                              ? 'bg-[#526D55]/10 border-[#526D55]/30 text-[#526D55] hover:bg-[#526D55]/20'
                              : 'bg-[#A73A4A]/10 border-[#A73A4A]/30 text-[#A73A4A] hover:bg-[#A73A4A]/20'
                          }`}
                        >
                          {isAvailable ? (
                            <>
                              <PackageCheck className="w-3.5 h-3.5" /> Active
                            </>
                          ) : (
                            <>
                              <PackageX className="w-3.5 h-3.5" /> Unavailable
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
        )}
      </div>
    </div>
  );
}

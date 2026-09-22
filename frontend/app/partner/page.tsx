'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PartnerNav, { PartnerTab } from '@/components/partner/PartnerNav';
import {
  useSellerStore,
  SellerOrder,
  SellerOrderStatus,
  SellerProduct,
  authenticateSeller,
  isSellerAuthenticated as checkSellerAuth,
  clearSellerAuthentication,
} from '@/lib/sellerStore';
import {
  Store,
  ShieldCheck,
  Package,
  PlusCircle,
  ShoppingBag,
  IndianRupee,
  BarChart3,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowRight,
  Eye,
  FileText,
  User,
  Edit3,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Check,
  X,
  TrendingUp,
  Printer,
  ChevronRight,
  Boxes,
  Power,
  CreditCard,
  Building,
  HelpCircle,
  Gift,
  Calendar,
  Layers,
  ArrowUpRight,
  LogOut,
} from 'lucide-react';

export default function PartnerPortalPage() {
  const {
    orders,
    products,
    profile,
    updateOrderStatus,
    addSellerProduct,
    updateProductStock,
    deleteProduct,
    toggleStoreStatus,
    updateStoreProfile,
    setActiveRole,
  } = useSellerStore();

  const [activeTab, setActiveTab] = useState<PartnerTab>('dashboard');

  // Filter States for Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | SellerOrderStatus>('all');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<SellerOrder | null>(null);

  // Filter States for Products
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');

  // Form State for Add Product Studio
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState('chocolate-bouquets');
  const [newPrice, setNewPrice] = useState<number>(999);
  const [newDiscountPrice, setNewDiscountPrice] = useState<number>(849);
  const [newInventory, setNewInventory] = useState<number>(20);
  const [newPrepTime, setNewPrepTime] = useState<number>(30);
  const [newDescription, setNewDescription] = useState('');
  const [newStory, setNewStory] = useState('');
  const [newMaterials, setNewMaterials] = useState('');
  const [newDimensions, setNewDimensions] = useState('25cm x 15cm');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600');
  const [productSubmitSuccess, setProductSubmitSuccess] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState(profile);
  const [profileSavedNotice, setProfileSavedNotice] = useState(false);

  // Bank Form State
  const [bankSavedNotice, setBankSavedNotice] = useState(false);
  const [withdrawalSuccessNotice, setWithdrawalSuccessNotice] = useState(false);

  // Toast message
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Calculations for KPI Cards
  const totalOrdersCount = orders.length;
  const newOrdersCount = orders.filter((o) => o.status === 'NEW').length;
  const preparingOrdersCount = orders.filter((o) => o.status === 'PREPARING').length;
  const dispatchedOrdersCount = orders.filter((o) => o.status === 'DISPATCHED').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'DELIVERED').length;
  const pendingActionCount = newOrdersCount + preparingOrdersCount;

  const totalGrossRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const bloomoraFee = Math.round(totalGrossRevenue * (profile.commissionRate / 100));
  const netEarnings = totalGrossRevenue - bloomoraFee;

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const q = orderSearch.toLowerCase();
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q) ||
      o.deliveryAddress.toLowerCase().includes(q);
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const q = productSearch.toLowerCase();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q);
    const matchesCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Status Handlers
  const handleOrderStatusUpdate = (orderId: string, newStatus: SellerOrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`Order ${orderId} updated to ${newStatus}`);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addSellerProduct({
      name: newTitle.trim(),
      subtitle: newSubtitle.trim() || `Artisanal ${newCategory} crafted in ${profile.city}`,
      description: newDescription.trim() || 'Handcrafted artisanal item with premium ingredients and gift packaging.',
      story: newStory.trim() || 'Curated with passion and dedication to elevate your heartfelt celebrations.',
      price: Number(newPrice) || 999,
      discountPrice: newDiscountPrice ? Number(newDiscountPrice) : undefined,
      category: newCategory,
      images: [newImageUrl || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600'],
      inventory: Number(newInventory) || 15,
      inStock: true,
      preparationTimeMinutes: Number(newPrepTime) || 30,
      fulfillmentOptions: ['partner_delivery', 'meet_me_there'],
      materials: newMaterials.trim() || 'Fresh flora, luxury satin, custom keepsake gift box',
      dimensions: newDimensions.trim() || 'Standard gift box',
    });

    setProductSubmitSuccess(true);
    showToast(`"${newTitle}" added to your live catalog!`);
    setTimeout(() => {
      setProductSubmitSuccess(false);
      setActiveTab('products');
    }, 1500);

    // Reset Form
    setNewTitle('');
    setNewSubtitle('');
    setNewDescription('');
    setNewStory('');
    setNewMaterials('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreProfile(profileForm);
    setProfileSavedNotice(true);
    showToast('Store settings updated successfully');
    setTimeout(() => setProfileSavedNotice(false), 3000);
  };

  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreProfile({
      payoutBank: profileForm.payoutBank,
      upiId: profileForm.upiId,
    });
    setBankSavedNotice(true);
    showToast('Payout settlement details updated');
    setTimeout(() => setBankSavedNotice(false), 3000);
  };

  // Dedicated Seller Authentication State
  const [isSellerAuthenticated, setIsSellerAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return checkSellerAuth();
    }
    return false;
  });

  const [sellerLoginEmail, setSellerLoginEmail] = useState('');
  const [sellerLoginPassword, setSellerLoginPassword] = useState('');
  const [sellerLoginError, setSellerLoginError] = useState('');
  const [sellerLoginLoading, setSellerLoginLoading] = useState(false);
  const [showSellerPassword, setShowSellerPassword] = useState(false);

  const handleSellerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerLoginEmail.trim() || !sellerLoginPassword.trim()) {
      setSellerLoginError('Please enter your merchant email address and password.');
      return;
    }
    setSellerLoginLoading(true);
    setSellerLoginError('');

    const res = await authenticateSeller(sellerLoginEmail, sellerLoginPassword);
    if (!res.success) {
      setSellerLoginError(res.error || 'Invalid merchant credentials. Please verify your email and password.');
      setSellerLoginLoading(false);
      return;
    }

    setActiveRole('seller');
    setIsSellerAuthenticated(true);
    setSellerLoginLoading(false);
    showToast('Welcome to your Merchant Studio');
  };

  // Seller Authentication Gate Screen
  if (!isSellerAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDF8F5] flex items-center justify-center p-4 sm:p-6 text-[#262626]">
        <div className="w-full max-w-md bg-white rounded-[28px] p-7 sm:p-9 border border-[#EFE8E4] shadow-xl space-y-6">
          {/* Header Icon & Brand */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#3B172D] text-[#B58A4B] flex items-center justify-center mx-auto shadow-sm">
              <Store className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#B58A4B] uppercase tracking-widest block">
                Restricted Merchant Portal
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#262626]">
                Seller Partner Login
              </h1>
              <p className="text-xs text-[#8B8B8B] max-w-xs mx-auto leading-relaxed">
                This portal is strictly reserved for verified Bloomora sellers. Authentication is mandatory to access merchant operations.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSellerLogin} className="space-y-4">
            {sellerLoginError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{sellerLoginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#262626] uppercase tracking-wider text-[11px] flex items-center justify-between">
                <span>Merchant Email Address</span>
              </label>
              <div className="flex items-center gap-2 bg-[#FFFDFC] border border-[#D9D4CE] focus-within:border-[#B58A4B] rounded-xl px-3.5 py-2.5 transition-colors">
                <Mail className="w-4 h-4 text-[#8B8B8B] shrink-0" />
                <input
                  type="email"
                  value={sellerLoginEmail}
                  onChange={(e) => setSellerLoginEmail(e.target.value)}
                  placeholder="seller@bloomora.com"
                  autoComplete="email"
                  className="w-full bg-transparent text-xs text-[#262626] outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#262626] uppercase tracking-wider text-[11px] flex items-center justify-between">
                <span>Merchant Password</span>
              </label>
              <div className="flex items-center gap-2 bg-[#FFFDFC] border border-[#D9D4CE] focus-within:border-[#B58A4B] rounded-xl px-3.5 py-2.5 transition-colors">
                <ShieldCheck className="w-4 h-4 text-[#8B8B8B] shrink-0" />
                <input
                  type={showSellerPassword ? 'text' : 'password'}
                  value={sellerLoginPassword}
                  onChange={(e) => setSellerLoginPassword(e.target.value)}
                  placeholder="Enter your seller password"
                  autoComplete="current-password"
                  className="w-full bg-transparent text-xs text-[#262626] outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSellerPassword(!showSellerPassword)}
                  className="text-[#8B8B8B] hover:text-[#262626] text-xs font-semibold"
                >
                  {showSellerPassword ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4 opacity-50" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={sellerLoginLoading || !sellerLoginEmail || !sellerLoginPassword}
              className="w-full min-h-[46px] bg-[#3B172D] text-white rounded-xl text-xs font-bold hover:bg-[#200A18] disabled:bg-[#CCCCCC] disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {sellerLoginLoading ? (
                <>Verifying Merchant Credentials...</>
              ) : (
                <>
                  <Store className="w-4 h-4 text-[#B58A4B]" />
                  <span>Authenticate & Enter Studio</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Credential Fill for Verified Demo Partner */}
          <div className="bg-[#FCF8EE] border border-[#EADBBD] rounded-xl p-3 text-center space-y-1.5">
            <p className="text-[11px] text-[#786134] font-medium">
              Verified Partner Test Account:
            </p>
            <button
              type="button"
              onClick={() => {
                setSellerLoginEmail('seller@bloomora.com');
                setSellerLoginPassword('Bloomora@2026');
                setSellerLoginError('');
              }}
              className="text-xs font-bold text-[#3B172D] hover:underline"
            >
              Populate Demo Credentials (seller@bloomora.com)
            </button>
          </div>

          {/* Registration & Store Navigation */}
          <div className="pt-2 border-t border-[#F4E8E5] text-center space-y-2">
            <p className="text-xs text-[#8B8B8B]">
              New vendor?{' '}
              <Link href="/auth/register?role=seller" className="text-[#B58A4B] font-bold hover:underline">
                Register as a Seller Partner
              </Link>
            </p>
            <p className="text-[11px] text-[#A0A0A0]">
              Gift customer?{' '}
              <a href="/" className="text-[#8B8B8B] hover:underline font-medium">
                Return to Bloomora Store
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F5] flex flex-col md:flex-row text-[#262626]">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-24 right-6 z-50 bg-[#3B172D] text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-[#B58A4B]/40 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-[#B58A4B]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Desktop Sidebar + Mobile Nav */}
      <PartnerNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingOrdersCount={pendingActionCount}
      />

      {/* Main Merchant Portal Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto space-y-6 w-full">
        {/* Top Hub Bar: Store Status, Open Toggle, Customer Switch */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFE8E4] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#3B172D] to-[#542141] text-[#E8C8C1] flex items-center justify-center font-serif text-lg font-bold shadow-sm">
              {profile.storeName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-base text-[#262626]">{profile.storeName}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8C8C1]/30 text-[#8A4F57] uppercase">
                  {profile.storeCategory}
                </span>
              </div>
              <p className="text-xs text-[#8B8B8B] flex items-center gap-2">
                <span>{profile.city} Hub</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#526D55] font-semibold">
                  <ShieldCheck className="w-3 h-3" /> Verified Merchant
                </span>
                <span>•</span>
                <span className="font-semibold text-[#B58A4B]">⭐ {profile.rating} / 5.0</span>
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5 w-full sm:w-auto">
            {/* Store Open / Paused Switch */}
            <button
              type="button"
              onClick={toggleStoreStatus}
              className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                profile.isOpen
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
              }`}
              title="Toggle Live Store Availability"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${profile.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span>{profile.isOpen ? 'Store Open: Taking Orders' : 'Store Paused: Vacation Mode'}</span>
            </button>

            {/* Merchant Sign Out */}
            <button
              type="button"
              onClick={() => {
                clearSellerAuthentication();
                setIsSellerAuthenticated(false);
                window.location.href = '/auth/login?role=seller';
              }}
              className="min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5"
              title="Sign Out of Merchant Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Header Hero Banner */}
            <div className="bg-gradient-to-r from-[#3B172D] via-[#4A1D39] to-[#2E1223] text-white rounded-3xl p-6 sm:p-8 border border-[#B58A4B]/30 shadow-sm relative overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-2">
                <span className="text-[10px] font-bold text-[#E8C8C1] uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Merchant Command Center
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold">
                  Welcome, {profile.ownerName}
                </h1>
                <p className="text-xs text-white/80 leading-relaxed">
                  Here is your real-time store overview. You have{' '}
                  <strong className="text-[#E8C8C1] underline font-bold">{pendingActionCount} order(s)</strong> awaiting preparation or dispatch today.
                </p>
              </div>

              <div className="relative z-10 flex flex-wrap gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="min-h-[42px] px-4 py-2 rounded-full bg-[#B58A4B] text-[#1B1816] text-xs font-bold hover:bg-white transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> View Active Orders ({pendingActionCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('add_product')}
                  className="min-h-[42px] px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold hover:bg-white/20 transition-all flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#E8C8C1]" /> Add New Gift Product
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('earnings')}
                  className="min-h-[42px] px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold hover:bg-white/20 transition-all flex items-center gap-1.5"
                >
                  <IndianRupee className="w-3.5 h-3.5 text-[#D4AF37]" /> Payouts & Ledger
                </button>
              </div>
            </div>

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-[#EFE8E4] shadow-xs space-y-1">
                <div className="flex items-center justify-between text-xs text-[#8B8B8B]">
                  <span>Net Revenue</span>
                  <div className="w-8 h-8 rounded-xl bg-[#526D55]/10 text-[#526D55] flex items-center justify-center">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#262626]">₹{netEarnings.toLocaleString('en-IN')}</h3>
                <span className="text-[10px] text-[#526D55] font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> After 10% platform fee
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#EFE8E4] shadow-xs space-y-1">
                <div className="flex items-center justify-between text-xs text-[#8B8B8B]">
                  <span>Total Orders</span>
                  <div className="w-8 h-8 rounded-xl bg-[#3B172D]/10 text-[#3B172D] flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#262626]">{totalOrdersCount} Orders</h3>
                <span className="text-[10px] text-[#8A4F57] font-semibold">
                  {deliveredOrdersCount} Successfully Completed
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#EFE8E4] shadow-xs space-y-1">
                <div className="flex items-center justify-between text-xs text-[#8B8B8B]">
                  <span>Pending Action</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#262626]">{pendingActionCount} Orders</h3>
                <span className="text-[10px] text-amber-700 font-semibold">
                  {newOrdersCount} New Got • {preparingOrdersCount} In Prep
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#EFE8E4] shadow-xs space-y-1">
                <div className="flex items-center justify-between text-xs text-[#8B8B8B]">
                  <span>Active Catalog</span>
                  <div className="w-8 h-8 rounded-xl bg-[#B58A4B]/10 text-[#8A6328] flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#262626]">{products.length} Products</h3>
                <span className="text-[10px] text-[#526D55] font-semibold">
                  {products.filter((p) => p.inStock).length} Live In-Stock
                </span>
              </div>
            </div>

            {/* Live Order Pipeline Kanban / Progress Counters */}
            <div className="bg-white rounded-3xl p-6 border border-[#EFE8E4] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F4E8E5] pb-3">
                <h2 className="font-serif text-lg font-bold text-[#262626] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#B58A4B]" />
                  Live Order Fulfillment Pipeline
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#D98C95] hover:underline"
                >
                  Manage All Orders →
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div
                  onClick={() => { setOrderStatusFilter('NEW'); setActiveTab('orders'); }}
                  className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 cursor-pointer hover:shadow-xs transition-all space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-amber-800">
                    <span>1. Got (New)</span>
                    <span className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-xs">
                      {newOrdersCount}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-700">Awaiting kitchen / crafting confirmation</p>
                </div>

                <div
                  onClick={() => { setOrderStatusFilter('PREPARING'); setActiveTab('orders'); }}
                  className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70 cursor-pointer hover:shadow-xs transition-all space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-blue-800">
                    <span>2. Preparing</span>
                    <span className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs">
                      {preparingOrdersCount}
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-700">Baking, crafting & packaging items</p>
                </div>

                <div
                  onClick={() => { setOrderStatusFilter('DISPATCHED'); setActiveTab('orders'); }}
                  className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/70 cursor-pointer hover:shadow-xs transition-all space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-purple-800">
                    <span>3. Dispatched</span>
                    <span className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-xs">
                      {dispatchedOrdersCount}
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-700">Handed to delivery rider or locker</p>
                </div>

                <div
                  onClick={() => { setOrderStatusFilter('DELIVERED'); setActiveTab('orders'); }}
                  className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 cursor-pointer hover:shadow-xs transition-all space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                    <span>4. Delivered</span>
                    <span className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center text-xs">
                      {deliveredOrdersCount}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700">Successfully completed & settled</p>
                </div>
              </div>
            </div>

            {/* Recent Orders Overview with Quick Actions */}
            <div className="bg-white rounded-3xl p-6 border border-[#EFE8E4] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F4E8E5] pb-3">
                <h2 className="font-serif text-lg font-bold text-[#262626]">Recent Orders Requiring Attention</h2>
                <span className="text-xs text-[#8B8B8B]">Auto-synced with live customer checkouts</span>
              </div>

              <div className="divide-y divide-[#F4E8E5]">
                {orders.slice(0, 4).map((order) => (
                  <div key={order.id} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#262626]">#{order.id}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            order.status === 'NEW'
                              ? 'bg-amber-100 text-amber-800'
                              : order.status === 'PREPARING'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'DISPATCHED'
                              ? 'bg-purple-100 text-purple-800'
                              : order.status === 'DELIVERED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="text-xs text-[#8B8B8B]">Target: {order.targetDeliveryTime}</span>
                      </div>
                      <p className="text-xs text-[#262626] font-medium">
                        <strong>{order.customerName}</strong> ({order.customerPhone}) • {order.items[0]?.name} x{order.items[0]?.quantity}
                      </p>
                      <p className="text-[11px] text-[#8B8B8B] truncate max-w-xl">
                        📍 {order.deliveryAddress}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <span className="font-bold text-sm text-[#262626] mr-2">₹{order.totalAmount}</span>

                      {order.status === 'NEW' && (
                        <button
                          type="button"
                          onClick={() => handleOrderStatusUpdate(order.id, 'PREPARING')}
                          className="min-h-[36px] px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                        >
                          Start Prep
                        </button>
                      )}

                      {order.status === 'PREPARING' && (
                        <button
                          type="button"
                          onClick={() => handleOrderStatusUpdate(order.id, 'DISPATCHED')}
                          className="min-h-[36px] px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors"
                        >
                          Dispatch
                        </button>
                      )}

                      {order.status === 'DISPATCHED' && (
                        <button
                          type="button"
                          onClick={() => handleOrderStatusUpdate(order.id, 'DELIVERED')}
                          className="min-h-[36px] px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                        >
                          Mark Delivered
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedOrderForInvoice(order)}
                        className="min-h-[36px] px-2.5 py-1.5 rounded-xl bg-[#F4E8E5] text-[#262626] hover:bg-[#E9C9C7] text-xs font-bold transition-colors"
                        title="Print Packing Slip / Invoice"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT (GOT, PENDING, DISPATCHED, DELIVERED) */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F4E8E5] pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#B58A4B] uppercase tracking-widest block">
                  Store Fulfillment Control
                </span>
                <h1 className="font-serif text-2xl font-bold text-[#262626]">Orders Management</h1>
              </div>

              <div className="text-xs text-[#8B8B8B]">
                Total Orders in System: <strong className="text-[#262626]">{orders.length}</strong>
              </div>
            </div>

            {/* Search and Status Pills */}
            <div className="bg-white rounded-2xl p-4 border border-[#EFE8E4] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[#8B8B8B] absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by ID, customer name, phone, address..."
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl pl-10 pr-3 py-2 text-xs text-[#262626] outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                {[
                  { key: 'all', label: 'All Orders', count: orders.length },
                  { key: 'NEW', label: 'Got (New)', count: newOrdersCount },
                  { key: 'PREPARING', label: 'Preparing', count: preparingOrdersCount },
                  { key: 'DISPATCHED', label: 'Dispatched', count: dispatchedOrdersCount },
                  { key: 'DELIVERED', label: 'Delivered', count: deliveredOrdersCount },
                  { key: 'CANCELLED', label: 'Cancelled', count: orders.filter((o) => o.status === 'CANCELLED').length },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setOrderStatusFilter(tab.key as any)}
                    className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      orderStatusFilter === tab.key
                        ? 'bg-[#3B172D] text-white shadow-xs'
                        : 'bg-[#F4E8E5] text-[#746E68] hover:text-[#262626]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="text-[10px] opacity-75 font-normal">({tab.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Feed */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-xs text-[#8B8B8B] border border-[#EFE8E4] space-y-2">
                <ShoppingBag className="w-10 h-10 text-[#D9D4CE] mx-auto" />
                <p className="font-bold text-sm text-[#262626]">No orders match this filter.</p>
                <p>Orders placed by customers on Bloomora will immediately show up here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EFE8E4] shadow-xs space-y-4"
                  >
                    {/* Top Row: Ref, Status, Delivery Time */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4E8E5] pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-base text-[#262626]">#{order.id}</span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                            order.status === 'NEW'
                              ? 'bg-amber-100 text-amber-800'
                              : order.status === 'PREPARING'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'DISPATCHED'
                              ? 'bg-purple-100 text-purple-800'
                              : order.status === 'DELIVERED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="text-[11px] text-[#8B8B8B] hidden sm:inline">
                          Placed: {order.orderTime}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-700" />
                          Delivery Target: {order.targetDeliveryTime}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedOrderForInvoice(order)}
                          className="p-1.5 text-xs text-[#746E68] hover:text-[#262626] rounded-lg hover:bg-[#F4E8E5]"
                          title="Print Packing Slip"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Middle Section: Customer & Delivery Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#262626]">
                      <div className="space-y-1.5 bg-[#FFFDFC] p-3.5 rounded-2xl border border-[#F4E8E5]">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#B58A4B] block">
                          Customer Information
                        </span>
                        <p className="font-bold text-sm text-[#262626]">{order.customerName}</p>
                        <div className="flex items-center gap-3 text-[#746E68]">
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="flex items-center gap-1 text-[#3B172D] hover:underline font-semibold"
                          >
                            <Phone className="w-3 h-3" /> {order.customerPhone}
                          </a>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {order.customerEmail}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 bg-[#FFFDFC] p-3.5 rounded-2xl border border-[#F4E8E5]">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#B58A4B] block">
                          Delivery Destination & Channel
                        </span>
                        <p className="text-[#262626] font-medium flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#D98C95] shrink-0 mt-0.5" />
                          {order.deliveryAddress}
                        </p>
                        <div className="pt-1 flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#3B172D]/10 text-[#3B172D]">
                            {order.fulfillmentType === 'meet_me_there'
                              ? `Meet Me There Locker (${order.lockerNumber || 'Smart Locker'})`
                              : 'Hyperlocal Express Courier'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items List */}
                    <div className="space-y-2 border-t border-[#F4E8E5] pt-3">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[#746E68]">
                        Items to Prepare & Pack ({order.items.length})
                      </span>
                      <div className="divide-y divide-[#F4E8E5]/70">
                        {order.items.map((item) => (
                          <div key={item.id} className="py-2 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-xl object-cover border border-[#EFE8E4]"
                              />
                              <div>
                                <h4 className="font-bold text-[#262626]">{item.name}</h4>
                                <span className="text-[11px] text-[#746E68]">
                                  Qty: <strong>{item.quantity}</strong> • ₹{item.price} each
                                </span>
                                {item.selectedPackaging && (
                                  <span className="block text-[10px] text-[#B58A4B] font-semibold">
                                    Packaging: {item.selectedPackaging}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="font-bold text-sm text-[#262626]">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Custom Gift Message if present */}
                      {order.items.some((i) => i.customMessage) && (
                        <div className="p-3 rounded-2xl bg-[#FFF8F5] border border-[#E8C8C1]/50 text-xs text-[#262626] flex items-start gap-2.5">
                          <Gift className="w-4 h-4 text-[#D98C95] shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-[#8A4F57] block text-[11px]">Gift Greeting Note to Print:</strong>
                            <p className="italic text-[#262626]">
                              "{order.items.find((i) => i.customMessage)?.customMessage}"
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Special Instructions */}
                      {order.specialInstructions && (
                        <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/50 text-xs text-amber-900">
                          <strong>Buyer Note:</strong> {order.specialInstructions}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-[#F4E8E5] pt-4">
                      <div>
                        <span className="text-xs text-[#746E68]">Total Order Value:</span>
                        <h4 className="font-bold text-lg text-[#262626]">₹{order.totalAmount}</h4>
                      </div>

                      <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
                        <span className="text-xs text-[#746E68] font-bold mr-1">Advance Status:</span>

                        {order.status === 'NEW' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOrderStatusUpdate(order.id, 'PREPARING')}
                              className="min-h-[40px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" /> Accept & Start Prep
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOrderStatusUpdate(order.id, 'CANCELLED')}
                              className="min-h-[40px] px-3 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold transition-all"
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {order.status === 'PREPARING' && (
                          <button
                            type="button"
                            onClick={() => handleOrderStatusUpdate(order.id, 'DISPATCHED')}
                            className="min-h-[40px] px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                          >
                            <Package className="w-3.5 h-3.5" /> Ready & Hand Over to Courier
                          </button>
                        )}

                        {order.status === 'DISPATCHED' && (
                          <button
                            type="button"
                            onClick={() => handleOrderStatusUpdate(order.id, 'DELIVERED')}
                            className="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Delivered to Customer
                          </button>
                        )}

                        {order.status === 'DELIVERED' && (
                          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Delivered & Completed
                          </span>
                        )}

                        {/* Direct Select Override */}
                        <select
                          value={order.status}
                          onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value as SellerOrderStatus)}
                          className="bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-2.5 py-2 text-xs font-bold text-[#262626] outline-none"
                        >
                          <option value="NEW">NEW</option>
                          <option value="PREPARING">PREPARING</option>
                          <option value="DISPATCHED">DISPATCHED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F4E8E5] pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#B58A4B] uppercase tracking-widest block">
                  Product Catalog
                </span>
                <h1 className="font-serif text-2xl font-bold text-[#262626]">Handcrafted Product Portfolio</h1>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('add_product')}
                className="min-h-[42px] px-4 py-2 rounded-full bg-[#3B172D] text-white text-xs font-bold hover:bg-[#1B1816] transition-colors flex items-center gap-2 shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-[#B58A4B]" /> + Add New Product
              </button>
            </div>

            {/* Search and Category Filter */}
            <div className="bg-white rounded-2xl p-4 border border-[#EFE8E4] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#8B8B8B] absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search catalog products..."
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl pl-10 pr-3 py-2 text-xs text-[#262626] outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'chocolate-bouquets', label: 'Chocolates' },
                  { key: 'flowers', label: 'Flowers' },
                  { key: 'gift-hampers', label: 'Hampers' },
                  { key: 'mini-gifts', label: 'Mini Gifts' },
                ].map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setProductCategoryFilter(c.key)}
                    className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      productCategoryFilter === c.key
                        ? 'bg-[#3B172D] text-white'
                        : 'bg-[#F4E8E5] text-[#746E68] hover:text-[#262626]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-3xl p-5 border border-[#EFE8E4] shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="relative">
                      <img
                        src={prod.images[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600'}
                        alt={prod.name}
                        className="w-full h-48 rounded-2xl object-cover border border-[#EFE8E4]"
                      />
                      <span className="absolute top-3 right-3 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase bg-[#526D55] text-white shadow-xs">
                        {prod.inStock ? 'In Stock' : 'Paused'}
                      </span>
                      <span className="absolute bottom-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#3B172D]/90 text-white backdrop-blur-xs">
                        ⏱️ {prod.preparationTimeMinutes} min prep
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#B58A4B] uppercase tracking-wider block">
                        {prod.category}
                      </span>
                      <h3 className="font-bold text-sm text-[#262626] line-clamp-1">{prod.name}</h3>
                      <p className="text-xs text-[#8B8B8B] line-clamp-2">{prod.subtitle}</p>

                      <div className="flex items-center gap-2 pt-1">
                        <span className="font-bold text-base text-[#262626]">₹{prod.discountPrice || prod.price}</span>
                        {prod.discountPrice && (
                          <span className="text-xs text-[#8B8B8B] line-through">₹{prod.price}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stock counter & actions */}
                  <div className="pt-3 border-t border-[#F4E8E5] space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#8B8B8B]">Inventory Stock:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateProductStock(prod.id, Math.max(0, prod.inventory - 1))}
                          className="w-7 h-7 rounded-lg bg-[#F4E8E5] hover:bg-[#E9C9C7] flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="font-bold text-sm text-[#262626] min-w-[20px] text-center">
                          {prod.inventory}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateProductStock(prod.id, prod.inventory + 1)}
                          className="w-7 h-7 rounded-lg bg-[#F4E8E5] hover:bg-[#E9C9C7] flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => deleteProduct(prod.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>

                      <span className="text-[10px] text-[#526D55] font-semibold">
                        ⭐ {prod.rating} ({prod.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ADD PRODUCT STUDIO */}
        {activeTab === 'add_product' && (
          <form
            onSubmit={handleCreateProduct}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE8E4] shadow-xs space-y-6 max-w-4xl mx-auto"
          >
            <div className="border-b border-[#F4E8E5] pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#B58A4B] uppercase tracking-widest block">
                  Artisan Studio Creation
                </span>
                <h1 className="font-serif text-2xl font-bold text-[#262626]">Publish New Gift Item</h1>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className="text-xs font-bold text-[#746E68] hover:text-[#262626]"
              >
                Back to Catalog
              </button>
            </div>

            {productSubmitSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Product published successfully! Redirecting to catalog...</span>
              </div>
            )}

            {/* Visual Photo Selector & Presets */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#262626] block">Product Image & Live Preview</label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Enter image URL..."
                    className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#262626] outline-none"
                    required
                  />

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#746E68] uppercase">Or select one-click photo preset:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        {
                          name: 'Ferrero Bouquet',
                          url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600',
                        },
                        {
                          name: 'Blushing Roses',
                          url: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=600',
                        },
                        {
                          name: 'Luxury Hamper',
                          url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600',
                        },
                        {
                          name: 'Celebration Cake',
                          url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600',
                        },
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setNewImageUrl(preset.url)}
                          className="text-[11px] p-2 rounded-xl bg-[#F4E8E5] hover:bg-[#E9C9C7] text-[#262626] font-semibold text-center truncate transition-colors"
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border border-[#EFE8E4] rounded-2xl overflow-hidden bg-[#FFFDFC] p-2 flex flex-col items-center justify-center">
                  <img
                    src={newImageUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-xl border border-[#EFE8E4]"
                    onError={(e) => {
                      (e.target as any).src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600';
                    }}
                  />
                  <span className="text-[10px] text-[#8B8B8B] mt-1 font-medium">Customer Thumbnail Preview</span>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#262626]">Product Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Royal Belgian Truffle Bouquet"
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#262626] outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#262626]">Category *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#262626] outline-none"
                >
                  <option value="chocolate-bouquets">Chocolate Bouquets</option>
                  <option value="flowers">Fresh Flowers & Floral Boxes</option>
                  <option value="gift-hampers">Luxury Gift Hampers</option>
                  <option value="mini-gifts">Mini Gifts & Favors</option>
                  <option value="personalized">Custom & Personalized</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#262626]">Subtitle / Tagline</label>
              <input
                type="text"
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                placeholder="e.g. 18 Handcrafted pralines nested in soft velvet and gold organza"
                className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#262626] outline-none"
              />
            </div>

            {/* Pricing, Stock & Preparation */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#262626]">Regular Price (₹) *</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#262626] outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#262626]">Discount Price (₹)</label>
                <input
                  type="number"
                  value={newDiscountPrice}
                  onChange={(e) => setNewDiscountPrice(Number(e.target.value))}
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#262626] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#262626]">Initial Stock (Qty) *</label>
                <input
                  type="number"
                  value={newInventory}
                  onChange={(e) => setNewInventory(Number(e.target.value))}
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#262626] outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#262626]">Prep Time (Minutes)</label>
                <input
                  type="number"
                  value={newPrepTime}
                  onChange={(e) => setNewPrepTime(Number(e.target.value))}
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#262626] outline-none"
                />
              </div>
            </div>

            {/* Descriptions & Story */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#262626]">Product Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detail the materials, presentation, freshness guarantees..."
                  rows={3}
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#262626] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#262626]">Gift Emotion / Story</label>
                <textarea
                  value={newStory}
                  onChange={(e) => setNewStory(e.target.value)}
                  placeholder="Share the inspiration behind this artisan creation..."
                  rows={2}
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#262626] outline-none"
                />
              </div>
            </div>

            {/* Materials & Dimensions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#262626]">Materials / Inclusions</label>
                <input
                  type="text"
                  value={newMaterials}
                  onChange={(e) => setNewMaterials(e.target.value)}
                  placeholder="e.g. Belgian Dark Chocolate, Gold Wrappers, Keepsake Box"
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#262626] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#262626]">Package Dimensions</label>
                <input
                  type="text"
                  value={newDimensions}
                  onChange={(e) => setNewDimensions(e.target.value)}
                  placeholder="e.g. 25cm x 15cm x 10cm"
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#262626] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full min-h-[46px] bg-[#3B172D] text-white py-3 rounded-full text-xs font-bold hover:bg-[#1B1816] transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-[#B58A4B]" />
              Publish Handcrafted Product to Live Catalog
            </button>
          </form>
        )}

        {/* TAB 5: INVENTORY REPLENISHMENT */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F4E8E5] pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#B58A4B] uppercase tracking-widest block">
                  Stock Optimization
                </span>
                <h1 className="font-serif text-2xl font-bold text-[#262626]">Inventory & SKU Levels</h1>
              </div>

              <div className="flex gap-2">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {products.filter((p) => p.inventory > 5).length} Well Stocked
                </span>
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  {products.filter((p) => p.inventory <= 5 && p.inventory > 0).length} Low Stock
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#EFE8E4] shadow-xs overflow-hidden">
              <div className="p-4 border-b border-[#F4E8E5] flex items-center justify-between">
                <h3 className="font-serif font-bold text-sm text-[#262626]">Active Inventory Ledger</h3>
                <span className="text-xs text-[#8B8B8B]">Instant stock updates automatically persist</span>
              </div>

              <div className="divide-y divide-[#F4E8E5]">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-[#EFE8E4]"
                      />
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-[#B58A4B]">
                          {prod.category}
                        </span>
                        <h4 className="font-bold text-sm text-[#262626]">{prod.name}</h4>
                        <p className="text-xs text-[#8B8B8B]">
                          Price: ₹{prod.price} • Prep: {prod.preparationTimeMinutes} mins
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right sm:text-left mr-2">
                        <span className="text-[10px] text-[#8B8B8B] block uppercase font-bold">Stock Available</span>
                        <span
                          className={`font-bold text-base ${
                            prod.inventory === 0
                              ? 'text-rose-600'
                              : prod.inventory <= 5
                              ? 'text-amber-600'
                              : 'text-emerald-700'
                          }`}
                        >
                          {prod.inventory} Units
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-[#FFFDFC] border border-[#D9D4CE] p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => updateProductStock(prod.id, Math.max(0, prod.inventory - 5))}
                          className="px-2 py-1 rounded bg-[#F4E8E5] hover:bg-[#E9C9C7] text-xs font-bold text-[#262626]"
                          title="Reduce by 5"
                        >
                          -5
                        </button>
                        <button
                          type="button"
                          onClick={() => updateProductStock(prod.id, Math.max(0, prod.inventory - 1))}
                          className="w-7 h-7 rounded bg-[#F4E8E5] hover:bg-[#E9C9C7] text-xs font-bold text-[#262626]"
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          onClick={() => updateProductStock(prod.id, prod.inventory + 1)}
                          className="w-7 h-7 rounded bg-[#F4E8E5] hover:bg-[#E9C9C7] text-xs font-bold text-[#262626]"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => updateProductStock(prod.id, prod.inventory + 5)}
                          className="px-2 py-1 rounded bg-[#F4E8E5] hover:bg-[#E9C9C7] text-xs font-bold text-[#262626]"
                          title="Add 5"
                        >
                          +5
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: EARNINGS & SETTLEMENTS */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F4E8E5] pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#B58A4B] uppercase tracking-widest block">
                  Financial Ledger
                </span>
                <h1 className="font-serif text-2xl font-bold text-[#262626]">Store Earnings & Bank Settlements</h1>
              </div>

              <button
                type="button"
                onClick={() => {
                  setWithdrawalSuccessNotice(true);
                  showToast('Instant payout request submitted to bank');
                  setTimeout(() => setWithdrawalSuccessNotice(false), 3500);
                }}
                className="min-h-[42px] px-4 py-2 rounded-full bg-[#526D55] text-white text-xs font-bold hover:bg-[#3D5240] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <ArrowUpRight className="w-4 h-4" /> Request Instant Payout
              </button>
            </div>

            {withdrawalSuccessNotice && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Withdrawal payout request submitted! Your funds will reflect via IMPS within 2 hours.</span>
              </div>
            )}

            {/* 3 Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-[#EFE8E4] shadow-xs space-y-1">
                <span className="text-xs text-[#8B8B8B]">Gross Customer Orders</span>
                <h3 className="text-2xl font-bold text-[#262626]">₹{totalGrossRevenue.toLocaleString('en-IN')}</h3>
                <span className="text-[10px] text-[#746E68]">From {totalOrdersCount} orders placed</span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#EFE8E4] shadow-xs space-y-1">
                <span className="text-xs text-[#8B8B8B]">Bloomora Marketplace Fee ({profile.commissionRate}%)</span>
                <h3 className="text-2xl font-bold text-[#8A4F57]">- ₹{bloomoraFee.toLocaleString('en-IN')}</h3>
                <span className="text-[10px] text-[#746E68]">Covers payment gateway & logistics</span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#E8C8C1]/50 bg-gradient-to-br from-white to-[#FFF8F5] shadow-xs space-y-1">
                <span className="text-xs text-[#526D55] font-bold">Net Merchant Payout</span>
                <h3 className="text-2xl font-bold text-[#526D55]">₹{netEarnings.toLocaleString('en-IN')}</h3>
                <span className="text-[10px] text-[#526D55] font-semibold">Available for settlement</span>
              </div>
            </div>

            {/* Bank & UPI Configuration */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE8E4] shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#F4E8E5] pb-3">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#B58A4B]" />
                  <h3 className="font-serif font-bold text-base text-[#262626]">Direct Payout Banking Coordinates</h3>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Verified for NEFT / RTGS
                </span>
              </div>

              <form onSubmit={handleSaveBankDetails} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#262626]">Bank Account / IFSC</label>
                    <input
                      type="text"
                      value={profileForm.payoutBank}
                      onChange={(e) => setProfileForm({ ...profileForm, payoutBank: e.target.value })}
                      className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#262626] outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#262626]">UPI ID (Instant IMPS Settlement)</label>
                    <input
                      type="text"
                      value={profileForm.upiId}
                      onChange={(e) => setProfileForm({ ...profileForm, upiId: e.target.value })}
                      className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#262626] outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-[#8B8B8B]">
                    Settlements run automatically twice a week on <strong>Mondays and Thursdays at 11:00 AM IST</strong>.
                  </p>
                  <button
                    type="submit"
                    className="min-h-[40px] px-5 py-2 rounded-full bg-[#3B172D] text-white text-xs font-bold hover:bg-[#1B1816] transition-colors"
                  >
                    Save Payout Coordinates
                  </button>
                </div>
              </form>
            </div>

            {/* Past Settlement History Ledger */}
            <div className="bg-white rounded-3xl border border-[#EFE8E4] shadow-xs overflow-hidden">
              <div className="p-4 border-b border-[#F4E8E5]">
                <h3 className="font-serif font-bold text-sm text-[#262626]">Settlement Transaction History</h3>
              </div>

              <div className="divide-y divide-[#F4E8E5] text-xs">
                {[
                  { ref: 'SET-99120', date: 'Yesterday, 11:00 AM', amount: '₹3,450', mode: 'NEFT to HDFC Bank', status: 'Settled' },
                  { ref: 'SET-99084', date: '3 days ago', amount: '₹5,180', mode: 'UPI to surampalem@okhdfcbank', status: 'Settled' },
                  { ref: 'SET-98921', date: 'Last week', amount: '₹7,890', mode: 'NEFT to HDFC Bank', status: 'Settled' },
                ].map((s) => (
                  <div key={s.ref} className="p-4 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-[#262626]">#{s.ref}</span>
                      <p className="text-[#8B8B8B]">{s.date} • {s.mode}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm text-[#262626] block">{s.amount}</span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        {s.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PROFILE & STORE SETTINGS */}
        {activeTab === 'profile' && (
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE8E4] shadow-xs space-y-6 max-w-3xl mx-auto"
          >
            <div className="border-b border-[#F4E8E5] pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#B58A4B] uppercase tracking-widest block">
                  Merchant Identity
                </span>
                <h1 className="font-serif text-2xl font-bold text-[#262626]">Store Profile & Operating Settings</h1>
              </div>

              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Active Partner Studio
              </span>
            </div>

            {profileSavedNotice && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Store profile details updated successfully!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#262626]">Store Business Name</label>
                <input
                  type="text"
                  value={profileForm.storeName}
                  onChange={(e) => setProfileForm({ ...profileForm, storeName: e.target.value })}
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#262626] outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#262626]">Primary Contact Owner</label>
                <input
                  type="text"
                  value={profileForm.ownerName}
                  onChange={(e) => setProfileForm({ ...profileForm, ownerName: e.target.value })}
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#262626] outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#262626]">Support Phone Number</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#262626] outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#262626]">Notification Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#262626] outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#262626]">Workshop / Studio Physical Address</label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#262626] outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#262626]">City / Hub</label>
                <input
                  type="text"
                  value={profileForm.city}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#262626] outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#262626]">Operating Hours</label>
                <input
                  type="text"
                  value={profileForm.operatingHours}
                  onChange={(e) => setProfileForm({ ...profileForm, operatingHours: e.target.value })}
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#262626] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#262626]">Express Delivery Radius (km)</label>
                <input
                  type="number"
                  value={profileForm.deliveryRadiusKm}
                  onChange={(e) => setProfileForm({ ...profileForm, deliveryRadiusKm: Number(e.target.value) })}
                  className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-3.5 py-2.5 text-xs text-[#262626] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full min-h-[46px] bg-[#3B172D] text-white py-3 rounded-full text-xs font-bold hover:bg-[#1B1816] transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 text-[#B58A4B]" /> Save Store Profile Settings
            </button>
          </form>
        )}

        {/* TAB 8: SUPPORT & SELLER SLA */}
        {activeTab === 'support' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE8E4] shadow-xs space-y-6 max-w-3xl mx-auto">
            <div className="border-b border-[#F4E8E5] pb-4">
              <span className="text-[10px] font-bold text-[#B58A4B] uppercase tracking-widest block">
                Partner Assistance & Guidelines
              </span>
              <h1 className="font-serif text-2xl font-bold text-[#262626]">
                Merchant Standards & Seller Concierge
              </h1>
            </div>

            <div className="space-y-4 text-xs text-[#746E68] leading-relaxed">
              <div className="bg-[#FFFDFC] p-4 rounded-2xl border border-[#F4E8E5] space-y-1">
                <h3 className="font-bold text-sm text-[#262626]">1. Immediate Order Acceptance (SLA: 15 Mins)</h3>
                <p>
                  As soon as a new order arrives, click <strong>"Accept & Start Prep"</strong> within 15 minutes to guarantee swift courier pickup and happy customers.
                </p>
              </div>

              <div className="bg-[#FFFDFC] p-4 rounded-2xl border border-[#F4E8E5] space-y-1">
                <h3 className="font-bold text-sm text-[#262626]">2. Quality Packaging & Cold Chain</h3>
                <p>
                  Flowers must be water-stem wrapped, and chocolates must be packaged with cooling insulation to ensure pristine condition upon arrival.
                </p>
              </div>

              <div className="bg-[#FFFDFC] p-4 rounded-2xl border border-[#F4E8E5] space-y-1">
                <h3 className="font-bold text-sm text-[#262626]">3. Meet Me There Smart Locker Fulfillments</h3>
                <p>
                  For locker orders, deposit the packaged gift into the specified locker terminal and mark the order as <strong>"Dispatched"</strong>. The customer will receive their unlock OTP automatically.
                </p>
              </div>

              <div className="bg-[#FFF8F5] p-4 rounded-2xl border border-[#E8C8C1]/60 space-y-1 text-[#262626]">
                <h3 className="font-bold text-sm text-[#8A4F57]">Direct Merchant Helpline</h3>
                <p>
                  Need urgent help with an active order? Reach our 24/7 Seller Operations Desk at{' '}
                  <strong className="text-[#3B172D]">+91 94401 23456</strong> or email{' '}
                  <strong className="text-[#3B172D]">merchants@bloomora.com</strong>.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Printable Invoice / Packing Slip Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl border border-[#EFE8E4] relative animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setSelectedOrderForInvoice(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#F4E8E5] text-[#8B8B8B] hover:text-[#262626]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[#F4E8E5] pb-4 space-y-1">
              <span className="text-[10px] font-bold text-[#B58A4B] uppercase tracking-widest">
                Bloomora Merchant Dispatch Slip
              </span>
              <h2 className="font-serif text-xl font-bold text-[#262626]">
                Order Slip #{selectedOrderForInvoice.id}
              </h2>
              <p className="text-xs text-[#8B8B8B]">Store: {profile.storeName}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#FFFDFC] p-3 rounded-xl border border-[#F4E8E5]">
                <strong className="block text-[#262626]">Delivery To:</strong>
                <p className="font-bold text-sm text-[#262626]">{selectedOrderForInvoice.customerName}</p>
                <p className="text-[#746E68]">Phone: {selectedOrderForInvoice.customerPhone}</p>
                <p className="text-[#746E68]">{selectedOrderForInvoice.deliveryAddress}</p>
              </div>

              <div className="space-y-1">
                <strong className="block text-[#746E68] uppercase text-[10px]">Items Summary:</strong>
                {selectedOrderForInvoice.items.map((it) => (
                  <div key={it.id} className="flex justify-between py-1 border-b border-[#F4E8E5]">
                    <span>{it.name} (x{it.quantity})</span>
                    <span className="font-bold">₹{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-bold text-sm pt-2">
                <span>Total Amount:</span>
                <span>₹{selectedOrderForInvoice.totalAmount}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 min-h-[42px] bg-[#3B172D] text-white rounded-full text-xs font-bold hover:bg-[#1B1816] transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Dispatch Slip
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrderForInvoice(null)}
                className="px-5 min-h-[42px] bg-[#F4E8E5] text-[#262626] rounded-full text-xs font-bold hover:bg-[#E9C9C7] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

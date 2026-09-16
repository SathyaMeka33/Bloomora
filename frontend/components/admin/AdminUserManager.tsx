'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { FirestoreUserDoc } from '@/lib/types/models';
import { UserRole } from '@/lib/types';
import {
  Users,
  ShieldCheck,
  User,
  Store,
  Search,
  Filter,
  Ban,
  CheckCircle2,
  Lock,
  Loader2,
  RefreshCw,
} from 'lucide-react';

export default function AdminUserManager() {
  const [users, setUsers] = useState<FirestoreUserDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'partner' | 'admin'>('all');
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    if (!db) {
      // Demo mock dataset fallback if Firestore client offline
      setUsers([
        { uid: 'u-1', email: 'sriram@bloomora.com', displayName: 'Sriram Reddy', role: 'customer', rewardPoints: 450 },
        { uid: 'u-2', email: 'partner@bloomora.com', displayName: 'Rajahmundry Artisanal Shop', role: 'partner', rewardPoints: 1200 },
        { uid: 'u-[#3B172D]', email: 'admin@bloomora.com', displayName: 'Bloomora Admin', role: 'admin', rewardPoints: 5000 },
      ]);
      setLoading(false);
      return;
    }

    try {
      const colRef = collection(db, 'users');
      const snapshot = await getDocs(colRef);
      const list = snapshot.docs.map((docSnap) => ({ uid: docSnap.id, ...docSnap.data() } as FirestoreUserDoc));
      setUsers(list);
    } catch (err) {
      console.warn('Failed to load user accounts from Firestore:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (targetUid: string, newRole: UserRole) => {
    setUpdatingUid(targetUid);
    if (db) {
      try {
        const userRef = doc(db, 'users', targetUid);
        await updateDoc(userRef, { role: newRole, updatedAt: serverTimestamp() });
      } catch (err) {
        console.warn('Failed to update user role:', err);
      }
    }
    setUsers((prev) => prev.map((u) => (u.uid === targetUid ? { ...u, role: newRole } : u)));
    setUpdatingUid(null);
  };

  const filteredUsers = users.filter((u) => {
    const name = (u.displayName || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
    if (roleFilter !== 'all') return matchesSearch && u.role === roleFilter;
    return matchesSearch;
  });

  if (loading) {
    return <div className="text-center py-16 text-xs text-[#746E68]">Retrieving platform user accounts...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F4E8E5] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#B58A4B] uppercase tracking-widest block">
            Access Control & User Governance
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#1B1816]">
            Platform Users & Role Management
          </h1>
        </div>

        <button
          type="button"
          onClick={loadUsers}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-white border border-[#D9D4CE] text-xs font-bold text-[#1B1816] hover:bg-[#F4E8E5] flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4 text-[#B58A4B]" /> Refresh User List
        </button>
      </div>

      {/* Security Banner */}
      <div className="p-4 rounded-2xl bg-[#FFFDFC] border border-[#D9D4CE] text-xs text-[#746E68] flex items-center gap-3">
        <Lock className="w-5 h-5 text-[#B58A4B] shrink-0" />
        <span>Authentication Security Policy: User credentials and passwords are strictly protected by Firebase Auth and are never exposed to client interfaces.</span>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E9C9C7]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#746E68] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email address..."
            className="w-full bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl pl-10 pr-3 py-2 text-xs text-[#1B1816]"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {(['all', 'customer', 'partner', 'admin'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-colors uppercase ${
                roleFilter === r
                  ? 'bg-[#3B172D] text-[#FFFDFC]'
                  : 'bg-[#F4E8E5] text-[#746E68] hover:text-[#1B1816]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-[#E9C9C7]/40 shadow-xs overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#746E68] space-y-1">
            <Users className="w-8 h-8 text-[#D9D4CE] mx-auto" />
            <p>No user accounts match current search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4E8E5]/60 border-b border-[#E9C9C7]/40 text-[#746E68] uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4">User Identity</th>
                  <th className="py-3.5 px-4">Email Address</th>
                  <th className="py-3.5 px-4">Assigned Role</th>
                  <th className="py-3.5 px-4">Reward Points</th>
                  <th className="py-3.5 px-4">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4E8E5] text-[#1B1816]">
                {filteredUsers.map((u) => {
                  const isUpdating = updatingUid === u.uid;
                  return (
                    <tr key={u.uid}>
                      <td className="py-4 px-4 font-bold">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#3B172D] text-[#FFFDFC] font-bold text-xs flex items-center justify-center">
                            {(u.displayName || u.email || 'U').substring(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-[#1B1816] block">{u.displayName || 'Bloomora User'}</span>
                            <span className="text-[10px] text-[#746E68] font-mono">UID: {u.uid}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-[11px]">{u.email || 'N/A'}</td>

                      <td className="py-4 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                            u.role === 'admin'
                              ? 'bg-[#3B172D] text-[#B58A4B]'
                              : u.role === 'partner'
                              ? 'bg-[#B58A4B]/20 text-[#3B172D]'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-bold text-[#526D55]">
                        {u.rewardPoints ?? 0} pts
                      </td>

                      <td className="py-4 px-4">
                        <select
                          disabled={isUpdating}
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.uid, e.target.value as UserRole)}
                          className="bg-[#FFFDFC] border border-[#D9D4CE] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#1B1816]"
                        >
                          <option value="customer">customer</option>
                          <option value="partner">partner</option>
                          <option value="admin">admin</option>
                        </select>
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

/**
 * useReminders — Full CRUD reminders via Django API
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useBloomoraAuth } from './useBloomoraAuth';

export interface Reminder {
  id: number;
  recipient_name: string;
  relationship: string;
  occasion: string;
  reminder_date: string;
  days_before: number;
  budget?: number;
  notes?: string;
  is_active: boolean;
  days_until?: number;
}

export function useReminders() {
  const { isLoggedIn } = useBloomoraAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      const { reminderApiService } = await import('@/lib/api');
      const data = await reminderApiService.getReminders();
      // Compute days_until for UI
      const now = new Date();
      const withDays = (Array.isArray(data) ? data : (data as { results?: unknown[] }).results || []).map((r: unknown) => {
        const rem = r as Reminder;
        const target = new Date(rem.reminder_date);
        const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return { ...rem, days_until: diff };
      });
      setReminders(withDays as Reminder[]);
    } catch { /* silent */ } finally { setLoading(false); }
  }, [isLoggedIn]);

  useEffect(() => { load(); }, [load]);

  const create = useCallback(async (data: Omit<Reminder, 'id' | 'is_active' | 'days_until'>) => {
    setSaving(true);
    try {
      const { reminderApiService } = await import('@/lib/api');
      await reminderApiService.createReminder(data as unknown as Parameters<typeof reminderApiService.createReminder>[0]);
      await load();
      return true;
    } catch { return false; } finally { setSaving(false); }
  }, [load]);

  const update = useCallback(async (id: number, data: Partial<Reminder>) => {
    setSaving(true);
    try {
      const { reminderApiService } = await import('@/lib/api');
      await reminderApiService.updateReminder(id, data as unknown as Parameters<typeof reminderApiService.updateReminder>[1]);
      await load();
      return true;
    } catch { return false; } finally { setSaving(false); }
  }, [load]);

  const remove = useCallback(async (id: number) => {
    try {
      const { reminderApiService } = await import('@/lib/api');
      await reminderApiService.deleteReminder(id);
      setReminders(prev => prev.filter(r => r.id !== id));
    } catch { /* silent */ }
  }, []);

  return { reminders, loading, saving, create, update, remove, reload: load };
}

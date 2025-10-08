import { useState, useEffect, useCallback } from 'react';
import type { HistoryRecord } from '@/lib/types';
import { getHistory, saveToHistory } from '@/lib/db';
import { getTodayString, calculateStreak } from '@/lib/utils';

interface UseReadingHistoryReturn {
  history: HistoryRecord[];
  streak: number;
  loading: boolean;
  addRecord: (date: string, charCount: number, sections?: string[]) => Promise<void>;
  hasReadToday: boolean;
}

export function useReadingHistory(): UseReadingHistoryReturn {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const records = await getHistory();
        setHistory(records);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const streak = calculateStreak(history);

  const today = getTodayString();
  const hasReadToday = history.some(record => record.date === today && record.completed);

  const addRecord = useCallback(async (date: string, charCount: number, sections?: string[]) => {
    const newRecord: HistoryRecord = {
      date,
      charCount,
      sections,
      timestamp: Date.now(),
      completed: true,
    };

    try {
      await saveToHistory(newRecord);
      const updatedHistory = await getHistory();
      setHistory(updatedHistory);
    } catch (err) {
      console.error('Failed to add history record:', err);
      throw err;
    }
  }, []);

  return {
    history,
    streak,
    loading,
    addRecord,
    hasReadToday,
  };
}
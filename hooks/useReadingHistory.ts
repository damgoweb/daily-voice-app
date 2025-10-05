import { useState, useEffect, useCallback } from 'react';
import type { HistoryRecord } from '@/lib/types';
import { getTodayString, calculateStreak } from '@/lib/utils';

interface UseReadingHistoryReturn {
  history: HistoryRecord[];
  streak: number;
  loading: boolean;
  addRecord: (date: string, charCount: number, sections?: string[]) => Promise<void>;
  hasReadToday: boolean;
}

/**
 * 朗読履歴を管理するカスタムフック
 * 
 * Phase 1では仮実装（メモリ内のみ）
 * Phase 2でIndexedDBと統合
 */
export function useReadingHistory(): UseReadingHistoryReturn {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 履歴の読み込み（Phase 2でIndexedDBから取得）
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        // TODO: Phase 2でIndexedDBから読み込み
        // const records = await historyDB.getAll();
        // setHistory(records);
        
        // Phase 1: LocalStorageから読み込み（仮実装）
        const stored = localStorage.getItem('reading_history');
        if (stored) {
          const parsed = JSON.parse(stored);
          setHistory(parsed);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  // 連続日数を計算
  const streak = calculateStreak(history);

  // 今日読んだかチェック
  const today = getTodayString();
  const hasReadToday = history.some(record => record.date === today && record.completed);

  // 記録を追加
  const addRecord = useCallback(async (date: string, charCount: number, sections?: string[]) => {
    const newRecord: HistoryRecord = {
      date,
      charCount,
      sections,
      timestamp: Date.now(),
      completed: true,
    };

    try {
      // TODO: Phase 2でIndexedDBに保存
      // await historyDB.add(newRecord);

      // Phase 1: LocalStorageに保存（仮実装）
      const updatedHistory = [...history, newRecord];
      setHistory(updatedHistory);
      localStorage.setItem('reading_history', JSON.stringify(updatedHistory));

    } catch (err) {
      console.error('Failed to add history record:', err);
      throw err;
    }
  }, [history]);

  return {
    history,
    streak,
    loading,
    addRecord,
    hasReadToday,
  };
}
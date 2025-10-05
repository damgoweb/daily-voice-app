import { useState, useEffect, useCallback } from 'react';
import type { DailyReading } from '@/lib/types';
import { getTodayString } from '@/lib/utils';

interface UseDailyReadingReturn {
  data: DailyReading | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * 毎日の朗読データを取得するカスタムフック
 */
export function useDailyReading(date?: string): UseDailyReadingReturn {
  const [data, setData] = useState<DailyReading | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const targetDate = date || getTodayString();

  const fetchData = useCallback(async (force: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        date: targetDate,
      });

      if (force) {
        params.append('force', 'true');
      }

      const response = await fetch(`/api/daily-reading?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'データの取得に失敗しました');
      }

      const result = await response.json();
      setData(result);

    } catch (err) {
      console.error('Failed to fetch daily reading:', err);
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [targetDate]);

  // 初回データ取得
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 強制更新関数
  const refresh = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
  };
}
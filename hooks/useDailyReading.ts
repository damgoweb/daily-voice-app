import { useState, useEffect, useCallback } from 'react';
import type { DailyReading } from '@/lib/types';
import { getTodayString } from '@/lib/utils';
import { getCachedReading, cacheReading } from '@/lib/db';

interface UseDailyReadingReturn {
  data: DailyReading | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDailyReading(date?: string): UseDailyReadingReturn {
  const [data, setData] = useState<DailyReading | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const targetDate = date || getTodayString();

  const fetchData = useCallback(async (force: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      // キャッシュをチェック（強制更新でない場合）
      if (!force) {
        const cached = await getCachedReading(targetDate);
        if (cached) {
          console.log('Using cached data for', targetDate);
          setData(cached.data);
          setLoading(false);
          return;
        }
      }

      // APIから取得
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

      // キャッシュに保存
      await cacheReading(targetDate, result);

    } catch (err) {
      console.error('Failed to fetch daily reading:', err);
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [targetDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
import { useState, useEffect, useCallback } from 'react';
import type { UserSettings, FontSize } from '@/lib/types';

interface UseSettingsReturn {
  settings: UserSettings;
  loading: boolean;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
}

/**
 * デフォルト設定
 */
const DEFAULT_SETTINGS: UserSettings = {
  fontSize: 'medium',
  darkMode: false,
  enabledSources: {
    wikipedia: true,
    news: true,
    government: true,
    fallback: false,
  },
  maxCharCount: 500,
  notificationEnabled: false,
};

/**
 * ユーザー設定を管理するカスタムフック
 * 
 * Phase 1では仮実装（LocalStorage）
 * Phase 2でIndexedDBと統合
 */
export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);

  // 設定の読み込み
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        // TODO: Phase 2でIndexedDBから読み込み
        // const storedSettings = await settingsDB.get('user_settings');
        
        // Phase 1: LocalStorageから読み込み（仮実装）
        const stored = localStorage.getItem('user_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        } else {
          setSettings(DEFAULT_SETTINGS);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // 設定の更新
  const updateSettings = useCallback(async (updates: Partial<UserSettings>) => {
    const newSettings = { ...settings, ...updates };

    try {
      // TODO: Phase 2でIndexedDBに保存
      // await settingsDB.put('user_settings', newSettings);

      // Phase 1: LocalStorageに保存（仮実装）
      localStorage.setItem('user_settings', JSON.stringify(newSettings));
      setSettings(newSettings);

    } catch (err) {
      console.error('Failed to update settings:', err);
      throw err;
    }
  }, [settings]);

  return {
    settings,
    loading,
    updateSettings,
  };
}
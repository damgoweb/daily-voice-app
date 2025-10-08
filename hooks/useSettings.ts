import { useState, useEffect, useCallback } from 'react';
import type { UserSettings, FontSize } from '@/lib/types';
import { getSetting, saveSetting } from '@/lib/db';

interface UseSettingsReturn {
  settings: UserSettings;
  loading: boolean;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
}

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

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const storedSettings = await getSetting<UserSettings>('user_settings', DEFAULT_SETTINGS);
        setSettings(storedSettings);
      } catch (err) {
        console.error('Failed to load settings:', err);
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = useCallback(async (updates: Partial<UserSettings>) => {
    const newSettings = { ...settings, ...updates };

    try {
      await saveSetting('user_settings', newSettings);
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
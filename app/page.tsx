'use client';

import { useState } from 'react';
import { useDailyReading } from '@/hooks/useDailyReading';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { useSettings } from '@/hooks/useSettings';
import { ReadingDisplay } from '@/components/ReadingDisplay';
import { StatsCards } from '@/components/StatsCards';
import { ActionButtons } from '@/components/ActionButtons';
import { SettingsPanel } from '@/components/SettingsPanel';
import { CalendarView } from '@/components/CalendarView';
import { getTodayString } from '@/lib/utils';

type View = 'home' | 'calendar';

export default function Home() {
  const { data, loading, error, refresh } = useDailyReading();
  const { history, streak, addRecord, hasReadToday } = useReadingHistory();
  const { settings, updateSettings } = useSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');

  // ローディング状態
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー状態
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2 text-gray-900">エラーが発生しました</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => refresh()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              再試行
            </button>
          </div>
        </div>
      </div>
    );
  }

  // データなし状態
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <p className="text-gray-600">データがありません</p>
        </div>
      </div>
    );
  }

  // 「読んだ」ボタンのハンドラ
  const handleMarkAsRead = async () => {
    try {
      await addRecord(
        data.date,
        data.totalCharCount,
        data.sections.map(s => s.source)
      );
      alert('記録しました');
    } catch (err) {
      console.error('Failed to mark as read:', err);
      alert('記録に失敗しました');
    }
  };

  return (
    <div className={`min-h-screen ${settings.darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-purple-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto p-6 pb-24">
        {/* ヘッダー */}
        <header className="text-center mb-8 relative">
          <h1 className="text-4xl font-bold mb-2">音読日和</h1>
          <p className="text-sm opacity-70">毎日の朗読習慣</p>
          
          {/* 設定ボタン */}
          <button
            onClick={() => setShowSettings(true)}
            className="absolute top-0 right-0 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="設定"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {currentView === 'home' && (
            <div className="mt-4 flex items-center justify-center gap-4 text-sm">
              <div>
                <span className="font-bold text-2xl text-blue-500">{streak}</span>
                <span className="ml-1">日連続</span>
              </div>
              <div className="text-xs opacity-60">
                {getTodayString()}
              </div>
            </div>
          )}
        </header>

        {/* コンテンツ */}
        {currentView === 'home' ? (
          <>
            {/* 統計カード */}
            <div className="mb-6">
              <StatsCards
                totalCharCount={data.totalCharCount}
                sectionCount={data.sections.length}
                historyCount={history.length}
                darkMode={settings.darkMode}
              />
            </div>

            {/* 朗読コンテンツ */}
            <div className="mb-6">
              <ReadingDisplay
                sections={data.sections}
                totalCharCount={data.totalCharCount}  // ← この行を追加
                fontSize={settings.fontSize}
                darkMode={settings.darkMode}
              />
            </div>

            {/* アクションボタン */}
            <ActionButtons
              onRefresh={refresh}
              onMarkAsRead={handleMarkAsRead}
              hasReadToday={hasReadToday}
              loading={loading}
            />

            {/* デバッグ情報 */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-yellow-100 rounded text-xs">
                <div>Cached: {data.cached ? 'Yes' : 'No'}</div>
                <div>Timestamp: {data.timestamp}</div>
                {data.errors && (
                  <div className="mt-2 text-red-600">
                    Errors: {JSON.stringify(data.errors)}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <CalendarView
            history={history}
            darkMode={settings.darkMode}
            onDateSelect={(date) => {
              console.log('Selected date:', date);
            }}
          />
        )}
      </div>

      {/* ナビゲーションバー */}
      <nav className={`fixed bottom-0 left-0 right-0 ${settings.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t shadow-lg`}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setCurrentView('home')}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
                currentView === 'home'
                  ? 'bg-blue-500 text-white'
                  : settings.darkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs">ホーム</span>
            </button>
            <button
              onClick={() => setCurrentView('calendar')}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
                currentView === 'calendar'
                  ? 'bg-blue-500 text-white'
                  : settings.darkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs">カレンダー</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 設定パネル */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onUpdate={updateSettings}
          onClose={() => setShowSettings(false)}
          darkMode={settings.darkMode}
        />
      )}
    </div>
  );
}
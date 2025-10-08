import type { HistoryRecord } from '@/lib/types';
import { useState } from 'react';

interface CalendarViewProps {
  history: HistoryRecord[];
  darkMode: boolean;
  onDateSelect?: (date: string) => void;
}

export function CalendarView({ history, darkMode, onDateSelect }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 現在の年月
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 月の最初の日と最後の日
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // 月の開始曜日（0: 日曜）
  const startDayOfWeek = firstDay.getDay();

  // 月の日数
  const daysInMonth = lastDay.getDate();

  // 履歴データを日付でマッピング
  const historyMap = new Map<string, HistoryRecord>();
  history.forEach(record => {
    historyMap.set(record.date, record);
  });

  // カレンダーグリッドの生成
  const calendarDays: (number | null)[] = [];
  
  // 前月の空白
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // 当月の日付
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // 前月・次月へ移動
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // 日付をクリック
  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (onDateSelect) {
      onDateSelect(dateStr);
    }
  };

  // 今日の日付
  const today = new Date();
  const isToday = (day: number) => {
    return (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    );
  };

  // 読んだ日かチェック
  const hasRead = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return historyMap.has(dateStr);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-xl p-6 shadow-lg`}>
      {/* ヘッダー: 年月と移動ボタン */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          ←
        </button>
        <h2 className="text-xl font-bold">
          {year}年 {month + 1}月
        </h2>
        <button
          onClick={goToNextMonth}
          className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          →
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-medium py-2 ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : ''
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const isCurrentDay = isToday(day);
          const hasReadThisDay = hasRead(day);

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-sm
                transition-colors relative
                ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                ${isCurrentDay ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              <span className={isCurrentDay ? 'font-bold' : ''}>{day}</span>
              {hasReadThisDay && (
                <div className="absolute bottom-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="mt-6 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>読了済み</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border-2 border-blue-500" />
          <span>今日</span>
        </div>
      </div>
    </div>
  );
}
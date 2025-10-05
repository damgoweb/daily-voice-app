'use client'

import { Sun, Moon } from 'lucide-react';

interface NavigationProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Navigation({ darkMode, onToggleDarkMode }: NavigationProps) {
  return (
    <nav className={`sticky top-0 z-50 ${
      darkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    } border-b shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              よむ日和
            </h1>
          </div>

          {/* 右側のアクション */}
          <div className="flex items-center gap-4">
            {/* ダークモード切替ボタン */}
            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              aria-label="ダークモード切替"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
import type { UserSettings, FontSize } from '@/lib/types';

interface SettingsPanelProps {
  settings: UserSettings;
  onUpdate: (updates: Partial<UserSettings>) => void;
  onClose: () => void;
  darkMode: boolean;
}

export function SettingsPanel({
  settings,
  onUpdate,
  onClose,
  darkMode,
}: SettingsPanelProps) {
  const fontSizes: { value: FontSize; label: string }[] = [
    { value: 'small', label: '小' },
    { value: 'medium', label: '中' },
    { value: 'large', label: '大' },
    { value: 'xlarge', label: '特大' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
      <div
        className={`${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        } rounded-xl shadow-2xl max-w-md w-full p-6`}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">設定</h2>
          <button
            onClick={onClose}
            className="text-2xl leading-none hover:opacity-70"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* フォントサイズ */}
          <div>
            <label className="block text-sm font-medium mb-3">
              フォントサイズ
            </label>
            <div className="grid grid-cols-4 gap-2">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => onUpdate({ fontSize: size.value })}
                  className={`py-2 px-4 rounded-lg transition-colors ${
                    settings.fontSize === size.value
                      ? 'bg-blue-500 text-white'
                      : darkMode
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* ダークモード */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">ダークモード</label>
            <button
              onClick={() => onUpdate({ darkMode: !settings.darkMode })}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.darkMode ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                  settings.darkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
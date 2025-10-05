interface StatsCardsProps {
  totalCharCount: number;
  sectionCount: number;
  historyCount: number;
  darkMode: boolean;
}

export function StatsCards({
  totalCharCount,
  sectionCount,
  historyCount,
  darkMode,
}: StatsCardsProps) {
  const cardClass = `${
    darkMode ? 'bg-gray-800' : 'bg-white'
  } rounded-xl p-4 shadow`;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className={cardClass}>
        <div className="text-xs opacity-70 mb-1">総文字数</div>
        <div className="text-2xl font-bold">{totalCharCount}</div>
      </div>
      <div className={cardClass}>
        <div className="text-xs opacity-70 mb-1">セクション</div>
        <div className="text-2xl font-bold">{sectionCount}</div>
      </div>
      <div className={cardClass}>
        <div className="text-xs opacity-70 mb-1">読書記録</div>
        <div className="text-2xl font-bold">{historyCount}</div>
      </div>
    </div>
  );
}
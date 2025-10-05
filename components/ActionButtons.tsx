interface ActionButtonsProps {
  onRefresh: () => void;
  onMarkAsRead: () => void;
  hasReadToday: boolean;
  loading?: boolean;
}

export function ActionButtons({
  onRefresh,
  onMarkAsRead,
  hasReadToday,
  loading = false,
}: ActionButtonsProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={onRefresh}
        disabled={loading}
        className="flex-1 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors disabled:opacity-50"
      >
        更新
      </button>
      <button
        onClick={onMarkAsRead}
        disabled={hasReadToday || loading}
        className="flex-1 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:bg-gray-400"
      >
        {hasReadToday ? '読了済み' : '読んだ'}
      </button>
    </div>
  );
}
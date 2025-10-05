// ============================================
// 基本型
// ============================================

/**
 * フォントサイズの種類
 */
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

/**
 * データソースの種類
 */
export type SourceType = 'wikipedia' | 'news' | 'government' | 'fallback';

/**
 * 公的機関の情報種類
 */
export type GovernmentType = 'weather' | 'health' | 'environment';

// ============================================
// データ型
// ============================================

/**
 * Wikipediaのアイテム
 */
export interface WikipediaItem {
  /** 年号（例: 1868） */
  year?: number;
  /** テキスト内容 */
  text: string;
  /** Wikipedia URL */
  url?: string;
}

/**
 * ニュースのアイテム
 */
export interface NewsItem {
  /** ニュース見出し */
  text: string;
  /** 記事URL */
  url?: string;
  /** 公開日時 */
  publishedAt?: string;
}

/**
 * 公的機関のアイテム
 */
export interface GovernmentItem {
  /** 本文 */
  text: string;
  /** 機関名（例: 気象庁） */
  agency: string;
  /** 情報種類 */
  type: GovernmentType;
}

/**
 * セクションアイテムの統合型
 */
export type SectionItem = WikipediaItem | NewsItem | GovernmentItem;

/**
 * 朗読セクション
 */
export interface Section {
  /** データソース */
  source: SourceType;
  /** セクションタイトル */
  title: string;
  /** アイテム配列 */
  items: SectionItem[];
  /** このセクションの文字数 */
  charCount: number;
  /** 出典情報 */
  attribution: string;
  /** 取得時刻（Unix timestamp） */
  fetchedAt?: number;
}

/**
 * 毎日の朗読データ
 */
export interface DailyReading {
  /** 日付（YYYY-MM-DD） */
  date: string;
  /** セクション配列 */
  sections: Section[];
  /** 総文字数 */
  totalCharCount: number;
  /** キャッシュからの読み込みか */
  cached: boolean;
  /** タイムスタンプ（ISO 8601） */
  timestamp: string;
  /** エラー情報（一部取得失敗時） */
  errors?: {
    wikipedia?: string;
    news?: string;
    government?: string;
  };
}

// ============================================
// キャッシュ型
// ============================================

/**
 * キャッシュされた朗読データ
 */
export interface CachedReading {
  /** 日付（YYYY-MM-DD） */
  date: string;
  /** 朗読データ */
  data: DailyReading;
  /** 保存時刻（Unix timestamp） */
  timestamp: number;
  /** 有効期限（Unix timestamp） */
  expiresAt: number;
}

// ============================================
// 履歴型
// ============================================

/**
 * 朗読履歴レコード
 */
export interface HistoryRecord {
  /** 日付（YYYY-MM-DD） */
  date: string;
  /** 読んだグループID（フォールバック時） */
  groupId?: string;
  /** 読んだセクション */
  sections?: string[];
  /** 読んだ文字数 */
  charCount: number;
  /** 記録時刻（Unix timestamp） */
  timestamp: number;
  /** 完了フラグ */
  completed: boolean;
}

// ============================================
// 設定型
// ============================================

/**
 * ユーザー設定
 */
export interface UserSettings {
  /** フォントサイズ */
  fontSize: FontSize;
  /** ダークモード */
  darkMode: boolean;
  /** 有効なデータソース */
  enabledSources: {
    wikipedia: boolean;
    news: boolean;
    government: boolean;
    fallback: boolean;
  };
  /** 1回の最大文字数 */
  maxCharCount: number;
  /** 通知時刻（Phase 2） */
  notificationTime?: string;
  /** 通知有効化（Phase 2） */
  notificationEnabled?: boolean;
}

/**
 * 設定レコード（IndexedDB用）
 */
export interface SettingRecord {
  /** 設定キー */
  key: string;
  /** 設定値 */
  value: unknown;
  /** 更新時刻（Unix timestamp） */
  updatedAt: number;
}

// ============================================
// 録音型（Phase 2）
// ============================================

/**
 * 録音データ
 */
export interface Recording {
  /** 録音ID（UUID） */
  id: string;
  /** 日付（YYYY-MM-DD） */
  date: string;
  /** 音声データ */
  blob: Blob;
  /** 録音時間（秒） */
  duration: number;
  /** 録音時刻（Unix timestamp） */
  timestamp: number;
  /** ファイルサイズ（bytes） */
  size: number;
}

// ============================================
// API型
// ============================================

/**
 * API基本レスポンス
 */
export interface APIResponse<T> {
  /** 成功フラグ */
  success: boolean;
  /** データ */
  data?: T;
  /** エラーメッセージ */
  error?: string;
  /** フォールバック使用フラグ */
  fallback?: boolean;
}

/**
 * 毎日の朗読API レスポンス
 */
export interface DailyReadingAPIResponse extends APIResponse<DailyReading> {
  /** 日付 */
  date: string;
  /** セクション配列 */
  sections: Section[];
  /** 総文字数 */
  totalCharCount: number;
  /** キャッシュフラグ */
  cached: boolean;
  /** タイムスタンプ */
  timestamp: string;
  /** エラー情報 */
  errors?: Record<string, string>;
}

// ============================================
// コンポーネントProps型
// ============================================

/**
 * ReadingDisplay コンポーネントのProps
 */
export interface ReadingDisplayProps {
  /** セクション配列 */
  sections: Section[];
  /** 総文字数 */
  totalCharCount: number;
  /** フォントサイズ */
  fontSize: FontSize;
  /** ダークモード */
  darkMode: boolean;
}

/**
 * Section コンポーネントのProps
 */
export interface SectionProps {
  /** セクションデータ */
  section: Section;
  /** ダークモード */
  darkMode: boolean;
}

/**
 * CalendarView コンポーネントのProps（Phase 2）
 */
export interface CalendarViewProps {
  /** 履歴レコード配列 */
  history: HistoryRecord[];
  /** ダークモード */
  darkMode: boolean;
}

/**
 * SettingsForm コンポーネントのProps（Phase 2）
 */
export interface SettingsFormProps {
  /** 現在の設定 */
  settings: UserSettings;
  /** 設定更新ハンドラ */
  onUpdate: (settings: Partial<UserSettings>) => void;
}

// ============================================
// フォールバックデータ型
// ============================================

/**
 * 朗読グループ（フォールバック用）
 */
export interface ReadingGroup {
  /** グループID */
  id: string;
  /** タイトル */
  title: string;
  /** カテゴリ */
  category: string;
  /** アイテム配列 */
  items: ReadingItem[];
  /** 表示タイプ */
  displayType: 'numbered' | 'paragraph';
}

/**
 * 朗読アイテム（フォールバック用）
 */
export interface ReadingItem {
  /** アイテムID */
  id: string;
  /** テキスト */
  text: string;
  /** 著者 */
  author: string;
  /** 出典 */
  source?: string;
}


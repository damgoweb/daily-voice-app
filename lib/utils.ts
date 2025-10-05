import type { HistoryRecord, Section, FontSize } from './types';

// ============================================
// 日付関連
// ============================================

/**
 * Dateオブジェクトを YYYY-MM-DD 形式にフォーマットする
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 今日の日付を YYYY-MM-DD 形式で取得する
 */
export function getTodayString(): string {
  return formatDate(new Date());
}

/**
 * 日付文字列から月と日を取得する
 */
export function getMonthDay(dateString: string): { month: number; day: number } {
  const date = new Date(dateString);
  return {
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

/**
 * 2つの日付が同じ日かチェックする
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDate(date1) === formatDate(date2);
}

// ============================================
// 連続日数計算
// ============================================

/**
 * 朗読履歴から連続日数を計算する
 */
export function calculateStreak(history: HistoryRecord[]): number {
  if (history.length === 0) {
    return 0;
  }

  // 日付の降順でソート
  const sortedHistory = [...history].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  let streak = 0;
  const checkDate = new Date();

  for (const record of sortedHistory) {
    const recordDate = formatDate(new Date(record.date));
    const expectedDate = formatDate(checkDate);

    if (recordDate === expectedDate) {
      streak++;
      // 前日をチェック
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // 連続が途切れた
      break;
    }
  }

  return streak;
}

// ============================================
// 文字数関連
// ============================================

/**
 * セクション配列から総文字数を計算する
 */
export function countTotalChars(sections: Section[]): number {
  return sections.reduce((total, section) => total + section.charCount, 0);
}

/**
 * テキストの文字数をカウントする
 */
export function countChars(text: string): number {
  return text.length;
}

/**
 * テキストの文字数が指定範囲内かチェックする
 */
export function isWithinCharRange(
  text: string,
  min: number,
  max: number
): boolean {
  const length = text.length;
  return length >= min && length <= max;
}

// ============================================
// スタイル関連
// ============================================

/**
 * フォントサイズからTailwind CSSクラスを取得する
 */
export function getFontSizeClass(fontSize: FontSize): string {
  switch (fontSize) {
    case 'small':
      return 'text-base';
    case 'medium':
      return 'text-lg';
    case 'large':
      return 'text-xl';
    case 'xlarge':
      return 'text-2xl';
    default:
      return 'text-lg';
  }
}

/**
 * クラス名を結合する（条件付き）
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ============================================
// データ変換
// ============================================

/**
 * 数値を3桁区切りの文字列に変換する
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ja-JP');
}

/**
 * バイト数を人間が読める形式に変換する
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// ============================================
// 配列操作
// ============================================

/**
 * 配列からランダムに要素を選択する
 */
export function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 配列からランダムにN個の要素を選択する
 */
export function pickRandomN<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * 配列をシャッフルする
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================
// 文字列操作
// ============================================

/**
 * テキストを指定文字数で切り詰める
 */
export function truncate(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + suffix;
}

/**
 * 文字列の最初の文字を大文字にする
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================
// 検証
// ============================================

/**
 * 日付文字列が有効なYYYY-MM-DD形式かチェックする
 */
export function isValidDateString(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * URLが有効かチェックする
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ============================================
// デバッグ用
// ============================================

/**
 * 開発環境かチェックする
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * 開発環境でのみログを出力する
 */
export function devLog(...args: unknown[]): void {
  if (isDevelopment()) {
    console.log('[DEV]', ...args);
  }
}

/**
 * エラーをログに出力する
 */
export function logError(error: unknown, context?: string): void {
  const message = context ? `[${context}]` : '';
  console.error(message, error);
}
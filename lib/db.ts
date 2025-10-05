import { openDB, IDBPDatabase } from 'idb';
import type {
  CachedReading,
  HistoryRecord,
  SettingRecord,
  Recording,
  DailyReading,
} from './types';

// ============================================
// データベース設定
// ============================================

const DB_NAME = 'DailyVoiceDB';
const DB_VERSION = 1;

// Object Store名
const STORES = {
  CACHE: 'reading_cache',
  HISTORY: 'reading_history',
  SETTINGS: 'user_settings',
  RECORDINGS: 'recordings', // Phase 2
} as const;

// ============================================
// データベース初期化
// ============================================

/**
 * IndexedDBを初期化する
 */
export async function initDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // 1. reading_cache ストア
      if (!db.objectStoreNames.contains(STORES.CACHE)) {
        const cacheStore = db.createObjectStore(STORES.CACHE, {
          keyPath: 'date',
        });
        cacheStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // 2. reading_history ストア
      if (!db.objectStoreNames.contains(STORES.HISTORY)) {
        const historyStore = db.createObjectStore(STORES.HISTORY, {
          keyPath: 'date',
        });
        historyStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // 3. user_settings ストア
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, {
          keyPath: 'key',
        });
      }

      // 4. recordings ストア（Phase 2）
      if (!db.objectStoreNames.contains(STORES.RECORDINGS)) {
        const recordingsStore = db.createObjectStore(STORES.RECORDINGS, {
          keyPath: 'id',
        });
        recordingsStore.createIndex('date', 'date', { unique: false });
        recordingsStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    },
  });
}

// ============================================
// 基本CRUD関数
// ============================================

/**
 * データを保存する
 */
export async function saveToDB<T>(
  storeName: string,
  data: T
): Promise<void> {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  await store.put(data);
  await tx.done;
}

/**
 * データを取得する
 */
export async function getFromDB<T>(
  storeName: string,
  key: string
): Promise<T | undefined> {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  return await store.get(key);
}

/**
 * すべてのデータを取得する
 */
export async function getAllFromDB<T>(storeName: string): Promise<T[]> {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  return await store.getAll();
}

/**
 * データを削除する
 */
export async function deleteFromDB(
  storeName: string,
  key: string
): Promise<void> {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  await store.delete(key);
  await tx.done;
}

/**
 * ストアを全削除する
 */
export async function clearStore(storeName: string): Promise<void> {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  await store.clear();
  await tx.done;
}

// ============================================
// キャッシュ専用関数
// ============================================

/**
 * 朗読データをキャッシュする
 */
export async function cacheReading(
  date: string,
  data: DailyReading
): Promise<void> {
  const now = Date.now();
  const cache: CachedReading = {
    date,
    data,
    timestamp: now,
    expiresAt: now + 24 * 60 * 60 * 1000, // 24時間後
  };

  await saveToDB(STORES.CACHE, cache);
}

/**
 * キャッシュされた朗読データを取得する
 */
export async function getCachedReading(
  date: string
): Promise<CachedReading | null> {
  const cache = await getFromDB<CachedReading>(STORES.CACHE, date);

  if (!cache) {
    return null;
  }

  // 有効期限チェック
  if (isExpired(cache)) {
    await deleteFromDB(STORES.CACHE, date);
    return null;
  }

  return cache;
}

/**
 * キャッシュが期限切れかチェックする
 */
export function isExpired(cache: CachedReading): boolean {
  return Date.now() > cache.expiresAt;
}

/**
 * 古いキャッシュを削除する（7日以上前）
 */
export async function cleanOldCache(): Promise<void> {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const allCache = await getAllFromDB<CachedReading>(STORES.CACHE);

  for (const cache of allCache) {
    if (cache.timestamp < sevenDaysAgo) {
      await deleteFromDB(STORES.CACHE, cache.date);
    }
  }
}

// ============================================
// 履歴専用関数
// ============================================

/**
 * 朗読履歴を保存する
 */
export async function saveToHistory(record: HistoryRecord): Promise<void> {
  await saveToDB(STORES.HISTORY, record);
}

/**
 * 朗読履歴を取得する
 */
export async function getHistory(): Promise<HistoryRecord[]> {
  const history = await getAllFromDB<HistoryRecord>(STORES.HISTORY);
  // 日付の降順でソート
  return history.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * 特定の日付の履歴を取得する
 */
export async function getHistoryByDate(
  date: string
): Promise<HistoryRecord | undefined> {
  return await getFromDB<HistoryRecord>(STORES.HISTORY, date);
}

/**
 * 履歴を削除する
 */
export async function deleteHistory(date: string): Promise<void> {
  await deleteFromDB(STORES.HISTORY, date);
}

// ============================================
// 設定専用関数
// ============================================

/**
 * 設定を保存する
 */
export async function saveSetting<T>(key: string, value: T): Promise<void> {
  const record: SettingRecord = {
    key,
    value,
    updatedAt: Date.now(),
  };
  await saveToDB(STORES.SETTINGS, record);
}

/**
 * 設定を取得する
 */
export async function getSetting<T>(
  key: string,
  defaultValue: T
): Promise<T> {
  const record = await getFromDB<SettingRecord>(STORES.SETTINGS, key);
  return record ? (record.value as T) : defaultValue;
}

/**
 * すべての設定を取得する
 */
export async function getAllSettings(): Promise<Record<string, unknown>> {
  const records = await getAllFromDB<SettingRecord>(STORES.SETTINGS);
  const settings: Record<string, unknown> = {};

  for (const record of records) {
    settings[record.key] = record.value;
  }

  return settings;
}

/**
 * 設定を削除する
 */
export async function deleteSetting(key: string): Promise<void> {
  await deleteFromDB(STORES.SETTINGS, key);
}

// ============================================
// 録音専用関数（Phase 2）
// ============================================

/**
 * 録音データを保存する
 */
export async function saveRecording(recording: Recording): Promise<void> {
  await saveToDB(STORES.RECORDINGS, recording);
}

/**
 * 録音データを取得する
 */
export async function getRecording(id: string): Promise<Recording | undefined> {
  return await getFromDB<Recording>(STORES.RECORDINGS, id);
}

/**
 * 特定の日付の録音データを取得する
 */
export async function getRecordingsByDate(date: string): Promise<Recording[]> {
  const db = await initDB();
  const tx = db.transaction(STORES.RECORDINGS, 'readonly');
  const store = tx.objectStore(STORES.RECORDINGS);
  const index = store.index('date');
  return await index.getAll(date);
}

/**
 * 録音データを削除する
 */
export async function deleteRecording(id: string): Promise<void> {
  await deleteFromDB(STORES.RECORDINGS, id);
}

// ============================================
// ユーティリティ関数
// ============================================

/**
 * データベース全体のサイズを取得する（概算）
 */
export async function getDBSize(): Promise<number> {
  let totalSize = 0;

  // 各ストアのデータサイズを計算
  const stores = [STORES.CACHE, STORES.HISTORY, STORES.SETTINGS, STORES.RECORDINGS];

  for (const storeName of stores) {
    const data = await getAllFromDB(storeName);
    const size = JSON.stringify(data).length;
    totalSize += size;
  }

  return totalSize;
}

/**
 * データベース全体をクリアする（開発用）
 */
export async function clearAllData(): Promise<void> {
  await clearStore(STORES.CACHE);
  await clearStore(STORES.HISTORY);
  await clearStore(STORES.SETTINGS);
  await clearStore(STORES.RECORDINGS);
}
import { NextRequest, NextResponse } from 'next/server';
import type { DailyReading, Section } from '@/lib/types';
import { getTodayString, countTotalChars } from '@/lib/utils';

/**
 * 統合API - 毎日の朗読データ取得
 * GET /api/daily-reading?date=2025-10-05&sources=wiki,news,gov&force=true
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // パラメータ取得
    const dateParam = searchParams.get('date');
    const sourcesParam = searchParams.get('sources');
    const forceParam = searchParams.get('force');
    
    const date = dateParam || getTodayString();
    const force = forceParam === 'true';
    
    // 有効なソースを決定（デフォルト: すべて）
    const enabledSources = {
      wiki: true,
      news: true,
      gov: true,
    };
    
    if (sourcesParam) {
      const sources = sourcesParam.split(',');
      enabledSources.wiki = sources.includes('wiki');
      enabledSources.news = sources.includes('news');
      enabledSources.gov = sources.includes('gov');
    }

    console.log('=== Daily Reading API ===');
    console.log('Date:', date);
    console.log('Enabled sources:', enabledSources);
    console.log('Force refresh:', force);

    // 各APIを並列で呼び出し
    const baseUrl = request.nextUrl.origin;
    const promises: Promise<{ source: string; data: Section | null }>[] = [];

    if (enabledSources.wiki) {
      promises.push(
        fetchWithFallback(
          `${baseUrl}/api/wikipedia?date=${date}`,
          'wikipedia'
        )
      );
    }

    if (enabledSources.news) {
      promises.push(
        fetchWithFallback(
          `${baseUrl}/api/news`,
          'news'
        )
      );
    }

    if (enabledSources.gov) {
      promises.push(
        fetchWithFallback(
          `${baseUrl}/api/government?type=weather&region=130000`,
          'government'
        )
      );
    }

    console.log('Fetching from', promises.length, 'sources...');

    // Promise.allSettled で並列取得（一部失敗しても継続）
    const results = await Promise.allSettled(promises);

    console.log('Fetch results:', results.map(r => r.status));

    // 成功したセクションを収集
    const sections: Section[] = [];
    const errors: Record<string, string> = {};

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.data) {
        sections.push(result.value.data);
      } else if (result.status === 'rejected') {
        console.error('Failed to fetch:', result.reason);
        errors['unknown'] = result.reason?.message || 'Unknown error';
      } else if (result.status === 'fulfilled' && !result.value.data) {
        errors[result.value.source] = 'データ取得に失敗しました';
      }
    }

    console.log('Successful sections:', sections.length);
    console.log('Errors:', Object.keys(errors).length);

    // セクションが1つも取得できなかった場合
    if (sections.length === 0) {
      console.warn('No sections available, using fallback');
      return NextResponse.json(
        {
          error: 'すべてのデータソースからの取得に失敗しました',
          details: 'フォールバックデータを使用してください',
          errors,
        },
        { status: 503 }
      );
    }

    // 総文字数を計算
    const totalCharCount = countTotalChars(sections);

    // DailyReadingレスポンスを構築
    const response: DailyReading = {
      date,
      sections,
      totalCharCount,
      cached: false,
      timestamp: new Date().toISOString(),
      ...(Object.keys(errors).length > 0 && { errors }),
    };

    console.log('=== Success ===');
    console.log('Sections:', sections.length);
    console.log('Total characters:', totalCharCount);
    console.log('Has errors:', Object.keys(errors).length > 0);

    return NextResponse.json(response);

  } catch (error) {
    console.error('=== Daily Reading API Error ===');
    console.error('Error:', error);
    
    return NextResponse.json(
      { 
        error: '毎日の朗読データを取得できませんでした',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * フェッチをエラーハンドリング付きで実行
 */
async function fetchWithFallback(
  url: string,
  source: string
): Promise<{ source: string; data: Section | null }> {
  try {
    console.log(`Fetching ${source}:`, url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'YomuBiyori/1.0',
      },
    });

    if (!response.ok) {
      console.error(`${source} fetch failed:`, response.status);
      return { source, data: null };
    }

    const data = await response.json();
    
    // エラーレスポンスの場合
    if (data.error) {
      console.error(`${source} returned error:`, data.error);
      return { source, data: null };
    }

    console.log(`${source} fetch success`);
    return { source, data };

  } catch (error) {
    console.error(`${source} fetch exception:`, error);
    return { source, data: null };
  }
}

/**
 * キャッシュチェック（Phase 2で実装）
 * 
 * 現在は常に新しいデータを取得するが、
 * 将来的にはIndexedDBやRedisでキャッシュを実装する
 */
async function checkCache(date: string): Promise<DailyReading | null> {
  // TODO: Phase 2でキャッシュ実装
  return null;
}

/**
 * キャッシュ保存（Phase 2で実装）
 */
async function saveCache(date: string, data: DailyReading): Promise<void> {
  // TODO: Phase 2でキャッシュ実装
  return;
}
import { NextRequest, NextResponse } from 'next/server';
import type { Section, WikipediaItem } from '@/lib/types';
import { getMonthDay, countChars } from '@/lib/utils';

/**
 * Wikipedia「今日は何の日」APIエンドポイント（日本語版対応）
 * GET /api/wikipedia?date=YYYY-MM-DD
 */
export async function GET(request: NextRequest) {
  try {
    // クエリパラメータから日付を取得
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get('date');
    
    // 日付の検証
    let targetDate: Date;
    if (dateParam) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dateParam)) {
        return NextResponse.json(
          { error: '不正な日付フォーマットです。YYYY-MM-DD形式で指定してください。' },
          { status: 400 }
        );
      }
      targetDate = new Date(dateParam);
    } else {
      targetDate = new Date();
    }

    // 月と日を取得
    const dateString = targetDate.toISOString().split('T')[0];
    const { month, day } = getMonthDay(dateString);

    console.log('=== Wikipedia API (Japanese) ===');
    console.log('Target date:', dateString);
    console.log('Month:', month, 'Day:', day);
    
    // 日本語版Wikipediaの日付記事を取得
    // 例: https://ja.wikipedia.org/wiki/10月6日
    const pageTitle = `${month}月${day}日`;
    const apiUrl = `https://ja.wikipedia.org/w/api.php`;
    const params = new URLSearchParams({
      action: 'parse',
      page: pageTitle,
      format: 'json',
      prop: 'text',
      section: '1', // 「できごと」セクション（通常はセクション1）
      origin: '*', // CORS対策
    });
    
    const fullUrl = `${apiUrl}?${params}`;
    console.log('API URL:', fullUrl);
    
    const response = await fetch(fullUrl, {
      headers: {
        'User-Agent': 'YomuBiyori/1.0 (https://github.com/damgoweb/daily-voice-app)',
        'Accept': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Wikipedia API error:', errorText);
      throw new Error(`Wikipedia API error: ${response.status}`);
    }

    const data = await response.json();
    
    // エラーチェック
    if (data.error) {
      throw new Error(`Wikipedia error: ${data.error.info}`);
    }

    // HTMLテキストを取得
    const htmlContent = data.parse?.text?.['*'];
    if (!htmlContent) {
      throw new Error('No content found');
    }

    console.log('HTML content length:', htmlContent.length);

    // HTMLから「できごと」を抽出
    const events = parseEventsFromHtml(htmlContent);
    console.log('Parsed events:', events.length);

    if (events.length === 0) {
      return NextResponse.json(
        { 
          error: 'この日の出来事が見つかりませんでした',
          details: `${month}月${day}日のデータが存在しません`
        },
        { status: 404 }
      );
    }

    // 日本関連の出来事を優先的に抽出
    const japanKeywords = [
      '日本', '天皇', '将軍', '幕府', '江戸', '東京', '京都', '大阪',
      '明治', '大正', '昭和', '平成', '令和',
      '戦国', '鎌倉', '室町', '安土', '桃山'
    ];

    // イベントを日本関連とその他に分類
    const japanEvents = events.filter(e => 
      e.text.length >= 15 && e.text.length <= 150 &&
      japanKeywords.some(keyword => e.text.includes(keyword))
    );

    const otherEvents = events.filter(e => 
      e.text.length >= 15 && e.text.length <= 150 &&
      !japanKeywords.some(keyword => e.text.includes(keyword))
    );

    console.log('Japan events:', japanEvents.length);
    console.log('Other events:', otherEvents.length);

    // 日本の出来事を優先して3件、残り2件をその他から
    const selectedEvents: WikipediaItem[] = [
      ...japanEvents.slice(0, 3).map(e => ({
        year: e.year,
        text: e.text,
        url: `https://ja.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`,
      })),
      ...otherEvents.slice(0, 2).map(e => ({
        year: e.year,
        text: e.text,
        url: `https://ja.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`,
      }))
    ];

    // 日本の出来事が少ない場合は、その他の出来事で補完
    if (selectedEvents.length < 5) {
      const additionalEvents = otherEvents
        .slice(2, 2 + (5 - selectedEvents.length))
        .map(e => ({
          year: e.year,
          text: e.text,
          url: `https://ja.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`,
        }));
      selectedEvents.push(...additionalEvents);
    }

    // 文字数制限を緩和しても5件に満たない場合
    if (selectedEvents.length < 3) {
      const fallbackEvents = events
        .slice(0, 5)
        .map(e => ({
          year: e.year,
          text: e.text,
          url: `https://ja.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`,
        }));
      selectedEvents.length = 0;
      selectedEvents.push(...fallbackEvents);
    }

    console.log('Selected events:', selectedEvents.length);

    // Sectionオブジェクトを構築
    const totalText = selectedEvents.map(e => e.text).join('');
    const charCount = countChars(totalText);

    const section: Section = {
      source: 'wikipedia',
      title: `今日は何の日（${month}月${day}日）`,
      items: selectedEvents,
      charCount,
      attribution: 'Wikipedia日本語版（CC-BY-SA）',
      fetchedAt: Date.now(),
    };

    console.log('=== Success ===');
    console.log('Total characters:', charCount);

    return NextResponse.json(section);

  } catch (error) {
    console.error('=== Wikipedia API Error ===');
    console.error('Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Wikipediaからデータを取得できませんでした',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * HTMLから「できごと」リストを抽出する
 */
function parseEventsFromHtml(html: string): Array<{ year?: number; text: string }> {
  const events: Array<{ year?: number; text: string }> = [];
  
  // <li>タグで囲まれた項目を抽出（es2015互換版）
  const liRegex = /<li>([\s\S]*?)<\/li>/g;
  let match;
  
  while ((match = liRegex.exec(html)) !== null) {
    let content = match[1];
    
    // HTMLタグを除去
    content = content.replace(/<[^>]+>/g, '');
    // HTMLエンティティをデコード
    content = content
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      // 数値文字参照をデコード（&#91; → [ など）
      .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
      // 脚注参照を削除
      .replace(/\[\d+\]/g, '');
    
    // 年号を抽出（例: 「1582年 - 」）
    const yearMatch = content.match(/^(\d+)年\s*[-–—]\s*(.+)/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1]);
      const text = yearMatch[2].trim();
      
      if (text.length > 5) {
        events.push({ year, text });
      }
    } else if (content.length > 5) {
      // 年号がない場合もテキストとして追加
      events.push({ text: content.trim() });
    }
  }
  
  return events;
}
import { NextRequest, NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import type { Section, NewsItem } from '@/lib/types';
import { countChars } from '@/lib/utils';

/**
 * NHKニュースRSS取得APIエンドポイント
 * GET /api/news
 */
export async function GET(request: NextRequest) {
  try {
    console.log('=== NHK News RSS API ===');
    
    // NHK主要ニュースのRSSフィード
    const rssUrl = 'https://www.nhk.or.jp/rss/news/cat0.xml';
    console.log('RSS URL:', rssUrl);
    
    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'OndokuBiyori/1.0 (https://github.com/damgoweb/daily-voice-app)',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`NHK RSS fetch error: ${response.status}`);
    }

    const xmlText = await response.text();
    console.log('XML length:', xmlText.length);

    // XMLをパース
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });

    const result = parser.parse(xmlText);
    
    // RSS構造を取得
    const channel = result.rss?.channel;
    if (!channel) {
      throw new Error('Invalid RSS structure');
    }

    const items = channel.item || [];
    if (!Array.isArray(items)) {
      throw new Error('No items in RSS feed');
    }

    console.log('Total RSS items:', items.length);

    // ニュース見出しを抽出（5〜7件）
    const newsItems: NewsItem[] = [];
    
    for (let i = 0; i < Math.min(items.length, 7); i++) {
      const item = items[i];
      const title = item.title || '';
      const link = item.link || '';
      const pubDate = item.pubDate || '';
      
      // 見出しの文字数チェック（10〜60文字程度）
      if (title.length >= 10 && title.length <= 60) {
        newsItems.push({
          text: title.trim(),
          url: link,
          publishedAt: pubDate,
        });
      }
      
      // 5件以上取得できたら終了
      if (newsItems.length >= 5) {
        break;
      }
    }

    // 5件に満たない場合は文字数制限を緩和
    if (newsItems.length < 5) {
      for (let i = 0; i < Math.min(items.length, 10); i++) {
        const item = items[i];
        const title = item.title || '';
        const link = item.link || '';
        const pubDate = item.pubDate || '';
        
        if (title.length > 0) {
          // 既に追加済みかチェック
          const exists = newsItems.some(n => n.text === title.trim());
          if (!exists) {
            newsItems.push({
              text: title.trim(),
              url: link,
              publishedAt: pubDate,
            });
          }
        }
        
        if (newsItems.length >= 7) {
          break;
        }
      }
    }

    console.log('Selected news items:', newsItems.length);

    if (newsItems.length === 0) {
      return NextResponse.json(
        { 
          error: 'ニュースデータが取得できませんでした',
          details: 'RSSフィードにニュース項目がありません'
        },
        { status: 404 }
      );
    }

    // 総文字数を計算
    const totalText = newsItems.map(n => n.text).join('');
    const charCount = countChars(totalText);

    // Sectionオブジェクトを構築
    const section: Section = {
      source: 'news',
      title: '今日のニュース',
      items: newsItems,
      charCount,
      attribution: 'NHKニュース',
      fetchedAt: Date.now(),
    };

    console.log('=== Success ===');
    console.log('Total characters:', charCount);

    return NextResponse.json(section);

  } catch (error) {
    console.error('=== NHK News RSS Error ===');
    console.error('Error:', error);
    
    return NextResponse.json(
      { 
        error: 'ニュースデータを取得できませんでした',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
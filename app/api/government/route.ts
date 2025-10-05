import { NextRequest, NextResponse } from 'next/server';
import type { Section, GovernmentItem, GovernmentType } from '@/lib/types';
import { countChars } from '@/lib/utils';

/**
 * 公的機関API（気象庁等）エンドポイント
 * GET /api/government?type=weather&region=130000
 */
export async function GET(request: NextRequest) {
  try {
    // クエリパラメータを取得
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'weather';
    const region = searchParams.get('region') || '130000'; // デフォルト: 東京都

    console.log('=== Government API ===');
    console.log('Type:', type);
    console.log('Region:', region);

    // typeに応じた処理
    if (type === 'weather') {
      return await getWeatherInfo(region);
    }

    // 将来の拡張: health, environment など
    return NextResponse.json(
      { 
        error: '未対応のtypeです',
        details: `type="${type}" は現在サポートされていません。現在は "weather" のみ対応。`
      },
      { status: 400 }
    );

  } catch (error) {
    console.error('=== Government API Error ===');
    console.error('Error:', error);
    
    return NextResponse.json(
      { 
        error: '公的機関データを取得できませんでした',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * 気象庁から天気概況を取得
 */
async function getWeatherInfo(regionCode: string): Promise<NextResponse> {
  try {
    // 気象庁天気予報API
    const apiUrl = `https://www.jma.go.jp/bosai/forecast/data/overview_forecast/${regionCode}.json`;
    console.log('Weather API URL:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'YomuBiyori/1.0 (https://github.com/damgoweb/daily-voice-app)',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Weather data received');

    // 天気概況テキストを取得
    const overview = data.text || '';
    
    if (!overview || overview.length === 0) {
      throw new Error('天気概況データが空です');
    }

    console.log('Overview length:', overview.length);

    // テキストを適切な長さに調整（50〜150文字程度）
    let text = overview.trim();
    
    // 改行を削除
    text = text.replace(/\n+/g, '');
    
    // 余分な空白を削除
    text = text.replace(/\s+/g, '');
    
    // 文が長すぎる場合は最初の文のみ抽出
    if (text.length > 150) {
      const sentences = text.split(/[。．]/);
      text = sentences[0] + '。';
    }

    // 短すぎる場合はもう少し追加
    if (text.length < 50 && text.length < overview.length) {
      const sentences = overview.trim().replace(/\n+/g, '').replace(/\s+/g, '').split(/[。．]/);
      text = sentences.slice(0, 2).join('。') + '。';
    }

    console.log('Final text length:', text.length);

    // GovernmentItemを作成
    const item: GovernmentItem = {
      text: text,
      agency: '気象庁',
      type: 'weather',
    };

    // 地域名を取得（あれば）
    const regionName = data.publishingOffice || data.targetArea || '関東地方';

    // Sectionオブジェクトを構築
    const section: Section = {
      source: 'government',
      title: `今日の天気（${regionName}）`,
      items: [item],
      charCount: countChars(text),
      attribution: '気象庁',
      fetchedAt: Date.now(),
    };

    console.log('=== Success ===');
    console.log('Text:', text.substring(0, 50) + '...');
    console.log('Character count:', section.charCount);

    return NextResponse.json(section);

  } catch (error) {
    console.error('=== Weather API Error ===');
    console.error('Error:', error);
    
    return NextResponse.json(
      { 
        error: '気象情報を取得できませんでした',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * 地域コード一覧（参考）
 * 
 * 主要地域:
 * - 011000: 北海道（宗谷地方）
 * - 016000: 北海道（札幌）
 * - 040000: 宮城県
 * - 130000: 東京都
 * - 140000: 神奈川県
 * - 230000: 愛知県
 * - 270000: 大阪府
 * - 400000: 福岡県
 * - 471000: 沖縄県（沖縄本島地方）
 * 
 * 詳細は気象庁のドキュメントを参照:
 * https://www.jma.go.jp/bosai/common/const/area.json
 */
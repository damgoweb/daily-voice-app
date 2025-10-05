import type { ReadingGroup, Section, DailyReading } from './types';
import { formatDate, countChars } from './utils';

// ============================================
// 青空文庫フォールバックデータ（MVP版：5グループ）
// ============================================

/**
 * 芭蕉の俳句 8選
 */
const HAIKU_BASHO: ReadingGroup = {
  id: 'haiku_basho',
  title: '芭蕉の俳句 8選',
  category: '俳句',
  displayType: 'numbered',
  items: [
    { id: 'h1', text: '古池や蛙飛び込む水の音', author: '松尾芭蕉', source: '俳句' },
    { id: 'h2', text: '閑さや岩にしみ入る蝉の声', author: '松尾芭蕉', source: '俳句' },
    { id: 'h3', text: '夏草や兵どもが夢の跡', author: '松尾芭蕉', source: '俳句' },
    { id: 'h4', text: 'ものいへば唇寂し秋の風', author: '松尾芭蕉', source: '俳句' },
    { id: 'h5', text: '秋深き隣は何をする人ぞ', author: '松尾芭蕉', source: '俳句' },
    { id: 'h6', text: 'この道や行く人なしに秋の暮', author: '松尾芭蕉', source: '俳句' },
    { id: 'h7', text: '旅に病んで夢は枯野をかけ廻る', author: '松尾芭蕉', source: '俳句' },
    { id: 'h8', text: '花の雲鐘は上野か浅草か', author: '松尾芭蕉', source: '俳句' },
  ],
};

/**
 * 夏目漱石 名文選
 */
const SOSEKI_SELECTIONS: ReadingGroup = {
  id: 'soseki',
  title: '夏目漱石 名文選',
  category: '文学',
  displayType: 'paragraph',
  items: [
    {
      id: 's1',
      text: '智に働けば角が立つ。情に棹させば流される。意地を通せば窮屈だ。とかくに人の世は住みにくい。',
      author: '夏目漱石',
      source: '草枕',
    },
    {
      id: 's2',
      text: '親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。',
      author: '夏目漱石',
      source: '坊っちゃん',
    },
    {
      id: 's3',
      text: '吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。',
      author: '夏目漱石',
      source: '吾輩は猫である',
    },
  ],
};

/**
 * 芥川龍之介 名文選
 */
const AKUTAGAWA_SELECTIONS: ReadingGroup = {
  id: 'akutagawa',
  title: '芥川龍之介 名文選',
  category: '文学',
  displayType: 'paragraph',
  items: [
    {
      id: 'a1',
      text: 'ある日の暮方の事である。一人の下人が、羅生門の下で雨やみを待っていた。広い門の下には、この男のほかに誰もいない。',
      author: '芥川龍之介',
      source: '羅生門',
    },
    {
      id: 'a2',
      text: '人生は一箱のマッチに似ている。重大に扱うのは馬鹿馬鹿しい。重大に扱わねば危険である。',
      author: '芥川龍之介',
      source: '侏儒の言葉',
    },
  ],
};

/**
 * 宮沢賢治 名文選
 */
const MIYAZAWA_SELECTIONS: ReadingGroup = {
  id: 'miyazawa',
  title: '宮沢賢治 名文選',
  category: '文学',
  displayType: 'paragraph',
  items: [
    {
      id: 'm1',
      text: '雨ニモマケズ 風ニモマケズ 雪ニモ夏ノ暑サニモマケヌ 丈夫ナカラダヲモチ 慾ハナク 決シテ瞋ラズ イツモシヅカニワラッテヰル',
      author: '宮沢賢治',
      source: '雨ニモマケズ',
    },
    {
      id: 'm2',
      text: 'なぜ、むしが光るか、おれは知らない。けれども、なんとなくわかるような気がするよ。',
      author: '宮沢賢治',
      source: '銀河鉄道の夜',
    },
    {
      id: 'm3',
      text: '風の又三郎が、ガラスのマントをひるがえして立っていました。',
      author: '宮沢賢治',
      source: '風の又三郎',
    },
  ],
};

/**
 * 近代文学 名場面
 */
const MODERN_LITERATURE: ReadingGroup = {
  id: 'modern',
  title: '近代文学 名場面',
  category: '文学',
  displayType: 'paragraph',
  items: [
    {
      id: 'mod1',
      text: '木曾路はすべて山の中である。あるところは岨づたいに行く崖の道であり、あるところは数十間の深さに臨む木曾川の岸であり、',
      author: '島崎藤村',
      source: '夜明け前',
    },
    {
      id: 'mod2',
      text: '国境の長いトンネルを抜けると雪国であった。夜の底が白くなった。信号所に汽車が止まった。',
      author: '川端康成',
      source: '雪国',
    },
    {
      id: 'mod3',
      text: '恥の多い生涯を送って来ました。自分には、人間の生活というものが、見当つかないのです。',
      author: '太宰治',
      source: '人間失格',
    },
    {
      id: 'mod4',
      text: 'メロスは激怒した。必ず、かの邪智暴虐の王を除かなければならぬと決意した。',
      author: '太宰治',
      source: '走れメロス',
    },
  ],
};

// ============================================
// フォールバックグループ配列
// ============================================

export const FALLBACK_GROUPS: ReadingGroup[] = [
  HAIKU_BASHO,
  SOSEKI_SELECTIONS,
  AKUTAGAWA_SELECTIONS,
  MIYAZAWA_SELECTIONS,
  MODERN_LITERATURE,
];

// ============================================
// ヘルパー関数
// ============================================

/**
 * ReadingGroupをSectionに変換する
 */
function convertGroupToSection(group: ReadingGroup): Section {
  const items = group.items.map((item) => ({
    text: item.text,
    author: item.author,
    source: item.source,
  }));

  const totalText = items.map((i) => i.text).join('');
  const charCount = countChars(totalText);

  return {
    source: 'fallback',
    title: group.title,
    items,
    charCount,
    attribution: '青空文庫より',
    fetchedAt: Date.now(),
  };
}

/**
 * ランダムにフォールバックグループを選択する
 */
export function getRandomFallback(): ReadingGroup {
  const index = Math.floor(Math.random() * FALLBACK_GROUPS.length);
  return FALLBACK_GROUPS[index];
}

/**
 * 日付ベースでフォールバックグループを選択する
 */
export function getFallbackForDate(date: Date): ReadingGroup {
  const dateStr = formatDate(date);
  // 日付文字列からハッシュ値を計算
  const hash = dateStr.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  const index = hash % FALLBACK_GROUPS.length;
  return FALLBACK_GROUPS[index];
}

/**
 * フォールバック用のDailyReadingデータを生成する
 */
export function generateFallbackReading(date?: Date): DailyReading {
  const targetDate = date || new Date();
  const dateStr = formatDate(targetDate);
  
  // 日付ベースでグループを選択
  const group = getFallbackForDate(targetDate);
  
  // GroupをSectionに変換
  const section = convertGroupToSection(group);
  
  return {
    date: dateStr,
    sections: [section],
    totalCharCount: section.charCount,
    cached: false,
    timestamp: new Date().toISOString(),
  };
}

/**
 * 複数のフォールバックグループを組み合わせる
 */
export function generateCombinedFallback(
  groupCount: number = 2
): DailyReading {
  const today = new Date();
  const dateStr = formatDate(today);
  
  // ランダムに複数のグループを選択
  const selectedGroups: ReadingGroup[] = [];
  const usedIndices = new Set<number>();
  
  while (selectedGroups.length < groupCount && usedIndices.size < FALLBACK_GROUPS.length) {
    const index = Math.floor(Math.random() * FALLBACK_GROUPS.length);
    if (!usedIndices.has(index)) {
      usedIndices.add(index);
      selectedGroups.push(FALLBACK_GROUPS[index]);
    }
  }
  
  // 各グループをSectionに変換
  const sections = selectedGroups.map(convertGroupToSection);
  
  // 総文字数を計算
  const totalCharCount = sections.reduce((sum, section) => {
    return sum + section.charCount;
  }, 0);
  
  return {
    date: dateStr,
    sections,
    totalCharCount,
    cached: false,
    timestamp: new Date().toISOString(),
  };
}

/**
 * すべてのフォールバックグループを取得する
 */
export function getAllFallbackGroups(): ReadingGroup[] {
  return FALLBACK_GROUPS;
}

/**
 * IDでフォールバックグループを取得する
 */
export function getFallbackGroupById(id: string): ReadingGroup | undefined {
  return FALLBACK_GROUPS.find((group) => group.id === id);
}
import type { WikipediaItem, FontSize } from '@/lib/types';
import { getFontSizeClass } from '@/lib/utils';

interface WikipediaSectionProps {
  items: WikipediaItem[];
  fontSize: FontSize;
  darkMode: boolean;
}

export function WikipediaSection({
  items,
  fontSize,
  darkMode,
}: WikipediaSectionProps) {
  const fontClass = getFontSizeClass(fontSize);

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="border-l-4 border-blue-500 pl-4"
        >
          {item.year && (
            <div className="text-sm font-bold text-blue-600 mb-1">
              {item.year}年
            </div>
          )}
          <p className={`leading-relaxed ${fontClass}`}>
            {item.text}
          </p>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline mt-2 inline-block"
            >
              詳しく見る
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
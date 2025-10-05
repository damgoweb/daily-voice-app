import type { NewsItem, FontSize } from '@/lib/types';
import { getFontSizeClass } from '@/lib/utils';

interface NewsSectionProps {
  items: NewsItem[];
  fontSize: FontSize;
  darkMode: boolean;
}

export function NewsSection({
  items,
  fontSize,
  darkMode,
}: NewsSectionProps) {
  const fontClass = getFontSizeClass(fontSize);

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="border-l-4 border-green-500 pl-4"
        >
          <p className={`leading-relaxed ${fontClass}`}>
            {item.text}
          </p>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-500 hover:underline mt-2 inline-block"
            >
              記事を読む
            </a>
          )}
          {item.publishedAt && (
            <div className="text-xs opacity-60 mt-1">
              {new Date(item.publishedAt).toLocaleString('ja-JP')}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
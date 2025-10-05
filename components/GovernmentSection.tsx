import type { GovernmentItem, FontSize } from '@/lib/types';
import { getFontSizeClass } from '@/lib/utils';

interface GovernmentSectionProps {
  items: GovernmentItem[];
  fontSize: FontSize;
  darkMode: boolean;
}

export function GovernmentSection({
  items,
  fontSize,
  darkMode,
}: GovernmentSectionProps) {
  const fontClass = getFontSizeClass(fontSize);

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="border-l-4 border-orange-500 pl-4"
        >
          <div className="text-sm font-bold text-orange-600 mb-2">
            {item.agency}
          </div>
          <p className={`leading-relaxed ${fontClass}`}>
            {item.text}
          </p>
          <a
            href="https://www.jma.go.jp/bosai/forecast/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-orange-500 hover:underline mt-2 inline-block"
          >
            気象庁の天気予報を見る
          </a>
        </div>
      ))}
    </div>
  );
}
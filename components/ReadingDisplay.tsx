import type { ReadingDisplayProps } from '@/lib/types';
import { WikipediaSection } from './WikipediaSection';
import { NewsSection } from './NewsSection';
import { GovernmentSection } from './GovernmentSection';

export function ReadingDisplay({
  sections,
  totalCharCount,
  fontSize,
  darkMode,
}: ReadingDisplayProps) {
  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <div
          key={index}
          className={`${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-xl p-6 shadow-lg`}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
            <span>{section.title}</span>
            <span className="text-sm font-normal opacity-60">
              {section.charCount}字
            </span>
          </h2>

          {section.source === 'wikipedia' && (
            <WikipediaSection
              items={section.items as import('@/lib/types').WikipediaItem[]}
              fontSize={fontSize}
              darkMode={darkMode}
            />
          )}

          {section.source === 'news' && (
            <NewsSection
              items={section.items as import('@/lib/types').NewsItem[]}
              fontSize={fontSize}
              darkMode={darkMode}
            />
          )}

          {section.source === 'government' && (
            <GovernmentSection
              items={section.items as import('@/lib/types').GovernmentItem[]}
              fontSize={fontSize}
              darkMode={darkMode}
            />
          )}

          <div className="mt-4 text-xs opacity-60">
            出典: {section.attribution}
          </div>
        </div>
      ))}
    </div>
  );
}
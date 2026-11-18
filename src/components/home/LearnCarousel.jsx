import React from 'react';
import { useTranslation } from 'react-i18next';
import { PlayIcon } from '../ui/Icons';

const CATEGORY_KEYS = {
  plastic: 'home_learn_cat_plastic',
  segregation: 'home_learn_cat_segregation',
  local: 'home_learn_cat_local',
};

function LearnCard({ item, onOpen }) {
  const { t } = useTranslation();
  const isVideo = item.kind === 'video';

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      aria-label={isVideo ? t('home_video_play_aria', { title: item.title }) : undefined}
      className="
        snap-start shrink-0 w-[236px] md:w-auto text-left flex flex-col overflow-hidden
        rounded-[24px] bg-white border border-border/60 shadow-card cursor-pointer press-scale
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
      "
    >
      <span className="relative block h-32 bg-primary-light">
        <img
          src={item.imageUrl}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />

        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/92 text-[11px] font-semibold text-primary-dark">
          {t(CATEGORY_KEYS[item.category])}
        </span>

        {isVideo && (
          <>
            <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <span className="w-11 h-11 rounded-full bg-white/92 text-primary shadow-card flex items-center justify-center pl-0.5">
                <PlayIcon className="w-5 h-5" />
              </span>
            </span>
            <span className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded-md bg-black/70 text-white text-[11px] font-semibold tabular">
              {item.duration}
            </span>
          </>
        )}
      </span>

      <span className="block p-3.5 space-y-1.5">
        <span className="block text-sm font-bold text-black leading-snug line-clamp-2">{item.title}</span>
        <span className="block text-xs text-muted">
          {isVideo
            ? t('home_learn_watch_time', { minutes: item.minutes })
            : t('home_learn_read_time', { minutes: item.minutes })}
        </span>
      </span>
    </button>
  );
}

/**
 * Learn highlights: snap-scrolling carousel on mobile, 2-column grid on desktop.
 * The scroll region is focusable so keyboard users can scroll it with the arrow keys,
 * and every card is a button reachable with Tab.
 */
export default function LearnCarousel({ items, onOpenItem }) {
  const { t } = useTranslation();

  return (
    <div
      role="region"
      aria-label={t('home_learn_carousel_aria')}
      tabIndex={0}
      className="
        flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-4 px-4 pb-3
        sm:-mx-6 sm:px-6 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 md:overflow-visible md:snap-none
        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-[24px]
      "
    >
      {items.map(item => (
        <LearnCard key={item.id} item={item} onOpen={onOpenItem} />
      ))}
    </div>
  );
}


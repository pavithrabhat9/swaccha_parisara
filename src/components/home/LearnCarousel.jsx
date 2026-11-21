import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PlayIcon, ChevronRightIcon } from '../ui/Icons';

const CATEGORY_KEYS = {
  plastic: 'home_learn_cat_plastic',
  segregation: 'home_learn_cat_segregation',
  local: 'home_learn_cat_local',
};

const QUICK_RESINS = [
  { num: '#1', name: 'PET', tone: 'bg-primary-light text-primary-dark' },
  { num: '#2', name: 'HDPE', tone: 'bg-primary-light text-primary-dark' },
  { num: '#5', name: 'PP', tone: 'bg-primary-light text-primary-dark' },
  { num: '#3–7', name: 'More', tone: 'bg-yellow-light text-yellow-dark' },
];

function QuickGuideCard({ item, onOpen }) {
  const { t } = useTranslation();
  const isVideo = item.kind === 'video';

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      aria-label={isVideo ? t('home_video_play_aria', { title: item.title }) : undefined}
      className="
        group snap-start shrink-0 w-[236px] md:w-full md:shrink text-left flex flex-col overflow-hidden
        rounded-2xl card-interactive cursor-pointer
      "
    >
      <span className="relative block h-32 bg-sunken overflow-hidden">
        <img
          src={item.imageUrl}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />

        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-white/92 glass text-[11px] font-bold text-ink shadow-xs">
          {t(CATEGORY_KEYS[item.category])}
        </span>

        {isVideo && (
          <>
            <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <span className="size-11 rounded-full bg-ink/80 text-white flex items-center justify-center pl-0.5 shadow-md">
                <PlayIcon className="size-4" />
              </span>
            </span>
            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-ink/80 text-white tabular text-[11px] font-bold">
              {item.duration}
            </span>
          </>
        )}
      </span>

      <span className="block p-3.5 space-y-1.5 flex-1">
        <span className="block text-sm font-bold text-ink leading-snug line-clamp-2 text-balance">
          {item.title}
        </span>
        <span className="block tabular text-xs font-medium text-muted">
          {isVideo
            ? t('home_learn_watch_time', { minutes: item.minutes })
            : t('home_learn_read_time', { minutes: item.minutes })}
        </span>
      </span>
    </button>
  );
}

/**
 * LearnCarousel — Warm consumer discovery banner for "Know your plastic"
 * paired with elevated photo Quick Guide cards.
 */
export default function LearnCarousel({ items, onOpenItem }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const openPlasticTypes = () => {
    navigate('/learn/plastic-types');
  };

  return (
    <div className="space-y-5">
      {/* 1. Expressive "Know your plastic" discovery card */}
      <div
        onClick={openPlasticTypes}
        className="rounded-2xl card-interactive p-5 space-y-4 cursor-pointer"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="text-base font-extrabold text-ink text-balance tracking-tight">
              {t('home_kyp_title')}
            </h3>
            <p className="text-xs text-muted text-pretty leading-relaxed">
              {t('home_kyp_subtitle')}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openPlasticTypes();
            }}
            className="min-h-9 px-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold inline-flex items-center gap-1 shrink-0 shadow-xs transition-colors duration-150 cursor-pointer"
          >
            <span>{t('home_kyp_explore')}</span>
            <ChevronRightIcon className="size-3.5" />
          </button>
        </div>

        {/* Friendly tactile plastic code tags (not a developer wireframe table) */}
        <div className="flex flex-wrap gap-2" aria-label="Common plastic recycling codes">
          {QUICK_RESINS.map(code => (
            <span
              key={code.num}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 ${code.tone}`}
            >
              <span className="tabular">{code.num}</span>
              <span>{code.name}</span>
            </span>
          ))}
        </div>
      </div>

      {/* 2. Quick guides — mobile horizontal snap carousel, desktop clean 2-col grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-ink text-balance">
          {t('home_quick_guides_title')}
        </h3>

        <div
          role="region"
          aria-label={t('home_quick_guides_title')}
          tabIndex={0}
          className="
            flex gap-3.5 overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-4 px-4 pb-2
            sm:-mx-6 sm:px-6 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 md:overflow-visible
            hide-scrollbar
          "
        >
          {items.map(item => (
            <QuickGuideCard key={item.id} item={item} onOpen={onOpenItem} />
          ))}
        </div>
      </div>
    </div>
  );
}

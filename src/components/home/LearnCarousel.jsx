import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PlayIcon, ChevronRightIcon } from '../ui/Icons';

const CATEGORY_KEYS = {
  plastic: 'home_learn_cat_plastic',
  segregation: 'home_learn_cat_segregation',
  local: 'home_learn_cat_local',
};

const RESIN_NUMBERS = [1, 2, 3, 4, 5, 6, 7];

/**
 * Original inline SVG illustration for the "Know your plastic" banner
 * (resin triangle + bottle + tub in brand palette: #38761d green, #ffffff white, #fab328 yellow).
 */
function KnowYourPlasticIllustration() {
  return (
    <svg width="88" height="80" viewBox="0 0 88 80" fill="none" aria-hidden="true">
      <ellipse cx="44" cy="73" rx="34" ry="4.5" fill="#38761d" opacity="0.14" />
      {/* Recycling triangle frame */}
      <path
        d="M44 10L72 58H16L44 10Z"
        fill="#ffffff"
        fillOpacity="0.7"
        stroke="#38761d"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Bottle & container inside */}
      <rect x="37" y="28" width="14" height="24" rx="4" fill="#38761d" />
      <rect x="41" y="22" width="6" height="7" rx="1.5" fill="#38761d" />
      <rect x="40" y="19" width="8" height="4" rx="1.5" fill="#fab328" />
      <text
        x="44"
        y="44"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="10"
        fontWeight="800"
        fontFamily="DM Sans, sans-serif"
      >
        1
      </text>
      <circle cx="68" cy="20" r="4.5" fill="#fab328" />
    </svg>
  );
}

function QuickGuideCard({ item, onOpen }) {
  const { t } = useTranslation();
  const isVideo = item.kind === 'video';

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      aria-label={isVideo ? t('home_video_play_aria', { title: item.title }) : undefined}
      className="
        snap-start shrink-0 w-[236px] text-left flex flex-col overflow-hidden
        rounded-2xl bg-white border border-border cursor-pointer press-scale
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

        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/95 text-[11px] font-semibold text-primary-dark">
          {t(CATEGORY_KEYS[item.category])}
        </span>

        {isVideo && (
          <>
            <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <span className="size-11 rounded-full bg-white/95 text-primary flex items-center justify-center pl-0.5">
                <PlayIcon className="size-5" />
              </span>
            </span>
            <span className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded-md bg-ink/80 text-white text-[11px] font-semibold tabular">
              {item.duration}
            </span>
          </>
        )}
      </span>

      <span className="block p-3.5 space-y-1.5 flex-1">
        <span className="block text-sm font-bold text-ink leading-snug line-clamp-2 text-balance">{item.title}</span>
        <span className="block text-xs text-muted tabular">
          {isVideo
            ? t('home_learn_watch_time', { minutes: item.minutes })
            : t('home_learn_read_time', { minutes: item.minutes })}
        </span>
      </span>
    </button>
  );
}

/**
 * Home Learn section:
 * 1. Featured banner "Know your plastic" (light green card, short text, original SVG, 1–7 circles, "Explore" button -> /learn/plastic-types)
 * 2. Horizontal snap-scrolling row "Quick guides"
 */
export default function LearnCarousel({ items, onOpenItem }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const openPlasticTypes = () => {
    navigate('/learn/plastic-types');
  };

  return (
    <div className="space-y-4">
      {/* 1. Featured banner: "Know your plastic" */}
      <div
        onClick={openPlasticTypes}
        className="rounded-2xl bg-primary-light border border-primary/15 p-5 cursor-pointer hover:bg-primary-light/90 transition-colors duration-150 space-y-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1.5">
            <h3 className="text-base font-extrabold text-ink text-balance">
              {t('home_kyp_title')}
            </h3>
            <p className="text-xs text-muted text-pretty leading-relaxed">
              {t('home_kyp_subtitle')}
            </p>
          </div>
          <div className="shrink-0 -mt-1">
            <KnowYourPlasticIllustration />
          </div>
        </div>

        {/* Row of 7 numbered circles (1 to 7) + "Explore" button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5" aria-label="Resin codes 1 to 7">
            {RESIN_NUMBERS.map(num => (
              <span
                key={num}
                className="size-7 rounded-full bg-white text-primary-dark border border-primary/20 text-xs font-extrabold tabular flex items-center justify-center"
              >
                {num}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openPlasticTypes();
            }}
            className="min-h-11 px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold inline-flex items-center gap-1 shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span>{t('home_kyp_explore')}</span>
            <ChevronRightIcon className="size-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Horizontal snap-scrolling row: "Quick guides" */}
      <div className="space-y-2.5">
        <h3 className="text-sm font-bold text-ink text-balance">
          {t('home_quick_guides_title')}
        </h3>

        <div
          role="region"
          aria-label={t('home_quick_guides_title')}
          tabIndex={0}
          className="
            flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-4 px-4 pb-3
            sm:-mx-6 sm:px-6 md:mx-0 md:px-0
            hide-scrollbar
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl
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

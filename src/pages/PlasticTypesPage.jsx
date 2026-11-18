import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  usePlasticTypes,
  PLASTIC_FILTER_OPTIONS,
  getPlasticCategory,
} from '../hooks/usePlasticTypes';
import Chip from '../components/ui/Chip';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { SkeletonCard } from '../components/ui/Skeleton';
import { ArrowLeftIcon } from '../components/ui/Icons';

const TAG_STYLES = {
  recyclable: {
    className: 'bg-primary-light text-primary-dark border-primary/25',
    dotClass: 'bg-primary',
    labelKey: 'kyp_tag_recyclable',
    answerKey: 'kyp_pickup_answer_yes',
  },
  special: {
    className: 'bg-yellow-light text-yellow-dark border-yellow/40',
    dotClass: 'bg-yellow',
    labelKey: 'kyp_tag_special',
    answerKey: 'kyp_pickup_answer_special',
  },
  not_recyclable: {
    className: 'bg-orange-red-light text-orange-red-dark border-orange-red/30',
    dotClass: 'bg-orange-red',
    labelKey: 'kyp_tag_not_recyclable',
    answerKey: 'kyp_pickup_answer_no',
  },
};

/**
 * PlasticTypesPage (/learn/plastic-types) — "Know your plastic"
 * Filter chips: All, Recyclable, Special handling, Not recyclable.
 * Renders resin codes 1 to 7 from `src/data/learnContent.js` in a 1-col mobile / 2-col desktop grid.
 */
export default function PlasticTypesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, loading, error, activeFilter, setActiveFilter, retry } = usePlasticTypes();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
      {/* Header: Back button + Page Title */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label={t('kyp_back')}
          className="min-h-[44px] -ml-2 px-2 text-xs font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>{t('kyp_back')}</span>
        </button>

        <div>
          <h1 className="text-xl font-extrabold text-black tracking-tight">
            {t('kyp_page_title')}
          </h1>
          <p className="text-xs text-muted mt-1">{t('kyp_page_subtitle')}</p>
        </div>
      </div>

      {/* Filter Chips: All, Recyclable, Special handling, Not recyclable */}
      <div
        role="tablist"
        aria-label={t('kyp_page_title')}
        className="flex flex-wrap items-center gap-2"
      >
        {PLASTIC_FILTER_OPTIONS.map(opt => (
          <Chip
            key={opt.id}
            selected={activeFilter === opt.id}
            onClick={() => setActiveFilter(opt.id)}
          >
            {t(opt.labelKey)}
          </Chip>
        ))}
      </div>

      {/* States & Resin Code Cards (1 column mobile, 2 columns desktop) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" aria-busy="true">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <ErrorState
          title={t('ui_error_default_title')}
          description={error}
          retryLabel={t('ui_error_try_again')}
          onRetry={retry}
        />
      ) : items.length === 0 ? (
        <EmptyState
          title={t('ui_empty_default_title')}
          description={t('ui_empty_default_description')}
          actionLabel={t('kyp_filter_all')}
          onAction={() => setActiveFilter('all')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map(plastic => {
            const category = getPlasticCategory(plastic.recyclable);
            const tag = TAG_STYLES[category];

            return (
              <article
                key={plastic.code}
                className="rounded-[24px] bg-white border border-border/70 shadow-card overflow-hidden flex flex-col"
              >
                {/* Top image + resin code number + category tag */}
                <div className="relative h-40 w-full bg-sunken">
                  <img
                    src={plastic.imageUrl}
                    alt={plastic.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                  {/* Resin code number badge (1 to 7) */}
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white text-black font-extrabold text-base tabular shadow-xs flex items-center justify-center">
                    #{plastic.code}
                  </div>

                  {/* Color-coded tag: green = recyclable, yellow = special handling, orange-red = not recyclable */}
                  <span
                    className={`absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${tag.className}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${tag.dotClass}`} aria-hidden="true" />
                    {t(tag.labelKey)}
                  </span>

                  {/* Name & full chemical name */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h2 className="text-base font-extrabold text-white leading-tight">
                      {plastic.name}
                    </h2>
                    <p className="text-xs text-white/85 truncate">{plastic.fullName}</p>
                  </div>
                </div>

                {/* Body: example items + "Can I put this in a pickup?" */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
                      {t('kyp_examples_label')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {plastic.examples.map(ex => (
                        <span
                          key={ex}
                          className="px-2.5 py-1 rounded-full bg-sunken border border-border text-xs font-medium text-black"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Short line: "Can I put this in a pickup?" */}
                  <div className="pt-3 border-t border-border-light space-y-1">
                    <p className="text-xs font-bold text-black">
                      {t('kyp_pickup_question')}
                    </p>
                    <p className="text-xs font-semibold text-primary-dark">
                      {t(tag.answerKey)}
                    </p>
                    <p className="text-[11px] text-muted leading-relaxed">
                      {plastic.tip}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}


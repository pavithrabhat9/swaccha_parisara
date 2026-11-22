import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  usePlasticTypes,
  PLASTIC_FILTER_OPTIONS,
  getPlasticCategory,
} from '../hooks/usePlasticTypes';
import Chip from '../components/ui/Chip';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import PageTopBar from '../components/layout/PageTopBar';
import { SkeletonCard } from '../components/ui/Skeleton';
import { cn } from '../utils/cn';

const TAG_STYLES = {
  recyclable: {
    className: 'bg-primary text-white shadow-xs',
    labelKey: 'kyp_tag_recyclable',
    answerKey: 'kyp_pickup_answer_yes',
  },
  special: {
    className: 'bg-yellow text-ink shadow-xs',
    labelKey: 'kyp_tag_special',
    answerKey: 'kyp_pickup_answer_special',
  },
  not_recyclable: {
    className: 'bg-orange-red text-white shadow-xs',
    labelKey: 'kyp_tag_not_recyclable',
    answerKey: 'kyp_pickup_answer_no',
  },
};

/**
 * PlasticTypesPage (/learn/plastic-types) — Warm, scannable consumer plastic guide.
 */
export default function PlasticTypesPage() {
  const { t } = useTranslation();
  const { items, loading, error, activeFilter, setActiveFilter, retry } = usePlasticTypes();

  return (
    <div>
      <PageTopBar title={t('kyp_page_title')} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
        <p className="text-sm text-muted text-pretty">{t('kyp_page_subtitle')}</p>

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
                className="rounded-2xl card-elevated overflow-hidden flex flex-col"
              >
                <div className="relative h-40 w-full bg-sunken">
                  <img
                    src={plastic.imageUrl}
                    alt={plastic.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />

                  <div className="absolute top-3 left-3 size-9 rounded-xl bg-white/95 glass text-ink tabular font-extrabold text-sm flex items-center justify-center shadow-xs">
                    #{plastic.code}
                  </div>

                  <span
                    className={cn(
                      'absolute top-3 right-3 inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold',
                      tag.className
                    )}
                  >
                    {t(tag.labelKey)}
                  </span>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h2 className="text-base font-extrabold text-white text-balance leading-tight">
                      {plastic.name}
                    </h2>
                    <p className="text-xs text-white/90 truncate mt-0.5">{plastic.fullName}</p>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-xs font-bold text-muted mb-2">
                      {t('kyp_examples_label')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {plastic.examples.map(ex => (
                        <span
                          key={ex}
                          className="px-2.5 py-1 rounded-lg bg-sunken text-xs font-semibold text-ink"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border-light space-y-1">
                    <p className="text-xs font-bold text-ink">
                      {t('kyp_pickup_question')}
                    </p>
                    <p
                      className={cn(
                        'text-xs font-bold',
                        category === 'recyclable'
                          ? 'text-primary'
                          : category === 'special'
                            ? 'text-yellow-dark'
                            : 'text-orange-red-dark'
                      )}
                    >
                      {t(tag.answerKey)}
                    </p>
                    <p className="text-xs text-muted text-pretty leading-relaxed pt-0.5">
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
    </div>
  );
}

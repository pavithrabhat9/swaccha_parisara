import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  usePlasticTypes,
  PLASTIC_FILTER_OPTIONS,
} from '../hooks/usePlasticTypes';
import { getPlasticAnchorId } from '../utils/plasticTypesUtils';
import PageTopBar from '../components/layout/PageTopBar';
import ResinCodeIcon from '../components/learn/ResinCodeIcon';
import Button from '../components/ui/Button';
import Chip from '../components/ui/Chip';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import Skeleton from '../components/ui/Skeleton';
import { ChevronRightIcon } from '../components/ui/Icons';
import { cn } from '../utils/cn';

const STATUS_META = {
  widely: {
    labelKey: 'kyp_status_widely',
    pillClass: 'bg-primary-light text-[#38761d] border border-[#38761d]/20',
  },
  sometimes: {
    labelKey: 'kyp_status_sometimes',
    pillClass: 'bg-yellow-light text-yellow-dark border border-yellow/35',
  },
  rarely: {
    labelKey: 'kyp_status_rarely',
    pillClass: 'bg-orange-red-light text-orange-red-dark border border-orange-red/25',
  },
};

function ArticleSkeleton({ label }) {
  return (
    <div className="space-y-8 py-6" aria-busy="true" aria-label={label}>
      <div className="space-y-3">
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-44" />
      </div>
      <div className="space-y-2.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 rounded-xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-52" />
          </div>
        </div>
        <Skeleton className="w-full aspect-[16/9] rounded-xl" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

/**
 * PlasticTypesPage (/learn/plastic-types) — Editorial article-style guide to resin codes 1 to 7.
 * Pure presentation layer: all state, filtering, deep-link scroll, and data fetching live in `usePlasticTypes`.
 */
export default function PlasticTypesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    guide,
    allTypes,
    items,
    loading,
    error,
    isOffline,
    activeFilter,
    setActiveFilter,
    activeCode,
    scrollToCode,
    goBack,
    retry,
  } = usePlasticTypes();

  return (
    <div className="min-h-dvh bg-cream">
      {/* 1. Reusable Top Bar: back arrow on left, "Learn" centered */}
      <PageTopBar
        as="span"
        title={t('kyp_topbar_title')}
        centeredTitle
        onBack={goBack}
        backAriaLabel={t('kyp_back')}
      />

      <div className="max-w-[720px] mx-auto px-4 sm:px-6 pt-6 pb-14">
        {loading ? (
          <ArticleSkeleton label={t('kyp_loading_aria')} />
        ) : error || !guide ? (
          <div className="py-8">
            <ErrorState
              title={t('ui_error_default_title')}
              description={t('ui_error_default_description')}
              retryLabel={t('ui_error_try_again')}
              onRetry={retry}
            />
          </div>
        ) : (
          <article className="space-y-8">
            {isOffline && (
              <p
                role="status"
                className="rounded-xl bg-sunken border border-border px-4 py-2.5 text-xs font-semibold text-muted"
              >
                {t('kyp_offline_note')}
              </p>
            )}

            {/* 2. Article Header */}
            <header className="space-y-3">
              <h1 className="font-[family-name:var(--font-brand)] text-[28px] sm:text-[34px] leading-[1.15] font-extrabold text-ink text-balance">
                {t('kyp_article_title')}
              </h1>
              <p className="text-base text-muted text-pretty leading-relaxed">
                {guide.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-1 text-xs font-semibold text-muted">
                <span>{t('kyp_byline')}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular">
                  {t('kyp_read_time', { minutes: guide.readTimeMinutes })}
                </span>
              </div>
            </header>

            {/* 3. Intro */}
            <div className="space-y-4 text-[15px] text-ink/90 leading-[1.65] text-pretty">
              {guide.introParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* 4. Background Section: Why plastics are numbered */}
            <section
              aria-labelledby="kyp-why-numbered"
              className="pt-6 border-t border-border space-y-4"
            >
              <h2
                id="kyp-why-numbered"
                className="font-[family-name:var(--font-brand)] text-xl font-bold text-ink text-balance"
              >
                {t('kyp_why_numbered_title')}
              </h2>
              <p className="text-[15px] text-ink/90 leading-[1.65] text-pretty">
                {guide.backgroundSection.body}
              </p>
              <div className="rounded-xl bg-white border border-border p-4 flex items-start gap-3.5">
                <span className="size-10 rounded-lg bg-sunken flex items-center justify-center shrink-0">
                  <ResinCodeIcon code={1} size={24} tone="dark" />
                </span>
                <p className="text-sm font-semibold text-ink text-pretty leading-snug">
                  {guide.backgroundSection.note}
                </p>
              </div>
            </section>

            {/* 5. Sticky Quick-Jump Row (7 Resin Codes) + Existing Filter Chips */}
            <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top,0px))] z-20 -mx-4 px-4 sm:-mx-6 sm:px-6 py-2.5 bg-cream/95 glass border-y border-border/80 space-y-2">
              <nav
                aria-label={t('kyp_quick_jump_aria')}
                className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1"
              >
                {allTypes.map((item) => {
                  const isCurrent = activeCode === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => scrollToCode(item.code)}
                      aria-current={isCurrent ? 'location' : undefined}
                      className={cn(
                        'min-h-11 px-3 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors duration-150',
                        isCurrent
                          ? 'bg-primary-light border-[#38761d]/40 text-[#38761d]'
                          : 'bg-white border-border text-ink hover:bg-sunken'
                      )}
                    >
                      <ResinCodeIcon
                        code={item.code}
                        size={20}
                        tone={isCurrent ? 'green' : 'dark'}
                      />
                      <span className="sr-only">
                        {t('kyp_resin_code_sr', { code: item.code })}{' '}
                      </span>
                      <span>{item.abbreviation}</span>
                    </button>
                  );
                })}
              </nav>

              <div
                role="group"
                aria-label={t('kyp_filter_aria')}
                className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1"
              >
                {PLASTIC_FILTER_OPTIONS.map((opt) => (
                  <Chip
                    key={opt.id}
                    size="lg"
                    selected={activeFilter === opt.id}
                    onClick={() => setActiveFilter(opt.id)}
                    className="shrink-0"
                  >
                    {t(opt.labelKey)}
                  </Chip>
                ))}
              </div>
            </div>

            {/* 6. Seven Plastic-Type Sections */}
            {items.length === 0 ? (
              <EmptyState
                title={t('ui_empty_default_title')}
                description={t('ui_empty_default_description')}
                actionLabel={t('kyp_filter_all')}
                onAction={() => setActiveFilter('all')}
              />
            ) : (
              <div className="divide-y divide-border">
                {items.map((plastic) => {
                  const statusMeta = STATUS_META[plastic.status] || STATUS_META.rarely;
                  const anchorId = getPlasticAnchorId(plastic.code);

                  return (
                    <section
                      key={plastic.code}
                      id={anchorId}
                      aria-labelledby={`${anchorId}-heading`}
                      className="py-8 first:pt-2 scroll-mt-52 space-y-5"
                    >
                      {/* Resin symbol + abbreviation + full name */}
                      <div className="flex items-start gap-3.5">
                        <div className="size-14 rounded-xl bg-white border border-border flex items-center justify-center shrink-0">
                          <ResinCodeIcon code={plastic.code} size={38} tone="green" />
                        </div>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <h2
                            id={`${anchorId}-heading`}
                            className="font-[family-name:var(--font-brand)] text-xl sm:text-2xl font-extrabold text-ink leading-tight text-balance"
                          >
                            <span className="sr-only">
                              {t('kyp_resin_code_sr', { code: plastic.code })}{' '}
                            </span>
                            {plastic.abbreviation}
                          </h2>
                          <p className="text-sm font-medium text-muted mt-0.5 text-pretty">
                            {plastic.fullName}
                          </p>
                        </div>
                      </div>

                      {/* Fixed 16:9 rounded image slot (zero layout shift) */}
                      <figure className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-sunken border border-border">
                        <img
                          src={plastic.imagePath}
                          alt={plastic.imageAlt}
                          loading="lazy"
                          width="960"
                          height="540"
                          className="w-full h-full object-cover"
                        />
                      </figure>

                      {/* What it is */}
                      <div className="space-y-1.5">
                        <h3 className="text-sm font-bold text-ink">
                          {t('kyp_what_it_is')}
                        </h3>
                        <p className="text-[15px] text-ink/90 leading-[1.65] text-pretty">
                          {plastic.whatItIs}
                        </p>
                      </div>

                      {/* Common examples */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-ink">
                          {t('kyp_common_examples')}
                        </h3>
                        <ul className="list-disc pl-5 space-y-1.5 text-[15px] text-ink/90 leading-snug">
                          {plastic.examples.map((ex) => (
                            <li key={ex}>{ex}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Recyclability */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-sm font-bold text-ink">
                            {t('kyp_recyclability')}
                          </h3>
                          <span
                            className={cn(
                              'inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold',
                              statusMeta.pillClass
                            )}
                          >
                            {t(statusMeta.labelKey)}
                          </span>
                        </div>
                        <p className="text-[15px] text-ink/90 leading-[1.6] text-pretty">
                          {plastic.recyclabilityExplanation}
                        </p>
                        <p className="text-xs font-medium text-muted text-pretty">
                          {t('kyp_acceptance_note')}
                        </p>
                      </div>

                      {/* Tip callout (soft full tint, no one-sided bar) */}
                      <div className="rounded-xl bg-primary-lighter border border-[#38761d]/15 px-4 py-3.5">
                        <p className="text-sm text-ink/90 leading-relaxed text-pretty">
                          <span className="font-bold text-[#38761d] mr-1.5">
                            {t('kyp_tip_label')}:
                          </span>
                          {plastic.tip}
                        </p>
                      </div>
                    </section>
                  );
                })}
              </div>
            )}

            {/* 7. Recap (compact tappable 7-row list) */}
            <section
              aria-labelledby="kyp-recap-heading"
              className="pt-8 border-t border-border space-y-4"
            >
              <div className="space-y-1">
                <h2
                  id="kyp-recap-heading"
                  className="font-[family-name:var(--font-brand)] text-xl font-bold text-ink text-balance"
                >
                  {t('kyp_recap_title')}
                </h2>
                <p className="text-xs font-medium text-muted">
                  {t('kyp_recap_hint')}
                </p>
              </div>

              <ul className="rounded-2xl bg-white border border-border divide-y divide-border-light overflow-hidden">
                {allTypes.map((item) => {
                  const statusMeta = STATUS_META[item.status] || STATUS_META.rarely;
                  return (
                    <li key={item.code}>
                      <button
                        type="button"
                        onClick={() => scrollToCode(item.code)}
                        className="w-full min-h-14 px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-sunken/70 focus-visible:outline-offset-[-2px] transition-colors duration-150 cursor-pointer"
                      >
                        <span className="flex items-center gap-3 min-w-0">
                          <ResinCodeIcon code={item.code} size={26} tone="green" />
                          <span className="min-w-0">
                            <span className="block text-sm font-bold text-ink leading-tight">
                              <span className="sr-only">
                                {t('kyp_resin_code_sr', { code: item.code })}{' '}
                              </span>
                              {item.abbreviation}
                            </span>
                            <span className="block text-xs text-muted truncate mt-0.5">
                              {item.fullName}
                            </span>
                          </span>
                        </span>

                        <span className="flex items-center gap-2 shrink-0">
                          <span
                            className={cn(
                              'inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-bold',
                              statusMeta.pillClass
                            )}
                          >
                            {t(statusMeta.labelKey)}
                          </span>
                          <ChevronRightIcon className="size-4 text-muted-light" />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* 8. Final Considerations */}
            <section
              aria-labelledby="kyp-final-heading"
              className="pt-8 border-t border-border space-y-4"
            >
              <h2
                id="kyp-final-heading"
                className="font-[family-name:var(--font-brand)] text-xl font-bold text-ink text-balance"
              >
                {t('kyp_final_title')}
              </h2>
              <p className="text-[15px] text-ink/90 leading-[1.65] text-pretty">
                {guide.finalConsiderations.intro}
              </p>
              <ul className="space-y-3.5">
                {guide.finalConsiderations.points.map((pt) => (
                  <li key={pt.title} className="space-y-0.5">
                    <p className="text-sm font-bold text-ink">{pt.title}</p>
                    <p className="text-[15px] text-muted leading-relaxed text-pretty">
                      {pt.body}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* 9. Call-to-Action Panel */}
            <section
              aria-labelledby="kyp-cta-heading"
              className="rounded-2xl bg-white border border-border p-5 sm:p-6 space-y-4"
            >
              <div className="space-y-1.5">
                <h2
                  id="kyp-cta-heading"
                  className="font-[family-name:var(--font-brand)] text-lg font-extrabold text-ink text-balance"
                >
                  {t('kyp_cta_title')}
                </h2>
                <p className="text-sm text-muted leading-relaxed text-pretty">
                  {t('kyp_cta_subtitle')}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/pickup?tab=home&start=1')}
                  className="w-full sm:w-auto"
                >
                  {t('kyp_cta_pickup')}
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => navigate('/report')}
                  className="w-full sm:w-auto"
                >
                  {t('kyp_cta_report')}
                </Button>
              </div>
            </section>

            {/* 10. Related Guides */}
            <section
              aria-labelledby="kyp-related-heading"
              className="pt-8 border-t border-border space-y-4"
            >
              <h2
                id="kyp-related-heading"
                className="font-[family-name:var(--font-brand)] text-xl font-bold text-ink text-balance"
              >
                {t('kyp_related_title')}
              </h2>

              <ul className="rounded-2xl bg-white border border-border divide-y divide-border-light overflow-hidden">
                {guide.relatedGuides.map((rel) => (
                  <li key={rel.id}>
                    <button
                      type="button"
                      onClick={() => navigate(rel.to)}
                      className="w-full min-h-16 px-4 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-sunken/70 focus-visible:outline-offset-[-2px] transition-colors duration-150 cursor-pointer"
                    >
                      <span className="min-w-0 flex-1 space-y-0.5">
                        <span className="block text-sm font-bold text-ink leading-snug text-balance">
                          {rel.title}
                        </span>
                        <span className="block text-xs text-muted leading-snug text-pretty">
                          {rel.summary}
                        </span>
                        <span className="block tabular text-[11px] font-semibold text-muted pt-0.5">
                          {t('kyp_read_time', { minutes: rel.readMinutes })}
                        </span>
                      </span>
                      <ChevronRightIcon className="size-4 text-muted shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </article>
        )}
      </div>

      {/* Subtle page-local bottom fade above BottomNav */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 md:bottom-0 h-8 bg-gradient-to-t from-cream to-transparent z-10"
        style={{ bottom: 'calc(4rem + env(safe-area-inset-bottom, 0px))' }}
      />
    </div>
  );
}

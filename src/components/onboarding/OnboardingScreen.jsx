import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrandMark } from '../ui/Icons';
import { ReportIllustration, PickupIllustration, RewardsIllustration } from './OnboardingIllustrations';
import { cn } from '../../utils/cn';

const STEPS = [
  { id: 'report', Illustration: ReportIllustration, titleKey: 'onboarding_1_title', textKey: 'onboarding_1_text' },
  { id: 'pickup', Illustration: PickupIllustration, titleKey: 'onboarding_2_title', textKey: 'onboarding_2_text' },
  { id: 'rewards', Illustration: RewardsIllustration, titleKey: 'onboarding_3_title', textKey: 'onboarding_3_text' },
];

/**
 * OnboardingScreen — Warm, inviting 3-step consumer welcome flow.
 */
export default function OnboardingScreen({ onFinish }) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;
  const { Illustration } = step;

  const handleNext = () => {
    if (isLast) {
      onFinish();
    } else {
      setIndex(prev => prev + 1);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('appTitle')}
      className="fixed inset-0 z-50 bg-cream flex flex-col"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 h-15 bg-white/95 glass shadow-xs shrink-0">
        <div className="flex items-center gap-2.5">
          <BrandMark className="size-9 rounded-xl shadow-xs" />
          <span className="font-brand text-base font-extrabold text-ink whitespace-nowrap">
            {t('appTitle')}
          </span>
        </div>
        <button
          type="button"
          onClick={onFinish}
          className="touch-target px-3 rounded-xl text-xs font-bold text-muted hover:text-ink hover:bg-sunken transition-colors duration-150 cursor-pointer"
        >
          {t('onboarding_skip')}
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 text-center overflow-y-auto">
        <div key={step.id} className="w-full max-w-sm flex flex-col items-center">
          <div className="w-full max-w-[328px] sm:max-w-[356px] aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-card border border-border/70 animate-scale-in">
            <Illustration />
          </div>
          <h1 className="mt-6 text-2xl font-extrabold text-ink tracking-tight text-balance animate-fade-in-up">
            {t(step.titleKey)}
          </h1>
          <p className="mt-2.5 text-sm text-muted text-pretty max-w-[300px] leading-relaxed animate-fade-in-up">
            {t(step.textKey)}
          </p>
        </div>
      </div>

      <div className="shrink-0 px-6 pb-7 pt-3 w-full max-w-sm mx-auto space-y-5">
        <div className="flex items-center justify-center gap-2" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span
              key={s.id}
              className={cn(
                'h-2 rounded-full transition-[width,background-color] duration-200 ease-out',
                i === index ? 'w-8 bg-primary' : 'w-2 bg-border'
              )}
            />
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {t('onboarding_progress', { current: index + 1, total: STEPS.length })}
        </p>

        <button
          type="button"
          onClick={handleNext}
          className="w-full min-h-12 py-3 bg-primary text-white font-bold rounded-xl text-sm shadow-[0_6px_18px_-3px_rgba(13,122,87,0.38)] hover:bg-primary-dark transition-all duration-150 cursor-pointer press-scale"
        >
          {isLast ? t('onboarding_get_started') : t('onboarding_next')}
        </button>
      </div>
    </div>
  );
}

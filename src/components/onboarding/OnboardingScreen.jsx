import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrandMark } from '../ui/Icons';
import { ReportIllustration, PickupIllustration, RewardsIllustration } from './OnboardingIllustrations';

const STEPS = [
  { id: 'report', Illustration: ReportIllustration, titleKey: 'onboarding_1_title', textKey: 'onboarding_1_text' },
  { id: 'pickup', Illustration: PickupIllustration, titleKey: 'onboarding_2_title', textKey: 'onboarding_2_text' },
  { id: 'rewards', Illustration: RewardsIllustration, titleKey: 'onboarding_3_title', textKey: 'onboarding_3_text' },
];

/**
 * First-launch onboarding: 3 animated steps with dots, Next and Skip.
 * Entrance animations come from shared CSS classes, which the global
 * prefers-reduced-motion rule neutralises.
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
      className="fixed inset-0 z-[3000] bg-white flex flex-col"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Top row: brand + Skip */}
      <div className="flex items-center justify-between px-4 sm:px-6 h-14 shrink-0">
        <div className="flex items-center gap-2">
          <BrandMark className="w-8 h-8 rounded-xl" />
          <span className="font-brand text-[18px] font-extrabold tracking-[-0.03em] text-primary whitespace-nowrap">
            {t('appTitle')}
          </span>
        </div>
        <button
          type="button"
          onClick={onFinish}
          className="touch-target px-3 text-sm font-semibold text-muted hover:text-black transition-colors cursor-pointer"
        >
          {t('onboarding_skip')}
        </button>
      </div>

      {/* Step content (re-keyed so the entrance animation replays on every step) */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 text-center overflow-y-auto">
        <div key={step.id} className="w-full max-w-sm flex flex-col items-center">
          <div className="w-full max-w-[280px] aspect-[6/5] animate-scale-in">
            <Illustration />
          </div>
          <h1 className="mt-6 text-title font-extrabold text-black tracking-tight animate-fade-in-up">
            {t(step.titleKey)}
          </h1>
          <p className="mt-2 text-body text-muted max-w-[280px] animate-fade-in-up" style={{ animationDelay: '80ms' }}>
            {t(step.textKey)}
          </p>
        </div>
      </div>

      {/* Bottom: dots + Next */}
      <div className="shrink-0 px-6 pb-6 pt-2 w-full max-w-sm mx-auto space-y-5">
        <div className="flex items-center justify-center gap-2" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span
              key={s.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-primary' : 'w-2 bg-border'
              }`}
            />
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {t('onboarding_progress', { current: index + 1, total: STEPS.length })}
        </p>

        <button
          type="button"
          onClick={handleNext}
          className="w-full min-h-[48px] py-3 bg-primary text-white font-semibold rounded-[6px] text-sm hover:bg-primary-dark transition-colors cursor-pointer"
        >
          {isLast ? t('onboarding_get_started') : t('onboarding_next')}
        </button>
      </div>
    </div>
  );
}


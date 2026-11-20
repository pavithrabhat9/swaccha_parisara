import React from 'react';
import { useNavigate } from 'react-router-dom';
import { plasticTypes, commonlyConfused, localCoastalContent } from '../data/learnContent';
import BottomMist from '../components/layout/BottomMist';
import { cn } from '../utils/cn';

const RECYCLABLE_BADGE = {
  yes: 'bg-primary-light text-primary-dark border-primary/25',
  limited: 'bg-yellow-light text-yellow-dark border-yellow/35',
  special: 'bg-orange-red-light text-orange-red-dark border-orange-red/30',
  no: 'bg-sunken text-muted border-border',
};

/**
 * LearnPage — Educational content about plastic segregation and recycling.
 * Renders synchronously without artificial useEffect timer delays.
 */
export default function LearnPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-full mx-auto pb-12 space-y-10 animate-fade-in-up overflow-x-hidden">
      {/* Header */}
      <div className="px-5 pt-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-extrabold text-ink text-balance">Learn & Segregate</h1>
        <p className="text-sm text-muted text-pretty mt-2 max-w-2xl leading-relaxed">
          Understanding plastic types helps you recycle effectively. Explore our interactive guides to identify and segregate waste properly in Dakshina Kannada.
        </p>
      </div>

      {/* ================================================
          SECTION 1: KNOW YOUR PLASTIC
          ================================================ */}
      <section aria-labelledby="learn-kyp-heading">
        <div className="px-5 mb-4 max-w-5xl mx-auto flex items-center justify-between gap-3">
          <h2 id="learn-kyp-heading" className="text-base font-bold text-ink text-balance">
            Know Your Plastic
          </h2>
          <button
            type="button"
            onClick={() => navigate('/learn/plastic-types')}
            className="min-h-11 px-3 text-xs font-semibold text-primary hover:text-primary-dark cursor-pointer"
          >
            Filter by resin code →
          </button>
        </div>

        {/* Horizontal scroll on mobile, Grid on desktop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-5 pb-4 hide-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 md:max-w-5xl md:mx-auto">
          {plasticTypes.map(plastic => (
            <article
              key={plastic.code}
              className="w-[82vw] md:w-auto shrink-0 snap-center rounded-2xl bg-white border border-border overflow-hidden flex flex-col"
            >
              {/* Image Header */}
              <div className="relative h-44 w-full bg-sunken">
                <img
                  src={plastic.imageUrl}
                  alt={plastic.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-ink/55" />

                {/* Resin code badge */}
                <div className="absolute top-3 left-3 size-10 rounded-xl bg-white flex items-center justify-center">
                  <span className="text-lg font-black text-ink tabular">{plastic.code}</span>
                </div>

                {/* Title inside image */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-white font-bold text-lg text-balance">{plastic.name}</h3>
                  <p className="text-white/90 text-xs font-medium truncate">{plastic.fullName}</p>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="mb-3">
                  <span
                    className={cn(
                      'inline-block text-[11px] px-2.5 py-1 rounded-full font-bold border',
                      RECYCLABLE_BADGE[plastic.recyclable] || RECYCLABLE_BADGE.no
                    )}
                  >
                    {plastic.badge}
                  </span>
                </div>

                <p className="text-xs text-ink font-semibold mb-1.5">Common Examples:</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {plastic.examples.map((ex, i) => (
                    <span
                      key={i}
                      className="text-xs bg-sunken text-ink font-medium px-2.5 py-0.5 rounded-lg border border-border"
                    >
                      {ex}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-3 border-t border-border-light">
                  <p className="text-xs text-muted text-pretty leading-relaxed">
                    <span className="font-bold text-ink mr-1">Tip:</span>
                    {plastic.tip}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ================================================
          SECTION 2: COMMONLY CONFUSED
          ================================================ */}
      <section aria-labelledby="learn-confused-heading" className="bg-sunken/60 py-8 border-y border-border">
        <div className="px-5 mb-4 max-w-5xl mx-auto">
          <h2 id="learn-confused-heading" className="text-base font-bold text-ink text-balance">
            Commonly Confused
          </h2>
          <p className="text-xs text-muted text-pretty mt-1">
            Don't let misleading packaging fool you. These items often end up in the wrong bin.
          </p>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-5 pb-2 hide-scrollbar md:grid md:grid-cols-2 md:gap-5 md:max-w-5xl md:mx-auto">
          {commonlyConfused.map(item => (
            <article
              key={item.id}
              className="w-[78vw] md:w-auto shrink-0 snap-center rounded-2xl bg-white border border-border overflow-hidden flex flex-col"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="h-32 w-full object-cover border-b border-border-light"
              />
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-ink text-balance">{item.title}</h3>
                <p className="text-xs font-semibold text-primary mt-0.5 mb-2">{item.subtitle}</p>
                <p className="text-xs text-muted text-pretty leading-relaxed mb-4 flex-1">
                  {item.description}
                </p>

                <div className="bg-orange-red-light border border-orange-red/25 rounded-xl px-3 py-2 mt-auto">
                  <p className="text-xs font-bold text-orange-red-dark flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {item.verdict}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ================================================
          SECTION 3: LOCAL TO THE COAST
          ================================================ */}
      <section aria-labelledby="learn-coastal-heading" className="px-5 max-w-5xl mx-auto">
        <h2 id="learn-coastal-heading" className="text-base font-bold text-ink text-balance mb-4">
          Local Context: Dakshina Kannada
        </h2>
        <div className="space-y-4 md:grid md:grid-cols-3 md:gap-5 md:space-y-0">
          {localCoastalContent.map(item => (
            <article
              key={item.id}
              className="relative rounded-2xl overflow-hidden border border-border h-44 flex items-end"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-ink/65" />

              <div className="relative z-10 p-4 w-full">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <h3 className="text-sm font-bold text-white text-balance">{item.title}</h3>
                  <span className="text-[11px] font-bold text-primary-dark bg-primary-light px-2.5 py-0.5 rounded-full shrink-0 tabular">
                    {item.stat}
                  </span>
                </div>
                <p className="text-xs text-white/90 text-pretty leading-snug line-clamp-2">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ================================================
          FOR BUSINESSES LINK
          ================================================ */}
      <section className="px-5 pb-4 max-w-5xl mx-auto">
        <div className="relative bg-primary rounded-2xl p-5 overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="size-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>

            <div>
              <h2 className="text-base font-bold text-white text-balance">For Businesses</h2>
              <p className="text-xs text-white/90 text-pretty mt-0.5 leading-snug">
                Set up a recurring plastic waste pickup schedule for your establishment.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/business')}
            className="min-h-11 bg-white text-primary-dark text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-primary-lighter transition-colors duration-150 press-scale shrink-0 cursor-pointer"
          >
            Set Up Schedule
          </button>
        </div>
      </section>

      <BottomMist />
    </div>
  );
}

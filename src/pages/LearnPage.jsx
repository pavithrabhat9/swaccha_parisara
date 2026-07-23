import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { plasticTypes, commonlyConfused, localCoastalContent } from '../data/learnContent';

/**
 * LearnPage — Educational content about plastic segregation and recycling.
 * Organized as browsable card sections, not a wall of text.
 */
export default function LearnPage() {
  const navigate = useNavigate();
  const [expandedPlastic, setExpandedPlastic] = useState(null);

  const recyclableBadge = (type) => {
    const colors = {
      yes: 'bg-primary-light text-primary border-primary/20',
      limited: 'bg-yellow-light text-yellow border-yellow/20',
      special: 'bg-orange-red-light text-orange-red border-orange-red/20',
      no: 'bg-border-light text-muted border-border',
    };
    return colors[type] || colors.no;
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-black">Learn & Segregate</h2>
        <p className="text-sm text-muted mt-0.5">
          Understanding plastic types helps you recycle right and keep Dakshina Kannada clean.
        </p>
      </div>

      {/* ================================================
          SECTION 1: KNOW YOUR PLASTIC
          ================================================ */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">♻️</span>
          <h3 className="text-sm font-bold text-black uppercase tracking-wide">Know Your Plastic</h3>
        </div>
        <p className="text-xs text-muted mb-4">
          Every plastic item has a resin identification code (1–7). Here's what each means and whether it's recyclable.
        </p>

        <div className="space-y-2.5">
          {plasticTypes.map(plastic => {
            const isExpanded = expandedPlastic === plastic.code;
            return (
              <button
                key={plastic.code}
                onClick={() => setExpandedPlastic(isExpanded ? null : plastic.code)}
                className="w-full text-left bg-surface rounded-xl border border-border p-3.5 shadow-xs
                  hover:shadow-card transition-all duration-200 press-scale"
              >
                <div className="flex items-start gap-3">
                  {/* Resin code circle */}
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-bold"
                    style={{ backgroundColor: plastic.color + '15', color: plastic.color }}
                  >
                    {plastic.code}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-black">{plastic.name}</p>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold border ${recyclableBadge(plastic.recyclable)}`}>
                        {plastic.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted">{plastic.fullName}</p>

                    {/* Examples */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {plastic.examples.slice(0, isExpanded ? undefined : 2).map((ex, i) => (
                        <span key={i} className="text-[10px] bg-border-light text-muted px-2 py-0.5 rounded-full">
                          {ex}
                        </span>
                      ))}
                      {!isExpanded && plastic.examples.length > 2 && (
                        <span className="text-[10px] text-primary font-medium">
                          +{plastic.examples.length - 2} more
                        </span>
                      )}
                    </div>

                    {/* Expanded tip */}
                    {isExpanded && (
                      <div className="mt-2.5 pt-2.5 border-t border-border-light animate-fade-in">
                        <p className="text-xs text-muted leading-relaxed">
                          💡 {plastic.tip}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Expand chevron */}
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"
                    className={`flex-shrink-0 mt-1 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================================================
          SECTION 2: COMMONLY CONFUSED
          ================================================ */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🤔</span>
          <h3 className="text-sm font-bold text-black uppercase tracking-wide">Commonly Confused</h3>
        </div>
        <p className="text-xs text-muted mb-4">
          These items look recyclable but usually aren't — or need special handling. Don't let greenwashing fool you.
        </p>

        <div className="space-y-3">
          {commonlyConfused.map(item => (
            <div key={item.id} className="bg-surface rounded-xl border border-border p-4 shadow-xs">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-black">{item.title}</p>
                  <p className="text-[10px] text-muted font-medium uppercase tracking-wide mb-1.5">{item.subtitle}</p>
                  <p className="text-xs text-muted leading-relaxed mb-2">{item.description}</p>
                  <div className="bg-orange-red-light border border-orange-red/15 rounded-lg px-2.5 py-1.5">
                    <p className="text-[10px] font-semibold text-orange-red">
                      ⚠️ {item.verdict}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================
          SECTION 3: LOCAL TO THE COAST
          ================================================ */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🌊</span>
          <h3 className="text-sm font-bold text-black uppercase tracking-wide">Local to the Coast</h3>
        </div>
        <p className="text-xs text-muted mb-4">
          Dakshina Kannada has unique plastic waste challenges tied to its coastline, temples, and fishing industry.
        </p>

        <div className="space-y-3">
          {localCoastalContent.map(item => (
            <div key={item.id} className="bg-surface rounded-xl border border-border p-4 shadow-xs">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-black mb-1">{item.title}</p>
                  <p className="text-xs text-muted leading-relaxed mb-2">{item.description}</p>
                  <div className="bg-primary-light rounded-lg px-2.5 py-1.5 inline-flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-primary">{item.stat}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================
          FOR BUSINESSES LINK
          ================================================ */}
      <section className="bg-surface rounded-2xl border border-border p-5 shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38761d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-black">For Businesses</p>
            <p className="text-xs text-muted">Set up a recurring plastic waste pickup schedule for your business.</p>
          </div>
          <button
            onClick={() => navigate('/business')}
            className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl
              hover:bg-primary-dark active:scale-[0.97] transition-all shadow-sm"
          >
            Set Up
          </button>
        </div>
      </section>
    </div>
  );
}

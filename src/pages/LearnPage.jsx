import React from 'react';
import { useNavigate } from 'react-router-dom';
import { plasticTypes, commonlyConfused, localCoastalContent } from '../data/learnContent';

/**
 * LearnPage — Educational content about plastic segregation and recycling.
 * Redesigned with a professional UI: animated horizontal scrolling carousels 
 * and real HD images instead of basic expandable lists and emojis.
 */
export default function LearnPage() {
  const navigate = useNavigate();

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
    <div className="mx-auto pb-8 space-y-10 animate-fade-in-up overflow-hidden">
      
      {/* Header */}
      <div className="px-5 pt-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-extrabold text-black tracking-tight">Learn & Segregate</h2>
        <p className="text-sm text-muted mt-2 leading-relaxed">
          Understanding plastic types helps you recycle effectively. Explore our interactive guides to identify and segregate waste properly in Dakshina Kannada.
        </p>
      </div>

      {/* ================================================
          SECTION 1: KNOW YOUR PLASTIC (Carousel)
          ================================================ */}
      <section>
        <div className="px-5 mb-4 max-w-5xl mx-auto flex items-center justify-between">
          <h3 className="text-sm font-bold text-black uppercase tracking-wider">Know Your Plastic</h3>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
          </div>
        </div>
        
        {/* Horizontal scroll on mobile, Grid on desktop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-5 pb-6 hide-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:max-w-5xl md:mx-auto">
          {plasticTypes.map(plastic => (
            <div 
              key={plastic.code}
              className="w-[85vw] md:w-auto shrink-0 snap-center rounded-2xl bg-surface border border-border shadow-elevated overflow-hidden flex flex-col transition-transform press-scale"
            >
              {/* Image Header */}
              <div className="relative h-44 w-full bg-border-light">
                <img 
                  src={plastic.imageUrl} 
                  alt={plastic.name} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Resin code badge */}
                <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/95 glass flex items-center justify-center shadow-sm">
                  <span className="text-lg font-black text-black">{plastic.code}</span>
                </div>
                
                {/* Title inside image */}
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-white font-bold text-lg">{plastic.name}</p>
                  <p className="text-white/80 text-xs font-medium truncate">{plastic.fullName}</p>
                </div>
              </div>
              
              {/* Content Body */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="mb-3">
                  <span className={`inline-block text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide border ${recyclableBadge(plastic.recyclable)}`}>
                    {plastic.badge}
                  </span>
                </div>
                
                <p className="text-xs text-black font-medium mb-1.5">Common Examples:</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {plastic.examples.map((ex, i) => (
                    <span key={i} className="text-[10px] bg-border-light text-muted-light font-medium px-2 py-0.5 rounded-md border border-border">
                      {ex}
                    </span>
                  ))}
                </div>
                
                <div className="mt-auto pt-3 border-t border-border-light">
                  <p className="text-[11px] text-muted leading-relaxed">
                    <span className="font-bold text-black mr-1">Tip:</span> 
                    {plastic.tip}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================
          SECTION 2: COMMONLY CONFUSED (Carousel)
          ================================================ */}
      <section className="bg-white py-8 border-y border-border">
        <div className="px-5 mb-4 max-w-5xl mx-auto">
          <h3 className="text-sm font-bold text-black uppercase tracking-wider">Commonly Confused</h3>
          <p className="text-xs text-muted mt-1">Don't let greenwashing fool you. These often end up in the wrong bin.</p>
        </div>
        
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-5 pb-6 hide-scrollbar md:grid md:grid-cols-2 md:gap-6 md:max-w-5xl md:mx-auto">
          {commonlyConfused.map(item => (
            <div 
              key={item.id} 
              className="w-[75vw] md:w-auto shrink-0 snap-center rounded-2xl bg-surface border border-border shadow-card overflow-hidden flex flex-col"
            >
              <img src={item.imageUrl} alt={item.title} className="h-32 w-full object-cover border-b border-border-light"/>
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">{item.subtitle}</p>
                <p className="text-sm font-bold text-black mb-2">{item.title}</p>
                <p className="text-[11px] text-muted leading-relaxed mb-4 flex-1">{item.description}</p>
                
                <div className="bg-orange-red-light/50 border border-orange-red/20 rounded-lg px-3 py-2 mt-auto">
                  <p className="text-[10px] font-bold text-orange-red flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {item.verdict}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================
          SECTION 3: LOCAL TO THE COAST
          ================================================ */}
      <section className="px-5 max-w-5xl mx-auto">
        <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-4">Local Context: Dakshina Kannada</h3>
        <div className="space-y-4 md:grid md:grid-cols-3 md:gap-6 md:space-y-0">
          {localCoastalContent.map(item => (
            <div key={item.id} className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all h-40 flex items-end">
              <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>
              
              <div className="relative z-10 p-4 w-full">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <p className="text-sm font-bold text-white">{item.title}</p>
                  <span className="text-[9px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full shrink-0">
                    {item.stat}
                  </span>
                </div>
                <p className="text-[11px] text-white/80 leading-snug line-clamp-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================
          FOR BUSINESSES LINK
          ================================================ */}
      <section className="px-5 pb-8 max-w-5xl mx-auto">
        <div className="relative bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-5 shadow-fab overflow-hidden flex items-center gap-4">
          {/* Decorative shapes */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute bottom-0 right-10 w-16 h-16 rounded-full bg-white/5" />
          
          <div className="w-12 h-12 rounded-full bg-white/20 glass flex items-center justify-center shrink-0 z-10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          
          <div className="flex-1 z-10">
            <p className="text-base font-bold text-white">For Businesses</p>
            <p className="text-[11px] text-white/80 mt-0.5 leading-snug">Set up a recurring plastic waste pickup schedule for your establishment.</p>
          </div>
          
          <button
            onClick={() => navigate('/business')}
            className="z-10 bg-white text-primary text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-primary-lighter active:scale-[0.97] transition-all shadow-sm shrink-0"
          >
            Set Up
          </button>
        </div>
      </section>
      
    </div>
  );
}

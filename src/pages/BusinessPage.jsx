import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/Toast';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import SuccessState from '../components/ui/SuccessState';
import SlowNetworkAlert from '../components/ui/SlowNetworkAlert';
import ErrorState from '../components/ui/ErrorState';
import Skeleton, { SkeletonCard } from '../components/ui/Skeleton';
import { CADENCE_OPTIONS, VOLUME_OPTIONS } from '../data/mockBusinesses';
import { useBusinessSubscription } from '../hooks/useBusinessSubscription';
import { cn } from '../utils/cn';

/**
 * BusinessPage — Commercial & Institutional Recurring Collection Portal.
 */
export default function BusinessPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    business,
    loading,
    step,
    form,
    errors,
    updateForm,
    handleSignupNext,
    handleScheduleSubmit,
    handleSkip,
    handleTogglePause,
    handleBackToSignup,
    showSuccessModal,
    dismissSuccessModal,
    submitting,
    showSlowNetwork,
    dismissSlowNetwork,
    submissionError,
  } = useBusinessSubscription();

  const handleTogglePauseClick = async () => {
    const isPaused = await handleTogglePause();
    showToast(isPaused ? 'Subscription paused.' : 'Subscription resumed!', isPaused ? 'info' : 'success');
  };

  const handleSkipClick = async () => {
    await handleSkip();
    showToast("This pickup has been skipped — we've been notified.", 'info');
  };

  const handleScheduleSubmitClick = async () => {
    const result = await handleScheduleSubmit();
    if (result && result.success) {
      const cadenceLabel = CADENCE_OPTIONS.find(c => c.id === result.cadenceId)?.label || result.cadenceId;
      showToast(`Your recurring ${cadenceLabel.toLowerCase()} pickup is set. You can pause anytime.`, 'success', 4000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4" aria-busy="true">
        <Skeleton width="180px" height="24px" rounded="sm" />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (step === 'dashboard' && business) {
    const cadenceLabel = CADENCE_OPTIONS.find(c => c.id === business.cadence)?.label || business.cadence;
    return (
      <div className="max-w-lg mx-auto px-4 py-6 space-y-5 animate-fade-in-up">
        <button
          type="button"
          onClick={() => navigate('/learn')}
          className="min-h-10 -ml-2 px-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors duration-150 cursor-pointer rounded-lg"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Learn
        </button>

        <div>
          <h1 className="text-xl font-bold text-ink text-balance">{business.name}</h1>
          <p className="text-xs text-muted text-pretty mt-0.5">{business.address}</p>
        </div>

        <section
          className={cn(
            'rounded-xl p-5 border space-y-3',
            business.isPaused ? 'bg-sunken border-border' : 'bg-white border-border'
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-ink text-balance">
              {business.isPaused ? 'Subscription Paused' : 'Next Scheduled Pickup'}
            </h2>
            <StatusBadge status={business.isPaused ? 'Paused' : 'Scheduled'} />
          </div>

          {!business.isPaused && (
            <p className="font-mono-data text-2xl font-bold text-ink">
              {new Date(business.nextPickup).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            </p>
          )}
          <p className="font-mono-data text-xs text-muted">
            {cadenceLabel} · {business.preferredDate}
          </p>

          <div className="flex flex-wrap gap-2.5 pt-2">
            {!business.isPaused && (
              <button
                type="button"
                onClick={handleSkipClick}
                className="flex-1 min-h-10 py-2 px-3 bg-white border border-border rounded-lg text-xs font-semibold text-ink hover:border-yellow-dark hover:text-yellow-dark transition-colors duration-150 press-scale cursor-pointer"
              >
                Skip This Pickup
              </button>
            )}
            <button
              type="button"
              onClick={handleTogglePauseClick}
              className={cn(
                'flex-1 min-h-10 py-2 px-3 rounded-lg text-xs font-semibold transition-colors duration-150 press-scale cursor-pointer',
                business.isPaused
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-white border border-orange-red/35 text-orange-red-dark hover:bg-orange-red-light'
              )}
            >
              {business.isPaused ? 'Resume Subscription' : 'Pause Subscription'}
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold text-ink text-balance">Pickup History</h2>
          {!business.history || business.history.length === 0 ? (
            <EmptyState
              title="No pickups yet"
              description="Your collection history will appear here once your scheduled cycles begin."
            />
          ) : (
            <div className="rounded-xl border border-border bg-white divide-y divide-border-light px-4">
              {business.history.map((entry, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-3">
                  <span className="font-mono-data text-xs font-semibold text-ink">
                    {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <StatusBadge status={entry.status} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  if (step === 'signup') {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 space-y-5 animate-fade-in-up">
        <button
          type="button"
          onClick={() => navigate('/learn')}
          className="min-h-10 -ml-2 px-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors duration-150 cursor-pointer rounded-lg"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Learn
        </button>

        <section className="rounded-xl border border-border bg-white p-5 space-y-5">
          <div className="pb-4 border-b border-border-light">
            <h1 className="text-xl font-bold text-ink text-balance">Business Pickup Signup</h1>
            <p className="text-xs text-muted text-pretty mt-1">
              Set up a recurring plastic waste pickup schedule for your establishment.
            </p>
          </div>

          {[
            { field: 'name', id: 'biz-name', label: 'Business Name', placeholder: 'e.g., Mangalore Fish Market Association' },
            { field: 'address', id: 'biz-address', label: 'Address', placeholder: 'e.g., Bunder Road, Old Port, Mangaluru' },
            { field: 'contactPerson', id: 'biz-contact', label: 'Contact Person', placeholder: 'e.g., Rajesh Kumar' },
          ].map(({ field, id, label, placeholder }) => (
            <div key={field}>
              <label htmlFor={id} className="block text-xs font-semibold text-ink mb-1.5">
                {label} <span className="text-orange-red-dark" aria-hidden="true">*</span>
              </label>
              <input
                id={id}
                type="text"
                aria-invalid={Boolean(errors[field]) || undefined}
                value={form[field]}
                onChange={e => updateForm(field, e.target.value)}
                placeholder={placeholder}
                className="w-full min-h-11 px-3.5 py-2.5 border border-border rounded-lg text-sm bg-white text-ink placeholder:text-muted-light focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {errors[field] && (
                <p role="alert" className="text-xs text-orange-red-dark mt-1.5 font-semibold">{errors[field]}</p>
              )}
            </div>
          ))}

          <div>
            <label htmlFor="biz-phone" className="block text-xs font-semibold text-ink mb-1.5">
              Phone <span className="text-orange-red-dark" aria-hidden="true">*</span>
            </label>
            <div className="flex">
              <span className="flex items-center px-3 bg-sunken rounded-l-lg border border-r-0 border-border font-mono-data text-xs font-semibold text-muted">
                +91
              </span>
              <input
                id="biz-phone"
                type="tel"
                inputMode="numeric"
                aria-invalid={Boolean(errors.phone) || undefined}
                value={form.phone}
                onChange={e => updateForm('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit number"
                className="flex-1 min-h-11 px-3.5 py-2.5 border border-border rounded-r-lg text-sm bg-white text-ink font-mono-data placeholder:text-muted-light focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {errors.phone && (
              <p role="alert" className="text-xs text-orange-red-dark mt-1.5 font-semibold">{errors.phone}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSignupNext}
            className="w-full min-h-12 py-3 bg-primary text-white font-semibold rounded-lg text-sm hover:bg-primary-dark transition-colors duration-150 press-scale cursor-pointer"
          >
            Next: Set Schedule →
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5 animate-fade-in-up">
      <button
        type="button"
        onClick={handleBackToSignup}
        className="min-h-10 -ml-2 px-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors duration-150 cursor-pointer rounded-lg"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>

      <section className="rounded-xl border border-border bg-white p-5 space-y-5">
        <div className="pb-4 border-b border-border-light">
          <h1 className="text-xl font-bold text-ink text-balance">Set Pickup Schedule</h1>
          <p className="text-xs text-muted text-pretty mt-1">
            Choose how often you'd like us to pick up your plastic waste.
          </p>
        </div>

        <div>
          <span className="block text-xs font-semibold text-ink mb-2">
            Pickup Frequency <span className="text-orange-red-dark" aria-hidden="true">*</span>
          </span>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Pickup Frequency">
            {CADENCE_OPTIONS.map(opt => {
              const selected = form.cadence === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => updateForm('cadence', opt.id)}
                  className={cn(
                    'min-h-11 py-2.5 px-2 rounded-lg border text-center transition-colors duration-150 press-scale cursor-pointer',
                    selected
                      ? 'border-primary bg-primary-lighter text-primary-dark'
                      : 'border-border bg-white text-ink hover:border-primary/40'
                  )}
                >
                  <span className="text-xs font-semibold">{opt.label}</span>
                </button>
              );
            })}
          </div>
          {errors.cadence && (
            <p role="alert" className="text-xs text-orange-red-dark mt-1.5 font-semibold">{errors.cadence}</p>
          )}
        </div>

        <div>
          <label htmlFor="biz-preferred-date" className="block text-xs font-semibold text-ink mb-1.5">
            Preferred Date <span className="text-orange-red-dark" aria-hidden="true">*</span>
          </label>
          <input
            id="biz-preferred-date"
            type="text"
            aria-invalid={Boolean(errors.preferredDate) || undefined}
            value={form.preferredDate}
            onChange={e => updateForm('preferredDate', e.target.value)}
            placeholder="e.g., 1st of every month, Every Monday"
            className="w-full min-h-11 px-3.5 py-2.5 border border-border rounded-lg text-sm bg-white text-ink placeholder:text-muted-light focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {errors.preferredDate && (
            <p role="alert" className="text-xs text-orange-red-dark mt-1.5 font-semibold">{errors.preferredDate}</p>
          )}
        </div>

        <div>
          <span className="block text-xs font-semibold text-ink mb-2">
            Volume Estimate <span className="text-muted font-normal">(optional)</span>
          </span>
          <div className="grid grid-cols-2 gap-2">
            {VOLUME_OPTIONS.map(opt => {
              const selected = form.volumeEstimate === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => updateForm('volumeEstimate', opt.id)}
                  className={cn(
                    'min-h-11 py-2.5 px-3 rounded-lg border font-mono-data text-xs font-semibold text-left transition-colors duration-150 press-scale cursor-pointer',
                    selected
                      ? 'border-primary bg-primary-lighter text-primary-dark'
                      : 'border-border bg-white text-muted hover:border-primary/40 hover:text-ink'
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {showSlowNetwork && (
          <SlowNetworkAlert
            onRetry={handleScheduleSubmitClick}
            onCancel={dismissSlowNetwork}
          />
        )}

        {submissionError && (
          <ErrorState
            title="Schedule Failed"
            description={submissionError}
            onRetry={handleScheduleSubmitClick}
          />
        )}

        <button
          type="button"
          onClick={handleScheduleSubmitClick}
          disabled={submitting}
          className="w-full min-h-12 py-3 bg-primary text-white font-semibold rounded-lg text-sm hover:bg-primary-dark transition-colors duration-150 press-scale disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {submitting ? (
            <>
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving Schedule…</span>
            </>
          ) : (
            'Confirm Schedule'
          )}
        </button>
      </section>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-modal border border-border">
            <SuccessState
              title="Schedule Active!"
              description="Your recurring commercial plastic waste collection has been scheduled. Our vehicle will arrive on the selected frequency."
              actionLabel="Go to Dashboard"
              onAction={dismissSuccessModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}

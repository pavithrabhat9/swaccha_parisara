import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/Toast';
import StatusBadge from '../components/ui/StatusBadge';
import { CADENCE_OPTIONS, VOLUME_OPTIONS } from '../data/mockBusinesses';

/**
 * BusinessPage — Industry/Business recurring pickup schedule.
 * Not a main nav tab; reached via Learn page or direct link.
 * Flow: signup → schedule setup → status dashboard with skip/pause.
 */
export default function BusinessPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Check if business is already set up (localStorage)
  const [business, setBusiness] = useState(() => {
    try {
      const stored = localStorage.getItem('swachha_business');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const [step, setStep] = useState(business ? 'dashboard' : 'signup'); // 'signup' | 'schedule' | 'dashboard'
  const [form, setForm] = useState({
    name: '', address: '', contactPerson: '', phone: '',
    cadence: '', preferredDate: '', volumeEstimate: '',
  });
  const [errors, setErrors] = useState({});

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleSignupNext = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Required';
    if (!form.address.trim()) newErrors.address = 'Required';
    if (!form.contactPerson.trim()) newErrors.contactPerson = 'Required';
    if (!form.phone || form.phone.length < 10) newErrors.phone = 'Enter valid phone';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setStep('schedule');
  };

  const handleScheduleSubmit = () => {
    const newErrors = {};
    if (!form.cadence) newErrors.cadence = 'Select a cadence';
    if (!form.preferredDate.trim()) newErrors.preferredDate = 'Enter preferred date';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    const cadenceLabel = CADENCE_OPTIONS.find(c => c.id === form.cadence)?.label || form.cadence;
    const newBusiness = {
      ...form,
      id: `BIZ-${Date.now()}`,
      isPaused: false,
      nextPickup: getNextPickupDate(),
      history: [],
    };
    setBusiness(newBusiness);
    localStorage.setItem('swachha_business', JSON.stringify(newBusiness));
    setStep('dashboard');
    showToast(`Your recurring ${cadenceLabel.toLowerCase()} pickup is set. You can pause anytime.`, 'success', 4000);
  };

  const handleSkip = () => {
    const updated = { ...business, history: [{ date: business.nextPickup, status: 'Skipped' }, ...business.history] };
    updated.nextPickup = getNextPickupDate();
    setBusiness(updated);
    localStorage.setItem('swachha_business', JSON.stringify(updated));
    showToast('This pickup has been skipped — we\'ve been notified.', 'info');
  };

  const handleTogglePause = () => {
    const updated = { ...business, isPaused: !business.isPaused };
    setBusiness(updated);
    localStorage.setItem('swachha_business', JSON.stringify(updated));
    showToast(updated.isPaused ? 'Subscription paused.' : 'Subscription resumed!', updated.isPaused ? 'info' : 'success');
  };

  function getNextPickupDate() {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  }

  // === DASHBOARD VIEW ===
  if (step === 'dashboard' && business) {
    const cadenceLabel = CADENCE_OPTIONS.find(c => c.id === business.cadence)?.label || business.cadence;
    return (
      <div className="max-w-lg mx-auto px-4 py-6 space-y-5 animate-fade-in-up">
        {/* Back link */}
        <button onClick={() => navigate('/learn')} className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Learn
        </button>

        <div>
          <h2 className="text-xl font-bold text-black">{business.name}</h2>
          <p className="text-xs text-muted">{business.address}</p>
        </div>

        {/* Next pickup card */}
        <div className={`rounded-2xl p-5 border shadow-card ${business.isPaused ? 'bg-border-light border-border' : 'bg-primary-lighter border-primary/20'}`}>
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-1">
            {business.isPaused ? 'Subscription Paused' : 'Next Scheduled Pickup'}
          </p>
          {!business.isPaused && (
            <p className="text-2xl font-extrabold text-black mb-1">
              {new Date(business.nextPickup).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            </p>
          )}
          <p className="text-xs text-muted">
            {cadenceLabel} • {business.preferredDate}
          </p>

          <div className="flex gap-2 mt-4">
            {!business.isPaused && (
              <button
                onClick={handleSkip}
                className="flex-1 py-2.5 bg-surface border border-border rounded-xl text-xs font-semibold text-muted
                  hover:border-yellow hover:text-yellow active:scale-[0.98] transition-all"
              >
                Skip This Pickup
              </button>
            )}
            <button
              onClick={handleTogglePause}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold active:scale-[0.98] transition-all
                ${business.isPaused
                  ? 'bg-primary text-white hover:bg-primary-dark shadow-fab'
                  : 'bg-surface border border-orange-red/30 text-orange-red hover:bg-orange-red-light'
                }`}
            >
              {business.isPaused ? 'Resume Subscription' : 'Pause Subscription'}
            </button>
          </div>
        </div>

        {/* History */}
        {business.history && business.history.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-black mb-3">Pickup History</h3>
            <div className="space-y-2">
              {business.history.map((entry, idx) => (
                <div key={idx} className="bg-surface rounded-xl border border-border p-3 flex items-center justify-between shadow-xs">
                  <span className="text-xs font-medium text-black">
                    {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <StatusBadge status={entry.status} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // === SIGNUP FORM ===
  if (step === 'signup') {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 space-y-5 animate-fade-in-up">
        <button onClick={() => navigate('/learn')} className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Learn
        </button>

        <div>
          <h2 className="text-xl font-bold text-black">Business Pickup Signup</h2>
          <p className="text-sm text-muted mt-0.5">Set up a recurring plastic waste pickup schedule for your business.</p>
        </div>

        {[
          { field: 'name', label: 'Business Name', placeholder: 'e.g., Mangalore Fish Market Association' },
          { field: 'address', label: 'Address', placeholder: 'e.g., Bunder Road, Old Port, Mangaluru' },
          { field: 'contactPerson', label: 'Contact Person', placeholder: 'e.g., Rajesh Kumar' },
        ].map(({ field, label, placeholder }) => (
          <div key={field}>
            <label className="block text-[10px] font-semibold text-muted mb-1.5 uppercase tracking-wide">
              {label} <span className="text-orange-red">*</span>
            </label>
            <input
              type="text"
              value={form[field]}
              onChange={e => updateForm(field, e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-surface text-black
                placeholder:text-muted-light focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            {errors[field] && <p className="text-[10px] text-orange-red mt-1 font-medium">{errors[field]}</p>}
          </div>
        ))}

        <div>
          <label className="block text-[10px] font-semibold text-muted mb-1.5 uppercase tracking-wide">
            Phone <span className="text-orange-red">*</span>
          </label>
          <div className="flex">
            <span className="flex items-center px-3 bg-border-light rounded-l-xl border border-r-0 border-border text-sm font-medium text-muted">
              +91
            </span>
            <input
              type="tel"
              value={form.phone}
              onChange={e => updateForm('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit number"
              className="flex-1 px-4 py-3 border border-border rounded-r-xl text-sm bg-surface text-black
                placeholder:text-muted-light focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
          {errors.phone && <p className="text-[10px] text-orange-red mt-1 font-medium">{errors.phone}</p>}
        </div>

        <button
          onClick={handleSignupNext}
          className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl text-sm
            hover:bg-primary-dark active:scale-[0.98] transition-all shadow-fab"
        >
          Next: Set Schedule →
        </button>
      </div>
    );
  }

  // === SCHEDULE SETUP ===
  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5 animate-fade-in-up">
      <button onClick={() => setStep('signup')} className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>

      <div>
        <h2 className="text-xl font-bold text-black">Set Pickup Schedule</h2>
        <p className="text-sm text-muted mt-0.5">Choose how often you'd like us to pick up your plastic waste.</p>
      </div>

      {/* Cadence */}
      <div>
        <label className="block text-[10px] font-semibold text-muted mb-2 uppercase tracking-wide">
          Pickup Frequency <span className="text-orange-red">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {CADENCE_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => updateForm('cadence', opt.id)}
              className={`py-3 rounded-xl border text-center transition-all press-scale
                ${form.cadence === opt.id
                  ? 'border-primary bg-primary-light'
                  : 'border-border bg-surface hover:border-primary/30'
                }`}
            >
              <p className={`text-sm font-semibold ${form.cadence === opt.id ? 'text-primary' : 'text-black'}`}>
                {opt.label}
              </p>
            </button>
          ))}
        </div>
        {errors.cadence && <p className="text-[10px] text-orange-red mt-1 font-medium">{errors.cadence}</p>}
      </div>

      {/* Preferred date */}
      <div>
        <label className="block text-[10px] font-semibold text-muted mb-1.5 uppercase tracking-wide">
          Preferred Date <span className="text-orange-red">*</span>
        </label>
        <input
          type="text"
          value={form.preferredDate}
          onChange={e => updateForm('preferredDate', e.target.value)}
          placeholder="e.g., 1st of every month, Every Monday"
          className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-surface text-black
            placeholder:text-muted-light focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        {errors.preferredDate && <p className="text-[10px] text-orange-red mt-1 font-medium">{errors.preferredDate}</p>}
      </div>

      {/* Volume estimate */}
      <div>
        <label className="block text-[10px] font-semibold text-muted mb-2 uppercase tracking-wide">
          Volume Estimate <span className="text-muted-light">(optional)</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {VOLUME_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => updateForm('volumeEstimate', opt.id)}
              className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-left transition-all press-scale
                ${form.volumeEstimate === opt.id
                  ? 'border-primary bg-primary-light text-primary'
                  : 'border-border text-muted hover:border-primary/30'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleScheduleSubmit}
        className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl text-sm
          hover:bg-primary-dark active:scale-[0.98] transition-all shadow-fab"
      >
        Confirm Schedule
      </button>
    </div>
  );
}

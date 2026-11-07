import { useState, useEffect } from 'react';
import { businessApi } from '../services/businessApi';
import { getNextPickupDate } from '../utils/dateUtils';
import { CADENCE_OPTIONS } from '../data/mockBusinesses';

export function useBusinessSubscription() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('loading'); // 'loading' | 'signup' | 'schedule' | 'dashboard'
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSlowNetwork, setShowSlowNetwork] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [form, setForm] = useState({
    name: '', address: '', contactPerson: '', phone: '',
    cadence: '', preferredDate: '', volumeEstimate: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const sub = await businessApi.getSubscription();
      if (mounted) {
        setBusiness(sub);
        setStep(sub ? 'dashboard' : 'signup');
        setLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

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

  const handleScheduleSubmit = async () => {
    const newErrors = {};
    if (!form.cadence) newErrors.cadence = 'Select a cadence';
    if (!form.preferredDate.trim()) newErrors.preferredDate = 'Enter preferred date';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setSubmitting(true);
    setSubmissionError(null);
    setShowSlowNetwork(false);

    const slowTimer = setTimeout(() => setShowSlowNetwork(true), 5000);

    try {
      // Simulate delay to keep behavior identical
      await new Promise(r => setTimeout(r, 600));

      const newBusiness = {
        ...form,
        id: `BIZ-${Date.now()}`,
        isPaused: false,
        nextPickup: getNextPickupDate(),
        history: [],
      };
      
      const created = await businessApi.createSubscription(newBusiness);
      
      clearTimeout(slowTimer);
      setShowSlowNetwork(false);
      setBusiness(created);
      setSubmitting(false);
      setStep('dashboard');
      setShowSuccessModal(true);
      return { success: true, cadenceId: form.cadence };
    } catch (err) {
      clearTimeout(slowTimer);
      setShowSlowNetwork(false);
      setSubmitting(false);
      setSubmissionError('Failed to create subscription.');
      return { success: false };
    }
  };

  const handleSkip = async () => {
    if (!business) return;
    const updated = { ...business, history: [{ date: business.nextPickup, status: 'Skipped' }, ...business.history] };
    updated.nextPickup = getNextPickupDate();
    setBusiness(updated);
    await businessApi.updateSubscription(updated);
    return true;
  };

  const handleTogglePause = async () => {
    if (!business) return;
    const updated = { ...business, isPaused: !business.isPaused };
    setBusiness(updated);
    await businessApi.updateSubscription(updated);
    return updated.isPaused;
  };

  const handleBackToSignup = () => setStep('signup');
  const dismissSuccessModal = () => setShowSuccessModal(false);
  const dismissSlowNetwork = () => {
    setShowSlowNetwork(false);
    setSubmitting(false);
  };

  return {
    business,
    loading,
    step,
    setStep,
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
  };
}

import React, { useState } from 'react';
import { DK_LOCALITIES } from '../../data/mockPickups';

/**
 * Lightweight phone auth flow for Phase 0.
 * Steps: phone → OTP (any 4 digits accepted) → first-time name+locality setup.
 * Displays "1234" as demo OTP hint.
 */
export default function LoginFlow({ authHook }) {
  const { authStep, sendOtp, verifyOtp, completeSetup } = authHook;
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [locality, setLocality] = useState('');
  const [error, setError] = useState('');

  const handleSendOtp = () => {
    setError('');
    const result = sendOtp(phone);
    if (!result.success) setError(result.error);
  };

  const handleVerifyOtp = () => {
    setError('');
    const result = verifyOtp(otp);
    if (!result.success) setError(result.error);
  };

  const handleSetup = () => {
    setError('');
    const result = completeSetup(name, locality);
    if (!result.success) setError(result.error);
  };

  return (
    <div className="flex flex-col items-center px-4 py-8 max-w-sm mx-auto animate-fade-in-up">
      {/* Hero icon */}
      <div className="w-20 h-20 rounded-3xl bg-primary-light flex items-center justify-center mb-6">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#38761d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      </div>

      <h2 className="text-xl font-bold text-black mb-1 text-center">
        {authStep === 'phone' && 'Sign in to request pickups'}
        {authStep === 'otp' && 'Verify your number'}
        {authStep === 'setup' && 'Almost there!'}
      </h2>
      <p className="text-sm text-muted text-center mb-6">
        {authStep === 'phone' && 'Enter your phone number to get started. No password needed.'}
        {authStep === 'otp' && 'We sent a verification code to your phone.'}
        {authStep === 'setup' && 'Tell us your name and locality for pickup coordination.'}
      </p>

      {/* === PHONE STEP === */}
      {authStep === 'phone' && (
        <div className="w-full space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">
              Phone Number
            </label>
            <div className="flex">
              <span className="flex items-center px-3 bg-border-light rounded-l-lg border border-r-0 border-border text-sm font-medium text-muted">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter 10-digit number"
                maxLength={10}
                className="flex-1 px-4 py-3 border border-border rounded-r-lg text-sm font-medium
                  focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
                  bg-surface text-black placeholder:text-muted-light"
              />
            </div>
          </div>
          <button
            onClick={handleSendOtp}
            disabled={phone.length < 10}
            className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl
              hover:bg-primary-dark active:scale-[0.98] transition-all duration-150
              disabled:opacity-40 disabled:cursor-not-allowed shadow-fab"
          >
            Send OTP
          </button>
        </div>
      )}

      {/* === OTP STEP === */}
      {authStep === 'otp' && (
        <div className="w-full space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">
              Verification Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Enter 4-digit OTP"
              maxLength={4}
              className="w-full px-4 py-3 border border-border rounded-lg text-center text-2xl font-bold
                tracking-[0.5em] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
                bg-surface text-black placeholder:text-muted-light placeholder:text-base placeholder:tracking-normal"
            />
          </div>
          {/* Demo hint */}
          <div className="bg-yellow-light border border-yellow/20 rounded-lg px-3 py-2 text-xs text-center">
            <span className="font-semibold text-yellow">Demo Mode:</span>{' '}
            <span className="text-muted">Enter any 4 digits (e.g., <span className="font-bold text-black">1234</span>)</span>
          </div>
          <button
            onClick={handleVerifyOtp}
            disabled={otp.length < 4}
            className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl
              hover:bg-primary-dark active:scale-[0.98] transition-all duration-150
              disabled:opacity-40 disabled:cursor-not-allowed shadow-fab"
          >
            Verify
          </button>
        </div>
      )}

      {/* === SETUP STEP === */}
      {authStep === 'setup' && (
        <div className="w-full space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Priya Shetty"
              className="w-full px-4 py-3 border border-border rounded-lg text-sm font-medium
                focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
                bg-surface text-black placeholder:text-muted-light"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">
              Locality
            </label>
            <select
              value={locality}
              onChange={e => setLocality(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg text-sm font-medium
                focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
                bg-surface text-black appearance-none cursor-pointer"
            >
              <option value="">Select your area</option>
              {DK_LOCALITIES.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSetup}
            disabled={!name.trim() || !locality}
            className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl
              hover:bg-primary-dark active:scale-[0.98] transition-all duration-150
              disabled:opacity-40 disabled:cursor-not-allowed shadow-fab"
          >
            Start Recycling
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="w-full mt-3 bg-orange-red-light border border-orange-red/20 rounded-lg px-3 py-2 text-sm text-orange-red font-medium text-center animate-fade-in">
          {error}
        </div>
      )}
    </div>
  );
}

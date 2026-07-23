import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

/**
 * i18next configuration for Swachha Parisara.
 * English has full content for Phase 0.
 * Kannada, Tulu, Konkani, Beary are scaffolded as empty — can be filled later without refactoring.
 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          // App
          appTitle: 'Swachha Parisara',
          appSubtitle: 'Plastic Waste · Dakshina Kannada',

          // Navigation
          map: 'Map',
          report: 'Report',
          pickup: 'Pickup',
          learn: 'Learn',
          business: 'Business',

          // Map
          wasteMap: 'Waste Map',
          filter: 'Filter',
          clearFilters: 'Clear all filters',
          reports: 'reports',
          density: 'Density',
          low: 'Low',
          mid: 'Mid',
          high: 'High',
          firstReported: 'First reported',
          daysAgo: 'days ago',

          // Report
          reportPlasticWaste: 'Report Plastic Waste',
          reportDescription: 'No login required. Help us track and clear plastic waste in Dakshina Kannada.',
          photo: 'Photo',
          optional: 'optional',
          tapToCapture: 'Tap to capture or upload photo',
          maxFileSize: 'JPG, PNG, WebP • Max 5MB',
          location: 'Location',
          detectingLocation: 'Detecting your location…',
          gpsLocationCaptured: 'GPS location captured',
          adjustManually: 'Adjust manually',
          tapMapToPin: 'Tap the map to place your pin',
          wasteType: 'Waste Type',
          note: 'Note',
          notePlaceholder: 'Describe the location or situation',
          submitReport: 'Submit Report',
          submitting: 'Submitting…',
          reportAdded: 'Report Added',
          reportConfirmation: "Thanks — this has been added to our tracking map. We'll notify you if you're logged in when it's cleared.",
          reportAnother: 'Report Another',
          addedToMap: 'Added to Map',

          // Waste types
          petBottles: 'PET Bottles',
          mixedPlastic: 'Mixed Plastic',
          beachCoastalDebris: 'Beach/Coastal Debris',
          packagingWaste: 'Packaging Waste',
          other: 'Other',

          // Statuses
          reported: 'Reported',
          beingReviewed: 'Being Reviewed',
          cleared: 'Cleared',
          requested: 'Requested',
          scheduled: 'Scheduled',
          completed: 'Completed',
          skipped: 'Skipped',

          // Pickup
          homePickup: 'Home Pickup',
          signInToRequest: 'Sign in to request pickups',
          enterPhone: 'Enter your phone number to get started. No password needed.',
          phoneNumber: 'Phone Number',
          sendOtp: 'Send OTP',
          verifyNumber: 'Verify your number',
          verificationCode: 'Verification Code',
          verify: 'Verify',
          almostThere: 'Almost there!',
          setupDescription: 'Tell us your name and locality for pickup coordination.',
          yourName: 'Your Name',
          locality: 'Locality',
          startRecycling: 'Start Recycling',
          yourPoints: 'Your Points',
          kgDiverted: 'kg diverted',
          requestHomePickup: 'Request Home Pickup',
          requestPickup: 'Request Pickup',
          quantity: 'Quantity',
          pickupAddress: 'Pickup Address',
          preferredTime: 'Preferred Time',
          thisWeek: 'This Week',
          nextWeek: 'Next Week',
          confirmPickup: 'Confirm Pickup',
          pickupHistory: 'Pickup History',
          pickupConfirmation: "Pickup requested — we'll batch this with nearby requests and notify you of your pickup window.",
          noPickupsYet: 'No pickups yet',
          requestFirst: 'Request your first pickup above!',
          signOut: 'Sign out',

          // Learn
          learnAndSegregate: 'Learn & Segregate',
          learnDescription: 'Understanding plastic types helps you recycle right and keep Dakshina Kannada clean.',
          knowYourPlastic: 'Know Your Plastic',
          commonlyConfused: 'Commonly Confused',
          localToTheCoast: 'Local to the Coast',
          forBusinesses: 'For Businesses',
          businessDescription: 'Set up a recurring plastic waste pickup schedule for your business.',
          setUp: 'Set Up',

          // Business
          businessSignup: 'Business Pickup Signup',
          businessSignupDesc: "Set up a recurring plastic waste pickup schedule for your business.",
          businessName: 'Business Name',
          address: 'Address',
          contactPerson: 'Contact Person',
          phone: 'Phone',
          nextSetSchedule: 'Next: Set Schedule →',
          setPickupSchedule: 'Set Pickup Schedule',
          pickupFrequency: 'Pickup Frequency',
          preferredDate: 'Preferred Date',
          volumeEstimate: 'Volume Estimate',
          confirmSchedule: 'Confirm Schedule',
          nextScheduledPickup: 'Next Scheduled Pickup',
          subscriptionPaused: 'Subscription Paused',
          skipThisPickup: 'Skip This Pickup',
          pauseSubscription: 'Pause Subscription',
          resumeSubscription: 'Resume Subscription',
          backToLearn: 'Back to Learn',
        }
      },
      // Scaffolded for future — empty objects, falls back to English
      kn: { translation: {} },
      tu: { translation: {} }, // Tulu
      kk: { translation: {} }, // Konkani
      by: { translation: {} }, // Beary
    }
  });

export default i18n;
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    },
    resources: {
      en: {
        translation: {
          appTitle: 'Swaccha Parisara',
          language: 'Language',
          english: 'English',
          kannada: 'ಕನ್ನಡ',
          reportGarbage: 'Report Garbage',
          ward: 'Ward',
          garbageType: 'Garbage Type',
          location: 'Location',
          date: 'Date',
          status: 'Status',
          referenceId: 'Reference ID',
          filter: 'Filter',
          listView: 'List View',
          mapView: 'Map View',
          all: 'All',
          resolved: 'Resolved',
          unresolved: 'Unresolved',
          reportSubmitted: 'Report Submitted',
          thankYou: 'Thank you for stepping forward to keep our city clean. Every report makes a difference!',
          reportAnother: 'Report Another',
          close: 'Close',
          detectingLocation: 'Detecting location…',
          unableToDetectLocation: 'Unable to detect your location.',
          photo: 'Photo',
          landmarkDescription: 'Landmark Description',
          typeOfWaste: 'Type of Waste',
          captureOrSelectPhoto: 'Tap to capture or select photo',
          maxFileSize: 'JPG, PNG, WebP • Max 5MB',
          retake: 'Retake',
          delete: 'Delete',
          describeLocation: 'Describe the exact location (e.g., near temple, bus stop)',
          submitReport: 'Submit Report',
          submitting: 'Submitting…',
          loading: 'Loading...',
          serviceAreaRestriction: 'Service Area Restriction',
          serviceAreaRestrictionMessage: 'This service is only available for Dakshina Kannada district. You are currently outside the service area.',
          allowLocation: 'Allow Location',
        }
      },
      kn: {
        translation: {
          appTitle: 'ಸ್ವಚ್ಛ ಪರಿಸರ',
          language: 'ಭಾಷೆ',
          english: 'English',
          kannada: 'ಕನ್ನಡ',
          reportGarbage: 'ಕಸವನ್ನು ವರದಿ ಮಾಡಿ',
          ward: 'ವಾರ್ಡ್',
          garbageType: 'ಕಸದ ಪ್ರಕಾರ',
          location: 'ಸ್ಥಳ',
          date: 'ದಿನಾಂಕ',
          status: 'ಸ್ಥಿತಿ',
          referenceId: 'ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ',
          filter: 'ಫಿಲ್ಟರ್',
          listView: 'ಪಟ್ಟಿ ವೀಕ್ಷಣೆ',
          mapView: 'ನಕ್ಷೆ ವೀಕ್ಷಣೆ',
          all: 'ಎಲ್ಲಾ',
          resolved: 'ಪರಿಹರಿಸಲಾಗಿದೆ',
          unresolved: 'ಪರಿಹರಿಸಲಾಗಿಲ್ಲ',
          reportSubmitted: 'ವರದಿ ಸಲ್ಲಿಸಲಾಗಿದೆ',
          thankYou: 'ನಮ್ಮ ನಗರವನ್ನು ಸ್ವಚ್ಛವಾಗಿಡಲು ಮುಂದಾದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ಪ್ರತಿಯೊಂದು ವರದಿಯೂ ಒಂದು ಬದಲಾವಣೆಯನ್ನು ತರುತ್ತದೆ!',
          reportAnother: 'ಮತ್ತೊಂದು ವರದಿ ಮಾಡಿ',
          close: 'ಮುಚ್ಚಿ',
          detectingLocation: 'ಸ್ಥಳವನ್ನು ಪತ್ತೆಹಚ್ಚಲಾಗುತ್ತಿದೆ...',
          unableToDetectLocation: 'ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಪತ್ತೆಹಚ್ಚಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ.',
          photo: 'ಫೋಟೋ',
          landmarkDescription: 'ಗುರುತಿನ ವಿವರಣೆ',
          typeOfWaste: 'ಕಸದ ಪ್ರಕಾರ',
          captureOrSelectPhoto: 'ಫೋಟೋ ತೆಗೆಯಲು ಅಥವಾ ಆಯ್ಕೆ ಮಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
          maxFileSize: 'JPG, PNG, WebP • ಗರಿಷ್ಠ 5MB',
          retake: 'ಮತ್ತೆ ತೆಗೆ',
          delete: 'ಅಳಿಸಿ',
          describeLocation: 'ನಿಖರವಾದ ಸ್ಥಳವನ್ನು ವಿವರಿಸಿ (ಉದಾಹರಣೆಗೆ, ದೇವಸ್ಥಾನದ ಹತ್ತಿರ, ಬಸ್ ನಿಲ್ದಾಣ)',
          submitReport: 'ವರದಿ ಸಲ್ಲಿಸಿ',
          submitting: 'ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...',
          loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
          serviceAreaRestriction: 'ಸೇವಾ ಪ್ರದೇಶ ನಿರ್ಬಂಧ',
          serviceAreaRestrictionMessage: 'ಈ ಸೇವೆಯು ದಕ್ಷಿಣ ಕನ್ನಡ ಜಿಲ್ಲೆಗೆ ಮಾತ್ರ ಲಭ್ಯವಿದೆ. ನೀವು ಪ್ರಸ್ತುತ ಸೇವಾ ಪ್ರದೇಶದ ಹೊರಗಿದ್ದೀರಿ.',
          allowLocation: 'ಸ್ಥಳವನ್ನು ಅನುಮತಿಸಿ',
        }
      }
    }
  });

export default i18n;
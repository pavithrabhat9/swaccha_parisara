import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { PlayIcon, XIcon } from '../ui/Icons';

/**
 * Simple modal video player.
 * Without a `videoUrl` it shows a clear "Video coming soon" state instead of a broken player.
 */
export default function VideoModal({ video, onClose }) {
  const { t } = useTranslation();
  const { isOnline } = useNetworkStatus();
  const panelRef = useRef(null);
  const open = Boolean(video);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[2000] bg-black/70 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={video.title}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-[24px] overflow-hidden shadow-modal outline-none animate-scale-in"
      >
        <div className="flex items-center justify-between gap-2 px-4 py-2.5">
          <h2 className="text-sm font-bold text-black line-clamp-1">{video.title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('home_video_close')}
            className="touch-target w-11 h-11 rounded-full text-muted hover:text-black hover:bg-sunken flex items-center justify-center cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {video.videoUrl && isOnline ? (
          <video
            controls
            autoPlay
            playsInline
            poster={video.imageUrl}
            src={video.videoUrl}
            className="w-full aspect-video bg-black"
          />
        ) : (
          <div className="relative aspect-video bg-primary-light">
            <img
              src={video.imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-35"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 gap-2" role="status">
              <span className="w-12 h-12 rounded-full bg-white text-primary shadow-card flex items-center justify-center pl-0.5" aria-hidden="true">
                <PlayIcon className="w-5 h-5" />
              </span>
              <p className="text-sm font-bold text-black">
                {video.videoUrl ? t('home_video_offline') : t('home_video_coming_soon_title')}
              </p>
              {!video.videoUrl && (
                <p className="text-xs text-muted max-w-[260px]">{t('home_video_coming_soon_text')}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}


import { useCallback, useEffect, useRef, useState } from 'react';

export type ShareStatus = 'idle' | 'shared' | 'copied' | 'failed';

export interface UseProjectShareReturn {
  status: ShareStatus;
  share: () => void;
}

function writeToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  return Promise.reject(new Error('Clipboard unavailable'));
}

/**
 * Offers the page address to the visitor's own sharing tools, falling back to
 * copying it, and finally to a visible message. Nothing is stored and nothing
 * is sent anywhere by the portfolio itself.
 */
export function useProjectShare(url: string): UseProjectShareReturn {
  const [status, setStatus] = useState<ShareStatus>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  const settle = useCallback((next: ShareStatus) => {
    setStatus(next);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setStatus('idle'), 3000);
  }, []);

  const share = useCallback(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      navigator
        .share({ title: document.title, url })
        .then(() => settle('shared'))
        .catch(() => {
          // The visitor dismissed the share sheet: not a failure worth reporting.
          setStatus('idle');
        });
      return;
    }

    writeToClipboard(url)
      .then(() => settle('copied'))
      .catch(() => settle('failed'));
  }, [url, settle]);

  return { status, share };
}
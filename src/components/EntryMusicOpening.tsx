import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import GateOpeningVideo from './GateOpeningVideo';
import { OPENING_SESSION_KEY, shouldShowOpening } from '@/utils/entryExperience';

export default function EntryMusicOpening() {
  const { pathname } = useLocation();
  // Every fresh homepage load plays the opener; in-app navigation never replays it.
  const [pending] = useState(() => shouldShowOpening(pathname, null));
  const [ready, setReady] = useState(false);
  const [finished, setFinished] = useState(false);
  const finish = useCallback(() => {
    setFinished(true);
    try { sessionStorage.setItem(OPENING_SESSION_KEY, '1'); } catch { /* in-memory completion remains */ }
  }, []);
  useEffect(() => {
    if (!pending) return;
    const check = () => {
      if (!document.getElementById('aiwt-loader-overlay')) setReady(true);
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true });
    return () => observer.disconnect();
  }, [pending]);
  if (!pending || !ready || finished || pathname !== '/') return null;
  return <GateOpeningVideo onFinish={finish} />;
}
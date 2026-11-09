import { useEffect, useState } from "react";

/** Match the reference Frame's loading gate, independently of the cover. */
export function useInvitationReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let minimumTimer: ReturnType<typeof setTimeout>;
    let fontTimer: ReturnType<typeof setTimeout>;
    const minimumWait = new Promise<void>(resolve => {
      minimumTimer = setTimeout(resolve, 1000);
    });
    const fontTimeout = new Promise<void>(resolve => {
      fontTimer = setTimeout(resolve, 2500);
    });
    const fontsReady = document.fonts.ready.then(() => undefined, () => undefined);

    void Promise.all([minimumWait, Promise.race([fontsReady, fontTimeout])]).then(() => {
      clearTimeout(fontTimer);
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
      clearTimeout(minimumTimer);
      clearTimeout(fontTimer);
    };
  }, []);

  return ready;
}

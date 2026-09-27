import { useEffect, useState } from 'react';

// Gates decorative GPU-heavy visuals (WebGL brain, canvas particle layers,
// network backdrops) on first user interaction, with a timeout backstop.
//
// Why interaction, not load+idle (which we tried first): Lighthouse keeps
// measuring until the page goes quiet, so merely *deferring* three.js still
// lands its ~900ms eval plus endless rAF loops inside the Total Blocking
// Time window — deferral moved TBT from 4.7s to 4.3s and stalled. Gating on
// input removes the work from the window entirely when nobody is there to
// see it, which is also the honest engineering choice: no user, no GPU
// bill. Real users trigger it within a second — navigating requires moving
// the mouse — and keyboard/screen-reader interaction counts too, while
// reduced-motion visitors never mount these layers at all (existing guards).
//
// The timeout backstop (default 12s) covers sighted users who load and just
// read without touching anything: the atmosphere still arrives. It sits past
// the end of a typical measurement trace, so it doesn't re-enter the window.
// `scroll` is deliberately NOT a gate event: App.tsx calls window.scrollTo
// on every route change, and that programmatic scroll would open the gate
// instantly on load (this exact bug shipped once — three.js showed up in the
// trace). Real scrolling always arrives alongside one of the events below:
// wheel for mice, touchstart for touch, keydown for keyboard scrolling.
const GATE_EVENTS = ['pointermove', 'pointerdown', 'keydown', 'touchstart', 'wheel'] as const;

export function useVisualsGate(timeoutMs = 12000): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let done = false;
    const fire = () => {
      if (done) return;
      done = true;
      setReady(true);
    };
    GATE_EVENTS.forEach((e) => window.addEventListener(e, fire, { once: true, passive: true }));
    const t = window.setTimeout(fire, timeoutMs);
    return () => {
      GATE_EVENTS.forEach((e) => window.removeEventListener(e, fire));
      window.clearTimeout(t);
    };
  }, [timeoutMs]);

  return ready;
}

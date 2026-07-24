"use client";

import { useEffect, useMemo, useState } from "react";
import { invitation } from "../data/invitation";

type CountdownValue = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  complete: boolean;
};

function getCountdown(): CountdownValue {
  const distance = Math.max(
    0,
    new Date(invitation.countdown.targetISO).getTime() - Date.now(),
  );

  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
    complete: distance === 0,
  };
}

export function Countdown() {
  const [countdown, setCountdown] = useState<CountdownValue | null>(null);

  useEffect(() => {
    const update = () => setCountdown(getCountdown());
    const initialTimer = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 1_000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
    };
  }, []);

  const items = useMemo(
    () => [
      ["Days", countdown?.days],
      ["Hours", countdown?.hours],
      ["Minutes", countdown?.minutes],
      ["Seconds", countdown?.seconds],
    ],
    [countdown],
  );

  return (
    <section className="countdown-section paper-section" aria-labelledby="countdown-heading">
      <p className="section-kicker">Counting every moment</p>
      <h2 id="countdown-heading">Until we celebrate</h2>
      {countdown?.complete ? (
        <p className="countdown-complete">{invitation.countdown.completedMessage}</p>
      ) : (
        <div className="countdown-grid" role="timer" aria-live="off">
          {items.map(([label, value]) => (
            <div className="countdown-unit" key={label}>
              <strong>{value === undefined ? "—" : String(value).padStart(2, "0")}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}
      <p className="countdown-date">
        {invitation.countdown.label} · {invitation.countdown.display}
      </p>
      <p className="timezone-note">India Standard Time · {invitation.countdown.timezone}</p>
    </section>
  );
}

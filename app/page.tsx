"use client";

import { useEffect, useMemo, useState } from "react";
import { decodeInvitationToken } from "../lib/invitation-token.mjs";

type Countdown = { days: number; hours: number; minutes: number; seconds: number };
type InvitationDetails = { people: number | null; days: 1 | 2 | 3 };

const TREMONT_LOCATION = "https://share.google/hWnrB6DVuauJ6YYIV";
const NARAYANI_HEIGHTS_LOCATION = "https://share.google/VsfLgB1XlksNToBEJ";
const TREMONT_ADDRESS = "B.1302, Tremont, Vaishnodevi Circle, Ahmedabad";
const NARAYANI_HEIGHTS_ADDRESS = "Narayani Heights, Airport-Gandhinagar Road, Bhat, Ahmedabad";

const INVITED_DAY_DETAILS = {
  1: {
    dates: ["20"],
    firstDate: "20",
    lastDate: null,
    dateLine: "20 September 2026",
    placeLine: "Narayani Heights",
    openingNote: "One day of love · One beautiful beginning",
    eventCopy: "One beautiful day of celebration, laughter, and love.",
    invitationCopy: "You are warmly invited to celebrate with us on Sunday, 20 September.",
    countdownTarget: "2026-09-20T00:00:00+05:30",
    countdownLabel: "Sunday · 20 September",
  },
  2: {
    dates: ["19", "20"],
    firstDate: "19",
    lastDate: "20",
    dateLine: "19 — 20 September 2026",
    placeLine: "Narayani Heights",
    openingNote: "Two days of love · One beautiful beginning",
    eventCopy: "Two days of tradition, music, laughter, and love.",
    invitationCopy: "You are warmly invited for Saturday and Sunday, 19–20 September.",
    countdownTarget: "2026-09-19T09:30:00+05:30",
    countdownLabel: "Saturday · 19 September · 09:30 AM",
  },
  3: {
    dates: ["18", "19", "20"],
    firstDate: "18",
    lastDate: "20",
    dateLine: "18 — 20 September 2026",
    placeLine: "Tremont · Narayani Heights",
    openingNote: "Three days of love · One beautiful beginning",
    eventCopy: "Three days of tradition, music, laughter, and love.",
    invitationCopy: "You are warmly invited for the complete celebration, 18–20 September.",
    countdownTarget: "2026-09-18T00:00:00+05:30",
    countdownLabel: "Friday · 18 September",
  },
} as const;

const DEFAULT_DISPLAY_DETAILS = {
  ...INVITED_DAY_DETAILS[2],
  dates: INVITED_DAY_DETAILS[3].dates,
  eventCopy: INVITED_DAY_DETAILS[3].eventCopy,
  placeLine: INVITED_DAY_DETAILS[3].placeLine,
};

const EVENTS = [
  {
    day: "Friday",
    date: "18",
    month: "September",
    title: "Ganesh Sthapan · Mandap Muhurat · Grah Shanti",
    time: "An auspicious beginning",
    venue: TREMONT_ADDRESS,
    map: TREMONT_LOCATION,
  },
  {
    day: "Friday",
    date: "18",
    month: "September",
    title: "Mehendi",
    time: "An afternoon of henna & happiness",
    venue: TREMONT_ADDRESS,
    map: TREMONT_LOCATION,
  },
  {
    day: "Saturday",
    date: "19",
    month: "September",
    title: "Ring Ceremony",
    time: "09:30 AM",
    venue: NARAYANI_HEIGHTS_ADDRESS,
    map: NARAYANI_HEIGHTS_LOCATION,
  },
  {
    day: "Saturday",
    date: "19",
    month: "September",
    title: "Haldi",
    time: "11:00 AM · Lunch at 12:30 PM",
    venue: NARAYANI_HEIGHTS_ADDRESS,
    map: NARAYANI_HEIGHTS_LOCATION,
  },
  {
    day: "Saturday",
    date: "19",
    month: "September",
    title: "Mameru",
    time: "03:00 PM",
    venue: NARAYANI_HEIGHTS_ADDRESS,
    map: NARAYANI_HEIGHTS_LOCATION,
  },
  {
    day: "Saturday",
    date: "19",
    month: "September",
    title: "Sangeet",
    time: "07:30 PM",
    venue: NARAYANI_HEIGHTS_ADDRESS,
    map: NARAYANI_HEIGHTS_LOCATION,
  },
  {
    day: "Sunday",
    date: "20",
    month: "September",
    title: "Wedding Ceremony",
    time: "Pooja weds Meet",
    venue: NARAYANI_HEIGHTS_ADDRESS,
    map: NARAYANI_HEIGHTS_LOCATION,
    featured: true,
  },
];

function getCountdown(target: string): Countdown {
  const distance = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
}

export default function Home() {
  const [invitationState, setInvitationState] = useState<"sealed" | "untying" | "opening" | "revealed" | "open">("sealed");
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [invitationDetails, setInvitationDetails] = useState<InvitationDetails | null>(null);
  const [shareMessage, setShareMessage] = useState("");

  const displayDetails = invitationDetails
    ? INVITED_DAY_DETAILS[invitationDetails.days]
    : DEFAULT_DISPLAY_DETAILS;

  const visibleEvents = useMemo(() => {
    if (!invitationDetails) return EVENTS;
    const invitedDates = new Set<string>(INVITED_DAY_DETAILS[invitationDetails.days].dates);
    return EVENTS.filter((event) => invitedDates.has(event.date));
  }, [invitationDetails]);

  const guestCopy = invitationDetails?.people
    ? invitationDetails.people === 1
      ? "This invitation is lovingly reserved for one guest."
      : `This invitation is lovingly reserved for ${invitationDetails.people} guests.`
    : null;

  useEffect(() => {
    document.body.style.overflow = invitationState === "open" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [invitationState]);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("i");
    if (!token) return;

    let active = true;
    void decodeInvitationToken(token).then((details) => {
      if (active && details) setInvitationDetails(details);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const target = displayDetails.countdownTarget;
    setCountdown(getCountdown(target));
    const timer = window.setInterval(() => setCountdown(getCountdown(target)), 1000);
    return () => window.clearInterval(timer);
  }, [displayDetails.countdownTarget]);

  useEffect(() => {
    if (invitationState !== "revealed") return;

    const continueInvitation = () => setInvitationState("open");
    const continueFromKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") continueInvitation();
    };

    window.addEventListener("pointerup", continueInvitation, true);
    window.addEventListener("touchend", continueInvitation, { capture: true, passive: true });
    window.addEventListener("keydown", continueFromKeyboard);

    return () => {
      window.removeEventListener("pointerup", continueInvitation, true);
      window.removeEventListener("touchend", continueInvitation, true);
      window.removeEventListener("keydown", continueFromKeyboard);
    };
  }, [invitationState]);

  const countdownItems = useMemo(
    () => [
      ["Days", countdown.days],
      ["Hours", countdown.hours],
      ["Minutes", countdown.minutes],
      ["Seconds", countdown.seconds],
    ],
    [countdown],
  );

  const openInvitation = () => {
    if (invitationState !== "sealed") return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setInvitationState("revealed");
      return;
    }
    setInvitationState("untying");
    window.setTimeout(() => setInvitationState("opening"), 1070);
    window.setTimeout(() => setInvitationState("revealed"), 3000);
  };

  const shareInvitation = async () => {
    const shareData = {
      title: "Meet & Pooja — Wedding Invitation",
      text: `Join us as Meet and Pooja begin their forever, ${displayDetails.dateLine}.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareMessage("Invitation shared");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareMessage("Link copied");
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") setShareMessage("Share this page from your browser");
    }
    window.setTimeout(() => setShareMessage(""), 2400);
  };

  return (
    <main className={`invitation-${invitationState}`}>
      <div className={`invitation-gate gate-${invitationState}`} aria-hidden={invitationState === "open"}>
        <div className="gate-atmosphere" />
        <p className="gate-kicker">A celebration awaits</p>
        <div className="gate-inner-card" aria-hidden={invitationState !== "revealed"}>
          <span className="inner-floret">✦</span>
          <p>Together with their families</p>
          <div className="inner-names"><span>Meet</span><i>&</i><span>Pooja</span></div>
          <div className={`inner-rule${displayDetails.lastDate ? "" : " inner-rule-single"}`}>
            <b>{displayDetails.firstDate}</b>
            <span>September</span>
            {displayDetails.lastDate && <b>{displayDetails.lastDate}</b>}
          </div>
          <small>{displayDetails.openingNote}</small>
        </div>
        <button
          className="cover-button"
          type="button"
          onClick={openInvitation}
          aria-label="Pull the satin ribbon and open Meet and Pooja's wedding invitation"
          disabled={invitationState !== "sealed"}
        >
          <span className="cover-shadow" />
          <span className="cover-flap cover-flap-top" />
          <span className="cover-flap cover-flap-right" />
          <span className="cover-flap cover-flap-bottom" />
          <span className="cover-flap cover-flap-left" />
          <span className="satin-ribbons" aria-hidden="true">
            <i className="ribbon-strip ribbon-horizontal ribbon-left" />
            <i className="ribbon-strip ribbon-horizontal ribbon-right" />
            <i className="ribbon-strip ribbon-vertical ribbon-top" />
            <i className="ribbon-strip ribbon-vertical ribbon-bottom" />
          </span>
          <span className="satin-bow" aria-hidden="true">
            <i className="bow-piece bow-tail-left" />
            <i className="bow-piece bow-tail-right" />
            <i className="bow-piece bow-loop-left" />
            <i className="bow-piece bow-loop-right" />
            <i className="bow-piece bow-center" />
          </span>
        </button>
        <div className="gate-prompt" aria-live="polite">
          <span className="prompt-sealed"><i /> Tap to pull the ribbon</span>
          <span className="prompt-untying">Pulling the satin ribbon <b><i /><i /><i /></b></span>
          <span className="prompt-opening">Opening your invitation <b><i /><i /><i /></b></span>
          <span className="prompt-revealed"><i /> Tap or swipe to continue</span>
        </div>
      </div>

      <section className="hero" id="home">
        <div className="hero-image" />
        <div className="hero-wash" />
        <div className="door door-left" />
        <div className="door door-right" />
        <div className="hero-content">
          <p className="eyebrow">Together with their families</p>
          <h1><span>Meet</span><i>&</i><span>Pooja</span></h1>
          <p className="hero-date">{displayDetails.dateLine}</p>
          <p className="hero-place">{displayDetails.placeLine}</p>
          <a className="scroll-cue" href="#story" aria-label="Explore the invitation">
            <span>Explore our celebration</span>
            <b>↓</b>
          </a>
        </div>
      </section>

      <section className="story paper-section" id="story">
        <div className="botanical botanical-left" aria-hidden="true">❦</div>
        <div className="botanical botanical-right" aria-hidden="true">❦</div>
        <p className="section-kicker">A new chapter</p>
        <h2>Two hearts,<br /><em>one beautiful forever.</em></h2>
        <div className="fine-rule"><span>✦</span></div>
        <p className="story-copy">
          Mrs. Dharmishtha and Mr. Ketan Modi request the pleasure of your gracious presence
          as their beloved daughter Pooja celebrates her wedding with Meet.
        </p>
        <p className="script-note">Your presence will make our joy complete.</p>
      </section>

      {invitationDetails && (
        <section className="personal-invitation paper-section" aria-label="Your invitation details">
          <div className="personal-invitation-card">
            <span className="personal-floret" aria-hidden="true">✦</span>
            <p className="section-kicker">Especially for you</p>
            {guestCopy && <p className="guest-allocation">{guestCopy}</p>}
            <p className="day-allocation">{displayDetails.invitationCopy}</p>
          </div>
        </section>
      )}

      <section className="venue-reveal" aria-label="Narayani Heights wedding venue">
        <div className="venue-sticky">
          <div className="venue-image" />
          <div className="venue-overlay" />
          <div className="venue-copy">
            <p className="section-kicker light">The celebration venue</p>
            <h2>Narayani<br /><em>Heights</em></h2>
            <p>Lush green lawns, grand gathering spaces, and an evening made for celebration.</p>
          </div>
        </div>
      </section>

      <section className="countdown-section paper-section" aria-label="Wedding countdown">
        <p className="section-kicker">Counting every moment</p>
        <h2>Until we celebrate</h2>
        <div className="countdown-grid" role="timer" aria-live="off">
          {countdownItems.map(([label, value]) => (
            <div className="countdown-unit" key={label}>
              <strong>{String(value).padStart(2, "0")}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <p className="countdown-date">{displayDetails.countdownLabel}</p>
      </section>

      <section className="events-section" id="events">
        <div className="events-heading">
          <p className="section-kicker">The wedding weekend</p>
          <h2>Celebrate with us</h2>
          <p>{displayDetails.eventCopy}</p>
        </div>
        <div className="event-list">
          {visibleEvents.map((event, index) => (
            <article className={`event-card${event.featured ? " event-featured" : ""}`} key={`${event.title}-${index}`}>
              <div className="event-date-block">
                <span>{event.day}</span>
                <strong>{event.date}</strong>
                <small>{event.month}</small>
              </div>
              <div className="event-details">
                <p className="event-index">0{index + 1}</p>
                <h3>{event.title}</h3>
                <p className="event-time">{event.time}</p>
                <p className="event-venue">{event.venue}</p>
                {event.map && <a href={event.map} target="_blank" rel="noreferrer">Open directions ↗</a>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="closing paper-section">
        <p className="section-kicker">With love</p>
        <h2>We cannot wait<br />to celebrate with you.</h2>
        <p className="closing-names">Meet <i>&</i> Pooja</p>
        <button className="share-button" type="button" onClick={shareInvitation}>
          <span>Share the invitation</span><b>↗</b>
        </button>
        <p className="share-status" aria-live="polite">{shareMessage}</p>
      </section>

      <button className="floating-share" type="button" onClick={shareInvitation} aria-label="Share this invitation">
        ↗ <span>Share</span>
      </button>
    </main>
  );
}

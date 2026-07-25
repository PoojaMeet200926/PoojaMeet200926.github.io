"use client";

import { useEffect, useMemo, useState } from "react";
import {
  COPY,
  type DayCount,
  type EventKey,
  type Language,
  type VenueKey,
  type WeekdayKey,
} from "./invitation-copy";
import { decodeInvitationToken } from "../lib/invitation-token.mjs";

type Countdown = { days: number; hours: number; minutes: number; seconds: number };
type InvitationDetails = {
  people: number | null;
  days: 1 | 2 | 3;
  side: "meet" | "pooja";
};

const TREMONT_LOCATION = "https://share.google/hWnrB6DVuauJ6YYIV";
const NARAYANI_HEIGHTS_LOCATION = "https://share.google/VsfLgB1XlksNToBEJ";

const INVITED_DAY_DETAILS = {
  1: {
    dates: ["20"],
    firstDate: "20",
    lastDate: null,
    countdownTarget: "2026-09-20T00:00:00+05:30",
  },
  2: {
    dates: ["19", "20"],
    firstDate: "19",
    lastDate: "20",
    countdownTarget: "2026-09-19T09:30:00+05:30",
  },
  3: {
    dates: ["18", "19", "20"],
    firstDate: "18",
    lastDate: "20",
    countdownTarget: "2026-09-18T00:00:00+05:30",
  },
} as const;

type WeddingEvent = {
  key: EventKey;
  weekday: WeekdayKey;
  date: string;
  venue: VenueKey;
  map: string;
  featured?: boolean;
};

const EVENTS: WeddingEvent[] = [
  {
    key: "ganesh",
    weekday: "friday",
    date: "18",
    venue: "tremont",
    map: TREMONT_LOCATION,
  },
  {
    key: "mehendi",
    weekday: "friday",
    date: "18",
    venue: "tremont",
    map: TREMONT_LOCATION,
  },
  {
    key: "ring",
    weekday: "saturday",
    date: "19",
    venue: "narayani",
    map: NARAYANI_HEIGHTS_LOCATION,
  },
  {
    key: "haldi",
    weekday: "saturday",
    date: "19",
    venue: "narayani",
    map: NARAYANI_HEIGHTS_LOCATION,
  },
  {
    key: "mameru",
    weekday: "saturday",
    date: "19",
    venue: "narayani",
    map: NARAYANI_HEIGHTS_LOCATION,
  },
  {
    key: "sangeet",
    weekday: "saturday",
    date: "19",
    venue: "narayani",
    map: NARAYANI_HEIGHTS_LOCATION,
  },
  {
    key: "wedding",
    weekday: "sunday",
    date: "20",
    venue: "narayani",
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
  const [language, setLanguage] = useState<Language>("en");
  const [shareMessage, setShareMessage] = useState("");

  const copy = COPY[language];
  const selectedDays: DayCount = invitationDetails?.days ?? 2;
  const selectedDayDetails = INVITED_DAY_DETAILS[selectedDays];
  const selectedDayCopy = copy.days[selectedDays];
  const displayDetails = {
    ...selectedDayDetails,
    ...selectedDayCopy,
    dates: invitationDetails ? selectedDayDetails.dates : INVITED_DAY_DETAILS[3].dates,
    eventCopy: invitationDetails ? selectedDayCopy.eventCopy : copy.days[3].eventCopy,
    placeLine: invitationDetails ? selectedDayCopy.placeLine : copy.days[3].placeLine,
  };
  const firstPerson = invitationDetails?.side === "pooja" ? "pooja" : "meet";
  const secondPerson = firstPerson === "pooja" ? "meet" : "pooja";
  const firstName = copy.names[firstPerson];
  const secondName = copy.names[secondPerson];

  const visibleEvents = useMemo(() => {
    if (!invitationDetails) return EVENTS;
    const invitedDates = new Set<string>(INVITED_DAY_DETAILS[invitationDetails.days].dates);
    return EVENTS.filter((event) => invitedDates.has(event.date));
  }, [invitationDetails]);

  const guestCopy = invitationDetails?.people
    ? invitationDetails.people === 1
      ? copy.guestOne
      : copy.guestMany(invitationDetails.people)
    : null;

  useEffect(() => {
    try {
      const savedLanguage = window.localStorage.getItem("invitation-language");
      if (savedLanguage === "gu") setLanguage("gu");
    } catch {
      // The toggle still works when storage is unavailable.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "gu" ? "gu" : "en";
  }, [language]);

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

    const continueInvitation = (event: Event) => {
      if (event.target instanceof Element && event.target.closest(".language-toggle")) return;
      setInvitationState("open");
    };
    const continueFromKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") continueInvitation(event);
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
    () => copy.countdownUnits.map((label, index) => [
      label,
      [countdown.days, countdown.hours, countdown.minutes, countdown.seconds][index],
    ]),
    [copy.countdownUnits, countdown],
  );

  const toggleLanguage = () => {
    setLanguage((current) => {
      const next = current === "en" ? "gu" : "en";
      try {
        window.localStorage.setItem("invitation-language", next);
      } catch {
        // Some privacy modes disable storage; keep the in-page selection active.
      }
      return next;
    });
  };

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
      title: copy.shareTitle(firstName, secondName),
      text: copy.shareText(firstName, secondName, displayDetails.dateLine),
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareMessage(copy.invitationShared);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareMessage(copy.linkCopied);
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") setShareMessage(copy.shareFromBrowser);
    }
    window.setTimeout(() => setShareMessage(""), 2400);
  };

  return (
    <main className={`invitation-${invitationState} language-${language}`}>
      <button
        className="language-toggle"
        type="button"
        onClick={toggleLanguage}
        aria-label={copy.switchLanguage}
      >
        <span aria-hidden="true">{language === "en" ? "અ" : "A"}</span>
        <b>{copy.targetLanguage}</b>
      </button>
      <div className={`invitation-gate gate-${invitationState}`} aria-hidden={invitationState === "open"}>
        <div className="gate-atmosphere" />
        <p className="gate-kicker">{copy.celebrationAwaits}</p>
        <div className="gate-inner-card" aria-hidden={invitationState !== "revealed"}>
          <span className="inner-floret">✦</span>
          <p>{copy.familyLine}</p>
          <div className="inner-names"><span>{firstName}</span><i>&</i><span>{secondName}</span></div>
          <div className={`inner-rule${displayDetails.lastDate ? "" : " inner-rule-single"}`}>
            <b>{displayDetails.firstDate}</b>
            <span>{copy.month}</span>
            {displayDetails.lastDate && <b>{displayDetails.lastDate}</b>}
          </div>
          <small>{displayDetails.openingNote}</small>
        </div>
        <button
          className="cover-button"
          type="button"
          onClick={openInvitation}
          aria-label={copy.openInvitation(firstName, secondName)}
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
          <span className="prompt-sealed"><i /> {copy.tapPull}</span>
          <span className="prompt-untying">{copy.pullingRibbon} <b><i /><i /><i /></b></span>
          <span className="prompt-opening">{copy.openingInvitation} <b><i /><i /><i /></b></span>
          <span className="prompt-revealed"><i /> {copy.tapContinue}</span>
        </div>
      </div>

      <section className="hero" id="home">
        <div className="hero-image" />
        <div className="hero-wash" />
        <div className="door door-left" />
        <div className="door door-right" />
        <div className="hero-content">
          <p className="eyebrow">{copy.familyLine}</p>
          <h1><span>{firstName}</span><i>&</i><span>{secondName}</span></h1>
          <p className="hero-date">{displayDetails.dateLine}</p>
          <p className="hero-place">{displayDetails.placeLine}</p>
          <a className="scroll-cue" href="#story" aria-label={copy.exploreAria}>
            <span>{copy.explore}</span>
            <b>↓</b>
          </a>
        </div>
      </section>

      <section className="story paper-section" id="story">
        <div className="botanical botanical-left" aria-hidden="true">❦</div>
        <div className="botanical botanical-right" aria-hidden="true">❦</div>
        <p className="section-kicker">{copy.chapter}</p>
        <h2>{copy.storyLineOne}<br /><em>{copy.storyLineTwo}</em></h2>
        <div className="fine-rule"><span>✦</span></div>
        <p className="story-copy">
          {invitationDetails?.side === "meet" ? copy.storyMeet : copy.storyPooja}
        </p>
        <p className="script-note">{copy.presence}</p>
      </section>

      {invitationDetails && (
        <section className="personal-invitation paper-section" aria-label={copy.personalAria}>
          <div className="personal-invitation-card">
            <span className="personal-floret" aria-hidden="true">✦</span>
            <p className="section-kicker">{copy.especially}</p>
            {guestCopy && <p className="guest-allocation">{guestCopy}</p>}
            <p className="day-allocation">{displayDetails.invitationCopy}</p>
          </div>
        </section>
      )}

      <section className="venue-reveal" aria-label={copy.venueAria}>
        <div className="venue-sticky">
          <div className="venue-image" />
          <div className="venue-overlay" />
          <div className="venue-copy">
            <p className="section-kicker light">{copy.venueKicker}</p>
            <h2>{copy.narayani}<br /><em>{copy.heights}</em></h2>
            <p>{copy.venueDescription}</p>
          </div>
        </div>
      </section>

      <section className="countdown-section paper-section" aria-label={copy.countdownAria}>
        <p className="section-kicker">{copy.countdownKicker}</p>
        <h2>{copy.countdownHeading}</h2>
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
          <p className="section-kicker">{copy.weekend}</p>
          <h2>{copy.celebrate}</h2>
          <p>{displayDetails.eventCopy}</p>
        </div>
        <div className="event-list">
          {visibleEvents.map((event, index) => (
            <article className={`event-card${event.featured ? " event-featured" : ""}`} key={event.key}>
              <div className="event-date-block">
                <span>{copy.weekdays[event.weekday]}</span>
                <strong>{event.date}</strong>
                <small>{copy.month}</small>
              </div>
              <div className="event-details">
                <p className="event-index">0{index + 1}</p>
                <h3>{copy.eventTitles[event.key]}</h3>
                <p className="event-time">{event.featured ? copy.weds(firstName, secondName) : copy.eventTimes[event.key]}</p>
                <p className="event-venue">{copy.venues[event.venue]}</p>
                <a href={event.map} target="_blank" rel="noreferrer">{copy.directions}</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="closing paper-section">
        <p className="section-kicker">{copy.withLove}</p>
        <h2>{copy.closingLineOne}<br />{copy.closingLineTwo}</h2>
        <p className="closing-names">{firstName} <i>&</i> {secondName}</p>
        <button className="share-button" type="button" onClick={shareInvitation}>
          <span>{copy.shareInvitation}</span><b>↗</b>
        </button>
        <p className="share-status" aria-live="polite">{shareMessage}</p>
      </section>

      <button className="floating-share" type="button" onClick={shareInvitation} aria-label={copy.shareAria}>
        ↗ <span>{copy.share}</span>
      </button>
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";

type Countdown = { days: number; hours: number; minutes: number; seconds: number };

const EVENTS = [
  {
    day: "Friday",
    date: "18",
    month: "September",
    title: "Ganesh Sthapan · Mandap Muhurat · Grah Shanti",
    time: "An auspicious beginning",
    venue: "With the blessings of Lord Ganesha",
  },
  {
    day: "Friday",
    date: "18",
    month: "September",
    title: "Mehendi",
    time: "An afternoon of henna & happiness",
    venue: "B.1302, Tremont, Vaishnodevi Circle, Ahmedabad",
    map: "https://www.google.com/maps/search/?api=1&query=Tremont+Vaishnodevi+Circle+Ahmedabad",
  },
  {
    day: "Saturday",
    date: "19",
    month: "September",
    title: "Ring Ceremony",
    time: "09:30 AM",
    venue: "Narayani Heights Club & Resorts, Gandhinagar",
    map: "https://www.google.com/maps/search/?api=1&query=Narayani+Heights+Club+and+Resorts+Gandhinagar",
  },
  {
    day: "Saturday",
    date: "19",
    month: "September",
    title: "Haldi",
    time: "11:00 AM · Lunch at 12:30 PM",
    venue: "Narayani Heights Club & Resorts, Gandhinagar",
    map: "https://www.google.com/maps/search/?api=1&query=Narayani+Heights+Club+and+Resorts+Gandhinagar",
  },
  {
    day: "Saturday",
    date: "19",
    month: "September",
    title: "Mameru",
    time: "03:00 PM",
    venue: "A cherished family tradition",
  },
  {
    day: "Saturday",
    date: "19",
    month: "September",
    title: "Sangeet",
    time: "07:30 PM",
    venue: "An evening of music, dance & celebration",
  },
  {
    day: "Sunday",
    date: "20",
    month: "September",
    title: "Wedding Ceremony",
    time: "Pooja weds Meet",
    venue: "The beginning of forever",
    featured: true,
  },
];

function getCountdown(): Countdown {
  const distance = Math.max(0, new Date("2026-09-19T09:30:00+05:30").getTime() - Date.now());
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
}

export default function Home() {
  const [invitationState, setInvitationState] = useState<"sealed" | "opening" | "open">("sealed");
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    document.body.style.overflow = invitationState === "open" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [invitationState]);

  useEffect(() => {
    setCountdown(getCountdown());
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

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
    setInvitationState("opening");
    window.setTimeout(() => setInvitationState("open"), 1750);
  };

  const shareInvitation = async () => {
    const shareData = {
      title: "Meet & Pooja — Wedding Invitation",
      text: "Join us as Meet and Pooja begin their forever, 19–20 September 2026.",
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
    <main>
      <div className={`invitation-gate gate-${invitationState}`} aria-hidden={invitationState === "open"}>
        <div className="gate-glow" />
        <p className="gate-kicker">An invitation to celebrate</p>
        <button
          className="envelope-button"
          type="button"
          onClick={openInvitation}
          aria-label="Open Meet and Pooja's wedding invitation"
          disabled={invitationState !== "sealed"}
        >
          <span className="envelope-shadow" />
          <span className="envelope">
            <span className="envelope-back" />
            <span className="letter">
              <span className="letter-floret">✦</span>
              <span className="letter-names">Meet <i>&</i> Pooja</span>
              <span className="letter-date">19 · 20 · 09 · 26</span>
            </span>
            <span className="envelope-side envelope-left" />
            <span className="envelope-side envelope-right" />
            <span className="envelope-front" />
            <span className="envelope-flap" />
            <span className="wax-seal">M<span>♥</span>P</span>
          </span>
        </button>
        <p className="tap-copy">Tap to open</p>
      </div>

      <section className="hero" id="home">
        <div className="hero-image" />
        <div className="hero-wash" />
        <div className="door door-left" />
        <div className="door door-right" />
        <div className="hero-content">
          <p className="eyebrow">Together with their families</p>
          <h1><span>Meet</span><i>&</i><span>Pooja</span></h1>
          <p className="hero-date">19 — 20 September 2026</p>
          <p className="hero-place">Ahmedabad · Gandhinagar</p>
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

      <section className="venue-reveal" aria-label="Waterfront wedding venue">
        <div className="venue-sticky">
          <div className="venue-image" />
          <div className="venue-overlay" />
          <div className="venue-copy">
            <p className="section-kicker light">Where forever begins</p>
            <h2>A celebration<br /><em>by the water</em></h2>
            <p>Ivory blooms, still waters, and a horizon made for promises.</p>
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
        <p className="countdown-date">Saturday · 19 September · 09:30 AM</p>
      </section>

      <section className="events-section" id="events">
        <div className="events-heading">
          <p className="section-kicker">The wedding weekend</p>
          <h2>Celebrate with us</h2>
          <p>Three days of tradition, music, laughter, and love.</p>
        </div>
        <div className="event-list">
          {EVENTS.map((event, index) => (
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
                {event.map && <a href={event.map} target="_blank" rel="noreferrer">View location ↗</a>}
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

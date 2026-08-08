"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
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

const TREMONT_LOCATION = "https://maps.app.goo.gl/g4FNbs7ANbroAfxb8";
const NARAYANI_HEIGHTS_LOCATION = "https://maps.app.goo.gl/7QJob2xzgw7PQsBF9";

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
  meal?: "lunch" | "dinner";
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
    meal: "lunch",
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
    meal: "dinner",
  },
  {
    key: "wedding",
    weekday: "sunday",
    date: "20",
    venue: "narayani",
    map: NARAYANI_HEIGHTS_LOCATION,
    featured: true,
    meal: "lunch",
  },
];

const MEET_EVENTS: WeddingEvent[] = [
  {
    key: "ganesh",
    weekday: "sunday",
    date: "20",
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
    meal: "lunch",
  },
];

const POOJA_FAMILY_COMPLIMENTS = {
  en: [
    "G.S. Savitaben & Late Amrutbhai M. Modi",
    "Late Chandrikaben & Mr. Manaharbhai M. Modi",
    "G.S. Jyotsnaben & Late Kiritbhai A. Modi",
    "Mrs. Sangitaben & Mr. Sureshbhai A. Modi",
    "Mrs. Komal & Mr. Brijesh M. Modi",
    "Mrs. Kashish & Mr. Mitul K. Modi",
    "Mrs. Somya & Mr. Ishan S. Modi",
    "Mrs. Chinar & Mr. Monik S. Modi",
    "Mr. Krunal K. Modi",
  ],
  gu: [
    "ગં.સ્વ. સવિતાબેન અને સ્વ. અમૃતભાઈ એમ. મોદી",
    "સ્વ. ચંદ્રિકાબેન અને શ્રી મનહરભાઈ એમ. મોદી",
    "ગં.સ્વ. જ્યોત્સનાબેન અને સ્વ. કિરીટભાઈ એ. મોદી",
    "શ્રીમતી સંગીતાબેન અને શ્રી સુરેશભાઈ એ. મોદી",
    "શ્રીમતી કોમલ અને શ્રી બ્રિજેશ એમ. મોદી",
    "શ્રીમતી કશિશ અને શ્રી મિતુલ કે. મોદી",
    "શ્રીમતી સૌમ્યા અને શ્રી ઈશાન એસ. મોદી",
    "શ્રીમતી ચિનાર અને શ્રી મોનિક એસ. મોદી",
    "શ્રી કૃણાલ કે. મોદી",
  ],
} as const satisfies Record<Language, readonly string[]>;

type FamilyComplimentsGroup = {
  heading: string;
  rows: readonly (readonly string[])[];
};

const MEET_FAMILY_COMPLIMENTS = {
  en: [
    {
      heading: "Mama, Mami, Nana & Nani",
      rows: [
        ["Late Dahiben and Late Ramanlal Lalluram Modi"],
        ["Chandrakalaben and Late Navinchandra Modi"],
        ["Late Maheshkumar Modi"],
        ["Minaben and Umeshkumar Modi"],
        ["Surekhaben and Dineshkumar Modi"],
      ],
    },
    {
      heading: "Foi & Fua",
      rows: [
        ["Nilaben and Late Shashikant Modi"],
        ["Kalpanaben and Vasantkumar Modi"],
        ["Gitaben and Vijaykumar Modi"],
      ],
    },
    {
      heading: "Cherished Guests",
      rows: [
        ["Harsh Jitendrakumar Modi"],
        ["Vishwa Harsh Modi"],
        ["Karv Harsh Modi"],
      ],
    },
    {
      heading: "Bhai & Bhabhi",
      rows: [
        ["Sheetal and Jay Modi", "Krupaben and Kaushal Modi"],
        ["Chandni and Darshit Modi", "Dr. Nikiben and Dr. Ronak Modi"],
        ["Aarohi and Ishan Modi", "Yash Dineshbhai Modi"],
        ["Shivam and Rishit Mayurbhai Modi"],
      ],
    },
    {
      heading: "Kaka & Kaki",
      rows: [
        ["Shilpaben and Late Kirtikumar Modi"],
        ["Seemaben and Ashwinbhai Modi"],
        ["Diyaben and Umangbhai Modi"],
        ["Niruben and Mayurbhai Modi"],
        ["Sheetalben and Jatinbhai Modi"],
      ],
    },
    {
      heading: "Dada & Dadi",
      rows: [
        ["Late Champaben and Late Natvarlal Modi"],
        ["Savitaben and Late Bhogilal Modi"],
        ["Sharadaben and Mahendrabhai Modi"],
        ["Bharatiben and Pravinbhai Modi"],
      ],
    },
  ],
  gu: [
    {
      heading: "મામા, મામી, નાના, નાની",
      rows: [
        ["ડાહીબેન તથા રમણલાલ લલ્લુરામ મોદી"],
        ["ચંદ્રકલાબેન તથા સ્વ. નવીનચંદ્ર મોદી"],
        ["સ્વ. મહેશકુમાર મોદી"],
        ["મીનાબેન તથા ઉમેશકુમાર મોદી"],
        ["સુરેખાબેન તથા દિનેશકુમાર મોદી"],
      ],
    },
    {
      heading: "ફોઇ ફુઆ",
      rows: [
        ["નીલાબેન તથા સ્વ. શશિકાંત મોદી"],
        ["કલ્પનાબેન તથા વસંતકુમાર મોદી"],
        ["ગીતાબેન તથા વિજયકુમાર મોદી"],
      ],
    },
    {
      heading: "મોંઘેરા મહેમાન",
      rows: [
        ["હર્ષ જીતેન્દ્રકુમાર મોદી"],
        ["વિશ્વા હર્ષ મોદી"],
        ["કર્વ હર્ષ મોદી"],
      ],
    },
    {
      heading: "ભાઈ ભાભી",
      rows: [
        ["શીતલ જય મોદી", "કૃપાબેન તથા કૌશલ મોદી"],
        ["ચાંદની દર્શિત મોદી", "ડૉ. નિકીબેન તથા ડો. રોનક મોદી"],
        ["આરોહી ઈશાન મોદી", "યશ દિનેશભાઈ મોદી"],
        ["શિવમ, રીશીતા તથા મયુરભાઈ મોદી"],
      ],
    },
    {
      heading: "કાકા કાકી",
      rows: [
        ["શિલ્પાબેન તથા સ્વ. કીર્તિકુમાર મોદી"],
        ["સીમાબેન તથા અશ્વિનભાઈ મોદી"],
        ["દિયાબેન તથા ઉમંગભાઈ મોદી"],
        ["શીતલબેન તથા જતીનભાઈ મોદી"],
        ["નીરુબેન તથા મયુરભાઈ મોદી"],
      ],
    },
    {
      heading: "દાદા, દાદી",
      rows: [
        ["સ્વ. ચંપાબેન તથા સ્વ. નટવરલાલ મોદી"],
        ["સવિતાબેન તથા સ્વ. ભોગીલાલ મોદી"],
        ["શારદાબેન તથા મહેન્દ્રભાઈ મોદી"],
        ["ભારતીબેન તથા પ્રવિણભાઈ મોદી"],
      ],
    },
  ],
} as const satisfies Record<Language, readonly FamilyComplimentsGroup[]>;

const POOJA_YOUNG_FAMILY = {
  en: ["Devyanshi", "Naisha", "Dhruv", "Roohani", "Radhika"],
  gu: ["દેવ્યાંશી", "નાયશા", "ધ્રુવ", "રૂહાની", "રાધિકા"],
} as const satisfies Record<Language, readonly string[]>;

const POOJA_INVITERS = {
  en: {
    heading: "Inviters",
    phoneLabel: "Mo.",
    names: ["Mr. Ketan Amrutlal Modi", "Mrs. Dharmishtha Ketan Modi"],
  },
  gu: {
    heading: "નિમંત્રક",
    phoneLabel: "મો.",
    names: ["શ્રી કેતન અમૃતલાલ મોદી", "શ્રીમતી ધર્મિષ્ઠા કેતન મોદી"],
  },
} as const satisfies Record<Language, { heading: string; phoneLabel: string; names: readonly string[] }>;

const POOJA_CONTACT_NUMBERS = [
  { display: "9892701070", href: "tel:+919892701070" },
  { display: "9223375075", href: "tel:+919223375075" },
] as const;

const GUJARATI_DIGITS = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"] as const;

function localizeDigits(value: string | number, language: Language) {
  const text = String(value);
  if (language !== "gu") return text;
  return text.replace(/\d/g, (digit) => GUJARATI_DIGITS[Number(digit)]);
}

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
  const openingStartedRef = useRef(false);
  const openingGestureRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);

  const copy = COPY[language];
  const isMeetSide = invitationDetails?.side === "meet";
  const selectedDays: DayCount = isMeetSide ? 1 : invitationDetails?.days ?? 2;
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
  const showPoojaBlessings = invitationDetails?.side === "pooja";
  const showOpeningBlessings = invitationDetails !== null;
  const formatDigits = (value: string | number) => localizeDigits(value, language);

  const visibleEvents = useMemo(() => {
    if (invitationDetails?.side === "meet") return MEET_EVENTS;
    if (!invitationDetails) return EVENTS;
    const invitedDates = new Set<string>(INVITED_DAY_DETAILS[invitationDetails.days].dates);
    return EVENTS.filter((event) => invitedDates.has(event.date));
  }, [invitationDetails]);

  const rawGuestCopy = invitationDetails?.people
    ? invitationDetails.people === 1
      ? copy.guestOne
      : copy.guestMany(invitationDetails.people)
    : null;
  const guestCopy = rawGuestCopy ? formatDigits(rawGuestCopy) : null;

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
    if (language !== "gu" || document.getElementById("noto-serif-gujarati")) return;
    const fontStylesheet = document.createElement("link");
    fontStylesheet.id = "noto-serif-gujarati";
    fontStylesheet.rel = "stylesheet";
    fontStylesheet.href = "https://fonts.googleapis.com/css2?family=Noto+Serif+Gujarati:wght@400;500;600&display=swap";
    document.head.append(fontStylesheet);
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
    if (invitationState !== "sealed" || openingStartedRef.current) return;
    openingStartedRef.current = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setInvitationState("revealed");
      return;
    }
    setInvitationState("untying");
    window.setTimeout(() => setInvitationState("opening"), 1070);
    window.setTimeout(() => setInvitationState("revealed"), 3000);
  };

  const beginOpeningGesture = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (invitationState !== "sealed") return;
    openingGestureRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const continueOpeningGesture = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = openingGestureRef.current;
    if (!start || start.pointerId !== event.pointerId) return;
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) < 18) return;

    openingGestureRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    openInvitation();
  };

  const finishOpeningGesture = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = openingGestureRef.current;
    if (!start || start.pointerId !== event.pointerId) return;
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) >= 18) {
      continueOpeningGesture(event);
      return;
    }

    openingGestureRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    openInvitation();
  };

  const cancelOpeningGesture = () => {
    openingGestureRef.current = null;
  };

  const openFromWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (invitationState !== "sealed" || Math.abs(event.deltaX) + Math.abs(event.deltaY) < 1) return;
    event.preventDefault();
    openInvitation();
  };

  const openFromKeyboard = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    openInvitation();
  };

  const shareInvitation = async () => {
    const shareData = {
      title: copy.shareTitle(firstName, secondName),
      text: copy.shareText(firstName, secondName, formatDigits(displayDetails.dateLine)),
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
      <div className="falling-botanicals" aria-hidden="true">
        {Array.from({ length: 14 }, (_, index) => (
          <span className={index % 4 === 3 ? "falling-leaf" : "falling-petal"} key={index} />
        ))}
      </div>
      <button
        className="language-toggle"
        type="button"
        onClick={toggleLanguage}
        aria-label={copy.switchLanguage}
      >
        <span className={`language-option${language === "en" ? " is-active" : ""}`} aria-hidden="true">EN</span>
        <span className={`language-option language-option-gu${language === "gu" ? " is-active" : ""}`} aria-hidden="true">ગુ</span>
      </button>
      <div
        className={`invitation-gate gate-${invitationState}`}
        aria-hidden={invitationState === "open"}
        onPointerDown={beginOpeningGesture}
        onPointerMove={continueOpeningGesture}
        onPointerUp={finishOpeningGesture}
        onPointerCancel={cancelOpeningGesture}
        onWheel={openFromWheel}
      >
        <div className="gate-atmosphere" />
        <p className="gate-kicker">{copy.celebrationAwaits}</p>
        <div
          className={`gate-inner-card${showOpeningBlessings ? " gate-inner-card-blessed" : ""}${isMeetSide ? " gate-inner-card-meet" : ""}`}
          aria-hidden={invitationState !== "revealed"}
        >
          {showOpeningBlessings ? (
            <>
              <div
                className="ganesh-emblem"
                role="img"
                aria-label={copy.ganeshBlessingAlt}
              />
              <p className="gate-blessing-invocation">{copy.ganeshInvocation}</p>
              {isMeetSide && (
                <p className="gate-blessing-invocation gate-blessing-invocation-secondary">
                  {copy.mahalaxmiInvocation}
                </p>
              )}
            </>
          ) : (
            <span className="inner-floret">✦</span>
          )}
          <p className="gate-family-line">{copy.familyLine}</p>
          <div className="inner-names"><span>{firstName}</span><i>&</i><span>{secondName}</span></div>
          <div className={`inner-rule${displayDetails.lastDate ? "" : " inner-rule-single"}`}>
            <b>{formatDigits(displayDetails.firstDate)}</b>
            <span>{copy.month}</span>
            {displayDetails.lastDate && <b>{formatDigits(displayDetails.lastDate)}</b>}
          </div>
          <small>{displayDetails.openingNote}</small>
        </div>
        <button
          className="cover-button"
          type="button"
          onClick={openInvitation}
          onKeyDown={openFromKeyboard}
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

      <section className={`hero${showPoojaBlessings ? " hero-pooja" : ""}${isMeetSide ? " hero-meet" : ""}`} id="home">
        <div className="hero-image" />
        <div className="hero-wash" />
        <div className="door door-left" />
        <div className="door door-right" />
        {showPoojaBlessings && (
          <div className="hero-om-shanti" role="img" aria-label={copy.omShantiAlt} />
        )}
        {isMeetSide && (
          <div className="hero-deity-trio" role="img" aria-label={copy.deityTrioAlt} />
        )}
        <div className="hero-content">
          <p className="eyebrow">{copy.familyLine}</p>
          <h1><span>{firstName}</span><i>&</i><span>{secondName}</span></h1>
          <p className="hero-date">{formatDigits(displayDetails.dateLine)}</p>
          <p className="hero-place">{displayDetails.placeLine}</p>
        </div>
        <a className="hero-next-button" href="#story" aria-label={copy.exploreAria}>
          <span>{copy.explore}</span>
          <b aria-hidden="true">↓</b>
        </a>
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

      {isMeetSide && (
        <section className="meet-family-message paper-section" aria-label={copy.meetFamilyMessage.ariaLabel}>
          <div className="meet-family-message-card">
            <p className="section-kicker">{copy.meetFamilyMessage.kicker}</p>
            <h2>{copy.meetFamilyMessage.heading}</h2>
            <p className="meet-family-verse">{copy.meetFamilyMessage.verse}</p>
            <div className="fine-rule" aria-hidden="true"><span>✦</span></div>
            <p className="meet-family-home">{copy.meetFamilyMessage.familyHome}</p>
            <p className="meet-family-copy">{copy.meetFamilyMessage.invitation}</p>
            <p className="meet-family-copy">{formatDigits(copy.meetFamilyMessage.auspicious)}</p>
            <div className="meet-family-couple">
              <strong>{copy.meetFamilyMessage.groom}</strong>
              <span>{copy.meetFamilyMessage.union}</span>
              <strong>{copy.meetFamilyMessage.bride}</strong>
            </div>
            <p className="meet-family-inlaws">{copy.meetFamilyMessage.inLaws}</p>
            <div className="meet-parent-pairs">
              {copy.meetFamilyMessage.parentPairs.map((pair) => (
                <div className="meet-parent-pair" key={pair.join("-")}>
                  <span>{pair[0]}</span>
                  <span>{pair[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {invitationDetails && (
        <section className="personal-invitation paper-section" aria-label={copy.personalAria}>
          <div className="personal-invitation-card">
            <span className="personal-floret" aria-hidden="true">✦</span>
            <p className="section-kicker">{copy.especially}</p>
            {guestCopy && <p className="guest-allocation">{guestCopy}</p>}
            <p className="day-allocation">{formatDigits(displayDetails.invitationCopy)}</p>
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
        <div className="countdown-jaali" aria-hidden="true" />
        <div className="countdown-botanical countdown-botanical-left" aria-hidden="true">❦</div>
        <div className="countdown-botanical countdown-botanical-right" aria-hidden="true">❦</div>
        <p className="section-kicker">{copy.countdownKicker}</p>
        <h2>{copy.countdownHeading}</h2>
        <div className="countdown-grid" role="timer" aria-live="off">
          {countdownItems.map(([label, value]) => (
            <div className="countdown-unit" key={label}>
              <strong>{formatDigits(String(value).padStart(2, "0"))}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <p className="countdown-date">{formatDigits(displayDetails.countdownLabel)}</p>
      </section>

      <section className="events-section" id="events">
        <div className="event-garland" aria-hidden="true" />
        <div className="events-heading">
          <p className="section-kicker">{copy.weekend}</p>
          <h2>{copy.celebrate}</h2>
          <p>{formatDigits(isMeetSide ? copy.meetEventCopy : displayDetails.eventCopy)}</p>
        </div>
        <div className="event-list">
          {visibleEvents.map((event, index) => (
            <article className={`event-card${event.featured ? " event-featured" : ""}`} key={event.key}>
              <div className="event-date-block">
                <span>{copy.weekdays[event.weekday]}</span>
                <strong>{formatDigits(event.date)}</strong>
                <small>{copy.month}</small>
              </div>
              <div className="event-details">
                <p className="event-index">{formatDigits(String(index + 1).padStart(2, "0"))}</p>
                {event.key === "wedding" ? (
                  <div className="event-schedule-pair event-schedule-pair-wedding">
                    <div className="event-schedule-item">
                      <h3>{copy.eventTitles.wedding}</h3>
                      <p className="event-time">{copy.weds(firstName, secondName)}</p>
                    </div>
                    <div className="event-schedule-stack">
                      <div className="event-schedule-item">
                        <h3>{copy.hastaMelapTitle}</h3>
                        <p className="event-time">{formatDigits(copy.hastaMelapTime)}</p>
                      </div>
                      <div className="event-schedule-item">
                        <h3>{copy.lunchTitle}</h3>
                        <p className="event-time">{formatDigits(copy.lunchTime)}</p>
                      </div>
                      <div className="event-schedule-item">
                        <h3>{copy.eventTitles.vidai}</h3>
                        <p className="event-time">{formatDigits(copy.eventTimes.vidai)}</p>
                      </div>
                    </div>
                  </div>
                ) : event.meal ? (
                  <div className="event-schedule-pair">
                    <div className="event-schedule-item">
                      <h3>{copy.eventTitles[event.key]}</h3>
                      <p className="event-time">
                        {formatDigits(event.key === "wedding" ? copy.weds(firstName, secondName) : copy.eventTimes[event.key])}
                      </p>
                    </div>
                    <div className="event-schedule-item">
                      <h3>{event.meal === "dinner" ? copy.dinnerTitle : copy.lunchTitle}</h3>
                      <p className="event-time">{formatDigits(event.meal === "dinner" ? copy.dinnerTime : copy.lunchTime)}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {event.key === "ganesh" ? (
                      <h3 className={`event-title-lines${isMeetSide ? " event-title-lines-meet" : ""}`}>
                        {(isMeetSide ? copy.meetGaneshTitleLines : copy.ganeshTitleLines).map((line) => <span key={line}>{line}</span>)}
                      </h3>
                    ) : (
                      <h3>{copy.eventTitles[event.key]}</h3>
                    )}
                    <p className="event-time">
                      {formatDigits(isMeetSide && event.key === "ganesh" ? copy.meetGaneshTime : copy.eventTimes[event.key])}
                    </p>
                  </>
                )}
                <p className="event-venue">{formatDigits(copy.venues[event.venue])}</p>
                <a href={event.map} target="_blank" rel="noreferrer">
                  <span className="location-pin" aria-hidden="true" />
                  <span>{copy.directions}</span>
                </a>
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

      {invitationDetails && (
        <section
          className={`family-compliments${isMeetSide ? " family-compliments-meet" : ""}`}
          aria-label={isMeetSide ? copy.meetComplimentsAria : copy.complimentsAria}
        >
          <div className="compliments-ornament compliments-ornament-left" aria-hidden="true">❦</div>
          <div className="compliments-ornament compliments-ornament-right" aria-hidden="true">❦</div>
          <div className={`compliments-card${isMeetSide ? " compliments-card-meet" : ""}`}>
            <div className="compliments-heading-panel">
              <p className="compliments-monogram" aria-label={`${firstName} & ${secondName}`}>
                <span>{firstName}</span><i aria-hidden="true">&</i><span>{secondName}</span>
              </p>
              <p className="section-kicker">{copy.complimentsKicker}</p>
              <h2>{copy.complimentsHeading}</h2>
              <div className="compliments-rule" aria-hidden="true"><span>✦</span></div>
            </div>
            {isMeetSide ? (
              <div className="meet-compliments-groups">
                {MEET_FAMILY_COMPLIMENTS[language].map((group) => (
                  <section className="meet-compliments-group" key={group.heading}>
                    <h3>{group.heading}</h3>
                    <div className="meet-compliments-rows">
                      {group.rows.map((row, rowIndex) => (
                        <div
                          className={`meet-compliments-row${row.length > 1 ? " is-paired" : ""}`}
                          key={`${group.heading}-${rowIndex}`}
                        >
                          {row.map((name) => <p key={name}>{name}</p>)}
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <>
                <ul className="compliments-list">
                  {POOJA_FAMILY_COMPLIMENTS[language].map((name) => <li key={name}>{name}</li>)}
                </ul>
                <div className="compliments-younger" aria-label={copy.youngerFamilyAria}>
                  {POOJA_YOUNG_FAMILY[language].map((name) => <span key={name}>{name}</span>)}
                </div>
                <div className="compliments-contact">
                  <p className="compliments-contact-heading">{POOJA_INVITERS[language].heading}</p>
                  <div className="compliments-contact-names">
                    {POOJA_INVITERS[language].names.map((name) => <p key={name}>{name}</p>)}
                  </div>
                  <p className="compliments-contact-phones">
                    <span>{POOJA_INVITERS[language].phoneLabel}</span>{" "}
                    {POOJA_CONTACT_NUMBERS.map((phone, index) => (
                      <span key={phone.display}>
                        <a href={phone.href} aria-label={`Call ${phone.display}`}>{formatDigits(phone.display)}</a>
                        {index < POOJA_CONTACT_NUMBERS.length - 1 && ", "}
                      </span>
                    ))}
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <button className="floating-share" type="button" onClick={shareInvitation} aria-label={copy.shareAria}>
        ↗ <span>{copy.share}</span>
      </button>
    </main>
  );
}

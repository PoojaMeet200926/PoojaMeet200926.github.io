"use client";

import Image from "next/image";
import {
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { invitation } from "../data/invitation";

type OpeningState =
  | "sealed"
  | "loading"
  | "playing"
  | "finishing"
  | "failed"
  | "skipped"
  | "open";

const HANDOFF_MS = 700;
const MAX_PLAYBACK_MS = 10_000;

const statusText: Record<OpeningState, string> = {
  sealed: "Invitation ready to open",
  loading: "Preparing your invitation",
  playing: "Opening your invitation",
  finishing: "Invitation opened",
  failed: "Opening video unavailable. Entering the invitation.",
  skipped: "Opening skipped. Entering the invitation.",
  open: "Invitation open",
};

export function InvitationExperience({ children }: { children: ReactNode }) {
  const [openingState, setOpeningState] = useState<OpeningState>("sealed");
  const [mediaUnavailable, setMediaUnavailable] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const exitStartedRef = useRef(false);
  const playbackTimerRef = useRef<number | null>(null);
  const handoffTimerRef = useRef<number | null>(null);
  const keyboardActivationRef = useRef(false);

  const clearPlaybackTimer = useCallback(() => {
    if (playbackTimerRef.current !== null) {
      window.clearTimeout(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
  }, []);

  const completeHandoff = useCallback(
    (nextState: "finishing" | "failed" | "skipped") => {
      if (exitStartedRef.current) return;
      exitStartedRef.current = true;
      clearPlaybackTimer();

      const video = videoRef.current;
      if (nextState !== "finishing" && video) video.pause();

      setOpeningState(nextState);
      handoffTimerRef.current = window.setTimeout(() => {
        setOpeningState("open");
      }, HANDOFF_MS);
    },
    [clearPlaybackTimer],
  );

  useEffect(() => {
    if (openingState === "open") return;

    const previousOverflow = document.body.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscroll;
    };
  }, [openingState]);

  useEffect(
    () => () => {
      clearPlaybackTimer();
      if (handoffTimerRef.current !== null) {
        window.clearTimeout(handoffTimerRef.current);
      }
      videoRef.current?.pause();
    },
    [clearPlaybackTimer],
  );

  useEffect(() => {
    if (openingState !== "open" || !keyboardActivationRef.current) return;
    document.getElementById("invitation-heading")?.focus({ preventScroll: true });
  }, [openingState]);

  const schedulePlaybackFallback = () => {
    clearPlaybackTimer();
    const video = videoRef.current;
    const remainingMs =
      video && Number.isFinite(video.duration) && video.duration > 0
        ? Math.max(1_000, (video.duration - video.currentTime) * 1_000 + 1_200)
        : MAX_PLAYBACK_MS;

    playbackTimerRef.current = window.setTimeout(
      () => completeHandoff("failed"),
      Math.min(remainingMs, MAX_PLAYBACK_MS),
    );
  };

  const openInvitation = async (event: MouseEvent<HTMLButtonElement>) => {
    if (openingState !== "sealed") return;
    keyboardActivationRef.current = event.detail === 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      completeHandoff("skipped");
      return;
    }

    const video = videoRef.current;
    if (!video || mediaUnavailable) {
      completeHandoff("failed");
      return;
    }

    setOpeningState("loading");

    try {
      video.currentTime = 0;
      await video.play();
      if (exitStartedRef.current) return;
      setOpeningState("playing");
      schedulePlaybackFallback();
    } catch {
      completeHandoff("failed");
    }
  };

  const handleMediaError = () => {
    setMediaUnavailable(true);
    if (openingState === "loading" || openingState === "playing") {
      completeHandoff("failed");
    }
  };

  const isOpen = openingState === "open";
  const isExiting = ["finishing", "failed", "skipped", "open"].includes(openingState);

  return (
    <main className={`invitation invitation-${openingState}`}>
      <div
        className={`invitation-gate gate-${openingState}`}
        role="dialog"
        aria-modal={!isOpen}
        aria-labelledby="open-invitation-title"
        aria-hidden={isOpen}
      >
        <div className="opening-stage">
          <Image
            className="opening-cover"
            src={invitation.media.openingPoster}
            alt=""
            fill
            priority
            sizes="100vw"
          />
          <video
            ref={videoRef}
            className="ribbon-opening-video"
            src={invitation.media.openingVideo}
            poster={invitation.media.openingPoster}
            playsInline
            preload="metadata"
            controls={false}
            disablePictureInPicture
            onPlaying={() => {
              if (!exitStartedRef.current) setOpeningState("playing");
            }}
            onEnded={() => completeHandoff("finishing")}
            onError={handleMediaError}
            aria-label="Realistic ribbon opening"
          />
          <div className="gate-shade" aria-hidden="true" />
        </div>

        <div className="gate-copy">
          <p className="gate-kicker">A celebration awaits</p>
          <h1 id="open-invitation-title">
            <span>{invitation.couple.bride}</span>
            <i>&amp;</i>
            <span>{invitation.couple.groom}</span>
          </h1>
          <p className="gate-date">{invitation.celebration.displayDates}</p>
        </div>

        <button
          className="open-invitation-button"
          type="button"
          onClick={openInvitation}
          disabled={openingState !== "sealed"}
        >
          <span className="button-seal" aria-hidden="true">
            P<i>♥</i>M
          </span>
          <span>Open Invitation</span>
        </button>

        {(openingState === "loading" || openingState === "playing") && (
          <button
            className="skip-opening-button"
            type="button"
            onClick={() => completeHandoff("skipped")}
          >
            Skip opening
          </button>
        )}

        <p className="gate-status" role="status" aria-live="polite">
          {mediaUnavailable && openingState === "sealed"
            ? "Video unavailable. Tap to enter."
            : statusText[openingState]}
        </p>
      </div>

      <div
        className="invitation-content"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        {children}
      </div>

      <noscript>
        <style>{".invitation-gate,.invitation-content{display:none!important}"}</style>
        <section className="noscript-invitation">
          <h1>{invitation.couple.display}</h1>
          <p>Wedding celebrations · {invitation.celebration.displayDates}</p>
          <p>{invitation.invitationMessage}</p>
          <p>Please enable JavaScript for the interactive opening and full event schedule.</p>
        </section>
      </noscript>

      {isExiting && <span className="sr-only">The invitation is now available.</span>}
    </main>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { invitation } from "../data/invitation";

export function ShareInvitation({ floating = false }: { floating?: boolean }) {
  const [message, setMessage] = useState("");
  const clearTimerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (clearTimerRef.current !== null) window.clearTimeout(clearTimerRef.current);
    },
    [],
  );

  const updateMessage = (nextMessage: string) => {
    setMessage(nextMessage);
    if (clearTimerRef.current !== null) window.clearTimeout(clearTimerRef.current);
    clearTimerRef.current = window.setTimeout(() => setMessage(""), 2_800);
  };

  const shareInvitation = async () => {
    const shareData = {
      title: invitation.share.title,
      text: invitation.share.text,
      url: window.location.href,
    };

    try {
      if (typeof navigator.share === "function") {
        await navigator.share(shareData);
        updateMessage("Invitation shared.");
        return;
      }

      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(shareData.url);
        updateMessage("Invitation link copied.");
        return;
      }

      updateMessage("Copy this page’s address from your browser to share it.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      updateMessage("Sharing is unavailable. Copy this page’s address from your browser.");
    }
  };

  if (floating) {
    return (
      <>
        <button
          className="floating-share"
          type="button"
          onClick={shareInvitation}
          aria-describedby={message ? "floating-share-status" : undefined}
        >
          <span aria-hidden="true">↗</span> Share
        </button>
        <span className="sr-only" id="floating-share-status" role="status" aria-live="polite">
          {message}
        </span>
      </>
    );
  }

  return (
    <>
      <button className="share-button" type="button" onClick={shareInvitation}>
        <span>Share the invitation</span>
        <b aria-hidden="true">↗</b>
      </button>
      <p className="share-status" role="status" aria-live="polite">
        {message}
      </p>
    </>
  );
}

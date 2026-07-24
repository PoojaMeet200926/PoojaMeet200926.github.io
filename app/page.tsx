import Image from "next/image";
import { Countdown } from "./components/Countdown";
import { EventSchedule } from "./components/EventSchedule";
import { InvitationExperience } from "./components/InvitationExperience";
import { ShareInvitation } from "./components/ShareInvitation";
import { invitation, venues } from "./data/invitation";

export default function Home() {
  return (
    <InvitationExperience>
      <section className="hero" id="home" aria-labelledby="invitation-heading">
        <Image
          className="hero-image"
          src={invitation.media.heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-wash" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow">Together with their families</p>
          <h1 id="invitation-heading" tabIndex={-1}>
            <span>{invitation.couple.bride}</span>
            <i>&amp;</i>
            <span>{invitation.couple.groom}</span>
          </h1>
          <p className="hero-date">{invitation.celebration.displayDates}</p>
          <a className="scroll-cue" href="#story">
            <span>Explore the celebration</span>
            <b aria-hidden="true">↓</b>
          </a>
        </div>
      </section>

      <section className="story paper-section" id="story" aria-labelledby="story-heading">
        <div className="botanical botanical-left" aria-hidden="true">
          ❦
        </div>
        <div className="botanical botanical-right" aria-hidden="true">
          ❦
        </div>
        <p className="section-kicker">A new chapter</p>
        <h2 id="story-heading">
          Two hearts,
          <br />
          <em>one beautiful forever.</em>
        </h2>
        <div className="fine-rule" aria-hidden="true">
          <span>✦</span>
        </div>
        <p className="story-copy">{invitation.invitationMessage}</p>
        <p className="script-note">Your presence will make our joy complete.</p>
      </section>

      <section className="venue-section" aria-labelledby="venue-heading">
        <Image
          className="venue-image"
          src={invitation.media.venueImage}
          alt="Outdoor celebration lawn at Narayani Heights"
          fill
          sizes="100vw"
        />
        <div className="venue-overlay" aria-hidden="true" />
        <div className="venue-copy">
          <p className="section-kicker light">A confirmed celebration venue</p>
          <h2 id="venue-heading">
            Narayani
            <br />
            <em>Heights</em>
          </h2>
          <p>{venues.narayaniHeights.address}</p>
          <a
            className="venue-directions"
            href={venues.narayaniHeights.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open directions <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <Countdown />
      <EventSchedule />

      <section className="closing paper-section" aria-labelledby="closing-heading">
        <p className="section-kicker">With love</p>
        <h2 id="closing-heading">
          We cannot wait
          <br />
          to celebrate with you.
        </h2>
        <p className="closing-names">
          {invitation.couple.bride} <i>&amp;</i> {invitation.couple.groom}
        </p>
        <ShareInvitation />
      </section>

      <ShareInvitation floating />
    </InvitationExperience>
  );
}

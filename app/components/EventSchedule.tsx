import { weddingEvents, type WeddingEvent } from "../data/invitation";

function calendarHref(event: WeddingEvent): string | undefined {
  if (!event.startISO) return undefined;

  const start = new Date(event.startISO)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
  const venue =
    event.venue.confirmation === "confirmed" ? event.venue.value.address : "";
  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Pooja and Meet//Wedding Invitation//EN",
    "BEGIN:VEVENT",
    `DTSTART:${start}`,
    `SUMMARY:${event.title}`,
    venue ? `LOCATION:${venue.replace(/,/g, "\\,")}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(calendar)}`;
}

export function EventSchedule() {
  return (
    <section className="events-section" id="events" aria-labelledby="events-heading">
      <div className="events-heading">
        <p className="section-kicker">The wedding weekend</p>
        <h2 id="events-heading">Celebrate with us</h2>
        <p>Three days of tradition, music, laughter, and love.</p>
      </div>

      <div className="event-list">
        {weddingEvents.map((event, index) => {
          const calendar = calendarHref(event);
          const hasPendingDetails =
            event.time.confirmation === "pending" ||
            event.venue.confirmation === "pending";

          return (
            <article
              className={`event-card${event.featured ? " event-featured" : ""}`}
              key={event.id}
            >
              <div className="event-date-block">
                <span>{event.day}</span>
                <strong>{event.date}</strong>
                <small>{event.month}</small>
              </div>
              <div className="event-details">
                <p className="event-index">{String(index + 1).padStart(2, "0")}</p>
                <h3>{event.title}</h3>
                {hasPendingDetails && <p className="pending-badge">Details pending confirmation</p>}
                <dl className="event-facts">
                  <div>
                    <dt>Time</dt>
                    <dd>
                      {event.time.confirmation === "confirmed"
                        ? event.time.value
                        : "To be confirmed"}
                    </dd>
                  </div>
                  {event.note && (
                    <div>
                      <dt>Note</dt>
                      <dd>{event.note}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Venue</dt>
                    <dd>
                      {event.venue.confirmation === "confirmed"
                        ? event.venue.value.address
                        : "To be confirmed"}
                    </dd>
                  </div>
                </dl>
                <div className="event-actions">
                  {event.venue.confirmation === "confirmed" && (
                    <a
                      href={event.venue.value.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Directions <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {calendar && (
                    <a href={calendar} download={`${event.id}.ics`}>
                      Add to calendar
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

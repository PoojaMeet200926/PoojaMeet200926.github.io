export type ConfirmationState = "confirmed" | "pending";

export type InvitationDetail<T> =
  | {
      value: T;
      confirmation: "confirmed";
      pendingConfirmation?: false;
    }
  | {
      value?: T;
      confirmation: "pending";
      pendingConfirmation: true;
    };

export type Venue = {
  name: string;
  address: string;
  mapUrl: string;
  image?: string;
};

export type WeddingEvent = {
  id: string;
  title: string;
  day: string;
  date: string;
  month: string;
  dateISO: string;
  startISO?: string;
  time: InvitationDetail<string>;
  venue: InvitationDetail<Venue>;
  note?: string;
  featured?: boolean;
};

const confirmed = <T>(value: T): InvitationDetail<T> => ({
  value,
  confirmation: "confirmed",
});

const pending = <T>(): InvitationDetail<T> => ({
  confirmation: "pending",
  pendingConfirmation: true,
});

export const venues = {
  tremont: {
    name: "Tremont",
    address: "B.1302, Tremont, Vaishnodevi Circle, Ahmedabad",
    mapUrl: "https://share.google/hWnrB6DVuauJ6YYIV",
  },
  narayaniHeights: {
    name: "Narayani Heights",
    address: "Narayani Heights, Airport-Gandhinagar Road, Bhat, Ahmedabad",
    mapUrl: "https://share.google/VsfLgB1XlksNToBEJ",
    image: "/narayani-heights-venue.webp",
  },
} as const satisfies Record<string, Venue>;

export const invitation = {
  couple: {
    bride: "Pooja",
    groom: "Meet",
    display: "Pooja & Meet",
  },
  brideParents: "Mrs. Dharmishtha and Mr. Ketan Modi",
  celebration: {
    displayDates: "18–20 September 2026",
    startDateISO: "2026-09-18",
    endDateISO: "2026-09-20",
  },
  invitationMessage:
    "Mrs. Dharmishtha and Mr. Ketan Modi request the pleasure of your gracious presence as their beloved daughter Pooja celebrates her wedding with Meet.",
  countdown: {
    label: "Ring Ceremony",
    targetISO: "2026-09-19T09:30:00+05:30",
    display: "Saturday · 19 September · 09:30 AM",
    timezone: "Asia/Kolkata",
    completedMessage: "The celebrations have begun.",
  },
  media: {
    openingVideo: "/ribbon-opening.mp4",
    openingPoster: "/invitation-cover-v2.png",
    heroImage: "/invitation-cover-v2.png",
    venueImage: "/narayani-heights-venue.webp",
    socialImage: "/og.png",
  },
  share: {
    title: "Pooja & Meet — Wedding Invitation",
    text: "Join Pooja and Meet for their wedding celebrations, 18–20 September 2026.",
  },
} as const;

export const weddingEvents: readonly WeddingEvent[] = [
  {
    id: "ganesh-sthapan",
    title: "Ganesh Sthapan · Mandap Muhurat · Grah Shanti",
    day: "Friday",
    date: "18",
    month: "September",
    dateISO: "2026-09-18",
    time: pending<string>(),
    venue: pending<Venue>(),
  },
  {
    id: "mehendi",
    title: "Mehendi",
    day: "Friday",
    date: "18",
    month: "September",
    dateISO: "2026-09-18",
    time: pending<string>(),
    venue: confirmed(venues.tremont),
  },
  {
    id: "ring-ceremony",
    title: "Ring Ceremony",
    day: "Saturday",
    date: "19",
    month: "September",
    dateISO: "2026-09-19",
    startISO: "2026-09-19T09:30:00+05:30",
    time: confirmed("09:30 AM"),
    venue: confirmed(venues.narayaniHeights),
  },
  {
    id: "haldi",
    title: "Haldi",
    day: "Saturday",
    date: "19",
    month: "September",
    dateISO: "2026-09-19",
    startISO: "2026-09-19T11:00:00+05:30",
    time: confirmed("11:00 AM"),
    venue: confirmed(venues.narayaniHeights),
    note: "Lunch at 12:30 PM",
  },
  {
    id: "mameru",
    title: "Mameru",
    day: "Saturday",
    date: "19",
    month: "September",
    dateISO: "2026-09-19",
    startISO: "2026-09-19T15:00:00+05:30",
    time: confirmed("03:00 PM"),
    venue: pending<Venue>(),
  },
  {
    id: "sangeet",
    title: "Sangeet",
    day: "Saturday",
    date: "19",
    month: "September",
    dateISO: "2026-09-19",
    startISO: "2026-09-19T19:30:00+05:30",
    time: confirmed("07:30 PM"),
    venue: pending<Venue>(),
  },
  {
    id: "wedding",
    title: "Wedding Ceremony",
    day: "Sunday",
    date: "20",
    month: "September",
    dateISO: "2026-09-20",
    time: pending<string>(),
    venue: pending<Venue>(),
    featured: true,
  },
];

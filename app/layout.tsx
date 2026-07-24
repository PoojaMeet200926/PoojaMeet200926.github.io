import type { Metadata } from "next";
import { headers } from "next/headers";
import { invitation } from "./data/invitation";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: `${invitation.couple.display} | Wedding Invitation`,
    description: `Join Pooja and Meet for their wedding celebrations, ${invitation.celebration.displayDates}.`,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: `${invitation.couple.display} | Wedding Invitation`,
      description: `Wedding celebrations · ${invitation.celebration.displayDates}`,
      type: "website",
      images: [
        {
          url: `${origin}${invitation.media.socialImage}`,
          width: 1722,
          height: 913,
          alt: "Pooja and Meet wedding invitation",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${invitation.couple.display} | Wedding Invitation`,
      description: invitation.celebration.displayDates,
      images: [`${origin}${invitation.media.socialImage}`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

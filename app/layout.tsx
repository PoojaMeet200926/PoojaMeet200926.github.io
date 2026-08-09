import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Private Invitation",
  description: "Open the complete invitation link shared with you.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Private Invitation",
    description: "Open the complete invitation link shared with you.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Private Invitation",
    description: "Open the complete invitation link shared with you.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body>{children}</body>
    </html>
  );
}

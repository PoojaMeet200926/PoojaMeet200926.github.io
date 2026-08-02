import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "Meet & Pooja | Wedding Invitation",
    description: "Join Meet and Pooja as they celebrate their wedding, 19–20 September 2026.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "Meet & Pooja | Wedding Invitation",
      description: "19–20 September 2026 · Narayani Heights, Ahmedabad",
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1792, height: 936, alt: "Meet and Pooja wedding invitation" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Meet & Pooja | Wedding Invitation",
      description: "19–20 September 2026",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/invitation-box-lid.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
        <link rel="preload" href="/satin-bow-v2.webp" as="image" type="image/webp" />
      </head>
      <body>{children}</body>
    </html>
  );
}

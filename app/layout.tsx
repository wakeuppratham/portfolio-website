import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Pratham Goyal — Software Engineer",
  description:
    "Backend engineer building reactive, event-driven systems. Spring WebFlux, Kafka, Redis. Open to opportunities.",
  keywords: [
    "Pratham Goyal",
    "Software Engineer",
    "Backend Developer",
    "Java",
    "Spring Boot",
    "Kafka",
    "Portfolio",
  ],
  authors: [{ name: "Pratham Goyal" }],
  openGraph: {
    title: "Pratham Goyal — Software Engineer",
    description:
      "Backend engineer building reactive, event-driven systems at scale.",
    url: "https://prathamgoyal.dev",
    siteName: "Pratham Goyal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pratham Goyal — Software Engineer",
    description:
      "Backend engineer building reactive, event-driven systems at scale.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

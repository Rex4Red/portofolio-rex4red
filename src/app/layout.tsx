import type { Metadata } from "next";
import { DM_Serif_Display, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rex — Full Stack Developer Portfolio",
  description:
    "Portfolio website of Rex, a Full Stack Developer & CS Student at UPN Veteran Yogyakarta. Specializing in web, mobile, and AI projects.",
  openGraph: {
    title: "Rex — Full Stack Developer Portfolio",
    description:
      "Portfolio website of Rex, a Full Stack Developer & CS Student at UPN Veteran Yogyakarta.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${dmSerif.variable} ${sora.variable} ${jetbrainsMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}

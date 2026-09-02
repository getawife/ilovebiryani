import { Plus_Jakarta_Sans, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: {
    template: "%s",
    default: "Ilovebiryani",
  },
  description: "Curated films, series, and late-night binge watching. Fast, clean streaming without clutter.",
  keywords: "free streaming, movies, tv shows, cinema, hd streams, ilovebiryani",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-[#F4B942] selection:text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

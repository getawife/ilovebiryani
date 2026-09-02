import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  title: "ILoveBiryani",
  description: "Timeless films and series. No account.",
  keywords: "free streaming, movies, tv shows, hd",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

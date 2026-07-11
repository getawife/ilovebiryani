// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";

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
  icons: {
    icon: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%232d9b4e'/%3E%3Cpath d='M12 9l12 7-12 7V9z' fill='%23e8ddd0'/%3E%3C/svg%3E`,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
import { Plus_Jakarta_Sans, Bebas_Neue } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata = {
  title: "ILoveBiryani",
  description: "Streaming website",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      {/* Explicitly attach font-sans to the body to force all native inputs to inherit it */}
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
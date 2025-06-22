import { Pangolin, Poppins, Inter } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "./SessionProvider";
import ServiceWorkerRegister from "../components/ServiceWorkerRegister/ServiceWorkerRegister";

const pangolin = Pangolin({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pangolin",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "FFCS-inator",
  description:
    "Generate priority-based timetables in seconds with FFCS-inator. No hassle. No stress. No more clashes. The smartest way to plan your VIT FFCS.",
  icons: {
    icon: "/logo_ffcs.svg",
  },
  manifest: "/manifest.webmanifest",

  openGraph: {
    title: "FFCS-inator",
    description:
      "Generate priority-based timetables in seconds with FFCS-inator. No hassle. No stress. No more clashes. The smartest way to plan your VIT FFCS.",
    siteName: "FFCS-inator",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        alt: "FFCS-inator - Timetable Generator for VIT",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FFCS-inator",
    description:
      "Generate priority-based timetables in seconds with FFCS-inator.",
    images: ["/og-image.png"],
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${pangolin.variable} ${poppins.variable} ${inter.variable} antialiased bg-[#CEE4E5] select-none`}
      >
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}

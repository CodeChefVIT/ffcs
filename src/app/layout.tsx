import { Pangolin, Poppins, Inter } from "next/font/google";
import "./globals.css";

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


// export const metadata = {
//   title: 'FFCS-inator',
//   // description: '',
//   // icons: {
//   //   icon: '/logo_FFCS.svg',
//   // },
// };


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <head>
        <title>FFCS-inator</title>
      </head>
      <body className={`${pangolin.variable} ${poppins.variable} ${inter.variable} antialiased bg-[#CEE4E5]`}>
        {children}
      </body>
    </html>
  );
}

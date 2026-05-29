import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kaizen Capital Group",
  description: "Institutional capital strategy platform built around structure, credibility, and long-term growth across 12 active funds.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-7F3F4YLRLF"></script>
      <script dangerouslySetInnerHTML={{ __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-7F3F4YLRLF');
      ` }} />
      <body className="min-h-full flex flex-col">{children}      <script id="tawk" src="https://embed.tawk.to/6a18f4c2c95c7a1c33ced5d5/1jpono5pb" crossOrigin="*" async></script>
      </body>
    </html>
  );
}
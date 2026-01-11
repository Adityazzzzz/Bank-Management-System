import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-serif'
})

export const metadata: Metadata = {
  title: "Citadel Bank",
  description: "Citadel is a modern banking platform for everyone.",
  icons: {
    icon: '/icons/logo.svg'
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0179FE",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming -> feels like native app
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSerif.variable}`}>
        <div className="flex min-h-screen w-full justify-center bg-gray-50">
           <div className="w-full max-w-[1600px] shadow-2xl bg-white min-h-screen">
              {children}
           </div>
        </div>
      </body>
    </html>
  );
}
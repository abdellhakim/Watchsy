import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Watchsy",
  description: "Discover your next favorite show with Watchsy!",
  icons: {
    icon: "/icon.png", 
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`
            ${geistSans.variable} 
            ${geistMono.variable} 
            antialiased 
            min-h-screen 
            flex 
            flex-col 
            justify-between
          `}
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}

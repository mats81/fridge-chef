import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ShoppingListProvider } from "@/components/shopping-list-provider";
import { ShoppingListOverlay } from "@/components/shopping-list-overlay";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Fridge Chef",
  description: "Rezepte aus deinen vorhandenen Zutaten",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Fridge Chef"
  },
  other: {
    "mobile-web-app-capable": "yes"
  }
};

// Inline script to prevent flash of wrong theme before React hydrates
const themeScript = `(function(){try{var t=localStorage.getItem("fridge-chef-theme");if(t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme:dark)").matches))document.documentElement.classList.add("dark")}catch(e){}})()`;

// Register service worker for offline support
const swScript = `if("serviceWorker"in navigator)window.addEventListener("load",function(){navigator.serviceWorker.register("/sw.js")})`;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#315343" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: swScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider>
          <ShoppingListProvider>
            <header className="fixed top-4 right-4 z-30 flex items-center gap-2">
              <Link
                href="/favorites"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 text-sm backdrop-blur"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <span className="sr-only sm:not-sr-only">Gemerkt</span>
              </Link>
              <ThemeToggle />
            </header>
            {children}
            <ShoppingListOverlay />
          </ShoppingListProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

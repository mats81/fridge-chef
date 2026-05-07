import type { Metadata } from "next";
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
            <header className="fixed top-4 right-4 z-30">
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

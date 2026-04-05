
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from '@/context/CartContext';
import BottomNavBar from '@/components/bottom-nav-bar';
import { AppProvider } from '@/context/AppContext';
import AppSelectionWizard from '@/components/app-selection-wizard';


export const metadata: Metadata = {
  title: 'MenuMorph',
  description: 'A dynamic menu for any restaurant.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-gray-200 dark:bg-gray-900 font-body antialiased flex items-center justify-center p-4"
        )}
      >
        <div className="relative mx-auto border-gray-900 dark:border-gray-800 bg-gray-900 border-[14px] rounded-[2.5rem] h-[800px] w-[375px] shadow-xl">
          <div className="w-[148px] h-[18px] bg-gray-900 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
          <div className="h-[46px] w-[3px] bg-gray-900 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
          <div className="h-[46px] w-[3px] bg-gray-900 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
          <div className="h-[64px] w-[3px] bg-gray-900 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
          <div id="mobile-app-frame" className="rounded-[2rem] overflow-hidden w-full h-full bg-background flex flex-col relative">
            <AppProvider>
                <AppSelectionWizard />
                <CartProvider>
                  <main className="flex-grow overflow-y-auto pb-20">{children}</main>
                  <BottomNavBar />
                </CartProvider>
            </AppProvider>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}

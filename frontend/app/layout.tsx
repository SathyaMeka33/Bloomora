import type { Metadata } from 'next';
import { Playfair_Display, Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import CustomerShell from '@/components/common/CustomerShell';
import { BloomoraAuthProvider } from '@/lib/hooks/useBloomoraAuth';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bloomora — India’s First AI-Powered Hyperlocal Premium Gifting Platform',
  description: 'Discover luxury hand-crafted bouquets, artisanal gift boxes, and hyper-personalized AI gifting recommendations with signature ₹10 "Meet Me There" destination pickup.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FFF8F5] text-[#262626] font-sans selection:bg-[#D4AF37]/30 pb-16 lg:pb-0">
        <BloomoraAuthProvider>
          <CustomerShell>
            {children}
          </CustomerShell>
        </BloomoraAuthProvider>
      </body>
    </html>
  );
}

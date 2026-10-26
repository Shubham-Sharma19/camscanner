import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#4f46e5',
};

export const metadata: Metadata = {
  title: 'DocMaster Pro - Free All-in-One Document & Scanner Hub',
  description:
    'Free client-side document toolkit: CamScanner Web, Scanned Text In-Place Editor, iLovePDF tools (merge, compress, image to pdf), and Govt Form 20KB-50KB photo resizer. 100% private, zero server uploads.',
  keywords: [
    'camscanner online free',
    'edit text in scanned pdf',
    'merge pdf free',
    'compress pdf to 100kb',
    'photo resizer 20kb to 50kb',
    'rent receipt generator free',
    'salary slip maker pdf',
    'image to pdf converter',
  ],
  authors: [{ name: 'DocMaster Team' }],
  openGraph: {
    title: 'DocMaster Pro - Free All-in-One Document & Scanner Hub',
    description:
      'All your document tools in one place: CamScanner, Scanned Text Editor, PDF tools & Govt Photo Resizer. 100% Client-Side.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'DocMaster Pro',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Schema Markup for Google Rich Search Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'DocMaster Pro',
              applicationCategory: 'UtilityApplication',
              operatingSystem: 'All',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'INR',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                ratingCount: '1240',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white transition-colors">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

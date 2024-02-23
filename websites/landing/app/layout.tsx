import type { Metadata } from 'next';
import { Days_One, Inter } from 'next/font/google';
import '@/app/globals.css';
import Header from '@/containers/header';
import Footer from '@/containers/footer';

export const metadata: Metadata = {
  title: 'Killua',
  description: 'a local-storage management library for react applications'
};

const fontInter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const fontDaysOne = Days_One({
  weight: '400',
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-days-one'
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://github.com/PrismJS/prism-themes/blob/master/themes/prism-one-dark.css"
        ></link>
      </head>
      <body
        className={`bg-black minimal-scrollbar text-white min-h-screen flex flex-col font-inter ${fontInter.variable} ${fontDaysOne.variable}`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

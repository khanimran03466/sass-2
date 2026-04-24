import { Manrope, Space_Grotesk } from 'next/font/google';
import './globals.scss';
import { AppProviders } from '@/components/shared/AppProviders';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body'
});

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display'
});

export const metadata = {
  title: 'MarginMint Super App',
  description: 'Revenue-focused fintech super app for rent, cards, travel, recharge, and utilities'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${grotesk.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

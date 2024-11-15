import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts/Index';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js course dashboard built with App Router. My github account is RaminMajidi',
  metadataBase: new URL('https://learn-nextjs-15-theta.vercel.app/'),
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}

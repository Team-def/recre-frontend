import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '../component/header'
import Footer from '../component/footer'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './globals.css';
import { cookies } from 'next/headers';
import { ClientCookiesProvider } from './provider';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '설치없이 즐기는 신나는 레크레이션, RecRe',
  description: 'Recreation without installation, RecRe',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientCookiesProvider value={cookies().getAll()}>
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
        </body>
    </html>
    </ClientCookiesProvider>
  )
}

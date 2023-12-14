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
import { Viewport } from 'next';
import { ColorSchemeEnum } from 'next/dist/lib/metadata/types/metadata-types';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '설치없이 즐기는 신나는 레크레이션, RecRe',
  description: 'Recreation without installation, RecRe',
}

export const viewport: Viewport = {
  themeColor: 'white',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
}

export const colorScheme: ColorSchemeEnum = 'only light'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientCookiesProvider value={cookies().getAll()}>
    <html lang="ko">
    <body className="notranslate"
      // className={inter.className}
      >
        <Header />
        {children}
        <Footer />
        </body>
    </html>
    </ClientCookiesProvider>
  )
}

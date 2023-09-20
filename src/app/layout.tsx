import './globals.css'
import React from 'react'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { Header, Zoom } from '@/component/compound'
import { cx } from '@/helper'
import { cookies } from 'next/headers'
import { DEFAULT_LANG, LANG_COOKIE_NAME } from '@/common'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Grammar check',
  description: 'Grammar check',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/favicon-light.ico'
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/favicon-dark.ico'
      }
    ]
  },
}

type RootLayoutProps = React.PropsWithChildren

export default function RootLayout({ children }: RootLayoutProps) {
  const lang = cookies().get(LANG_COOKIE_NAME)?.value || DEFAULT_LANG

  return (
    <html lang={lang}>
      <body className={cx(inter.className, 'bg-slate-200 text-gray-950')}>
        <Header/>
        <main className='pt-[4.625rem]'>
          {children}
        </main>
        <Zoom className='absolute right-[16px] bottom-[16px]'/>
      </body>
    </html>
  )
}

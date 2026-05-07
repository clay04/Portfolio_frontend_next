import React from 'react'
import './globals.css'
import { ThemeProvider } from '@/components/theme-profider'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { GeistSans } from 'geist/font/sans'

export const metadata = {
  title : 'Portofolio',
  description : 'My Portofolio Website',
}

export default function RootLayout({ children }: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.className} bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
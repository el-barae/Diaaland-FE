import './globals.scss'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import Footer from '@/components/HomePage/Footer/Footer'

const montserrat = Montserrat({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Diaa Land',
  description: 'Service de recrutement des développeurs informatique et des profiles IT',
  keywords:
    'Recrutement, programmation, IT, DevOps, Chef de projet, GIT, javascript, php, java, dotnet',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={montserrat.className} suppressHydrationWarning={true}>
        {children}
        <Footer />
      </body>
    </html>
  )
}
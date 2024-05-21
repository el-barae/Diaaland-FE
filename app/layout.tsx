import './globals.scss'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import Footer from '@/components/HomePage/Footer/Footer'
const montserrat = Montserrat({
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Diaa Land',
  description: 'Service de recrutement des développeurs informatique et des profiles IT',
  keywords: 'Recrutement, programmation, IT, DevOps , Chef de projet, GIT , javascript , php , java , dotnet',
}

interface LayoutProps {
  includeFooter?: boolean;
}

export default function RootLayout({
  children,
  includeFooter = false,
}: {
  children: React.ReactNode
  includeFooter?: boolean
}) {
  return (
    <html lang="en" suppressHydrationWarning={true} >
      <body className={montserrat.className} suppressHydrationWarning={true} >
        {children}
        {includeFooter && <Footer />}
      </body>
    </html>
  )
}
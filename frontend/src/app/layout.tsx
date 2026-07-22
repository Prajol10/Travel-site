import type { Metadata } from 'next'
import './globals.css'
import GlobalDropGuard from '@/components/GlobalDropGuard'

export const metadata: Metadata = {
  title: 'Travel Platform',
  description: 'Premium multitenant travel agency platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <GlobalDropGuard />
        {children}
      </body>
    </html>
  )
}

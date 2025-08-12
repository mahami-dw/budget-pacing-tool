import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Budget Pacing Tool',
  description: 'Monitor and manage your advertising budgets across Google Ads and DV360 platforms',
  keywords: 'budget pacing, google ads, dv360, advertising, campaign management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}

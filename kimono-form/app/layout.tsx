import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'お申込みフォーム（着物）| のぞき梅',
  description: '侘び数寄道 のぞき梅 着物お申込みフォーム',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}

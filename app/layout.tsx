// app/layout.tsx
import './globals.css'
import { Mochiy_Pop_One } from 'next/font/google'
import HamburgerMenu from '@/components/HamburgerMenu'

const mochiy = Mochiy_Pop_One({
  subsets: ['latin'],
  weight: '400',
})

export const metadata = {
  title: 'もしも、あの人に聞けたなら',
  description: 'AIで、もう一度 あの人と会話を。',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no', // ⭐ここ追加
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={mochiy.className}>
        <HamburgerMenu />
        {children}
      </body>
    </html>
  )
}

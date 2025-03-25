// app/layout.tsx
import './globals.css'
import { Mochiy_Pop_One } from 'next/font/google'
import HamburgerMenu from '@/components/HamburgerMenu'

const mochiy = Mochiy_Pop_One({
  subsets: ['latin'],
  weight: '400',
})

export const viewport = {
  title: 'もしも、あの人に聞けたなら',
  description: 'AIで、もう一度 あの人と会話を。',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no', // ⭐ここ追加
}

// app/layout.tsx
export const metadata = {
  title: 'AI恋愛相談 - もしも、あの人に聞けたなら',
  description: '“あの人”と、もう一度会話できるAIアプリ',
  openGraph: {
    title: 'AI恋愛相談 - もしも、あの人に聞けたなら',
    description: '“あの人”と、もう一度会話できるAIアプリ',
    images: ['/og-image.png'], // 👈 これ！
    type: 'website',
    locale: 'ja_JP',
    url: 'https://defiant-norri-aoidayonn-7a166abf.koyeb.app/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'もしも、あの人に聞けたなら',
    description: 'AIで、もう一度 “あの人” と話せる。',
    images: ['/og-image.png'],
  }
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

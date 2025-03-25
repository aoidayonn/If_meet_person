'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto min-h-screen flex flex-col justify-center items-center gap-6 px-4 py-12 md:py-20 text-center bg-gradient-to-b from-pink-50 to-white">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-pink-600 drop-shadow-sm">
        もしも、"あの人"に聞けたなら
      </h1>
      <p className="text-sm md:text-base text-gray-600 italic">
        “あの人”と、もう一度つながるAIアプリ。
      </p>

      <div className="flex flex-col md:flex-row gap-5 mt-10 w-full md:w-3/4 lg:w-1/2">
        <Link
          href="/profile"
          className="flex-1 bg-pink-500 text-white py-3 rounded-2xl shadow-md hover:bg-pink-600 transition text-lg font-semibold tracking-wide"
        >
          あの人を作成する
        </Link>

        <Link
          href="/chat-history"
          className="flex-1 bg-white border-2 border-pink-400 text-pink-500 py-3 rounded-2xl hover:bg-pink-50 transition text-lg font-semibold tracking-wide shadow-sm"
        >
          会話履歴を見る
        </Link>
      </div>

      <footer className="mt-10 text-xs text-gray-400">
        Powered by AI / Made for the heart
      </footer>
    </main>
  )
}
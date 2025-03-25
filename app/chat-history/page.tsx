'use client'

import { useEffect, useState } from 'react'
import { getOrCreateSessionId } from '@/lib/session'
import { getChatPartners } from '@/lib/chat'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ChatHistoryPage() {
  const [partners, setPartners] = useState<string[]>([])

  const router = useRouter()


  useEffect(() => {
    const fetchPartners = async () => {
      const sessionId = getOrCreateSessionId()
      const names = await getChatPartners(sessionId)
      setPartners(names)
    }

    fetchPartners()
  }, [])

  return (
    
    <main className="max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto min-h-screen px-4 py-12 md:py-20 bg-gradient-to-b from-white to-pink-50">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-pink-600">
        話したことのある「あの人」たち
      </h1>

      

      {partners.length === 0 ? (
        <p className="text-gray-500 text-center">まだ誰とも会話していません。</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((name, i) => (
            <li key={i}>
              <Link
                href={`/chat?name=${encodeURIComponent(name)}`}
                className="block px-4 py-3 bg-white rounded-xl shadow hover:bg-pink-50 transition cursor-pointer text-center font-medium text-pink-600"
              >
                {name} と話す
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-center mt-6">
  <button
    onClick={() => router.push('/')}
    className="px-10 py-4 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition duration-200 cursor-pointer text-sm font-semibold shadow"
  >
    戻る
  </button>
</div>

    </main>
  )
}
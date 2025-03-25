'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { getOrCreateSessionId } from '@/lib/session'
import { getMessagesBySession } from '@/lib/chat'
import { useRouter } from 'next/navigation'

export default function ChatPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [profile, setProfile] = useState({
    name: searchParams.get('name') || '相手',
    mbti: searchParams.get('mbti') || '',
    personality: searchParams.get('personality') || '',
    speakingStyle: searchParams.get('speakingStyle') || '',
    gender: searchParams.get('gender') || '',
    relationship: searchParams.get('relationship') || '',
    memory: searchParams.get('memory') || '',
    toneMode: searchParams.get('toneMode') || '',
    honestMode: searchParams.get('honestMode') === 'true',
    userName: searchParams.get('userName') || 'あなた',
    userGender: searchParams.get('userGender') || ''
  })

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<
  {
    role: string
    text: string
    read?: boolean
    timestamp?: string
    context?: {
      mbti?: string
      name?: string
      gender?: string
      memory?: string
      toneMode?: string
      userName?: string
      honestMode?: boolean
      userGender?: string
      personality?: string
      relationship?: string
      speakingStyle?: string
    }
  }[]
>([])

  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      const sessionId = getOrCreateSessionId()
      const history = await getMessagesBySession(sessionId, profile.name)

      // 履歴の最後から context を復元して profile を上書き
      const lastContext = history.at(-1)?.context
      if (lastContext) {
        setProfile((prev) => ({
          ...prev,
          ...lastContext
        }))
      }

      const formatted = history.map((m: any) => ({
        role: m.role,
        text: m.text,
        read: m.role === 'user',
        timestamp: new Date(m.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        context: m.context
      }))

      setMessages(formatted)
    }

    fetchHistory()
  }, [])

  

  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const [isTyping, setIsTyping] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
  
    const recentMessages = messages.slice(-5).map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.text
    }))
  
    const sessionId = getOrCreateSessionId()
    const messageToSend = input.trim()
    setInput('')
  
    const timestamp = getCurrentTime()

    
  
    // ✅ 「#記憶」コマンドを検出して保存
    if (messageToSend.startsWith('#記憶')) {
      const memoryContent = messageToSend.replace('#記憶', '').trim()
  
      if (memoryContent) {
        await fetch('/api/saveMemory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-session-id': sessionId
          },
          body: JSON.stringify({
            sessionId,
            name: profile.name, // あの人の名前
            content: memoryContent
          })
        })
  
        // 表示用のAI返答（実際のAI生成ではない）
        setMessages((prev) => [
          ...prev,
          {
            role: 'user',
            text: messageToSend,
            read: true,
            timestamp
          },
          {
            role: 'ai',
            text: 'うん、覚えておくね！📝',
            timestamp: getCurrentTime()
          }
        ])
  
        return
      }
    }
  
    // 🔽 通常の送信処理
    const newMsg = {
      role: 'user',
      text: messageToSend,
      read: false,
      timestamp,
      context: { ...profile }
    }
    
    setMessages((prev) => [...prev, newMsg])
    setIsTyping(true)
  
    await fetch('/api/saveMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        role: 'user',
        text: messageToSend,
        context: {
          ...profile
        }
      })
    })
  
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId
      },
      body: JSON.stringify({
        profile: {
          ...profile
        },
        message: messageToSend,
        history: recentMessages
      })
    })
  
    const data = await res.json()
    const aiMessage = {
      role: 'ai',
      text: data.reply,
      timestamp: getCurrentTime(),
      context: { ...profile }
    }
    

    await fetch('/api/saveMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        role: 'ai',
        text: data.reply,
        context: {
          ...profile
        }
      })
    })
  
    setMessages((prev) => {
      const updated = [...prev]
      for (let i = updated.length - 1; i >= 0; i--) {
        if (updated[i].role === 'user') {
          updated[i] = { ...updated[i], read: true }
          break
        }
      }
      return [...updated, aiMessage]
    })
  
    setIsTyping(false)
  }
  

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, isTyping])

  return (
    <main className="flex flex-col h-screen max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto">
      <header className={`shrink-0 flex justify-between items-center text-lg md:text-xl font-semibold py-3 px-4 border-b
  ${profile.honestMode ? 'bg-red-100' : 'bg-white'}`}>

      {/* 左側の空間（必要なら戻るボタンなど入れてもOK） */}
      <div className="w-10" />

      {/* 中央タイトル */}
      <div className="flex-1 text-center truncate">
        "{profile.name}"とのチャット
      </div>

      {/* 右側に配置するアイコンやボタン（例: 記憶編集ボタン） */}
      <button 
      onClick={() => router.push(`/memories?name=${profile.name}`)}
      className="text-sm px-3 py-2 bg-pink-100 text-pink-800 rounded-full shadow hover:brightness-110 transition cursor-pointer">
        📝
      </button>
    </header>




      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto space-y-4 p-4 md:p-6 bg-gray-100"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`relative w-fit max-w-[65%] md:max-w-[50%] p-3 md:p-4 rounded-xl shadow text-sm md:text-base ${
              msg.role === 'user'
                ? 'ml-auto bg-pink-200 text-right'
                : `mr-auto text-left ${msg.context?.honestMode ? 'bg-red-100 border border-red-400' : 'bg-white'}`
            }`}
          >
            {msg.role === 'ai' && (
              <>
                <p className="text-sm font-medium mb-1 text-gray-600">{profile.name}</p>
                {msg.context?.honestMode && (
                  <p className="text-xs text-red-500 font-semibold mb-1">🔥 本音モード</p>
                )}

              </>
            )}
            <p className="whitespace-pre-wrap">{msg.text}</p>

            {msg.role === 'user' && (
              <div className="absolute -left-12 bottom-1 text-xs text-gray-400 text-left">
                {msg.read && <p>✔ 既読</p>}
                <p>{msg.timestamp}</p>
              </div>
            )}

            {msg.role === 'ai' && msg.timestamp && (
              <p className="text-xs text-gray-400 mt-1">{msg.timestamp}</p>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="mr-auto bg-white text-gray-500 px-4 py-2 rounded-xl shadow text-sm md:text-base animate-pulse">
            {profile.name}が入力中…
          </div>
        )}
      </div>

      <div className="fixed top-10 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={() =>
            setProfile((prev) => ({
              ...prev,
              honestMode: !prev.honestMode
            }))
          }
          className={`px-5 py-5 rounded-full text-sm font-semibold shadow-md transition
            ${profile.honestMode ? 'bg-red-200 text-red-800' : 'bg-pink-100 text-pink-800'}
            hover:brightness-110 cursor-pointer`}
        >
          {profile.honestMode ? '🔥' : '😌'}
        </button>
      </div>


      <div className={`sticky bottom-0 p-4 md:p-6 border-t flex gap-2 z-10
  ${profile.honestMode ? 'bg-red-100' : 'bg-white'}`}>
  
  <input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    }}
    placeholder="聞きたいことを入力..."
    className="flex-1 p-3 md:p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm md:text-base bg-white"
  />

  <div className="flex justify-end mb-2" />

  <button
    type="button"
    onClick={handleSend}
    className="bg-pink-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl hover:bg-pink-600 text-sm md:text-base cursor-pointer"
  >
    送信
  </button>
</div>

    </main>
  )
}


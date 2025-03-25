'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function MemoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name')
  const [memories, setMemories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  const sessionId =
    typeof window !== 'undefined'
      ? localStorage.getItem('session_id') || ''
      : ''

      useEffect(() => {
        if (!name || !sessionId) {
          setLoading(false)
          return
        }
      
        const fetchMemories = async () => {
          try {
            const res = await fetch(`/api/getMemory?name=${name}`, {
              headers: {
                'x-session-id': sessionId
              }
            })
      
            const data = await res.json()
      
            // 💡 レコードが存在しない or content が null の場合は初期化
            if (!data || data.content === null) {
              const initRes = await fetch('/api/initMemory', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-session-id': sessionId
                },
                body: JSON.stringify({ name })
              })
      
              if (!initRes.ok) {
                console.error('記憶の初期化に失敗しました')
                setMemories([])
              } else {
                setMemories([])
              }
            } else {
              // レコードが存在する場合は読み込み
              try {
                const parsed = JSON.parse(data.content || '[]')
                if (Array.isArray(parsed)) {
                  setMemories(parsed.slice(0, 10))
                } else {
                  setMemories([data.content])
                }
              } catch {
                setMemories([data.content])
              }
            }
          } catch (err) {
            console.error('記憶の取得エラー:', err)
            setMemories([])
          } finally {
            setLoading(false)
          }
        }
      
        fetchMemories()
      }, [name, sessionId])
      

  const handleSave = async () => {
    const payload = JSON.stringify(memories.filter((m) => m.trim() !== ''))
    await fetch('/api/saveMemory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId
      },
      body: JSON.stringify({ sessionId, name, content: payload })
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleDelete = async () => {
    const ok = confirm('本当にすべての記憶を削除しますか？')
    if (!ok) return

    await fetch('/api/deleteMemory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId
      },
      body: JSON.stringify({ sessionId, name })
    })
    setMemories([])
  }

  const handleChange = (index: number, value: string) => {
    const newMemories = [...memories]
    newMemories[index] = value
    setMemories(newMemories)
  }

  const handleAdd = () => {
    if (memories.length < 10) {
      setMemories([...memories, ''])
    }
  }

  const handleRemove = (index: number) => {
    const newMemories = [...memories]
    newMemories.splice(index, 1)
    setMemories(newMemories)
  }

  return (
    <main className="max-w-xl mx-auto p-6 pb-28 relative min-h-screen">
      <h1 className="text-center text-2xl font-bold mb-6 text-pink-700">{name} の記憶</h1>

      {loading ? (
        <p className="text-gray-500">読み込み中...</p>
      ) : (
        <>
          {memories.map((memory, idx) => (
            <div key={idx} className="mb-4">
              <label className="text-sm text-gray-600">記憶 {idx + 1}</label>
              <div className="flex gap-2">
                <textarea
                  className="w-full h-24 p-3 border rounded resize-none focus:outline-none focus:ring focus:ring-pink-200 bg-pink-50"
                  value={memory}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  maxLength={100}
                />
                <button
                  className="bg-pink-200 px-3 py-1 rounded hover:bg-pink-300 text-pink-800"
                  onClick={() => handleRemove(idx)}
                >
                  ✕
                </button>
              </div>
              <div className="text-right text-xs text-gray-500 mt-1">
                {memory.length}/100 文字
              </div>
            </div>
          ))}

          {memories.length < 10 && (
            <button
              onClick={handleAdd}
              className="bg-pink-100 text-pink-800 px-3 py-1 rounded hover:bg-pink-200 text-sm cursor-pointer mt-2"
            >
              ＋ 記憶を追加
            </button>
          )}

          {/* ボタン配置エリア */}
          <div className="fixed bottom-4 left-4 right-4 flex justify-between items-center">
            {/* 戻るボタン */}
            <button
              onClick={() => router.back()}
              className="bg-gray-200 text-gray-700 px-7 py-4 rounded hover:bg-gray-300 cursor-pointer"
            >
              戻る
            </button>

            {/* 追加・保存・削除ボタン */}
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-pink-500 text-white px-7 py-4 rounded hover:bg-pink-600 cursor-pointer"
              >
                保存
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-400 text-white px-5 py-4 rounded hover:bg-red-500 cursor-pointer"
              >
                全て削除
              </button>
            </div>
          </div>

          {saved && (
            <p className="text-green-600 mt-4 text-sm text-center">
              保存しました！
            </p>
          )}
        </>
      )}
    </main>
  )
}

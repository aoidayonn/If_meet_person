'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

interface Step1ProfileProps {
  name: string
  gender: string
  setName: (value: string) => void
  setGender: (value: string) => void
  setError: (msg: string) => void
  onNext: () => void
  error: string
  inputClass: (isInvalid: boolean) => string
  genderButtonClass: (selected: string, value: string) => string
}


export default function Step1Profile({
  name,
  gender,
  setName,
  setGender,
  setError,
  onNext,
  error,
  inputClass,
  genderButtonClass,
}: Step1ProfileProps) {

  const router = useRouter()
  return (
    <>
      <input
        type="text"
        placeholder="名前（例：けんちゃん）"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputClass(!name)}
      />

      <div>
        <p className="mb-1 font-semibold">性別</p>
        <div className="flex gap-3">
          {['男性', '女性', 'その他'].map((val) => (
            <button
              key={val}
              type="button"
              className={genderButtonClass(gender, val)}
              onClick={() => setGender(val)}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-4">

        <button
          onClick={() => router.push('/')}
          className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition duration-200 cursor-pointer"
        >
          戻る
        </button>
        <button
          onClick={() => {
            if (!name) {
              setError('相手の名前を入力してください')
              return
            }
            setError('')
            onNext()
          }}
          className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 font-semibold transition duration-200 cursor-pointer"
        >
          次へ
        </button>
      </div>
    </>
  )
}
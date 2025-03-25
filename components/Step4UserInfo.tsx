'use client'

import React from 'react'

interface Step4UserInfoProps {
  userName: string
  userGender: string
  setUserName: (value: string) => void
  setUserGender: (value: string) => void
  inputClass: (isInvalid: boolean) => string
  genderButtonClass: (selected: string, value: string) => string
  onBack: () => void
  onSubmit: () => void
  setError: (msg: string) => void
}



export default function Step4UserInfo({
  userName,
  userGender,
  setUserName,
  setUserGender,
  inputClass,
  genderButtonClass,
  onBack,
  onSubmit,
  setError
}: Step4UserInfoProps) {
  return (
    <>
      <h2 className="text-xl font-bold text-pink-600">あなたについても教えてください</h2>

      <input
        type="text"
        placeholder="あなたの名前（呼ばれたい名前）"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className={inputClass(!userName)}
      />

      <div>
        <p className="mb-1 font-semibold">あなたの性別（任意）</p>
        <div className="flex gap-3">
          {['男性', '女性', 'その他'].map((val) => (
            <button
              key={val}
              type="button"
              className={genderButtonClass(userGender, val)}
              onClick={() => setUserGender(val)}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onBack}
          className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition duration-200 cursor-pointer"
        >
          戻る
        </button>
        <button
          onClick={() => {
            if (!userName) {
              setError('あなたの名前を入力してください')
              return
            }
            setError('')
            onSubmit()
          }}
          className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 font-semibold transition duration-200 cursor-pointer"
        >
          あの人を呼び出す
        </button>
      </div>
    </>
  )
}

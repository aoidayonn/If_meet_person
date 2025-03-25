'use client'

import React from 'react'

interface Step3StyleProps {
  toneMode: string
  honestMode: boolean
  setToneMode: (value: string) => void
  setHonestMode: (value: boolean) => void
  inputClass: (isInvalid: boolean) => string
  onBack: () => void
  onNext: () => void
}

export default function Step3Style({
  toneMode,
  honestMode,
  setToneMode,
  setHonestMode,
  inputClass,
  onBack,
  onNext,
}: Step3StyleProps) {
  return (
    <>
      <div>
        <p className="mb-1 font-semibold">話し方モード</p>
        <select
          value={toneMode}
          onChange={(e) => setToneMode(e.target.value)}
          className={inputClass(false)}
        >
          <option value="polite">敬語</option>
          <option value="casual">タメ口</option>
          <option value="both">どちらでもOK</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="honestMode"
          checked={honestMode}
          onChange={(e) => setHonestMode(e.target.checked)}
        />
        <label htmlFor="honestMode">本音モードをONにする</label>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onBack}
          className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition duration-200 cursor-pointer"
        >
          戻る
        </button>
        <button
          onClick={onNext}
          className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 font-semibold transition duration-200 cursor-pointer"
        >
          次へ
        </button>
      </div>
    </>
  )
}

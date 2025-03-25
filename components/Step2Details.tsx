'use client'

import React from 'react'

interface Step2DetailsProps {
  mbti: string
  personality: string
  speakingStyle: string
  relationship: string
  memory: string
  setMbti: (value: string) => void
  setPersonality: (value: string) => void
  setSpeakingStyle: (value: string) => void
  setRelationship: (value: string) => void
  setMemory: (value: string) => void
  inputClass: (isInvalid: boolean) => string
  onBack: () => void
  onNext: () => void
}

export default function Step2Details({
  mbti,
  personality,
  speakingStyle,
  relationship,
  memory,
  setMbti,
  setPersonality,
  setSpeakingStyle,
  setRelationship,
  setMemory,
  inputClass,
  onBack,
  onNext,
}: Step2DetailsProps) {
  return (
    <>
      <input
        type="text"
        placeholder="MBTI（例：INFP）"
        value={mbti}
        onChange={(e) => setMbti(e.target.value)}
        className={inputClass(false)}
      />

      <input
        type="text"
        placeholder="性格（例：優しい／ツンデレ など）"
        value={personality}
        onChange={(e) => setPersonality(e.target.value)}
        className={inputClass(false)}
      />

      <input
        type="text"
        placeholder="話し方の特徴（例：ぶっきらぼう／甘め）"
        value={speakingStyle}
        onChange={(e) => setSpeakingStyle(e.target.value)}
        className={inputClass(false)}
      />

      <input
        type="text"
        placeholder="あなたとの関係性（例：元恋人）"
        value={relationship}
        onChange={(e) => setRelationship(e.target.value)}
        className={inputClass(false)}
      />

      <textarea
        placeholder="印象的な出来事（任意）"
        value={memory}
        onChange={(e) => setMemory(e.target.value)}
        className={inputClass(false)}
      />

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

'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import Step1Profile from '@/components/Step1Profile'
import Step2Details from '@/components/Step2Details'
import Step3Style from '@/components/Step3Style'
import Step4UserInfo from '@/components/Step4UserInfo'
import { AnimatePresence, motion } from 'framer-motion'

export default function ProfilePage() {
  const [step, setStep] = useState(1)
  const stepRef = useRef(step)
  const prevStepRef = useRef(step)

  useEffect(() => {
    prevStepRef.current = stepRef.current
    stepRef.current = step
  }, [step])

  const [profile, setProfile] = useState({
    name: '',
    gender: '',
    mbti: '',
    personality: '',
    speakingStyle: '',
    relationship: '',
    memory: '',
    toneMode: 'both',
    honestMode: false,
    userName: '',
    userGender: '',
  })

  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (key: keyof typeof profile, value: string | boolean) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }
  

  const handleStepChange = (nextStep: number) => {
    setStep((prev) => {
      prevStepRef.current = prev
      return nextStep
    })
  }

  const handleSubmit = () => {
    if (!profile.name) {
      setError('相手の名前を入力してください')
      return
    }
    if (!profile.userName) {
      setError('あなたの名前を入力してください')
      return
    }
    setError('')

    const query = new URLSearchParams({
      ...profile,
      honestMode: profile.honestMode ? 'true' : 'false',
    }).toString()

    router.push(`/chat?${query}`)
  }

  const inputClass = (isInvalid: boolean) =>
    `w-full p-3 text-base border rounded transition-all duration-200 focus:ring-2 focus:ring-pink-300 focus:border-pink-400 ${
      isInvalid ? 'border-red-500' : 'border-gray-300'
    }`

  const genderButtonClass = (selected: string, value: string) =>
    clsx(
      'px-4 py-2 rounded-full border text-sm sm:text-base cursor-pointer transition text-center',
      selected === value
        ? 'bg-pink-500 text-white border-pink-500'
        : 'bg-white text-gray-600 border-gray-300 hover:bg-pink-100'
    )

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1Profile
            name={profile.name}
            gender={profile.gender}
            setName={(v) => handleChange('name', v)}
            setGender={(v) => handleChange('gender', v)}
            setError={setError}
            onNext={() => handleStepChange(2)}
            error={error}
            inputClass={inputClass}
            genderButtonClass={genderButtonClass}
          />
        )
      case 2:
        return (
          <Step2Details
            mbti={profile.mbti}
            personality={profile.personality}
            speakingStyle={profile.speakingStyle}
            relationship={profile.relationship}
            memory={profile.memory}
            setMbti={(v) => handleChange('mbti', v)}
            setPersonality={(v) => handleChange('personality', v)}
            setSpeakingStyle={(v) => handleChange('speakingStyle', v)}
            setRelationship={(v) => handleChange('relationship', v)}
            setMemory={(v) => handleChange('memory', v)}
            inputClass={inputClass}
            onBack={() => handleStepChange(1)}
            onNext={() => handleStepChange(3)}
          />
        )
      case 3:
        return (
          <Step3Style
            toneMode={profile.toneMode}
            honestMode={profile.honestMode}
            setToneMode={(v) => handleChange('toneMode', v)}
            setHonestMode={(v) => handleChange('honestMode', v)}
            inputClass={inputClass}
            onBack={() => handleStepChange(2)}
            onNext={() => handleStepChange(4)}
          />
        )
      case 4:
        return (
          <Step4UserInfo
            userName={profile.userName}
            userGender={profile.userGender}
            setUserName={(v) => handleChange('userName', v)}
            setUserGender={(v) => handleChange('userGender', v)}
            inputClass={inputClass}
            genderButtonClass={genderButtonClass}
            setError={setError}
            onBack={() => handleStepChange(3)}
            onSubmit={handleSubmit}
          />
        )
    }
  }

  return (
    <main className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 space-y-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-bold text-center text-pink-600">
        “あの人”について教えてください
      </h1>

      <div className="flex justify-center gap-3">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={`w-3 h-3 rounded-full transition ${
              step >= n ? 'bg-pink-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {error && <p className="text-red-500 font-semibold text-center text-sm sm:text-base">{error}</p>}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
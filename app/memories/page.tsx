// app/memories/page.tsx
'use client'

import { Suspense } from 'react'
import MemoryPageContent from './MemoryPageContent'

export default function MemoryPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">読み込み中...</p>}>
      <MemoryPageContent />
    </Suspense>
  )
}

// app/chat/page.tsx
import { Suspense } from 'react'
import ChatPageContent from './ChatPageContent'

export default function ChatPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">読み込み中...</p>}>
      <ChatPageContent />
    </Suspense>
  )
}

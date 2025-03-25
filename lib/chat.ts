// lib/chat.ts
import { supabase } from './supabase' // ← 相対パス確実！

export async function getMessagesBySession(sessionId: string, name: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', sessionId)
    .eq('context->>name', name)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('メッセージ取得エラー:', error)
    return []
  }

  return data
}
// lib/chat.ts に追加

export async function getChatPartners(sessionId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('context')
      .eq('session_id', sessionId)
  
    if (error) {
      console.error('パートナー取得エラー:', error)
      return []
    }
  
    // 重複を除いた “あの人” の名前だけ抽出
    const names = Array.from(
      new Set(
        data.map((d) => d.context?.name).filter((n): n is string => !!n)
      )
    )
  
    return names
  }
  

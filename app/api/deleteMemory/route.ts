import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const { sessionId, name } = await req.json()

  const { error } = await supabase
    .from('memories')
    .delete()
    .eq('session_id', sessionId)
    .eq('name', name)

  if (error) {
    console.error('記憶削除エラー:', error)
    return new Response('削除失敗', { status: 500 })
  }

  return new Response('OK', { status: 200 })
}

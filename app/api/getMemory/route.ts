import { supabase } from '@/lib/supabase'

export async function GET(req: Request) {
  const sessionId = req.headers.get('x-session-id') || ''
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')

  if (!name) return new Response('名前が必要です', { status: 400 })

  const { data, error } = await supabase
    .from('memories')
    .select('content')
    .eq('session_id', sessionId)
    .eq('name', name)
    .single()

  if (error) {
    console.error('記憶取得エラー:', error)
    return new Response('取得失敗', { status: 500 })
  }

  return new Response(JSON.stringify({ content: data?.content }), {
    headers: { 'Content-Type': 'application/json' }
  })
}

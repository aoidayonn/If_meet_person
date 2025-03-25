import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const { sessionId, name, content } = await req.json()

  const { data: existing, error: fetchError } = await supabase
    .from('memories')
    .select('*')
    .eq('session_id', sessionId)
    .eq('name', name)
    .single()

  if (existing) {
    // 既存 → 更新
    const { error: updateError } = await supabase
      .from('memories')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
    if (updateError) return new Response('更新失敗', { status: 500 })
  } else {
    // 新規作成
    const { error: insertError } = await supabase
      .from('memories')
      .insert([{ session_id: sessionId, name, content }])
    if (insertError) return new Response('保存失敗', { status: 500 })
  }

  return new Response('OK', { status: 200 })
}

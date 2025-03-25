// app/api/saveMessage/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'


export async function POST(req: NextRequest) {
  const body = await req.json()
  const { session_id, role, text, context } = body

  if (!session_id || !role || !text) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { error } = await supabase.from('messages').insert([
    {
      session_id,
      role,
      text,
      context
    }
  ])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

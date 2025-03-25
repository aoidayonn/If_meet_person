// app/api/initMemory/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const sessionId = req.headers.get('x-session-id') || ''
  const { name } = await req.json()

  if (!sessionId || !name) {
    return NextResponse.json(
      { error: 'Missing sessionId or name' },
      { status: 400 }
    )
  }

  const { error } = await supabaseServer.from('memories').upsert([
    {
      session_id: sessionId,
      name,
      content: '[]'
    }
  ])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

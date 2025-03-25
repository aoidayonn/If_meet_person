import OpenAI from 'openai'
import { summarizeMessages } from '@/lib/summary'
import { supabase } from '@/lib/supabase'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { summarizeIncrementally } from '@/lib/summary'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})


export async function POST(req: Request) {
  const { profile, message } = await req.json()
  const sessionId = req.headers.get('x-session-id') || ''
  const targetName = profile.name

  // Supabaseから全履歴を取得
  const { data: fullHistory, error } = await supabase
  .from('messages')
  .select('*')
  .eq('session_id', sessionId)
  .eq('context->>name', targetName)
  .order('created_at', { ascending: true })

  if (error) {
    console.error('履歴取得エラー:', error)
  }

  

  const safeHistory = fullHistory || []

  if (safeHistory.length >= 10 && safeHistory.length % 5 === 0) {
    const summary = await summarizeMessages(safeHistory)

    await supabase
    .from('summaries')
    .upsert(
      [
        {
          session_id: sessionId,
          name: targetName,
          summary,
          updated_at: new Date().toISOString()
        }
      ],
      {
        onConflict: 'session_id,name'
      }
    )
  }


  // OpenAIの形式に整形（role + content）
  const formattedHistory = (fullHistory || []).map((m) => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content: m.text
  }))

  // Supabaseから summary を取得
  const { data: summaryData, error: summaryError } = await supabase
  .from('summaries')
  .select('summary, updated_at')
  .eq('session_id', sessionId)
  .eq('name', profile.name)
  .single()

  const previousSummary = summaryData?.summary || ''
  const lastSummaryTime = summaryData?.updated_at

  // 前回の summary 以降のメッセージだけを取得
  const { data: lastMessages } = await supabase
  .from('messages')
  .select('role, text, created_at')
  .eq('session_id', sessionId)
  .eq('context->>name', targetName)
  .gt('created_at', lastSummaryTime)
  .order('created_at', { ascending: true })

  const newMessages = lastMessages || []

  // 件数チェックして、要約トリガー（例：5件ごと）
if (newMessages.length >= 5) {
  const newSummary = await summarizeIncrementally({
    previousSummary,
    newMessages
  })

  await supabase.from('summaries').upsert(
    [
      {
        session_id: sessionId,
        name: targetName,
        summary: newSummary,
        updated_at: new Date().toISOString()
      }
    ],
    {
      onConflict: 'session_id,name'
    }
  )
}

  const { data: memoryData } = await supabase
  .from('memories')
  .select('content')
  .eq('session_id', sessionId)
  .eq('name', targetName)
  .single()

  const memory = memoryData?.content || ''


  // 直近5件だけを文脈に送る
  const recentMessages = formattedHistory.slice(-5)


  const systemPrompt = 
  `あなたは${profile.name}という名前の人物になりきってユーザーと会話を行います。
  性格: ${profile.personality}
  口調: ${profile.speakingStyle}
  関係性: ${profile.relationship}
  記憶: ${profile.memory}
  口調モード: ${profile.toneMode}
  本音モード: ${profile.honestMode ? 'オン' : 'オフ'}
  相手の名前: ${profile.userName}
  相手の性別: ${profile.userGender}

  以下は過去の要約です。文脈として考慮してください。\n\n${previousSummary}\n\n

  これまでの記憶：
  ${memory}
    `

  console.log('🍎：', memory)


  const messages = [
    { role: 'system', content: systemPrompt },
    ...recentMessages,
    { role: 'user', content: message }
  ] as ChatCompletionMessageParam[]

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    temperature: 0.9
  })

  return new Response(
    JSON.stringify({ reply: completion.choices[0].message.content }),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  )
  
}



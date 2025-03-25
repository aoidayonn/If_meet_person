import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function summarizeMessages(messages: { role: string; text: string }[]) {
  const content = messages
    .map((msg) => `${msg.role === 'user' ? 'ユーザー' : 'AI'}: ${msg.text}`)
    .join('\n')

  const systemPrompt = '以下の会話を最高500文字以内で要約してください。情報量が少なければ要約も少なくていいです。'

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content }
    ],
    temperature: 0.3
  })

  // 安全に取得（なければ空文字）
  return res.choices?.[0]?.message?.content ?? ''
}

// 増分要約を生成する関数
export async function summarizeIncrementally({
    previousSummary,
    newMessages,
  }: {
    previousSummary: string
    newMessages: { role: string; text: string }[]
  }): Promise<string> {
    const formatted = newMessages.map((m) => {
      const role = m.role === 'user' ? 'ユーザー' : 'AI'
      return `${role}：${m.text}`
    }).join('\n')
  
    const prompt = `
  あなたはAIのメモリを管理するアシスタントです。
  以下の「前回までの要約」と「追加された新しい会話ログ」をもとに、要点を整理して更新された要約を生成してください。
  要点を失わずに簡潔にまとめてください。
  
  # 前回までの要約
  ${previousSummary || '（なし）'}
  
  # 追加の会話ログ
  ${formatted}
  
  # 更新された要約（AIの記憶に残すべきことを中心に）
  `
  
    const res = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'あなたは要約アシスタントです。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    })
  
    return res.choices[0].message?.content?.trim() || ''
  }

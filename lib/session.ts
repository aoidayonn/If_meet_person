export function getOrCreateSessionId(): string {
    const key = 'session_id'
    let sessionId = localStorage.getItem(key)
  
    if (!sessionId) {
      sessionId = generateUUID()
      localStorage.setItem(key, sessionId)
    }
  
    return sessionId
  }
  
  // crypto.randomUUID が使えない場合でもOKなUUIDジェネレータ
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
  
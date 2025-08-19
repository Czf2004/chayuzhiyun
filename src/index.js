const url = new URL('http://localhost:8000/api/chat/memory');

export async function getResponse(prompt,onComplete,onUpdate,onError,options = {}){
  let fullResponse = ''
  let fullReasoning = ''
  let sessionId = localStorage.getItem('chat_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);
    localStorage.setItem('chat_session_id', sessionId);
  }
  //中断请求
  const controller = new AbortController();
  try{
  const res = await fetch(url,{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
    },
    body:JSON.stringify({
      question : prompt,
      session_id: sessionId,
      use_knowledge_base: options.useKnowledgeBase || false,
       ...(options.category && { category: options.category }),
      reasoning_mode: options.reasoningMode || false,
      stream:true,
    }),
    signal: controller.signal
  })

  if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
  const reader = res.body.getReader()
  const textDecoder = new TextDecoder()

  while(true){
    const {done,value} = await reader.read();

    if(done){
      onComplete({
        fullResponse,
        fullReasoning,
        sessionId,
      });
      break
    }
    const str = textDecoder.decode(value,{stream:true})
    console.log(str);
    // 处理SSE
      const lines = str.split('\n').filter(line => line.trim() !== '');
      for (const line of lines) {
        const data = line.replace(/^data: /, '');
        if (data === '[DONE]') {
          onComplete({
            fullResponse,
            fullReasoning,
            sessionId,
          });
          return;
        }

        try {
          // 解析JSON
          const json = JSON.parse(data);
          const content = json.answer || '';
          const reasoning = json.reasoning || '';

          if (content) {
            fullResponse += content;
          }

          if(reasoning){
            fullReasoning += reasoning
          }

           onUpdate({
            fullResponse,
            latestContent: content,
            fullReasoning,
            latestReasoning: reasoning,
            knowledgeUsed: json.knowledge_used || false,
            turnCount: json.turn_count
          });
        } catch (e) {
          console.warn('解析响应片段失败:', e, '片段内容:', data);
        }
      }
  }
}
  catch (error) {
    if (error.name !== 'AbortError') {
      onError(error);
    }
  }
  return ()=>controller.abort();
}

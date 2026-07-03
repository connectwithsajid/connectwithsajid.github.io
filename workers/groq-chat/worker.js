export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      })
    }

    if (request.method !== 'POST') {
      return Response.json({
        error: 'Method not allowed'
      }, {
        status: 405,
        headers: corsHeaders
      })
    }

    try {
      const body = await request.json()
      const question = (body.message || '').trim()

      if (!question) {
        return Response.json({
          error: 'Missing message'
        }, {
          status: 400,
          headers: corsHeaders
        })
      }

      const systemPrompt = [
        'You are the portfolio assistant for Sajid Shaikh.',
        'Answer using only the portfolio context you were given.',
        'Keep answers concise, helpful, and professional.',
        'Mention Topmate only when the user asks about mentorship, resume review, or booking time.',
        'If the answer is uncertain, say so plainly instead of inventing details.'
      ].join(' ')

      const profileContext = [
        'Sajid Shaikh is an AI and Data Engineer and a USC Computer Science alumnus.',
        'He works across data engineering, backend systems, machine learning, RAG-ready document processing, NLP text mining, computer vision, graph analytics, PostgreSQL query optimization, AWS pipelines, Flask APIs, Java systems, CI/CD, and production data validation.',
        'He builds scalable systems that convert raw data into reliable analytics, automation, and decision platforms.',
        'Projects include multimodal assistive AI, X-GastroAI, clinical data pipelines, distributed graph analytics, PostgreSQL optimization, and backend data tooling.',
        'He welcomes questions in English or Spanish.',
        'For mentorship or consulting, his Topmate is https://topmate.io/connectwithsajid.'
      ].join(' ')

      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: env.GROQ_MODEL || 'llama-3.1-8b-instant',
          temperature: 0.35,
          max_tokens: 300,
          messages: [
            {
              role: 'system',
              content: `${systemPrompt}\n\nPortfolio context:\n${profileContext}`
            },
            {
              role: 'user',
              content: question
            }
          ]
        })
      })

      if (!groqResponse.ok) {
        const errorText = await groqResponse.text()
        return Response.json({
          error: 'Groq request failed',
          details: errorText
        }, {
          status: 502,
          headers: corsHeaders
        })
      }

      const groqData = await groqResponse.json()
      const answer = groqData.choices?.[0]?.message?.content?.trim()

      return Response.json({
        answer: answer || 'The assistant could not generate a response just now.'
      }, {
        headers: corsHeaders
      })
    } catch (error) {
      return Response.json({
        error: 'Unexpected server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, {
        status: 500,
        headers: corsHeaders
      })
    }
  }
}

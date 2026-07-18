import { retrieveChunks, formatRetrievedContext } from './retrieve.js'

const SYSTEM_PROMPT = [
  'You are the portfolio assistant for Sajid Shaikh.',
  'Answer using only the retrieved portfolio context below.',
  'Keep answers concise, helpful, and professional.',
  'Prefer specific projects, roles, metrics, and links from the context when relevant.',
  'Mention Topmate only when the user asks about mentorship, resume review, consulting, or booking time.',
  'If the answer is uncertain or not covered by the context, say so plainly instead of inventing details.',
  'You may answer in English or Spanish to match the user.'
].join(' ')

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
      if (!env.GROQ_API_KEY) {
        return Response.json({
          error: 'GROQ_API_KEY is not configured'
        }, {
          status: 500,
          headers: corsHeaders
        })
      }

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

      const topK = Number(env.RAG_TOP_K || 4)
      const retrieval = retrieveChunks(question, { topK })
      const retrievedContext = formatRetrievedContext(retrieval.chunks)

      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: env.GROQ_MODEL || 'llama-3.1-8b-instant',
          temperature: 0.35,
          max_tokens: 350,
          messages: [
            {
              role: 'system',
              content: `${SYSTEM_PROMPT}\n\nRetrieved portfolio context:\n${retrievedContext}`
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
        || 'The assistant could not generate a response just now.'
      const sources = retrieval.chunks.map((chunk) => chunk.id)

      // Structured log for Workers Logs / Log Explorer.
      console.log(JSON.stringify({
        event: 'portfolio_chat',
        question,
        sources,
        answer,
        source: body.source || null,
        locale: body.locale || null
      }))

      const payload = {
        answer,
        sources
      }

      if (body.debug === true) {
        payload.debug = {
          queryTokens: retrieval.queryTokens,
          scores: retrieval.scores
        }
      }

      return Response.json(payload, {
        headers: corsHeaders
      })
    } catch (error) {
      console.error(JSON.stringify({
        event: 'portfolio_chat_error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }))

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

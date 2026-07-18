import { ALWAYS_INCLUDE_IDS, KNOWLEDGE_CHUNKS } from './knowledge.js'

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'or', 'that', 'the', 'to', 'was', 'were',
  'what', 'when', 'where', 'who', 'with', 'you', 'your', 'about', 'can', 'does',
  'did', 'how', 'me', 'my', 'this', 'his', 'him', 'do', 'any', 'tell'
])

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s+./-]/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token))
}

function scoreChunk(chunk, queryTokens) {
  if (!queryTokens.length) return 0

  const titleTokens = new Set(tokenize(chunk.title))
  const tagTokens = new Set(tokenize((chunk.tags || []).join(' ')))
  const bodyTokens = tokenize(chunk.text)
  const bodyFreq = new Map()

  for (const token of bodyTokens) {
    bodyFreq.set(token, (bodyFreq.get(token) || 0) + 1)
  }

  let score = 0

  for (const token of queryTokens) {
    if (titleTokens.has(token)) score += 4
    if (tagTokens.has(token)) score += 3
    if (bodyFreq.has(token)) score += 1 + Math.min(bodyFreq.get(token), 3) * 0.25

    // Light prefix match for partial terms like "gastro" → "x-gastroai"
    for (const tag of tagTokens) {
      if (tag.includes(token) || token.includes(tag)) score += 1.5
    }
    for (const titleToken of titleTokens) {
      if (titleToken.includes(token) || token.includes(titleToken)) score += 1
    }
  }

  return score
}

/**
 * Retrieve top-k knowledge chunks for a question using keyword similarity.
 * Always includes core profile/mentorship grounding chunks.
 */
export function retrieveChunks(question, {
  topK = 4,
  minScore = 2,
  chunks = KNOWLEDGE_CHUNKS
} = {}) {
  const queryTokens = tokenize(question)
  const scored = chunks.map((chunk) => ({
    chunk,
    score: scoreChunk(chunk, queryTokens)
  }))

  scored.sort((a, b) => b.score - a.score || a.chunk.id.localeCompare(b.chunk.id))

  const selected = []
  const selectedIds = new Set()

  for (const id of ALWAYS_INCLUDE_IDS) {
    const chunk = chunks.find((item) => item.id === id)
    if (chunk) {
      selected.push(chunk)
      selectedIds.add(id)
    }
  }

  for (const item of scored) {
    if (selected.length >= topK) break
    if (selectedIds.has(item.chunk.id)) continue
    if (item.score < minScore) continue
    selected.push(item.chunk)
    selectedIds.add(item.chunk.id)
  }

  // If the query matched nothing extra, still return the grounding chunks.
  return {
    chunks: selected.slice(0, Math.max(topK, ALWAYS_INCLUDE_IDS.length)),
    queryTokens,
    scores: Object.fromEntries(scored.map((item) => [item.chunk.id, Number(item.score.toFixed(2))]))
  }
}

export function formatRetrievedContext(chunks) {
  return chunks.map((chunk, index) => {
    return `[${index + 1}] ${chunk.title}\n${chunk.text}`
  }).join('\n\n')
}

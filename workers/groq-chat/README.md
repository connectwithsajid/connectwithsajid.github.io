# Groq Chat Worker (RAG-lite)

Secure proxy for the portfolio chatbot. The frontend calls `/api/chat`, the Worker retrieves relevant knowledge chunks about Sajid, then calls Groq with only that context.

## Why this exists

The portfolio is a static GitHub Pages site, so the Groq API key must never live in browser JavaScript.

## How the bot learns about Sajid

It does **not** train a model. Knowledge lives in curated chunks:

- `knowledge.js` — profile, experience, projects, blogs, mentorship
- `retrieve.js` — keyword similarity (title/tag/body scoring)
- `worker.js` — retrieves top chunks, then calls Groq

To update what the chatbot knows, edit `knowledge.js` and redeploy the Worker.

## Required secrets

- `GROQ_API_KEY`
- `GROQ_MODEL` (optional, default `llama-3.1-8b-instant`)
- `RAG_TOP_K` (optional, default `4`)

## Request shape

`POST /api/chat`

```json
{
  "message": "What did Sajid build at VISIC?",
  "source": "portfolio",
  "locale": "en"
}
```

Optional debug (shows retrieval scores):

```json
{
  "message": "Tell me about X-GastroAI",
  "debug": true
}
```

## Response shape

```json
{
  "answer": "At VISIC, Sajid is a Founding Engineer focused on backend systems for CityWise...",
  "sources": ["profile", "mentorship", "experience-visic", "project-citywise"]
}
```

## Local retrieval smoke test

From this folder:

```bash
node --input-type=module -e "
import { retrieveChunks } from './retrieve.js'
console.log(retrieveChunks('What is CityWise?').chunks.map(c => c.id))
console.log(retrieveChunks('X-GastroAI accuracy').chunks.map(c => c.id))
console.log(retrieveChunks('mentorship booking').chunks.map(c => c.id))
"
```

## Deploy (Cloudflare Workers)

```bash
cd workers/groq-chat
npx wrangler secret put GROQ_API_KEY
npx wrangler deploy
```

Then either:

1. Route your domain's `/api/chat` to this Worker, or
2. Point the site `data-chat-endpoint` at the Worker URL

## See what users ask

Observability is enabled in `wrangler.toml`. Each successful chat logs:

```json
{
  "event": "portfolio_chat",
  "question": "...",
  "sources": ["profile", "project-citywise"],
  "answer": "..."
}
```

After redeploy:

1. Cloudflare dashboard → **Workers & Pages** → **groq-chat** → **Logs**
2. Or live stream: `npx wrangler tail`
3. Filter / search for `portfolio_chat` or a keyword from the question

## Important

Rotate any Groq key that was pasted into chat or another shared surface before deploying.

# Groq Chat Worker

This Worker is a secure proxy for the portfolio chatbot. The frontend calls `/api/chat`, and the Worker sends the request to Groq using a server-side secret.

## Why this exists

The portfolio is a static site, so the Groq API key must never be placed in browser JavaScript or committed into the repo.

## Required secrets

- `GROQ_API_KEY`
- `GROQ_MODEL` (optional)

Recommended default model:

- `llama-3.1-8b-instant`

## Request shape

`POST /api/chat`

```json
{
  "message": "What kinds of AI systems has Sajid built?",
  "source": "portfolio",
  "locale": "en"
}
```

## Response shape

```json
{
  "answer": "Sajid has built multimodal assistive AI systems, explainable medical AI workflows, clinical data pipelines, and distributed graph analytics tooling."
}
```

## Deploy notes

1. Deploy this Worker on a platform that can store secrets.
2. Bind `GROQ_API_KEY` as an environment secret.
3. Route `/api/chat` to the Worker.
4. Keep the frontend `data-chat-endpoint` pointing at `/api/chat`, or replace it with the deployed full URL if needed.

## Important

Rotate the current Groq key before deploying. It should be treated as compromised once pasted into chat or any shared surface.

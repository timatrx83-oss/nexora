# NEXORA

Frontend for NEXORA — a career and skills exploration platform.

> Your skills. Your future. Your next move.

```bash
npm install
npm run dev
```

## AI Mentor (default: local, free)

The AI Mentor is a **built-in exploration mentor**. It uses your Assessment, Explore matches and saved careers. It does **not** need `OPENAI_API_KEY` and does not call OpenAI.

1. Run `npm run dev`.
2. Complete the Assessment (optional but recommended).
3. Open AI Mentor and send a message.

## Optional real OpenAI mode

The OpenAI Responses API integration is kept for later. It stays off unless you explicitly enable it.

1. Copy `.env.example` to `.env`.
2. Set `OPENAI_API_KEY` (server-only, never `VITE_` / `NEXT_PUBLIC_`).
3. Optionally set `OPENAI_MODEL` (default: `gpt-5.6-luna`).
4. Set `VITE_MENTOR_ENGINE=openai` to send Mentor chat through `/api/mentor`.
5. If that request fails, the app falls back to the local Mentor Engine.

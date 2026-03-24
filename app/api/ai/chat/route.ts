import { NextRequest } from 'next/server';
import { ChatAnthropic } from '@langchain/anthropic';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { buildSystemPrompt } from '@/lib/chat/systemPrompt';

// ============================================================
// SECURITY: ANTHROPIC_API_KEY is NEVER prefixed with NEXT_PUBLIC_
// → Only accessible server-side, never exposed to the browser
// ============================================================
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Simple in-memory rate limiter (per IP)
// In production, replace with Redis or Upstash for multi-instance support
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = { maxRequests: 20, windowMs: 60_000 }; // 20 req/min per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return true;
  }

  if (entry.count >= RATE_LIMIT.maxRequests) return false;

  entry.count++;
  return true;
}

// Clean up stale rate limit entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitMap) {
      if (now > entry.resetAt) rateLimitMap.delete(ip);
    }
  }, 5 * 60_000);
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  // ── Security: validate API key is configured ──────────────
  if (!ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Server configuration error: ANTHROPIC_API_KEY not set.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ── Rate limiting ─────────────────────────────────────────
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ── Parse & validate request body ────────────────────────
  let body: { messages: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: 'messages array is required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ── Sanitize: limit conversation history to last 20 messages ──
  const recentMessages = messages.slice(-20);

  // ── Build LangChain messages ──────────────────────────────
  const systemPrompt = buildSystemPrompt();

  const langchainMessages = [
    new SystemMessage(systemPrompt),
    ...recentMessages.map((m) =>
      m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
    ),
  ];

  // ── Initialize ChatAnthropic (LangChain) ──────────────────
  const model = new ChatAnthropic({
    apiKey: ANTHROPIC_API_KEY,   // server-side only ✓
    model: 'claude-sonnet-4-5',  // fast & capable for journalism tasks
    maxTokens: 4096,
    streaming: true,
  });

  // ── Stream response back to client ───────────────────────
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const streamResponse = await model.stream(langchainMessages);

        for await (const chunk of streamResponse) {
          const text =
            typeof chunk.content === 'string'
              ? chunk.content
              : chunk.content
                  .filter((c): c is { type: 'text'; text: string } => c.type === 'text')
                  .map((c) => c.text)
                  .join('');

          if (text) {
            // Server-Sent Events format
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      // Security headers
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

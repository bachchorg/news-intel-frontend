'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Copy, Check, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/app/api/ai/chat/route';

// ── Quick prompt shortcuts for journalist workflow ────────
const QUICK_PROMPTS = [
  { label: '✍️ Viết bài mới', prompt: 'Tôi cần viết một bài báo về ' },
  { label: '📰 Đặt tiêu đề', prompt: 'Hãy đặt 5 tiêu đề catchy cho bài báo về: ' },
  { label: '✂️ Tóm tắt', prompt: 'Tóm tắt thông tin sau thành bài báo ngắn 300 từ:\n\n' },
  { label: '🔍 Phân tích góc độ', prompt: 'Gợi ý các góc độ khai thác hay cho tin tức: ' },
  { label: '✅ Kiểm tra bài', prompt: 'Hãy review và cải thiện bài viết sau:\n\n' },
];

// ── Minimal markdown renderer (no external deps) ─────────
function renderMarkdown(text: string): string {
  return text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // H2 headings (## ...)
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold mt-4 mb-1 text-gray-100">$1</h2>')
    // H3 headings (### ...)
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold mt-3 mb-1 text-gray-200">$1</h3>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="border-gray-600 my-3"/>')
    // Bullet lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    // Paragraphs (double newlines)
    .replace(/\n\n/g, '</p><p class="mb-2">')
    // Single newlines
    .replace(/\n/g, '<br/>');
}

interface MessageBubbleProps {
  message: ChatMessage;
  isLast: boolean;
  isStreaming: boolean;
}

function MessageBubble({ message, isLast, isStreaming }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('flex gap-3 group', isAssistant ? 'items-start' : 'items-start flex-row-reverse')}>
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
          isAssistant ? 'bg-blue-600' : 'bg-gray-600'
        )}
      >
        {isAssistant ? <Bot size={15} /> : <User size={15} />}
      </div>

      {/* Bubble */}
      <div className={cn('max-w-[78%] flex flex-col gap-1', isAssistant ? 'items-start' : 'items-end')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed',
            isAssistant
              ? 'bg-gray-800 text-gray-100 rounded-tl-sm'
              : 'bg-blue-600 text-white rounded-tr-sm'
          )}
        >
          {isAssistant ? (
            <div
              className="prose-sm"
              dangerouslySetInnerHTML={{
                __html: `<p class="mb-2">${renderMarkdown(message.content)}</p>`,
              }}
            />
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}

          {/* Streaming cursor */}
          {isLast && isStreaming && isAssistant && (
            <span className="inline-block w-0.5 h-4 bg-blue-400 ml-0.5 animate-pulse align-middle" />
          )}
        </div>

        {/* Copy button (only for assistant messages, when not streaming) */}
        {isAssistant && !isStreaming && (
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 px-1"
          >
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            {copied ? 'Đã sao chép' : 'Sao chép'}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main ChatInterface component ──────────────────────────
export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [input]);

  const sendMessage = useCallback(
    async (userContent: string) => {
      if (!userContent.trim() || isStreaming) return;

      setError(null);
      const userMessage: ChatMessage = { role: 'user', content: userContent.trim() };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput('');
      setIsStreaming(true);

      // Placeholder for assistant response
      const assistantPlaceholder: ChatMessage = { role: 'assistant', content: '' };
      setMessages([...updatedMessages, assistantPlaceholder]);

      abortControllerRef.current = new AbortController();

      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: updatedMessages }),
          signal: abortControllerRef.current.signal,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({ error: 'Lỗi server' }));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error('No response stream');

        const decoder = new TextDecoder();
        let accumulatedText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.text) {
                accumulatedText += parsed.text;
                setMessages((prev) => {
                  const next = [...prev];
                  next[next.length - 1] = { role: 'assistant', content: accumulatedText };
                  return next;
                });
              }
            } catch {
              // skip malformed SSE lines
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          // User cancelled – keep whatever was streamed
        } else {
          const message = err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định';
          setError(message);
          // Remove empty assistant placeholder if nothing was received
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === 'assistant' && !last.content) return prev.slice(0, -1);
            return prev;
          });
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
        textareaRef.current?.focus();
      }
    },
    [messages, isStreaming]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const handleClear = () => {
    if (isStreaming) {
      abortControllerRef.current?.abort();
    }
    setMessages([]);
    setError(null);
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Bot size={16} />
          </div>
          <div>
            <p className="font-semibold text-sm">Trợ lý Viết Báo AI</p>
            <p className="text-xs text-gray-400">Phong cách znews.vn · Claude claude-sonnet-4-5</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-gray-800"
          >
            <Trash2 size={13} />
            Xóa cuộc trò chuyện
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
        {messages.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Bot size={28} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-100 mb-1">Trợ lý Viết Báo AI</h2>
              <p className="text-sm text-gray-400 max-w-sm">
                Sẵn sàng hỗ trợ bạn viết bài theo phong cách znews.vn với 10 năm kinh nghiệm
                báo chí tiếng Việt
              </p>
            </div>

            {/* Quick prompts */}
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {QUICK_PROMPTS.map((qp) => (
                <button
                  key={qp.label}
                  onClick={() => handleQuickPrompt(qp.prompt)}
                  className="text-sm px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-colors text-gray-300 hover:text-white"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <MessageBubble
              key={i}
              message={msg}
              isLast={i === messages.length - 1}
              isStreaming={isStreaming}
            />
          ))
        )}

        {/* Error banner */}
        {error && (
          <div className="bg-red-900/40 border border-red-700 rounded-xl px-4 py-3 text-sm text-red-300">
            ⚠️ {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="px-4 pb-5 pt-3 border-t border-gray-800 bg-gray-900">
        {/* Quick prompts (shown when chat is active) */}
        {messages.length > 0 && (
          <div className="flex gap-1.5 mb-2.5 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_PROMPTS.map((qp) => (
              <button
                key={qp.label}
                onClick={() => handleQuickPrompt(qp.prompt)}
                className="text-xs px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 whitespace-nowrap text-gray-400 hover:text-gray-200 transition-colors flex-shrink-0"
              >
                {qp.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2 bg-gray-800 rounded-2xl border border-gray-700 focus-within:border-blue-500 transition-colors px-4 py-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập yêu cầu viết báo... (Enter để gửi, Shift+Enter xuống dòng)"
            rows={1}
            disabled={isStreaming}
            className="flex-1 bg-transparent text-sm text-gray-100 placeholder-gray-500 resize-none outline-none min-h-[24px] max-h-[160px] py-1.5 disabled:opacity-60"
          />

          <div className="flex items-center gap-1.5 pb-1.5 flex-shrink-0">
            {isStreaming ? (
              <button
                onClick={handleStop}
                className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-colors"
                title="Dừng"
              >
                <span className="w-2.5 h-2.5 bg-white rounded-sm" />
              </button>
            ) : (
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                  input.trim()
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                )}
                title="Gửi (Enter)"
              >
                {isStreaming ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Send size={15} />
                )}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-2">
          AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng trước khi đăng bài.
        </p>
      </div>
    </div>
  );
}

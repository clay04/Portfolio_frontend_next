'use client'

import { useEffect, useRef, useState } from "react"
import { streamChatMessage, getChatHistory } from "@/lib/api/chat"

type Message = {
  role: "user" | "assistant"
  content: string
  sourceDocuments?: string[]
  isStreaming?: boolean   // true saat token masih mengalir
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [openChat, setOpenChat] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // 🔥 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  // 🔥 LOAD DATA (Backend → fallback LocalStorage)
  useEffect(() => {
    const load = async () => {
      const sessionId = localStorage.getItem("sessionId")

      if (sessionId) {
        try {
          const res = await getChatHistory(sessionId)
          if (res.status === "success" && res.messages?.length > 0) {
            setMessages(res.messages.map((m: Message) => ({
              role: m.role,
              content: m.content,
              sourceDocuments: m.sourceDocuments,
              isStreaming: false,
            })))
            return
          }
        } catch {
          console.warn("Backend gagal, fallback ke localStorage")
        }
      }

      // Fallback localStorage
      const saved = localStorage.getItem("chatMessages")
      if (saved) setMessages(JSON.parse(saved))
    }

    load()
  }, [])

  // 🔥 SAVE LOCAL CACHE (hanya pesan yang sudah selesai)
  useEffect(() => {
    const done = messages.filter((m) => !m.isStreaming)
    localStorage.setItem("chatMessages", JSON.stringify(done))
  }, [messages])

  // 🔥 SEND MESSAGE — streaming
  const handleSend = async () => {
    if (!input.trim() || loading) return

    const question = input.trim()

    // Tambah pesan user
    setMessages((prev) => [...prev, { role: "user", content: question }])
    setInput("")
    setLoading(true)

    // Placeholder AI dengan content kosong
    // const AI_PLACEHOLDER_ID = `ai-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", isStreaming: true },
    ])

    // AbortController untuk cancel stream
    const controller = new AbortController()
    abortRef.current = controller

    try {
      await streamChatMessage(
        question,
        {
          // Setiap token → append ke pesan AI terakhir
          onToken: (token) => {
            setMessages((prev) => {
              const updated = [...prev]
              const last = updated[updated.length - 1]
              if (last?.role === "assistant") {
                updated[updated.length - 1] = {
                  ...last,
                  content: last.content + token,
                }
              }
              return updated
            })
          },

          // Sumber dokumen diterima
          onSources: (sources) => {
            setMessages((prev) => {
              const updated = [...prev]
              const last = updated[updated.length - 1]
              if (last?.role === "assistant") {
                updated[updated.length - 1] = { ...last, sourceDocuments: sources }
              }
              return updated
            })
          },

          // Stream selesai — hilangkan flag isStreaming
          onDone: () => {
            setMessages((prev) => {
              const updated = [...prev]
              const last = updated[updated.length - 1]
              if (last?.role === "assistant") {
                updated[updated.length - 1] = { ...last, isStreaming: false }
              }
              return updated
            })
            setLoading(false)
          },

          // Error dari server
          onError: (msg) => {
            setMessages((prev) => {
              const updated = [...prev]
              const last = updated[updated.length - 1]
              if (last?.role === "assistant") {
                updated[updated.length - 1] = {
                  ...last,
                  content: `⚠️ ${msg}`,
                  isStreaming: false,
                }
              }
              return updated
            })
            setLoading(false)
          },
        },
        controller.signal
      )
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return // User cancel
      setMessages((prev) => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        if (last?.role === "assistant") {
          updated[updated.length - 1] = {
            ...last,
            content: "⚠️ Terjadi error, coba lagi.",
            isStreaming: false,
          }
        }
        return updated
      })
      setLoading(false)
    } finally {
      abortRef.current = null
    }
  }

  return (
    <>
      {/* 🔘 BUTTON FLOATING */}
      {!openChat && (
        <button
          onClick={() => setOpenChat(true)}
          className="fixed bottom-6 right-6 px-4 py-3 bg-black text-white dark:bg-white dark:text-black rounded-full shadow-lg hover:scale-105 transition"
        >
          Ask About Clay
        </button>
      )}

      {/* 💬 CHAT BOX */}
      {openChat && (
        <div className="fixed bottom-6 right-6 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl flex flex-col overflow-hidden">

          {/* HEADER */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-semibold flex justify-between items-center">
            Ask About Clay
            <button
              onClick={() => setOpenChat(false)}
              className="text-sm text-zinc-500 hover:text-red-500"
            >
              ✕
            </button>
          </div>

          {/* CHAT AREA */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-80 flex flex-col">

            {messages.length === 0 && (
              <div className="text-sm text-zinc-400 text-center">
                Start conversation...
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm px-3 py-2 rounded-lg max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-black text-white self-end"
                    : "bg-zinc-100 dark:bg-zinc-800 self-start"
                }`}
              >
                {/* Konten teks */}
                <span className="whitespace-pre-wrap">{msg.content}</span>

                {/* ── Blinking cursor saat streaming ── */}
                {msg.isStreaming && (
                  <span className="inline-block w-0.5 h-4 bg-current ml-0.5 align-middle animate-pulse" />
                )}

                {/* Source doc badge */}
                {msg.role === "assistant" &&
                  !msg.isStreaming &&
                  msg.sourceDocuments &&
                  msg.sourceDocuments.length > 0 && (
                    <p className="mt-1 text-[10px] text-zinc-400">
                      📄 {msg.sourceDocuments[0]}
                    </p>
                  )}
              </div>
            ))}

            {/* Thinking indicator — hanya sebelum token pertama datang */}
            {loading && messages[messages.length - 1]?.content === "" && (
              <div className="text-sm text-zinc-500">Thinking...</div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent outline-none"
              placeholder="Ask something..."
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg text-sm hover:opacity-90 transition disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}
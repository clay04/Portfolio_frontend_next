import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

// ── Helper: ambil/buat sessionId dari localStorage ────────────────────────────
const getSessionId = (): string | null => {
  if (typeof window === "undefined") return null
  let id = localStorage.getItem("sessionId")
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem("sessionId", id)
  }
  return id
}

// ── Axios instance dengan X-Session-ID otomatis ───────────────────────────────
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
})

apiClient.interceptors.request.use((config) => {
  const sessionId = getSessionId()
  if (sessionId) config.headers["X-Session-ID"] = sessionId
  return config
})

apiClient.interceptors.response.use((response) => {
  const newId = response.headers["x-session-id"]
  if (newId) localStorage.setItem("sessionId", newId)
  return response
})

// ── Non-streaming (fallback) ──────────────────────────────────────────────────
export async function sendChatMessage(question: string) {
  const res = await apiClient.post("/api/v1/chat", { question })
  return res.data
}

// ── Get history ───────────────────────────────────────────────────────────────
export async function getChatHistory(sessionId: string) {
  const res = await apiClient.get(`/api/v1/chat/history/${sessionId}`)
  return res.data
}

// ── Streaming ─────────────────────────────────────────────────────────────────
// Gunakan native fetch karena axios tidak support ReadableStream di browser.
// Callback onToken dipanggil per token, onSources saat sumber diterima,
// onDone saat stream selesai.
export async function streamChatMessage(
  question: string,
  callbacks: {
    onToken: (token: string) => void
    onSources: (sources: string[]) => void
    onDone: () => void
    onError: (msg: string) => void
  },
  signal?: AbortSignal
): Promise<void> {
  const sessionId = getSessionId()

  const response = await fetch(`${API_URL}/api/v1/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(sessionId ? { "X-Session-ID": sessionId } : {}),
    },
    body: JSON.stringify({ question }),
    signal,
  })

  if (!response.ok) {
    callbacks.onError(`Server error: ${response.status}`)
    return
  }

  // Simpan sessionId dari header response
  const newId = response.headers.get("x-session-id")
  if (newId) localStorage.setItem("sessionId", newId)

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n")
    buffer = lines.pop() ?? ""  // Simpan baris yang belum lengkap

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue
      try {
        const parsed = JSON.parse(line.slice(6))

        if (parsed.type === "sources") {
          callbacks.onSources(parsed.data)
        } else if (parsed.type === "token") {
          callbacks.onToken(parsed.data.replace(/\\n/g, "\n"))
        } else if (parsed.type === "done") {
          callbacks.onDone()
        } else if (parsed.type === "error") {
          callbacks.onError(parsed.data)
        }
      } catch {
        // abaikan baris yang tidak bisa di-parse
      }
    }
  }
}
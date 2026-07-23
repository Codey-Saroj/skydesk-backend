import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, X, Send, Plane } from 'lucide-react'

import bookings from '../../data/bookings.json'
import profile from '../../data/profile.json'
import offers from '../../data/offers.json'
import destinations from '../../data/destinations.json'
import travelTips from '../../data/travelTips.json'
import { advances as seedAdvances } from '../../data/expenseData'
import { useExpenseStore } from '../../hooks/useExpenses.jsx'
import { useAdvances } from '../../hooks/useAdvances.jsx'
import { useChat } from '../../hooks/chat/useChat'

export default function ChatBot() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false)
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)

  const { messages, typing, sendMessage } = useChat()

  // Expense/advance data comes from live app context
  let expenseStore = null
  let advancesStore = null
  try {
    expenseStore = useExpenseStore()
  } catch {
    expenseStore = null
  }
  try {
    advancesStore = useAdvances()
  } catch {
    advancesStore = null
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, typing])

  const handleOpen = () => {
    setOpen(true)
    setHasOpenedOnce(true)
  }

  const buildContext = () => ({
    bookings,
    profile,
    offers,
    destinations,
    travelTips,
    expenses: expenseStore?.expenses ?? [],
    totals: expenseStore?.totals ?? { total: 0, pending: 0, approved: 0, rejected: 0 },
    addExpense: expenseStore?.addExpense ?? null,
    budgets: [
      { category: 'Meals', monthly: 5000 },
      { category: 'Transport', monthly: 3000 },
      { category: 'Accommodation', monthly: 15000 },
      { category: 'Communication', monthly: 1000 },
      { category: 'Other', monthly: 2000 },
    ],
    advances: advancesStore?.advances ?? seedAdvances,
  })

  const send = (rawText) => {
    const text = (rawText ?? input).trim()
    if (!text) return

    sendMessage(text, buildContext(), navigate)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      {/* Floating launcher button */}
      {!open && (
        <button
          onClick={handleOpen}
          aria-label="Open SkyDesk Assistant"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] shadow-xl shadow-blue-900/20 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
        >
          {!hasOpenedOnce && (
            <span className="absolute inset-0 rounded-full bg-[#2563EB] animate-ping opacity-40" />
          )}
          <Sparkles size={22} className="text-white relative" />
          {!hasOpenedOnce && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#F97316] rounded-full border-2 border-white" />
          )}
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm h-[min(600px,calc(100vh-3rem))] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Plane size={16} className="text-white fill-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-tight">Skye</p>
              <p className="text-[11px] text-blue-100 leading-tight">SkyDesk Assistant</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="p-1.5 rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-slate-50">
            {messages.map((m) => (
              <ChatBubble key={m.id} message={m} onQuickReply={send} onAction={(a) => navigate(a.path)} />
            ))}
            {typing && (
              <div className="flex items-center gap-1.5 pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-100 bg-white shrink-0">
            <div className="flex items-end gap-2 bg-slate-100 rounded-full px-3 py-2 border border-transparent focus-within:border-[#2563EB]/40 focus-within:bg-white transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about flights, wallet, expenses..."
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none min-w-0"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim()}
                aria-label="Send message"
                className="w-7 h-7 rounded-full bg-[#2563EB] disabled:bg-slate-300 flex items-center justify-center text-white transition-colors shrink-0 cursor-pointer"
              >
                <Send size={13} />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              Powered by SkyDesk API & Gemini, grounded in your data.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

function ChatBubble({ message, onQuickReply, onAction }) {
  const isBot = message.role === 'bot'
  return (
    <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line ${
          isBot
            ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
            : 'bg-[#2563EB] text-white rounded-tr-sm'
        }`}
      >
        {message.text}
      </div>

      {isBot && message.actions && message.actions.filter((a) => !a.auto).length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {message.actions.filter((a) => !a.auto).map((a) => (
            <button
              key={a.path + a.label}
              onClick={() => onAction(a)}
              className="text-[11px] font-semibold text-[#2563EB] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
            >
              {a.label} →
            </button>
          ))}
        </div>
      )}

      {isBot && message.quickReplies && (
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {message.quickReplies.map((q) => (
            <button
              key={q}
              onClick={() => onQuickReply(q)}
              className="text-[11px] font-medium text-slate-600 bg-white border border-slate-200 hover:border-[#2563EB]/40 hover:text-[#2563EB] px-2.5 py-1 rounded-full transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

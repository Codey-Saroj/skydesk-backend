import { useState, useRef, useCallback } from 'react'
import { sendChatMessage } from '../../services/chat/chat.service'
import { runClientAction, runLocalFallback, STARTER_SUGGESTIONS } from '../../utils/chat/chatbotEngine'

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'bot',
  text: "Hi! I'm Skye, your SkyDesk assistant. Ask me about your flights, wallet, expenses, or let me suggest your next trip.",
  quickReplies: STARTER_SUGGESTIONS,
}

export function useChat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [typing, setTyping] = useState(false)
  const historyRef = useRef([]) // Rolling conversational history: [{ role: 'user'|'model', text }]

  const sendMessage = useCallback(async (text, context, navigate) => {
    const trimmedText = text.trim()
    if (!trimmedText) return

    // 1. Add user's message to UI list immediately
    const userMsg = { id: `u-${Date.now()}`, role: 'user', text: trimmedText }
    setMessages((prev) => [...prev, userMsg])
    setTyping(true)

    try {
      // 2. Check for local client-side actions (e.g. pre-filling form, fast navigation)
      const actionResult = runClientAction(trimmedText, context)
      if (actionResult) {
        const botMsg = { id: `b-${Date.now()}`, role: 'bot', ...actionResult }
        setMessages((prev) => [...prev, botMsg])

        // Handle auto navigation if defined
        const autoAction = actionResult.actions?.find((a) => a.auto)
        if (autoAction && navigate) {
          setTimeout(() => navigate(autoAction.path), 400)
        }
        setTyping(false)
        return
      }

      // 3. Fallback to backend Gemini server call
      try {
        const history = historyRef.current
        const serviceResponse = await sendChatMessage(trimmedText, context, history)
        
        const botMsg = {
          id: `b-${Date.now()}`,
          role: 'bot',
          text: serviceResponse.reply,
        }
        setMessages((prev) => [...prev, botMsg])

        // Maintain rolling history of up to 12 messages (6 turns)
        historyRef.current = [
          ...historyRef.current,
          { role: 'user', text: trimmedText },
          { role: 'model', text: serviceResponse.reply },
        ].slice(-12)

      } catch (backendError) {
        console.warn('Backend Gemini API failed; falling back to local FAQ engine:', backendError.message)
        
        // 4. Run local rule-based intent engine if backend is down or Gemini not configured
        const localResult = runLocalFallback(trimmedText, context)
        const botMsg = { id: `b-${Date.now()}`, role: 'bot', ...localResult }
        setMessages((prev) => [...prev, botMsg])

        // Maintain rolling history for local turns too
        historyRef.current = [
          ...historyRef.current,
          { role: 'user', text: trimmedText },
          { role: 'model', text: localResult.text },
        ].slice(-12)
      }

    } catch (err) {
      console.error('Chat error:', err)
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          role: 'bot',
          text: "I encountered a problem processing your request. Please try again in a moment.",
        },
      ])
    } finally {
      setTyping(false)
    }
  }, [])

  const resetChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE])
    setTyping(false)
    historyRef.current = []
  }, [])

  return {
    messages,
    typing,
    sendMessage,
    resetChat,
  }
}

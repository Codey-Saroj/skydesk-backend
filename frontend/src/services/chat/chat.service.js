import { apiFetch } from '../../utils/api'

/**
 * Sends the user's message and grounding context to the backend.
 *
 * @param {string} message - User's latest input
 * @param {object} context - Grounding context snapshot (profile, bookings, expenses)
 * @param {Array<{role: 'user'|'model', text: string}>} history - Active session conversation history
 * @returns {Promise<{reply: string}>}
 */
export async function sendChatMessage(message, context, history = []) {
  const response = await apiFetch('/chat', {
    method: 'POST',
    body: { message, context, history },
    auth: true, // Secure route requiring authorization token
  })

  // Both backends wrap the response payload in a standardized 'data' block
  if (response && response.data) {
    return response.data
  }
  
  throw new Error('Invalid chat response format.')
}

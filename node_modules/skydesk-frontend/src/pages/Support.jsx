import { useState } from 'react'
import { Headphones, Phone, Mail, MessageSquare, ChevronDown, ChevronUp, Send, CheckCircle2 } from 'lucide-react'

export default function Support() {
  const [expandedFAQ, setExpandedFAQ] = useState(0)
  const [ticketCreated, setTicketCreated] = useState(false)
  const [formData, setFormData] = useState({
    subject: '',
    category: 'Booking Issue',
    message: ''
  })

  const faqs = [
    {
      q: 'How do I cancel or reschedule my flight?',
      a: 'Go to the "Flight Bookings" page. Find the confirmed booking and click "Cancel Flight". To reschedule, please raise a support ticket below or contact our travel support team.'
    },
    {
      q: 'What is the flight booking and expense policy?',
      a: 'Your flight options are filtered based on your preferred travel class and budget settings. Expense submissions flagged above the standard daily limit may require additional review before approval.'
    },
    {
      q: 'How long does refund settlement take?',
      a: 'Cancelled flight bookings trigger an automated wallet credit within 24 hours. Refunds to bank accounts may take 3–5 business days depending on your payment provider.'
    },
    {
      q: 'How can I submit expense receipts?',
      a: 'Go to the "Expense Report" page and click "Add Expense" to log a new receipt. You can view all expense logs under "My Trips" for a consolidated breakdown.'
    }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    setTicketCreated(true)
    setFormData({ subject: '', category: 'Booking Issue', message: '' })
    setTimeout(() => {
      setTicketCreated(false)
    }, 4000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">Help Desk</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mt-1">Customer Support</h1>
        <p className="text-[#64748B] text-sm mt-1">Get immediate answers or open a support ticket with our travel agents.</p>
      </div>

      {/* Grid: Contact Strip + FAQ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact info side cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 pb-3 border-b border-slate-100">
              <Headphones size={16} className="text-[#2563EB]" /> Contact Info
            </h3>

            <div className="space-y-3.5 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Phone size={14} className="text-[#2563EB] shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">24/7 Helpline</span>
                  <span>+91 1800 200 4567</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Mail size={14} className="text-[#2563EB] shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Support Email</span>
                  <span>support@skydesk.in</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <MessageSquare size={16} className="text-[#2563EB]" /> Frequently Asked Questions
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFAQ === idx
              return (
                <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFAQ(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left p-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-800">{faq.q}</span>
                    {isOpen ? <ChevronUp size={14} className="text-slate-400 shrink-0" /> : <ChevronDown size={14} className="text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-500 font-medium leading-relaxed border-t border-slate-50 bg-slate-50/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Ticket Creation Form */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-800 text-sm">Create Support Ticket</h3>
          <p className="text-[11px] text-[#64748B]">Describe your query and an agent will respond within 30 minutes.</p>
        </div>

        {ticketCreated && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2.5 text-xs text-green-700 font-semibold shadow-sm">
            <CheckCircle2 size={16} className="text-green-600" />
            Support ticket created! Your reference: REF-{String(Date.now()).slice(-6)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3.5">
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Issue Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Refund issue for DEL-BOM flight"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all font-semibold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all font-semibold cursor-pointer"
              >
                <option value="Booking Issue">Flight Booking Issue</option>
                <option value="Expense Claim">Expense Claim / Receipt Reimbursement</option>
                <option value="Advances / Settlement">Cash Advance Adjustments</option>
                <option value="Other">General Travel Policy Query</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Query Description</label>
              <textarea
                required
                rows={4}
                placeholder="Provide booking IDs, transaction references, or receipt numbers..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all font-semibold resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs shadow-sm hover:shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5"
            >
              <Send size={13} />
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

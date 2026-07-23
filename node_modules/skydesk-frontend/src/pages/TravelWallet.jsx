import { useState } from 'react'
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, PlusCircle, CheckCircle2, Clock, Calendar } from 'lucide-react'
import { useAdvances } from '../hooks/useAdvances.jsx'
import { formatCurrency, formatDate } from '../utils/formatters'

export default function TravelWallet() {
  const { advances, addAdvance } = useAdvances()
  const [balance, setBalance] = useState(18450)
  const [activeTab, setActiveTab] = useState('transactions')
  const [showAddCard, setShowAddCard] = useState(false)
  const [showReqAdvance, setShowReqAdvance] = useState(false)
  
  // State for request cash advance form
  const [purpose, setPurpose] = useState('')
  const [amount, setAmount] = useState('')

  const [cards, setCards] = useState([
    { id: 'c1', type: 'Visa', last4: '4329', expiry: '12/28', holder: 'ARJUN MEHTA', primary: true },
    { id: 'c2', type: 'Mastercard', last4: '8871', expiry: '06/29', holder: 'ARJUN MEHTA', primary: false }
  ])

  const [transactions, setTransactions] = useState([
    { id: 'TX-10492', title: 'Refund for Booking SG-450', type: 'credit', amount: 3200, date: '2026-07-05', status: 'Completed' },
    { id: 'TX-10398', title: 'Delhi Trip Cab Reimbursement', type: 'credit', amount: 620, date: '2026-07-02', status: 'Completed' },
    { id: 'TX-10291', title: 'Booking FL-2291 Payment', type: 'debit', amount: 4820, date: '2026-06-25', status: 'Completed' },
    { id: 'TX-10112', title: 'Wallet Top Up', type: 'credit', amount: 5000, date: '2026-06-20', status: 'Completed' }
  ])

  const handleAddCard = (e) => {
    e.preventDefault()
    const last4 = String(Math.floor(1000 + Math.random() * 9000))
    setCards([...cards, {
      id: `c${cards.length + 1}`,
      type: 'Visa',
      last4,
      expiry: '10/30',
      holder: 'ARJUN MEHTA',
      primary: false
    }])
    setShowAddCard(false)
  }

  const handleReqAdvance = (e) => {
    e.preventDefault()
    if (!purpose || !amount) return
    addAdvance({
      purpose,
      amount: Number(amount),
      requestedOn: new Date().toISOString().split('T')[0]
    })
    setPurpose('')
    setAmount('')
    setShowReqAdvance(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">Payments</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mt-1">Travel Wallet</h1>
          <p className="text-[#64748B] text-sm mt-1">Manage corporate cash advances, personal cards, and wallet balance.</p>
        </div>
      </div>

      {/* Grid: Balance Card + Credit Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-[#2563EB] to-blue-700 rounded-2xl p-6 text-white flex flex-col justify-between shadow-sm min-h-[180px]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-blue-100 font-semibold uppercase tracking-wider">Wallet Balance</p>
              <h2 className="text-3xl font-black mt-1.5">{formatCurrency(balance)}</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Wallet size={20} className="text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setShowReqAdvance(true)}
              className="bg-white hover:bg-slate-50 text-[#2563EB] text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              <PlusCircle size={14} />
              Request Advance
            </button>
          </div>
        </div>

        {/* Saved Cards List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <CreditCard size={16} className="text-slate-400" /> Saved Payment Cards
            </span>
            <button
              onClick={() => setShowAddCard(true)}
              className="text-xs text-[#2563EB] font-bold hover:underline"
            >
              + Add New Card
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-slate-50 border border-[#E2E8F0] p-4 rounded-xl flex items-center justify-between relative"
              >
                <div>
                  <p className="text-xs font-extrabold text-slate-700">{card.type} **** {card.last4}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">Exp: {card.expiry} · {card.holder}</p>
                  {card.primary && (
                    <span className="text-[8px] font-bold bg-[#DBEAFE] text-[#2563EB] px-2 py-0.5 rounded-full mt-2 inline-block">
                      PRIMARY CARD
                    </span>
                  )}
                </div>
                <div className="text-slate-300">
                  <CreditCard size={24} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-[#E2E8F0]">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-5 py-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'transactions'
                ? 'text-[#2563EB] border-[#2563EB]'
                : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
          >
            Transaction History
          </button>
          <button
            onClick={() => setActiveTab('advances')}
            className={`px-5 py-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'advances'
                ? 'text-[#2563EB] border-[#2563EB]'
                : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
          >
            Corporate Advances ({advances.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          {activeTab === 'transactions' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-slate-400 font-bold uppercase tracking-wider bg-slate-50">
                    <th className="p-3">Transaction ID</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-semibold text-slate-800">{tx.id}</td>
                      <td className="p-3 font-semibold text-slate-700">{tx.title}</td>
                      <td className="p-3 text-slate-500">{formatDate(tx.date)}</td>
                      <td className="p-3 font-extrabold text-sm">
                        <span className={tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-800'}>
                          {tx.type === 'credit' ? '+' : '-'} {formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'advances' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-slate-400 font-bold uppercase tracking-wider bg-slate-50">
                    <th className="p-3">Advance ID</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Requested On</th>
                    <th className="p-3">Requested Amount</th>
                    <th className="p-3">Adjusted / Settled</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {advances.map((adv) => (
                    <tr key={adv.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-semibold text-slate-800">{adv.id}</td>
                      <td className="p-3 font-semibold text-slate-700">{adv.purpose}</td>
                      <td className="p-3 text-slate-500">{formatDate(adv.requestedOn)}</td>
                      <td className="p-3 font-extrabold text-slate-900">{formatCurrency(adv.amount)}</td>
                      <td className="p-3 text-slate-500 font-medium">{formatCurrency(adv.adjusted || 0)}</td>
                      <td className="p-3 text-right">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold inline-flex items-center gap-1 ${
                          adv.status === 'Settled'
                            ? 'bg-green-50 text-green-700'
                            : adv.status === 'Approved'
                            ? 'bg-blue-50 text-[#2563EB]'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {adv.status === 'Pending' ? <Clock size={11} /> : <CheckCircle2 size={11} />}
                          {adv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Req Cash Advance Modal */}
      {showReqAdvance && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg">Request Cash Advance</h3>
            <form onSubmit={handleReqAdvance} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase">Purpose / Trip Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai Client Visit"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase">Amount Needed (INR)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 8000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all font-semibold"
                />
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm hover:shadow-md transition-all active:scale-98"
                >
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowReqAdvance(false)}
                  className="flex-1 border border-[#E2E8F0] text-slate-600 font-bold py-2.5 rounded-xl text-xs hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg">Add Payment Card</h3>
            <form onSubmit={handleAddCard} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase">Card Number</label>
                <input
                  type="text"
                  required
                  placeholder="xxxx xxxx xxxx xxxx"
                  className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase">Expiry</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase">CVV</label>
                  <input
                    type="password"
                    required
                    placeholder="***"
                    className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all font-semibold"
                  />
                </div>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm hover:shadow-md transition-all active:scale-98"
                >
                  Save Card
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCard(false)}
                  className="flex-1 border border-[#E2E8F0] text-slate-600 font-bold py-2.5 rounded-xl text-xs hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

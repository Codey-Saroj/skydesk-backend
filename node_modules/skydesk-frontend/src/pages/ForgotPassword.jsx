import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import AuthLayout from '../components/AuthLayout.jsx'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!email) {
      setError('Email address is required.')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    setSent(true)
  }

  return (
    <AuthLayout
      title="Secure Your Account"
      subtitle="We will send you a secure link to reset your account credentials"
    >
      {sent ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto text-green-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Check your inbox</h3>
            <p className="text-sm text-slate-500 mt-1">
              We have sent a password reset link to <span className="font-semibold text-slate-700">{email}</span>.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/signin"
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-semibold hover:underline"
            >
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-150 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col">
            <label htmlFor="email" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 mt-2 cursor-pointer"
          >
            Send Reset Link
          </button>

          <div className="flex justify-center mt-5">
            <Link
              to="/signin"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 font-semibold transition-colors duration-150"
            >
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  )
}

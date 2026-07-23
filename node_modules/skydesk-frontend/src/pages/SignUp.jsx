import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function SignUp() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { signup } = useAuth()

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  function validate() {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Full name is required'
    if (!form.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Enter a valid email address'
    }
    if (!form.phone.trim()) {
      errs.phone = 'Phone number is required'
    } else if (form.phone.replace(/\D/g, '').length < 8) {
      errs.phone = 'Enter a valid phone number'
    }
    if (!form.password) {
      errs.password = 'Password is required'
    } else if (form.password.length < 8) {
      errs.password = 'Password must be at least 8 characters'
    }
    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match'
    }
    if (!form.terms) {
      errs.terms = 'You must accept the terms of service'
    }
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setSubmitting(true)
    try {
      await signup({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      })
      // Deliberately not auto-logged-in — send them to Sign In to authenticate fresh.
      navigate('/signin', {
        replace: true,
        state: { justRegistered: true, prefillEmail: form.email.trim() },
      })
    } catch (err) {
      // Server can return field-specific errors (e.g. "email already in use")
      if (err.fields) {
        setErrors(err.fields)
      } else {
        setErrors({ form: err.message || 'Something went wrong. Please try again.' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Start Your Journey"
      subtitle="Create your account to book flights and manage your trips."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {errors.form && (
          <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-150 rounded-lg">
            {errors.form}
          </div>
        )}

        {/* Full Name */}
        <div className="flex flex-col">
          <label htmlFor="fullName" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Arjun Mehta"
              value={form.fullName}
              onChange={handleChange}
              required
              className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.fullName ? 'border-red-400 focus:ring-red-400' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
        </div>

        {/* Email Address */}
        <div className="flex flex-col">
          <label htmlFor="email" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@company.com"
              value={form.email}
              onChange={handleChange}
              required
              className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.email ? 'border-red-400 focus:ring-red-400' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Phone Number */}
        <div className="flex flex-col">
          <label htmlFor="phone" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Phone Number
          </label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={handleChange}
              required
              className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.phone ? 'border-red-400 focus:ring-red-400' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label htmlFor="password" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 8 characters"
              value={form.password}
              onChange={handleChange}
              required
              className={`w-full pl-9 pr-10 py-2.5 bg-white border rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.password ? 'border-red-400 focus:ring-red-400' : 'border-slate-200'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col">
          <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className={`w-full pl-9 pr-10 py-2.5 bg-white border rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.confirmPassword ? 'border-red-400 focus:ring-red-400' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
        </div>

        {/* Terms of Service */}
        <div className="flex flex-col">
          <label className="flex items-start gap-2 cursor-pointer select-none text-sm text-slate-600">
            <input
              name="terms"
              type="checkbox"
              checked={form.terms}
              onChange={handleChange}
              className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
            />
            <span>
              I accept the{' '}
              <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 font-semibold hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 font-semibold hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.terms && <p className="text-xs text-red-500 mt-1">{errors.terms}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 mt-2 cursor-pointer flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/signin" className="text-blue-600 font-semibold hover:underline">
          Sign in instead
        </Link>
      </p>
    </AuthLayout>
  )
}

import { Plane } from 'lucide-react'

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left panel – Travel branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative bg-slate-900 text-white p-16 flex-col justify-between overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80"
          alt="Travel the world with SkyDesk"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-slate-900/80 pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-9 h-9 bg-[#2563EB] rounded-xl flex items-center justify-center">
            <Plane size={18} className="text-white fill-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">SkyDesk</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-5 max-w-xl">
          <h1 className="text-4xl font-extrabold leading-tight text-white tracking-tight">
            Your Personal Travel<br />
            <span className="text-orange-400">Companion.</span>
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Book flights, manage trips, track your bookings and explore amazing destinations — all in one place.
          </p>

          {/* Trust indicators */}
          <div className="flex items-center gap-10 pt-6 border-t border-white/20">
            <div>
              <p className="text-2xl font-bold text-white">2M+</p>
              <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider">Happy Travelers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">500+</p>
              <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider">Destinations</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">Best</p>
              <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider">Price Guarantee</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} SkyDesk. Your journey, our passion.
        </div>
      </div>

      {/* Right panel – Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="mx-auto w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6 lg:hidden justify-center">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <Plane size={15} className="text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Sky<span className="text-[#2563EB]">Desk</span>
            </span>
          </div>

          <div className="text-center lg:text-left mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}

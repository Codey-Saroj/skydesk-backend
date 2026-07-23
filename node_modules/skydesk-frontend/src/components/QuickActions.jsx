import { Download, Activity, MousePointerClick, Edit3, PhoneCall } from 'lucide-react'

const actions = [
  {
    id: 'download',
    label: 'Download Ticket',
    icon: Download,
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    hoverBg: 'hover:bg-blue-100',
  },
  {
    id: 'flight-status',
    label: 'Flight Status',
    icon: Activity,
    bg: 'bg-green-50',
    iconColor: 'text-green-600',
    hoverBg: 'hover:bg-green-100',
  },
  {
    id: 'web-checkin',
    label: 'Web Check-In',
    icon: MousePointerClick,
    bg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    hoverBg: 'hover:bg-orange-100',
  },
  {
    id: 'manage',
    label: 'Manage Booking',
    icon: Edit3,
    bg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    hoverBg: 'hover:bg-purple-100',
  },
  {
    id: 'support',
    label: 'Customer Support',
    icon: PhoneCall,
    bg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    hoverBg: 'hover:bg-rose-100',
  },
]

export default function QuickActions() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <h3 className="font-bold text-slate-800 text-base mb-4">Quick Actions</h3>
      <div className="grid grid-cols-5 gap-3">
        {actions.map(({ id, label, icon: Icon, bg, iconColor, hoverBg }) => (
          <button
            key={id}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl ${bg} ${hoverBg} transition-colors group`}
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Icon size={18} className={iconColor} />
            </div>
            <span className="text-xs font-semibold text-slate-600 text-center leading-tight">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

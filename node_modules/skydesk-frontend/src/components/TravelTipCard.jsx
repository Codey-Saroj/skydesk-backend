import { CloudSun, ScrollText, Building2, AlertTriangle } from 'lucide-react'

const iconMap = {
  FileText: ScrollText,
  CloudRain: CloudSun,
  Luggage: Building2,
  MapPin: AlertTriangle,
}

const colorConfig = {
  blue:   { bg: 'bg-[#DBEAFE]', icon: 'text-[#2563EB]', tag: 'bg-[#2563EB] text-white', border: 'border-[#DBEAFE]', iconBg: 'bg-white' },
  cyan:   { bg: 'bg-sky-50',   icon: 'text-sky-600',     tag: 'bg-sky-500 text-white',   border: 'border-sky-100',   iconBg: 'bg-white' },
  purple: { bg: 'bg-purple-50',icon: 'text-purple-600',  tag: 'bg-purple-500 text-white',border: 'border-purple-100',iconBg: 'bg-white' },
  orange: { bg: 'bg-orange-50',icon: 'text-[#F97316]',   tag: 'bg-[#F97316] text-white', border: 'border-orange-100',iconBg: 'bg-white' },
}

// More meaningful icon-to-type mapping
const tipIconMap = {
  FileText: { Icon: ScrollText, label: 'Visa Information' },
  CloudRain: { Icon: CloudSun, label: 'Weather' },
  Luggage: { Icon: Building2, label: 'Airport Updates' },
  MapPin: { Icon: AlertTriangle, label: 'Travel Advisory' },
}

export default function TravelTipCard({ tip }) {
  const mapping = tipIconMap[tip.icon] || tipIconMap.FileText
  const Icon = mapping.Icon
  const colors = colorConfig[tip.color] || colorConfig.blue

  return (
    <div className={`bg-white border border-[#E2E8F0] rounded-xl p-4 hover:shadow-sm transition-all cursor-pointer group`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
          <Icon size={18} className={colors.icon} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-[#0F172A] text-sm">{tip.title}</h4>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${colors.tag} shrink-0`}>{tip.tag}</span>
          </div>
          <p className="text-xs text-[#64748B] leading-relaxed">{tip.description}</p>
        </div>
      </div>
    </div>
  )
}

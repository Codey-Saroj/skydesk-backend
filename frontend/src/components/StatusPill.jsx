const styles = {
  Approved: 'bg-green-50 text-green-700 border border-green-200',
  Confirmed: 'bg-green-50 text-green-700 border border-green-200',
  Completed: 'bg-slate-100 text-slate-600 border border-slate-200',
  Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  Rejected: 'bg-red-50 text-red-700 border border-red-200',
  Cancelled: 'bg-red-50 text-red-700 border border-red-200',
  Upcoming: 'bg-blue-50 text-[#2563EB] border border-blue-200',
  Settled: 'bg-slate-100 text-slate-600 border border-slate-200'
}

export default function StatusPill({ status }) {
  const cls = styles[status] ?? 'bg-slate-100 text-slate-600 border border-slate-200'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {status}
    </span>
  )
}

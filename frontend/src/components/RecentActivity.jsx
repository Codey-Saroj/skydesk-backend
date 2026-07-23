export default function RecentActivity({ activities }) {
  const statusColors = {
    Confirmed: 'bg-green-50 text-green-700 border-green-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Cancelled: 'bg-red-50 text-red-700 border-red-200'
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Booking Activity</h3>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Real-time status log of booking registrations</p>
        </div>
        <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Live Feed
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-3">Booking ID</th>
              <th className="px-6 py-3">Passenger</th>
              <th className="px-6 py-3">Flight</th>
              <th className="px-6 py-3">Destination</th>
              <th className="px-6 py-3">Date & Time</th>
              <th className="px-6 py-3 text-right">Fare</th>
              <th className="px-6 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {activities.map((act) => (
              <tr key={act.id} className="hover:bg-slate-55 transition-colors">
                <td className="px-6 py-3.5 font-bold text-blue-600">{act.id}</td>
                <td className="px-6 py-3.5">
                  <div>
                    <p className="text-slate-950 font-bold leading-none">{act.passenger}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{act.email}</p>
                  </div>
                </td>
                <td className="px-6 py-3.5 font-semibold text-slate-800">{act.flight}</td>
                <td className="px-6 py-3.5">{act.destination}</td>
                <td className="px-6 py-3.5 text-xs text-slate-400 font-semibold">{act.date}</td>
                <td className="px-6 py-3.5 text-right font-bold text-slate-900">{act.amount}</td>
                <td className="px-6 py-3.5 text-center">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                      statusColors[act.status] || 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {act.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

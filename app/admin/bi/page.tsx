import Link from 'next/link'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
export const dynamic = 'force-dynamic'

function formatGBP(amount: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount || 0)
}

export default async function AdminBIPage() {
  const today = new Date()
  const startOfToday = new Date(today)
  startOfToday.setHours(0, 0, 0, 0)

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  const [
    parentsRes,
    tutorsRes,
    bookingsRes,
    paidBookingsRes,
    todayBookingsRes,
    monthlyBookingsRes,
    subjectsRes,
    studentsRes,
    recentBookingsRes,
  ] = await Promise.all([
    supabaseAdmin.from('parent_profiles').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('tutor_profiles').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('lesson_bookings').select('id', { count: 'exact', head: true }),
    supabaseAdmin
      .from('lesson_bookings')
      .select('amount_gbp')
      .eq('payment_status', 'PAID'),
    supabaseAdmin
      .from('lesson_bookings')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', startOfToday.toISOString()),
    supabaseAdmin
      .from('lesson_bookings')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString()),
    supabaseAdmin.from('subjects').select('id, name'),
    supabaseAdmin.from('students').select('id', { count: 'exact', head: true }),
    supabaseAdmin
      .from('lesson_bookings')
      .select(`
        id,
        created_at,
        lesson_date,
        lesson_time,
        status,
        payment_status,
        amount_gbp,
        subjects (
          name
        ),
        students (
          full_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  const totalRevenue =
    paidBookingsRes.data?.reduce((sum, item) => {
      return sum + Number(item.amount_gbp || 0)
    }, 0) || 0

  const paidBookings = paidBookingsRes.data || []

  const subjectRevenue: Record<string, { count: number; revenue: number }> = {}

  recentBookingsRes.data?.forEach((booking: any) => {
    const subjectName = booking.subjects?.name || 'Unknown'
    if (!subjectRevenue[subjectName]) {
      subjectRevenue[subjectName] = { count: 0, revenue: 0 }
    }

    subjectRevenue[subjectName].count += 1
    subjectRevenue[subjectName].revenue += Number(booking.amount_gbp || 0)
  })

  const topSubjects = Object.entries(subjectRevenue)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)

  const cards = [
    {
      label: 'Parents',
      value: parentsRes.count || 0,
      note: 'Registered parent accounts',
    },
    {
      label: 'Students',
      value: studentsRes.count || 0,
      note: 'Children added by parents',
    },
    {
      label: 'Tutors',
      value: tutorsRes.count || 0,
      note: 'Tutor profiles created',
    },
    {
      label: 'Total Bookings',
      value: bookingsRes.count || 0,
      note: 'All lesson bookings',
    },
    {
      label: 'Today Bookings',
      value: todayBookingsRes.count || 0,
      note: 'Bookings created today',
    },
    {
      label: 'This Month',
      value: monthlyBookingsRes.count || 0,
      note: 'Bookings created this month',
    },
    {
      label: 'Paid Bookings',
      value: paidBookings.length,
      note: 'Bookings with paid status',
    },
    {
      label: 'Revenue',
      value: formatGBP(totalRevenue),
      note: 'Total confirmed paid revenue',
    },
  ]

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">
              Fountain Prep Intelligence
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Business Intelligence Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Monitor parents, tutors, bookings, revenue, subjects and platform activity from one premium admin view.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/15"
          >
            Back to Admin
          </Link>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl"
            >
              <p className="text-sm font-semibold text-slate-300">{card.label}</p>
              <p className="mt-3 text-3xl font-black">{card.value}</p>
              <p className="mt-2 text-xs text-slate-400">{card.note}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Recent Bookings</h2>
                <p className="text-sm text-slate-400">Latest platform booking activity.</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/10 text-xs uppercase tracking-wider text-slate-300">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Lesson</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Amount</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {recentBookingsRes.data?.length ? (
                    recentBookingsRes.data.map((booking: any) => (
                      <tr key={booking.id} className="text-slate-200">
                        <td className="px-4 py-3">
                          {booking.students?.full_name || 'Student'}
                        </td>
                        <td className="px-4 py-3">
                          {booking.subjects?.name || 'Subject'}
                        </td>
                        <td className="px-4 py-3">
                          {booking.lesson_date || 'Not set'}{' '}
                          {booking.lesson_time || ''}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
                            {booking.payment_status || 'UNPAID'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {formatGBP(Number(booking.amount_gbp || 0))}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-6 text-slate-400" colSpan={5}>
                        No bookings yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-xl font-black">Top Subjects</h2>
            <p className="mt-1 text-sm text-slate-400">
              Based on recent booking activity.
            </p>

            <div className="mt-5 space-y-3">
              {topSubjects.length ? (
                topSubjects.map(([name, data]) => (
                  <div
                    key={name}
                    className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold">{name}</p>
                      <p className="text-sm text-violet-200">{data.count} bookings</p>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      {formatGBP(data.revenue)} revenue
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-400">
                  No subject activity yet.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-violet-400/20 bg-violet-500/10 p-6">
            <h3 className="text-lg font-black">Visitor Analytics</h3>
            <p className="mt-2 text-sm text-violet-100">
              Vercel Analytics is already tracking visitors, countries, devices and pages externally.
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-6">
            <h3 className="text-lg font-black">Conversion Tracking</h3>
            <p className="mt-2 text-sm text-emerald-100">
              Next stage: track clicks like View Pricing, Start Booking, Payment Started and Payment Success.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-6">
            <h3 className="text-lg font-black">Growth Dashboard</h3>
            <p className="mt-2 text-sm text-amber-100">
              Once GA4 and Clarity are connected, this can become your complete Fountain Prep mission control.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
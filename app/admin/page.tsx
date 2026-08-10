'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

type Booking = {
  id: string
  parent_id: string | null
  student_id: string
  tutor_id: string | null
  subject_id: string
  plan_id: string
  lesson_date: string | null
  lesson_time: string | null
  timezone: string | null
  status: string
  payment_status: string
  amount_gbp: number | null
  meeting_link: string | null
  notes: string | null
  created_at: string | null
}

type Student = {
  id: string
  full_name: string
}

type Subject = {
  id: string
  name: string
}

type Tutor = {
  id: string
  full_name: string
  approval_status: string
  verification_status: string
  is_listed: boolean
}

type Payment = {
  id: string
  booking_id: string
  payment_status: string
  amount: number | null
  currency: string | null
  created_at: string | null
}

type TutorEarning = {
  id: string
  tutor_id: string
  booking_id: string
  tutor_amount: number | string | null
  status: string
  created_at: string | null
  paid_at: string | null
  lesson_date: string | null
}

type ProgressNote = {
  lesson_booking_id: string
}

const adminActions = [
  {
    title: 'Lessons Control',
    text: 'See every scheduled class, assigned tutor, meeting link, payment, report and payout status.',
    href: '/admin/bookings',
    tag: 'Operations',
  },
  {
    title: 'Learners',
    text: 'Review students, parent relationships, learning levels, bookings and activity.',
    href: '/admin/students',
    tag: 'Learners',
  },
  {
    title: 'Tutors',
    text: 'Manage tutor approval, verification, listing status and teaching operations.',
    href: '/admin/tutors',
    tag: 'Tutors',
  },
  {
    title: 'Tutor Payouts',
    text: 'Review completed tutor earnings, amounts due and payout status.',
    href: '/admin/tutor-payouts',
    tag: 'Finance',
  },
  {
    title: 'Payments',
    text: 'Monitor parent payments, successful transactions and payment failures.',
    href: '/admin/payments',
    tag: 'Revenue',
  },
  {
    title: 'Reports',
    text: 'Review lesson reports, learning progress and platform performance.',
    href: '/admin/reports',
    tag: 'Quality',
  },
  {
    title: 'Messages & Support',
    text: 'Handle parent enquiries, tutor issues, complaints and safeguarding activity.',
    href: '/admin/messages',
    tag: 'Support',
  },
  {
    title: 'Tutor Capacity',
    text: 'Monitor tutor subjects, availability and future lesson capacity.',
    href: '/admin/tutor-capacity',
    tag: 'Capacity',
  },
  {
    title: 'Communications',
    text: 'Manage orientations, webinars, tutor communications and announcements.',
    href: '/admin/communications',
    tag: 'Comms',
  },
  {
    title: 'Curriculum',
    text: 'Manage subjects, stages, modules and lessons.',
    href: '/admin/curriculum',
    tag: 'Learning',
  },
  {
    title: 'Business Intelligence',
    text: 'Review growth, bookings, revenue, demand and platform performance.',
    href: '/admin/bi',
    tag: 'Analytics',
  },
]

export default function AdminDashboardPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('Loading admin control centre...')

  const [bookings, setBookings] = useState<Booking[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [tutorEarnings, setTutorEarnings] = useState<TutorEarning[]>([])

  const [studentMap, setStudentMap] =
    useState<Record<string, Student>>({})

  const [subjectMap, setSubjectMap] =
    useState<Record<string, Subject>>({})

  const [tutorMap, setTutorMap] =
    useState<Record<string, Tutor>>({})

  const [progressNotes, setProgressNotes] =
    useState<Record<string, boolean>>({})

  const [parentCount, setParentCount] = useState(0)
  const [studentCount, setStudentCount] = useState(0)

  const [openMessages, setOpenMessages] = useState(0)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [highPriorityMessages, setHighPriorityMessages] = useState(0)
  const [safeguardingMessages, setSafeguardingMessages] = useState(0)

  useEffect(() => {
    async function loadAdminDashboard() {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (!userProfile || userProfile.role !== 'ADMIN') {
        router.push('/account')
        return
      }

      const { data: bookingRows, error: bookingError } =
        await supabase
          .from('lesson_bookings')
          .select(`
            id,
            parent_id,
            student_id,
            tutor_id,
            subject_id,
            plan_id,
            lesson_date,
            lesson_time,
            timezone,
            status,
            payment_status,
            amount_gbp,
            meeting_link,
            notes,
            created_at
          `)
          .order('lesson_date', { ascending: true })
          .order('lesson_time', { ascending: true })

      if (bookingError) {
        setMessage(bookingError.message)
        setLoading(false)
        return
      }

      const cleanBookings =
        (bookingRows ?? []) as Booking[]

      const studentIds =
        Array.from(
          new Set(
            cleanBookings
              .map((booking) => booking.student_id)
              .filter(Boolean),
          ),
        )

      const subjectIds =
        Array.from(
          new Set(
            cleanBookings
              .map((booking) => booking.subject_id)
              .filter(Boolean),
          ),
        )

      const bookingTutorIds =
        Array.from(
          new Set(
            cleanBookings
              .map((booking) => booking.tutor_id)
              .filter(Boolean),
          ),
        ) as string[]

      const bookingIds =
        cleanBookings.map(
          (booking) => booking.id,
        )

      if (studentIds.length > 0) {
        const { data } = await supabase
          .from('student_profiles')
          .select('id, full_name')
          .in('id', studentIds)

        setStudentMap(
          Object.fromEntries(
            ((data ?? []) as Student[]).map(
              (student) => [
                student.id,
                student,
              ],
            ),
          ),
        )
      }

      if (subjectIds.length > 0) {
        const { data } = await supabase
          .from('subjects')
          .select('id, name')
          .in('id', subjectIds)

        setSubjectMap(
          Object.fromEntries(
            ((data ?? []) as Subject[]).map(
              (subject) => [
                subject.id,
                subject,
              ],
            ),
          ),
        )
      }

      const { data: tutorRows } =
        await supabase
          .from('tutor_profiles')
          .select(`
            id,
            full_name,
            approval_status,
            verification_status,
            is_listed
          `)
          .order('created_at', {
            ascending: false,
          })

      const cleanTutors =
        (tutorRows ?? []) as Tutor[]

      setTutors(cleanTutors)

      setTutorMap(
        Object.fromEntries(
          cleanTutors.map(
            (tutor) => [
              tutor.id,
              tutor,
            ],
          ),
        ),
      )

      if (
        bookingTutorIds.length > 0 &&
        cleanTutors.length === 0
      ) {
        const { data } = await supabase
          .from('tutor_profiles')
          .select(`
            id,
            full_name,
            approval_status,
            verification_status,
            is_listed
          `)
          .in('id', bookingTutorIds)

        const fallbackTutors =
          (data ?? []) as Tutor[]

        setTutorMap(
          Object.fromEntries(
            fallbackTutors.map(
              (tutor) => [
                tutor.id,
                tutor,
              ],
            ),
          ),
        )
      }

      if (bookingIds.length > 0) {
        const { data: noteRows } =
          await supabase
            .from('lesson_progress_notes')
            .select('lesson_booking_id')
            .in(
              'lesson_booking_id',
              bookingIds,
            )

        const noteMap:
          Record<string, boolean> = {}

        ;(
          (noteRows ?? []) as ProgressNote[]
        ).forEach((note) => {
          noteMap[
            note.lesson_booking_id
          ] = true
        })

        setProgressNotes(noteMap)
      }

      const { data: paymentRows } =
        await supabase
          .from('payments')
          .select(`
            id,
            booking_id,
            payment_status,
            amount,
            currency,
            created_at
          `)
          .order('created_at', {
            ascending: false,
          })
          .limit(40)

      const { data: tutorEarningRows } =
        await supabase
          .from('tutor_earnings')
          .select(`
            id,
            tutor_id,
            booking_id,
            tutor_amount,
            status,
            created_at,
            paid_at,
            lesson_date
          `)
          .order('created_at', {
            ascending: false,
          })

      const { count: parentsTotal } =
        await supabase
          .from('parent_profiles')
          .select('*', {
            count: 'exact',
            head: true,
          })

      const { count: studentsTotal } =
        await supabase
          .from('student_profiles')
          .select('*', {
            count: 'exact',
            head: true,
          })

      const { count: openMessagesTotal } =
        await supabase
          .from('support_threads')
          .select('*', {
            count: 'exact',
            head: true,
          })
          .eq('status', 'open')

      const { count: unreadMessagesTotal } =
        await supabase
          .from('support_threads')
          .select('*', {
            count: 'exact',
            head: true,
          })
          .eq('admin_read', false)

      const {
        count: highPriorityMessagesTotal,
      } = await supabase
        .from('support_threads')
        .select('*', {
          count: 'exact',
          head: true,
        })
        .in(
          'priority',
          ['high', 'urgent'],
        )
        .in(
          'status',
          ['open', 'pending'],
        )

      const {
        count: safeguardingMessagesTotal,
      } = await supabase
        .from('support_threads')
        .select('*', {
          count: 'exact',
          head: true,
        })
        .eq(
          'category',
          'safeguarding',
        )
        .in(
          'status',
          ['open', 'pending'],
        )

      setBookings(cleanBookings)

      setPayments(
        (paymentRows ?? []) as Payment[],
      )

      setTutorEarnings(
        (tutorEarningRows ??
          []) as TutorEarning[],
      )

      setParentCount(
        parentsTotal ?? 0,
      )

      setStudentCount(
        studentsTotal ?? 0,
      )

      setOpenMessages(
        openMessagesTotal ?? 0,
      )

      setUnreadMessages(
        unreadMessagesTotal ?? 0,
      )

      setHighPriorityMessages(
        highPriorityMessagesTotal ?? 0,
      )

      setSafeguardingMessages(
        safeguardingMessagesTotal ?? 0,
      )

      setMessage('')
      setLoading(false)
    }

    loadAdminDashboard()
  }, [router])

  const today =
    new Date()
      .toISOString()
      .slice(0, 10)

  const sevenDaysFromNow =
    useMemo(() => {
      const date =
        new Date()

      date.setDate(
        date.getDate() + 7,
      )

      return date
        .toISOString()
        .slice(0, 10)
    }, [])

  const confirmedBookings =
    useMemo(
      () =>
        bookings.filter(
          (booking) =>
            booking.payment_status ===
              'PAID' ||
            booking.status ===
              'CONFIRMED' ||
            booking.status ===
              'COMPLETED',
        ),
      [bookings],
    )

  const todaysLessons =
    useMemo(
      () =>
        confirmedBookings.filter(
          (booking) =>
            booking.lesson_date ===
            today,
        ),
      [
        confirmedBookings,
        today,
      ],
    )

  const upcomingLessons =
    useMemo(
      () =>
        confirmedBookings.filter(
          (booking) =>
            booking.lesson_date &&
            booking.lesson_date >
              today,
        ),
      [
        confirmedBookings,
        today,
      ],
    )

  const nextSevenDays =
    useMemo(
      () =>
        confirmedBookings.filter(
          (booking) =>
            booking.lesson_date &&
            booking.lesson_date >=
              today &&
            booking.lesson_date <=
              sevenDaysFromNow,
        ),
      [
        confirmedBookings,
        today,
        sevenDaysFromNow,
      ],
    )

  const completedLessons =
    useMemo(
      () =>
        bookings.filter(
          (booking) =>
            booking.status ===
            'COMPLETED',
        ),
      [bookings],
    )

  const pendingParentPayments =
    useMemo(
      () =>
        bookings.filter(
          (booking) =>
            booking.payment_status !==
              'PAID' &&
            booking.status !==
              'CANCELLED',
        ),
      [bookings],
    )

  const missingMeetingLinks =
    useMemo(
      () =>
        confirmedBookings.filter(
          (booking) =>
            booking.status !==
              'COMPLETED' &&
            !booking.meeting_link,
        ),
      [confirmedBookings],
    )

  const missingReports =
    useMemo(
      () =>
        completedLessons.filter(
          (booking) =>
            !progressNotes[
              booking.id
            ],
        ),
      [
        completedLessons,
        progressNotes,
      ],
    )

  const approvedTutors =
    useMemo(
      () =>
        tutors.filter(
          (tutor) =>
            tutor.approval_status ===
              'approved' &&
            tutor.verification_status ===
              'verified' &&
            tutor.is_listed,
        ),
      [tutors],
    )

  const pendingTutors =
    useMemo(
      () =>
        tutors.filter(
          (tutor) =>
            tutor.approval_status !==
              'approved' ||
            !tutor.is_listed,
        ),
      [tutors],
    )

  const pendingTutorPayouts =
    useMemo(
      () =>
        tutorEarnings.filter(
          (earning) =>
            String(
              earning.status || '',
            )
              .trim()
              .toLowerCase() ===
            'pending',
        ),
      [tutorEarnings],
    )

  const pendingTutorPayoutAmount =
    useMemo(
      () =>
        pendingTutorPayouts.reduce(
          (
            total,
            earning,
          ) =>
            total +
            Number(
              earning.tutor_amount ||
                0,
            ),
          0,
        ),
      [pendingTutorPayouts],
    )

  const revenue =
    useMemo(
      () =>
        payments
          .filter(
            (payment) =>
              payment.payment_status
                ?.toLowerCase() ===
              'paid',
          )
          .reduce(
            (
              total,
              payment,
            ) =>
              total +
              Number(
                payment.amount || 0,
              ),
            0,
          ),
      [payments],
    )

  const operationalIssues =
    missingMeetingLinks.length +
    missingReports.length +
    pendingTutorPayouts.length +
    highPriorityMessages +
    safeguardingMessages

  if (loading) {
    return (
      <main className="page">
        <section className="hero">
          <p className="eyebrow">
            FountainPrep Admin
          </p>

          <h1>
            Loading command centre...
          </h1>

          <p className="subtitle">
            {message}
          </p>
        </section>

        <style jsx global>
          {styles}
        </style>
      </main>
    )
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="heroTop">
          <div>
            <p className="eyebrow">
              FountainPrep Admin
            </p>

            <h1>
              Platform command centre
            </h1>
          </div>

          <div
            className={
              operationalIssues > 0
                ? 'systemStatus attention'
                : 'systemStatus healthy'
            }
          >
            <span>
              {operationalIssues >
              0
                ? 'Action required'
                : 'Platform healthy'}
            </span>

            <strong>
              {operationalIssues}
            </strong>
          </div>
        </div>

        <p className="subtitle">
          Monitor every learner,
          lesson, tutor, payment,
          meeting, report and payout
          from one operational
          workspace.
        </p>

        <div className="heroActions">
          <Link
            href="/admin/bookings"
            className="primaryLink"
          >
            Open Lessons Control
          </Link>

          <Link
            href="/admin/students"
            className="secondaryLink"
          >
            Learners
          </Link>

          <Link
            href="/admin/tutors"
            className="secondaryLink"
          >
            Tutors
          </Link>

          <Link
            href="/admin/payments"
            className="secondaryLink"
          >
            Payments
          </Link>

          <Link
            href="/admin/tutor-payouts"
            className="secondaryLink"
          >
            Payouts
          </Link>
        </div>

        <div className="kpiGrid">
          <Kpi
            label="Today's Lessons"
            value={String(
              todaysLessons.length,
            )}
          />

          <Kpi
            label="Next 7 Days"
            value={String(
              nextSevenDays.length,
            )}
          />

          <Kpi
            label="Students"
            value={String(
              studentCount,
            )}
          />

          <Kpi
            label="Listed Tutors"
            value={String(
              approvedTutors.length,
            )}
          />

          <Kpi
            label="Revenue"
            value={`£${revenue.toFixed(
              2,
            )}`}
          />

          <Kpi
            label="Payout Due"
            value={`$${pendingTutorPayoutAmount.toFixed(
              2,
            )}`}
          />

          <Kpi
            label="Missing Reports"
            value={String(
              missingReports.length,
            )}
          />

          <Kpi
            label="Alerts"
            value={String(
              operationalIssues,
            )}
          />
        </div>
      </section>

      <section className="operationsGrid">
        <OperationalCard
          title="Missing Meet Links"
          value={
            missingMeetingLinks.length
          }
          description="Confirmed lessons without a Google Meet link."
          href="/admin/bookings"
          tone={
            missingMeetingLinks.length >
            0
              ? 'danger'
              : 'good'
          }
        />

        <OperationalCard
          title="Missing Lesson Reports"
          value={
            missingReports.length
          }
          description="Completed lessons where a tutor report has not been submitted."
          href="/admin/bookings"
          tone={
            missingReports.length > 0
              ? 'warning'
              : 'good'
          }
        />

        <OperationalCard
          title="Tutor Payouts Due"
          value={
            pendingTutorPayouts.length
          }
          description="Completed tutor earnings still awaiting payout."
          href="/admin/tutor-payouts"
          tone={
            pendingTutorPayouts.length >
            0
              ? 'warning'
              : 'good'
          }
        />

        <OperationalCard
          title="Safeguarding"
          value={
            safeguardingMessages
          }
          description="Open or pending safeguarding messages requiring admin attention."
          href="/admin/messages"
          tone={
            safeguardingMessages > 0
              ? 'danger'
              : 'good'
          }
        />
      </section>

      <section className="cardWide">
        <div className="sectionHeader">
          <div>
            <p className="sectionEyebrow">
              Today's Operations
            </p>

            <h2>
              Lessons happening today
            </h2>

            <p className="sectionCopy">
              See the learner,
              tutor, lesson time and
              meeting access from one
              place.
            </p>
          </div>

          <Link
            href="/admin/bookings"
            className="smallLink"
          >
            View all lessons
          </Link>
        </div>

        {todaysLessons.length ===
        0 ? (
          <Empty
            title="No lessons today"
            text="Confirmed lessons scheduled for today will appear here."
          />
        ) : (
          <div className="lessonGrid">
            {todaysLessons.map(
              (booking) => (
                <LessonCard
                  key={booking.id}
                  booking={booking}
                  student={
                    studentMap[
                      booking.student_id
                    ]
                  }
                  subject={
                    subjectMap[
                      booking.subject_id
                    ]
                  }
                  tutor={
                    booking.tutor_id
                      ? tutorMap[
                          booking
                            .tutor_id
                        ]
                      : undefined
                  }
                  hasReport={
                    Boolean(
                      progressNotes[
                        booking.id
                      ],
                    )
                  }
                />
              ),
            )}
          </div>
        )}
      </section>

      <section className="cardWide">
        <div className="sectionHeader">
          <div>
            <p className="sectionEyebrow">
              Upcoming Classes
            </p>

            <h2>
              Next scheduled lessons
            </h2>

            <p className="sectionCopy">
              A quick operational
              view of confirmed
              lessons already in the
              system.
            </p>
          </div>

          <span className="countPill">
            {
              upcomingLessons.length
            }{' '}
            upcoming
          </span>
        </div>

        {upcomingLessons.length ===
        0 ? (
          <Empty
            title="No upcoming lessons"
            text="New confirmed lessons will appear here."
          />
        ) : (
          <div className="lessonGrid">
            {upcomingLessons
              .slice(0, 8)
              .map(
                (booking) => (
                  <LessonCard
                    key={booking.id}
                    booking={
                      booking
                    }
                    student={
                      studentMap[
                        booking
                          .student_id
                      ]
                    }
                    subject={
                      subjectMap[
                        booking
                          .subject_id
                      ]
                    }
                    tutor={
                      booking.tutor_id
                        ? tutorMap[
                            booking
                              .tutor_id
                          ]
                        : undefined
                    }
                    hasReport={
                      Boolean(
                        progressNotes[
                          booking.id
                        ],
                      )
                    }
                  />
                ),
              )}
          </div>
        )}
      </section>

      <section className="mainGrid">
        <div className="card">
          <div className="sectionHeader">
            <div>
              <p className="sectionEyebrow">
                Platform Attention
              </p>

              <h2>
                What needs action
              </h2>
            </div>
          </div>

          <div className="healthList">
            <HealthRow
              label="Missing meeting links"
              value={
                missingMeetingLinks.length
              }
              tone={
                missingMeetingLinks.length >
                0
                  ? 'danger'
                  : 'good'
              }
            />

            <HealthRow
              label="Missing tutor reports"
              value={
                missingReports.length
              }
              tone={
                missingReports.length > 0
                  ? 'warning'
                  : 'good'
              }
            />

            <HealthRow
              label="Tutor payouts due"
              value={
                pendingTutorPayouts.length
              }
              tone={
                pendingTutorPayouts.length >
                0
                  ? 'warning'
                  : 'good'
              }
            />

            <HealthRow
              label="Pending parent payments"
              value={
                pendingParentPayments.length
              }
              tone={
                pendingParentPayments.length >
                0
                  ? 'warning'
                  : 'good'
              }
            />

            <HealthRow
              label="Tutors needing review"
              value={
                pendingTutors.length
              }
              tone={
                pendingTutors.length > 0
                  ? 'warning'
                  : 'good'
              }
            />
          </div>
        </div>

        <div className="card">
          <div className="sectionHeader">
            <div>
              <p className="sectionEyebrow">
                Support & Safety
              </p>

              <h2>
                Inbox health
              </h2>
            </div>

            <Link
              href="/admin/messages"
              className="smallLink"
            >
              Open inbox
            </Link>
          </div>

          <div className="healthList">
            <HealthRow
              label="Unread messages"
              value={
                unreadMessages
              }
              tone={
                unreadMessages > 0
                  ? 'warning'
                  : 'good'
              }
            />

            <HealthRow
              label="Open enquiries"
              value={
                openMessages
              }
              tone={
                openMessages > 0
                  ? 'warning'
                  : 'good'
              }
            />

            <HealthRow
              label="High priority"
              value={
                highPriorityMessages
              }
              tone={
                highPriorityMessages > 0
                  ? 'danger'
                  : 'good'
              }
            />

            <HealthRow
              label="Safeguarding"
              value={
                safeguardingMessages
              }
              tone={
                safeguardingMessages > 0
                  ? 'danger'
                  : 'good'
              }
            />
          </div>
        </div>
      </section>

      <section className="financeGrid">
        <article className="financeCard">
          <p>
            Parent Revenue
          </p>

          <strong>
            £{revenue.toFixed(2)}
          </strong>

          <span>
            Successful parent
            payment records currently
            loaded.
          </span>

          <Link href="/admin/payments">
            View Payments →
          </Link>
        </article>

        <article className="financeCard">
          <p>
            Tutor Payout Liability
          </p>

          <strong>
            $
            {pendingTutorPayoutAmount.toFixed(
              2,
            )}
          </strong>

          <span>
            Tutor earnings currently
            waiting to be paid.
          </span>

          <Link href="/admin/tutor-payouts">
            Review Payouts →
          </Link>
        </article>

        <article className="financeCard">
          <p>
            Parents
          </p>

          <strong>
            {parentCount}
          </strong>

          <span>
            Registered parent
            profiles.
          </span>

          <Link href="/admin/parents">
            View Parents →
          </Link>
        </article>

        <article className="financeCard">
          <p>
            Completed Lessons
          </p>

          <strong>
            {completedLessons.length}
          </strong>

          <span>
            Lessons recorded as
            completed.
          </span>

          <Link href="/admin/bookings">
            Review Lessons →
          </Link>
        </article>
      </section>

      <section className="cardWide">
        <div className="sectionHeader">
          <div>
            <p className="sectionEyebrow">
              Admin Workspace
            </p>

            <h2>
              Platform controls
            </h2>

            <p className="sectionCopy">
              Move directly into the
              operational area you
              need.
            </p>
          </div>
        </div>

        <div className="quickGrid">
          {adminActions.map(
            (item) => (
              <Link
                href={item.href}
                className="quickCard"
                key={item.title}
              >
                <span>
                  {item.tag}
                </span>

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.text}
                </p>

                <strong>
                  Open →
                </strong>
              </Link>
            ),
          )}
        </div>
      </section>

      <style jsx global>
        {styles}
      </style>
    </main>
  )
}

function Kpi({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="kpiCard">
      <p>{label}</p>
      <h2>{value}</h2>
    </div>
  )
}

function OperationalCard({
  title,
  value,
  description,
  href,
  tone,
}: {
  title: string
  value: number
  description: string
  href: string
  tone: 'good' | 'warning' | 'danger'
}) {
  return (
    <Link
      href={href}
      className={`operationalCard ${tone}`}
    >
      <div>
        <p>{title}</p>

        <strong>
          {value}
        </strong>
      </div>

      <span>
        {description}
      </span>

      <b>
        Review →
      </b>
    </Link>
  )
}

function LessonCard({
  booking,
  student,
  subject,
  tutor,
  hasReport,
}: {
  booking: Booking
  student?: Student
  subject?: Subject
  tutor?: Tutor
  hasReport: boolean
}) {
  return (
    <article className="lessonCard">
      <div className="lessonTop">
        <div>
          <p className="lessonSubject">
            {subject?.name ||
              'Lesson'}
          </p>

          <h3>
            {student?.full_name ||
              'Learner'}
          </h3>
        </div>

        <StatusBadge
          status={
            booking.status
          }
        />
      </div>

      <div className="lessonDetails">
        <div>
          <span>
            Date
          </span>

          <strong>
            {formatDate(
              booking.lesson_date,
            )}
          </strong>
        </div>

        <div>
          <span>
            Time
          </span>

          <strong>
            {booking.lesson_time ||
              'Pending'}
          </strong>
        </div>

        <div>
          <span>
            Tutor
          </span>

          <strong>
            {tutor?.full_name ||
              'Not assigned'}
          </strong>
        </div>

        <div>
          <span>
            Payment
          </span>

          <strong>
            {
              booking.payment_status
            }
          </strong>
        </div>
      </div>

      <div className="lessonStatusRow">
        <span
          className={
            hasReport
              ? 'miniStatus success'
              : 'miniStatus warning'
          }
        >
          Report:{' '}
          {hasReport
            ? 'Submitted'
            : 'Pending'}
        </span>

        <span
          className={
            booking.meeting_link
              ? 'miniStatus success'
              : 'miniStatus danger'
          }
        >
          Meet:{' '}
          {booking.meeting_link
            ? 'Ready'
            : 'Missing'}
        </span>
      </div>

      {booking.notes ? (
        <div className="noteBox">
          <span>
            Parent note
          </span>

          <p>
            {booking.notes}
          </p>
        </div>
      ) : null}

      <div className="lessonActions">
        {booking.meeting_link ? (
          <a
            href={
              booking.meeting_link
            }
            target="_blank"
            rel="noreferrer"
            className="meetingLink"
          >
            Open Google Meet
          </a>
        ) : (
          <span className="missingLink">
            Meeting link missing
          </span>
        )}

        <Link
          href="/admin/bookings"
          className="detailLink"
        >
          Lesson details →
        </Link>
      </div>
    </article>
  )
}

function HealthRow({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone:
    | 'good'
    | 'warning'
    | 'danger'
}) {
  return (
    <div
      className={`healthRow ${tone}`}
    >
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  )
}

function StatusBadge({
  status,
}: {
  status: string
}) {
  const clean =
    String(
      status || '',
    ).toLowerCase()

  const positive =
    clean === 'confirmed' ||
    clean === 'completed' ||
    clean === 'paid'

  const warning =
    clean === 'pending' ||
    clean ===
      'pending_payment' ||
    clean === 'unpaid'

  return (
    <span
      className={
        positive
          ? 'statusBadge statusPaid'
          : warning
            ? 'statusBadge statusPending'
            : 'statusBadge'
      }
    >
      {status || 'Pending'}
    </span>
  )
}

function Empty({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="emptyState">
      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>
    </div>
  )
}

function formatDate(
  date: string | null,
) {
  if (!date) {
    return 'Date pending'
  }

  return new Intl.DateTimeFormat(
    'en-GB',
    {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  ).format(
    new Date(
      `${date}T00:00:00`,
    ),
  )
}

const styles = `
  .page {
    min-height: 100vh;
    padding: 34px 16px 90px;
    color: #21152d;

    background:
      radial-gradient(
        circle at 8% 0%,
        rgba(124, 58, 237, 0.14),
        transparent 30%
      ),
      radial-gradient(
        circle at 92% 5%,
        rgba(236, 72, 153, 0.06),
        transparent 28%
      ),
      linear-gradient(
        180deg,
        #fffaff 0%,
        #fbf8ff 44%,
        #f4edff 100%
      );
  }

  .hero,
  .operationsGrid,
  .cardWide,
  .mainGrid,
  .financeGrid {
    width: min(1220px, 100%);
    margin-left: auto;
    margin-right: auto;
  }

  .hero {
    padding: 42px;
    border-radius: 38px;

    background:
      radial-gradient(
        circle at top right,
        rgba(124,58,237,.18),
        transparent 34%
      ),
      linear-gradient(
        135deg,
        rgba(255,255,255,.98),
        rgba(246,239,255,.96)
      );

    border:
      1px solid
      rgba(126,87,194,.14);

    box-shadow:
      0 30px 90px
      rgba(71,43,117,.12);
  }

  .heroTop,
  .sectionHeader,
  .lessonTop {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 18px;
  }

  .eyebrow,
  .sectionEyebrow {
    margin: 0;
    color: #6d28d9;
    font-size: 13px;
    font-weight: 950;
    letter-spacing: .07em;
    text-transform: uppercase;
  }

  .hero h1 {
    margin: 14px 0 0;
    max-width: 900px;

    font-size:
      clamp(
        42px,
        6vw,
        72px
      );

    line-height: .96;
    letter-spacing: -.06em;
    font-weight: 950;
  }

  .subtitle {
    max-width: 800px;
    margin: 20px 0 0;
    color: #6f637e;
    font-size: 17px;
    line-height: 1.75;
  }

  .systemStatus {
    min-width: 130px;
    padding: 15px 18px;
    border-radius: 20px;
    text-align: center;
  }

  .systemStatus span,
  .systemStatus strong {
    display: block;
  }

  .systemStatus span {
    font-size: 10px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: .08em;
  }

  .systemStatus strong {
    margin-top: 5px;
    font-size: 27px;
  }

  .systemStatus.healthy {
    color: #166534;
    background: #ecfdf3;
  }

  .systemStatus.attention {
    color: #9a3412;
    background: #fff7ed;
  }

  .heroActions {
    display: flex;
    gap: 11px;
    flex-wrap: wrap;
    margin-top: 28px;
  }

  .primaryLink,
  .secondaryLink,
  .smallLink,
  .meetingLink,
  .detailLink {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    text-decoration: none;
    font-weight: 950;
  }

  .primaryLink,
  .secondaryLink {
    min-height: 52px;
    padding: 0 20px;
    border-radius: 16px;
  }

  .primaryLink,
  .meetingLink {
    color: #fff;

    background:
      linear-gradient(
        135deg,
        #7c3aed,
        #6d28d9
      );

    box-shadow:
      0 14px 34px
      rgba(124,58,237,.2);
  }

  .secondaryLink,
  .smallLink,
  .detailLink {
    color: #351e55;
    background: #fff;

    border:
      1px solid
      rgba(124,58,237,.16);
  }

  .smallLink {
    min-height: 42px;
    padding: 0 14px;
    border-radius: 999px;
    font-size: 12px;
  }

  .kpiGrid {
    margin-top: 30px;

    display: grid;

    grid-template-columns:
      repeat(
        4,
        minmax(0,1fr)
      );

    gap: 13px;
  }

  .kpiCard {
    padding: 18px;
    border-radius: 22px;

    background:
      rgba(
        255,
        255,
        255,
        .92
      );

    border:
      1px solid
      rgba(124,58,237,.11);

    box-shadow:
      0 16px 42px
      rgba(71,43,117,.06);
  }

  .kpiCard p {
    margin: 0;
    color: #7a7088;
    font-size: 12px;
    font-weight: 850;
  }

  .kpiCard h2 {
    margin: 7px 0 0;
    font-size: 30px;
    line-height: 1;
    letter-spacing: -.05em;
  }

  .operationsGrid {
    margin-top: 20px;

    display: grid;

    grid-template-columns:
      repeat(
        4,
        minmax(0,1fr)
      );

    gap: 13px;
  }

  .operationalCard {
    padding: 20px;
    min-height: 185px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    border-radius: 26px;

    color: inherit;
    text-decoration: none;

    background: #fff;

    border:
      1px solid
      rgba(124,58,237,.1);

    box-shadow:
      0 16px 45px
      rgba(71,43,117,.06);
  }

  .operationalCard div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .operationalCard p {
    margin: 0;
    font-size: 13px;
    font-weight: 950;
  }

  .operationalCard div strong {
    font-size: 28px;
  }

  .operationalCard > span {
    color: #756a7c;
    line-height: 1.55;
    font-size: 12px;
  }

  .operationalCard > b {
    color: #6d28d9;
    font-size: 12px;
  }

  .operationalCard.good {
    border-top:
      4px solid #16a34a;
  }

  .operationalCard.warning {
    border-top:
      4px solid #f59e0b;
  }

  .operationalCard.danger {
    border-top:
      4px solid #e11d48;
  }

  .cardWide,
  .card {
    background:
      rgba(
        255,
        255,
        255,
        .96
      );

    border:
      1px solid
      rgba(126,87,194,.12);

    box-shadow:
      0 22px 65px
      rgba(71,43,117,.07);
  }

  .cardWide {
    margin-top: 24px;
    padding: 30px;
    border-radius: 31px;
  }

  .card {
    padding: 27px;
    border-radius: 29px;
  }

  .sectionHeader {
    margin-bottom: 21px;
  }

  .sectionHeader h2 {
    margin: 8px 0 0;

    font-size:
      clamp(
        25px,
        3vw,
        40px
      );

    line-height: 1.05;
    letter-spacing: -.045em;
  }

  .sectionCopy {
    margin: 10px 0 0;
    max-width: 620px;
    color: #756a7c;
    line-height: 1.6;
  }

  .countPill {
    padding: 9px 12px;
    border-radius: 999px;

    background: #f2ebff;
    color: #6d28d9;

    font-size: 11px;
    font-weight: 950;
  }

  .lessonGrid {
    display: grid;

    grid-template-columns:
      repeat(
        2,
        minmax(0,1fr)
      );

    gap: 15px;
  }

  .lessonCard {
    padding: 22px;
    border-radius: 25px;

    background:
      linear-gradient(
        145deg,
        #fff,
        #fbf8ff
      );

    border:
      1px solid
      rgba(124,58,237,.1);
  }

  .lessonSubject {
    margin: 0;
    color: #6d28d9;
    font-size: 11px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: .07em;
  }

  .lessonCard h3 {
    margin: 6px 0 0;
    font-size: 24px;
    letter-spacing: -.035em;
  }

  .lessonDetails {
    margin-top: 17px;

    display: grid;

    grid-template-columns:
      repeat(
        2,
        minmax(0,1fr)
      );

    gap: 9px;
  }

  .lessonDetails div {
    padding: 13px;
    border-radius: 15px;

    background: #f8f5fc;
  }

  .lessonDetails span {
    display: block;
    color: #84798a;
    font-size: 10px;
    font-weight: 850;
  }

  .lessonDetails strong {
    display: block;
    margin-top: 4px;
    font-size: 13px;
  }

  .lessonStatusRow {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 14px;
  }

  .miniStatus {
    padding: 6px 9px;
    border-radius: 999px;

    font-size: 10px;
    font-weight: 900;
  }

  .miniStatus.success {
    color: #166534;
    background: #dcfce7;
  }

  .miniStatus.warning {
    color: #92400e;
    background: #fef3c7;
  }

  .miniStatus.danger {
    color: #be123c;
    background: #ffe4e6;
  }

  .noteBox {
    margin-top: 14px;
    padding: 13px;

    border-radius: 15px;

    background: #fff7ed;

    border:
      1px solid
      rgba(249,115,22,.13);
  }

  .noteBox span {
    color: #9a3412;
    font-size: 10px;
    font-weight: 950;
  }

  .noteBox p {
    margin: 5px 0 0;
    color: #7c2d12;
    line-height: 1.5;
    font-size: 12px;
  }

  .lessonActions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 15px;
  }

  .meetingLink,
  .detailLink {
    min-height: 40px;
    padding: 0 13px;
    border-radius: 12px;
    font-size: 11px;
  }

  .missingLink {
    display: inline-flex;
    align-items: center;

    min-height: 40px;
    padding: 0 13px;

    border-radius: 12px;

    background: #ffe4e6;
    color: #be123c;

    font-size: 11px;
    font-weight: 950;
  }

  .statusBadge {
    display: inline-flex;
    align-items: center;

    min-height: 31px;
    padding: 0 10px;

    border-radius: 999px;

    background: #f6f1ff;
    color: #4c1d95;

    font-size: 10px;
    font-weight: 950;
  }

  .statusPaid {
    background: #dcfce7;
    color: #166534;
  }

  .statusPending {
    background: #fff7ed;
    color: #9a3412;
  }

  .mainGrid {
    margin-top: 24px;

    display: grid;
    grid-template-columns:
      repeat(
        2,
        minmax(0,1fr)
      );

    gap: 22px;
  }

  .healthList {
    display: grid;
  }

  .healthRow {
    display: flex;
    justify-content: space-between;
    gap: 12px;

    padding: 14px 0;

    border-bottom:
      1px solid
      rgba(124,58,237,.09);
  }

  .healthRow span {
    color: #766b7d;
    font-weight: 800;
  }

  .healthRow strong {
    font-weight: 950;
  }

  .healthRow.good strong {
    color: #166534;
  }

  .healthRow.warning strong {
    color: #9a3412;
  }

  .healthRow.danger strong {
    color: #be123c;
  }

  .financeGrid {
    margin-top: 24px;

    display: grid;

    grid-template-columns:
      repeat(
        4,
        minmax(0,1fr)
      );

    gap: 13px;
  }

  .financeCard {
    padding: 22px;
    border-radius: 25px;

    background: #fff;

    border:
      1px solid
      rgba(124,58,237,.1);

    box-shadow:
      0 16px 44px
      rgba(71,43,117,.06);
  }

  .financeCard p {
    margin: 0;
    color: #766b7d;
    font-size: 11px;
    font-weight: 950;
    text-transform: uppercase;
  }

  .financeCard > strong {
    display: block;
    margin-top: 12px;

    font-size: 30px;
    letter-spacing: -.05em;
  }

  .financeCard > span {
    display: block;
    margin-top: 11px;

    color: #817687;
    font-size: 12px;
    line-height: 1.55;
  }

  .financeCard a {
    display: inline-block;
    margin-top: 18px;

    color: #6d28d9;
    text-decoration: none;

    font-size: 11px;
    font-weight: 950;
  }

  .quickGrid {
    display: grid;

    grid-template-columns:
      repeat(
        auto-fit,
        minmax(
          205px,
          1fr
        )
      );

    gap: 13px;
  }

  .quickCard {
    min-height: 205px;
    padding: 21px;

    display: flex;
    flex-direction: column;

    border-radius: 25px;

    color: inherit;
    text-decoration: none;

    background:
      linear-gradient(
        145deg,
        #fff,
        #fcfaff
      );

    border:
      1px solid
      rgba(124,58,237,.1);
  }

  .quickCard > span {
    width: fit-content;

    padding: 6px 9px;

    border-radius: 999px;

    color: #6d28d9;
    background: #f2ebff;

    font-size: 9px;
    font-weight: 950;
    text-transform: uppercase;
  }

  .quickCard h3 {
    margin: 20px 0 0;

    font-size: 21px;
    line-height: 1.08;
    letter-spacing: -.035em;
  }

  .quickCard p {
    margin: 9px 0 0;

    color: #756a7c;
    font-size: 12px;
    line-height: 1.55;
  }

  .quickCard strong {
    margin-top: auto;
    padding-top: 18px;

    color: #6d28d9;
    font-size: 11px;
  }

  .emptyState {
    padding: 24px;
    border-radius: 22px;

    background: #fbf8ff;

    border:
      1px solid
      rgba(124,58,237,.1);
  }

  .emptyState h3 {
    margin: 0;
    font-size: 22px;
  }

  .emptyState p {
    margin: 8px 0 0;
    color: #756a7c;
    line-height: 1.6;
  }

  @media(max-width: 950px) {
    .kpiGrid,
    .operationsGrid,
    .financeGrid {
      grid-template-columns:
        repeat(
          2,
          minmax(0,1fr)
        );
    }

    .lessonGrid,
    .mainGrid {
      grid-template-columns:
        1fr;
    }
  }

  @media(max-width: 620px) {
    .page {
      padding:
        20px
        10px
        70px;
    }

    .hero,
    .cardWide,
    .card {
      padding: 22px;
      border-radius: 25px;
    }

    .heroTop,
    .sectionHeader,
    .lessonTop {
      flex-direction: column;
      align-items: flex-start;
    }

    .hero h1 {
      font-size: 43px;
    }

    .systemStatus {
      width: 100%;
      text-align: left;
    }

    .kpiGrid,
    .operationsGrid,
    .financeGrid,
    .lessonDetails {
      grid-template-columns:
        1fr;
    }

    .heroActions {
      display: grid;
    }

    .primaryLink,
    .secondaryLink {
      width: 100%;
    }
  }
`
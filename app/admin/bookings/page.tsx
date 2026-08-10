'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

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
  created_at: string | null

  student_profiles: {
    full_name: string
    child_age: number | null
    country_system: string | null
    country_class_label: string | null
  } | null

  tutor_profiles: {
    id: string
    full_name: string
    payout_method: string | null
    payout_currency: string | null
    payout_account_name: string | null
    payout_bank_name: string | null
    payout_account_number: string | null
    paypal_email: string | null
    payout_details_completed: boolean | null
  } | null
}

type Subject = {
  id: string
  name: string
}

type ProgressNote = {
  id: string
  lesson_booking_id: string
  tutor_id: string
  student_id: string
  lesson_date: string | null
  lesson_topic: string | null
  strengths: string | null
  improvement_area: string | null
  homework: string | null
  tutor_comment: string | null
  attendance: string | null
  created_at: string | null
}

type Earning = {
  id: string
  tutor_id: string
  booking_id: string
  lesson_amount: number | null
  platform_fee: number | null
  tutor_amount: number | null
  status: string
  paid_at: string | null
  lesson_date: string | null
  payout_reference: string | null
  notes: string | null
}

type Filter =
  | 'ALL'
  | 'TODAY'
  | 'UPCOMING'
  | 'COMPLETED'
  | 'PENDING_PAYMENT'
  | 'MISSING_MEET'
  | 'NEEDS_REPORT'
  | 'NEEDS_PAYOUT'

const planLabels: Record<string, string> = {
  monthly: 'Monthly Plan',
  three_month: '3-Month Plan',
}

export default function AdminBookingsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('Loading lessons...')

  const [bookings, setBookings] =
    useState<Booking[]>([])

  const [subjects, setSubjects] =
    useState<Record<string, string>>({})

  const [progressNotes, setProgressNotes] =
    useState<Record<string, ProgressNote>>({})

  const [earnings, setEarnings] =
    useState<Record<string, Earning>>({})

  const [filter, setFilter] =
    useState<Filter>('ALL')

  const [search, setSearch] =
    useState('')

  const [selectedBookingId, setSelectedBookingId] =
    useState<string | null>(null)

  useEffect(() => {
    async function loadBookings() {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: userProfile } =
        await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()

      if (
        !userProfile ||
        userProfile.role !== 'ADMIN'
      ) {
        router.push('/account')
        return
      }

      const { data, error } =
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
            created_at,

            student_profiles (
              full_name,
              child_age,
              country_system,
              country_class_label
            ),

            tutor_profiles (
              id,
              full_name,
              payout_method,
              payout_currency,
              payout_account_name,
              payout_bank_name,
              payout_account_number,
              paypal_email,
              payout_details_completed
            )
          `)
          .order(
            'lesson_date',
            { ascending: true },
          )
          .order(
            'lesson_time',
            { ascending: true },
          )

      if (error) {
        setMessage(error.message)
        setLoading(false)
        return
      }

      const cleanRows =
        ((data ?? []) as any[]).map(
          (row) => ({
            ...row,

            student_profiles:
              Array.isArray(
                row.student_profiles,
              )
                ? row.student_profiles[0] ??
                  null
                : row.student_profiles ??
                  null,

            tutor_profiles:
              Array.isArray(
                row.tutor_profiles,
              )
                ? row.tutor_profiles[0] ??
                  null
                : row.tutor_profiles ??
                  null,
          }),
        ) as Booking[]

      setBookings(cleanRows)

      const subjectIds =
        Array.from(
          new Set(
            cleanRows.map(
              (row) => row.subject_id,
            ),
          ),
        )

      const bookingIds =
        cleanRows.map(
          (row) => row.id,
        )

      if (subjectIds.length > 0) {
        const { data: subjectRows } =
          await supabase
            .from('subjects')
            .select('id, name')
            .in('id', subjectIds)

        const subjectMap:
          Record<string, string> = {}

        ;(
          (subjectRows ?? []) as Subject[]
        ).forEach((subject) => {
          subjectMap[
            subject.id
          ] = subject.name
        })

        setSubjects(subjectMap)
      }

      if (bookingIds.length > 0) {
        const { data: noteRows } =
          await supabase
            .from('lesson_progress_notes')
            .select(`
              id,
              lesson_booking_id,
              tutor_id,
              student_id,
              lesson_date,
              lesson_topic,
              strengths,
              improvement_area,
              homework,
              tutor_comment,
              attendance,
              created_at
            `)
            .in(
              'lesson_booking_id',
              bookingIds,
            )

        const noteMap:
          Record<string, ProgressNote> = {}

        ;(
          (noteRows ?? []) as ProgressNote[]
        ).forEach((note) => {
          noteMap[
            note.lesson_booking_id
          ] = note
        })

        setProgressNotes(
          noteMap,
        )

        const { data: earningRows } =
          await supabase
            .from('tutor_earnings')
            .select(`
              id,
              tutor_id,
              booking_id,
              lesson_amount,
              platform_fee,
              tutor_amount,
              status,
              paid_at,
              lesson_date,
              payout_reference,
              notes
            `)
            .in(
              'booking_id',
              bookingIds,
            )

        const earningMap:
          Record<string, Earning> = {}

        ;(
          (earningRows ?? []) as Earning[]
        ).forEach((earning) => {
          earningMap[
            earning.booking_id
          ] = earning
        })

        setEarnings(
          earningMap,
        )
      }

      setMessage('')
      setLoading(false)
    }

    loadBookings()
  }, [router])

  const today =
    new Date()
      .toISOString()
      .split('T')[0]

  const operationalBookings = useMemo(() => {
  const upcoming = bookings
    .filter(
      (booking) =>
        booking.lesson_date &&
        booking.lesson_date >= today,
    )
    .sort((a, b) => {
      const aValue =
        `${a.lesson_date ?? ''}T${a.lesson_time ?? '00:00'}`;

      const bValue =
        `${b.lesson_date ?? ''}T${b.lesson_time ?? '00:00'}`;

      return aValue.localeCompare(bValue);
    });

  const past = bookings
    .filter(
      (booking) =>
        booking.lesson_date &&
        booking.lesson_date < today,
    )
    .sort((a, b) => {
      const aValue =
        `${a.lesson_date ?? ''}T${a.lesson_time ?? '00:00'}`;

      const bValue =
        `${b.lesson_date ?? ''}T${b.lesson_time ?? '00:00'}`;

      return bValue.localeCompare(aValue);
    });

  const noDate = bookings.filter(
    (booking) => !booking.lesson_date,
  );

  return [
    ...upcoming,
    ...past,
    ...noDate,
  ];
}, [bookings, today]);    

  const completedBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
        'COMPLETED',
    )

  const todayBookings =
    bookings.filter(
      (booking) =>
        booking.lesson_date ===
          today &&
        (
          booking.payment_status ===
            'PAID' ||
          booking.status ===
            'CONFIRMED'
        ),
    )

  const upcomingBookings =
    bookings.filter(
      (booking) =>
        booking.lesson_date &&
        booking.lesson_date >=
          today &&
        (
          booking.payment_status ===
            'PAID' ||
          booking.status ===
            'CONFIRMED'
        ),
    )

  const pendingPaymentBookings =
    bookings.filter(
      (booking) =>
        booking.payment_status !==
          'PAID' &&
        booking.status !==
          'CANCELLED',
    )

  const missingMeetBookings =
    bookings.filter(
      (booking) =>
        booking.lesson_date &&
        booking.lesson_date >=
          today &&
        (
          booking.payment_status ===
            'PAID' ||
          booking.status ===
            'CONFIRMED'
        ) &&
        !booking.meeting_link,
    )

  const needsReportBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
          'COMPLETED' &&
        !progressNotes[
          booking.id
        ],
    )

  const needsPayoutBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
          'COMPLETED' &&
        earnings[
          booking.id
        ]?.status !==
          'paid',
    )

  const revenue =
    bookings
      .filter(
        (booking) =>
          booking.payment_status ===
            'PAID' ||
          booking.status ===
            'CONFIRMED' ||
          booking.status ===
            'COMPLETED',
      )
      .reduce(
        (
          total,
          booking,
        ) =>
          total +
          Number(
            booking.amount_gbp ||
              0,
          ),
        0,
      )

  const filteredBookings =
    useMemo(() => {
      let rows =
  operationalBookings

      if (
        filter === 'TODAY'
      ) {
        rows =
          todayBookings
      }

      if (
        filter === 'UPCOMING'
      ) {
        rows =
          upcomingBookings
      }

      if (
        filter === 'COMPLETED'
      ) {
        rows =
          completedBookings
      }

      if (
        filter ===
        'PENDING_PAYMENT'
      ) {
        rows =
          pendingPaymentBookings
      }

      if (
        filter ===
        'MISSING_MEET'
      ) {
        rows =
          missingMeetBookings
      }

      if (
        filter ===
        'NEEDS_REPORT'
      ) {
        rows =
          needsReportBookings
      }

      if (
        filter ===
        'NEEDS_PAYOUT'
      ) {
        rows =
          needsPayoutBookings
      }

      const query =
        search
          .trim()
          .toLowerCase()

      if (!query) {
        return rows
      }

      return rows.filter(
        (booking) => {
          const student =
            booking
              .student_profiles
              ?.full_name ||
            ''

          const tutor =
            booking
              .tutor_profiles
              ?.full_name ||
            ''

          const subject =
            subjects[
              booking.subject_id
            ] || ''

          return [
            student,
            tutor,
            subject,
            booking.id,
            booking.status,
            booking.payment_status,
          ].some(
            (value) =>
              String(value)
                .toLowerCase()
                .includes(
                  query,
                ),
          )
        },
      )
    }, [
      filter,
      search,
      operationalBookings,
      bookings,
      subjects,
      todayBookings,
      upcomingBookings,
      completedBookings,
      pendingPaymentBookings,
      missingMeetBookings,
      needsReportBookings,
      needsPayoutBookings,
    ])
 
  if (loading) {
    return (
      <main className="page">
        <section className="hero">
          <p className="eyebrow">
            Admin Lessons
          </p>

          <h1>
            Loading lesson
            operations...
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
        <p className="eyebrow">
          FountainPrep Admin
        </p>

        <h1>
          Lesson Control Centre
        </h1>

        <p className="subtitle">
          Follow every lesson from
          parent payment through
          teaching, Google Meet,
          lesson report, tutor
          earnings and final payout.
        </p>

        <div className="kpiGrid">
          <Kpi
            label="Total Lessons"
            value={String(
              bookings.length,
            )}
          />

          <Kpi
            label="Today"
            value={String(
              todayBookings.length,
            )}
          />

          <Kpi
            label="Upcoming"
            value={String(
              upcomingBookings.length,
            )}
          />

          <Kpi
            label="Completed"
            value={String(
              completedBookings.length,
            )}
          />

          <Kpi
            label="Missing Meet"
            value={String(
              missingMeetBookings.length,
            )}
          />

          <Kpi
            label="Needs Report"
            value={String(
              needsReportBookings.length,
            )}
          />

          <Kpi
            label="Needs Payout"
            value={String(
              needsPayoutBookings.length,
            )}
          />

          <Kpi
            label="Revenue"
            value={`£${revenue.toFixed(
              2,
            )}`}
          />
        </div>

        <div className="heroActions">
          <Link
            href="/admin"
            className="secondaryButton"
          >
            Back to Admin
          </Link>

          <Link
            href="/admin/tutor-payouts"
            className="primaryButton"
          >
            Tutor Payouts
          </Link>

          <Link
            href="/admin/students"
            className="secondaryButton"
          >
            Learners
          </Link>

          <Link
            href="/admin/payments"
            className="secondaryButton"
          >
            Payments
          </Link>
        </div>
      </section>

      <section className="controlCard">
        <div className="filterRow">
          {[
            ['ALL', 'All'],
            ['TODAY', 'Today'],
            ['UPCOMING', 'Upcoming'],
            ['COMPLETED', 'Completed'],
            [
              'PENDING_PAYMENT',
              'Payment Pending',
            ],
            [
              'MISSING_MEET',
              'Missing Meet',
            ],
            [
              'NEEDS_REPORT',
              'Needs Report',
            ],
            [
              'NEEDS_PAYOUT',
              'Needs Payout',
            ],
          ].map(
            ([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() =>
                  setFilter(
                    key as Filter,
                  )
                }
                className={
                  filter === key
                    ? 'filterButton active'
                    : 'filterButton'
                }
              >
                {label}
              </button>
            ),
          )}
        </div>

        <div className="searchRow">
          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Search learner, tutor, subject or booking ID..."
          />

          <span>
            {
              filteredBookings.length
            }{' '}
            lessons
          </span>
        </div>
      </section>

      <section className="lessonList">
        {filteredBookings.length ===
        0 ? (
          <div className="emptyState">
            <h3>
              No lessons found
            </h3>

            <p>
              There are no lessons
              matching the current
              filter.
            </p>
          </div>
        ) : (
          filteredBookings.map(
            (booking) => {
              const note =
                progressNotes[
                  booking.id
                ]

              const earning =
                earnings[
                  booking.id
                ]

              return (
                <article
                  className="lessonCard"
                  key={booking.id}
                >
                  <div className="lessonHeader">
                    <div>
                      <p className="subject">
                        {subjects[
                          booking
                            .subject_id
                        ] ||
                          'Lesson'}
                      </p>

                      <h2>
                        {booking
                          .student_profiles
                          ?.full_name ||
                          'Learner'}
                      </h2>

                      <p className="meta">
                        Tutor:{' '}
                        {booking
                          .tutor_profiles
                          ?.full_name ||
                          'Not assigned'}
                      </p>
                    </div>

                    <div className="statusStack">
                      <Badge
                        text={
                          booking.payment_status ===
                          'PAID'
                            ? 'Paid'
                            : booking.payment_status
                        }
                        tone={
                          booking.payment_status ===
                          'PAID'
                            ? 'green'
                            : 'orange'
                        }
                      />

                      <Badge
                        text={
                          booking.status
                        }
                        tone={
                          booking.status ===
                          'COMPLETED'
                            ? 'green'
                            : 'blue'
                        }
                      />
                    </div>
                  </div>

                  <div className="lessonFacts">
                    <Fact
                      label="Date"
                      value={formatDate(
                        booking.lesson_date,
                      )}
                    />

                    <Fact
                      label="Time"
                      value={
                        booking.lesson_time ||
                        'Pending'
                      }
                    />

                    <Fact
                      label="Timezone"
                      value={
                        booking.timezone ||
                        'Not set'
                      }
                    />

                    <Fact
                      label="Plan"
                      value={
                        planLabels[
                          booking.plan_id
                        ] ||
                        'Learning Plan'
                      }
                    />

                    <Fact
                      label="Amount"
                      value={`£${Number(
                        booking.amount_gbp ||
                          0,
                      ).toFixed(2)}`}
                    />

                    <Fact
                      label="Attendance"
                      value={
                        note?.attendance ||
                        'Not recorded'
                      }
                    />
                  </div>

                  <div className="healthStrip">
                    <MiniStatus
                      label="Google Meet"
                      good={Boolean(
                        booking.meeting_link,
                      )}
                      text={
                        booking.meeting_link
                          ? 'Ready'
                          : 'Missing'
                      }
                    />

                    <MiniStatus
                      label="Tutor Report"
                      good={Boolean(
                        note,
                      )}
                      text={
                        note
                          ? 'Submitted'
                          : 'Missing'
                      }
                    />

                    <MiniStatus
                      label="Tutor Earning"
                      good={Boolean(
                        earning,
                      )}
                      text={
                        earning
                          ? earning.status
                          : 'Not created'
                      }
                    />
                  </div>

                  <div className="lessonActions">
                    {booking.meeting_link ? (
                      <a
                        href={
                          booking.meeting_link
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="meetButton"
                      >
                        Open Google Meet
                      </a>
                    ) : null}

                    <button
                      type="button"
                      className="detailsButton"
                      onClick={() =>
                        setSelectedBookingId(
                          selectedBookingId ===
                            booking.id
                            ? null
                            : booking.id,
                        )
                      }
                    >
                      {selectedBookingId ===
                      booking.id
                        ? 'Close Details'
                        : 'View Full Details'}
                    </button>
                  </div>

                  {selectedBookingId ===
                  booking.id ? (
                    <LessonDetailPanel
                      booking={
                        booking
                      }
                      note={note}
                      earning={
                        earning
                      }
                    />
                  ) : null}
                </article>
              )
            },
          )
        )}
      </section>
     
      <style jsx global>
        {styles}
      </style>
    </main>
  )
}

function LessonDetailPanel({
  booking,
  note,
  earning,
}: {
  booking: Booking
  note?: ProgressNote
  earning?: Earning
}) {
  const tutor =
    booking.tutor_profiles

  return (
    <div className="detailPanel">
      <div className="detailSection">
        <p className="detailEyebrow">
          Tutor Lesson Report
        </p>

        <h3>
          Learning record
        </h3>

        {!note ? (
          <div className="alertBox warningBox">
            Tutor report has not yet
            been submitted for this
            lesson.
          </div>
        ) : (
          <div className="reportGrid">
            <ReportField
              label="Lesson Topic"
              value={
                note.lesson_topic
              }
            />

            <ReportField
              label="Strengths"
              value={
                note.strengths
              }
            />

            <ReportField
              label="Improvement Area"
              value={
                note.improvement_area
              }
            />

            <ReportField
              label="Homework"
              value={
                note.homework
              }
            />

            <ReportField
              label="Tutor Comment"
              value={
                note.tutor_comment
              }
            />

            <ReportField
              label="Attendance"
              value={
                note.attendance
              }
            />
          </div>
        )}
      </div>

      <div className="detailSection">
        <p className="detailEyebrow">
          Tutor Earnings
        </p>

        <h3>
          Lesson payout
        </h3>

        {!earning ? (
          <div className="alertBox warningBox">
            No tutor earning record
            has been created for this
            lesson yet.
          </div>
        ) : (
          <div className="financialGrid">
            <Fact
              label="Lesson Amount"
              value={`$${Number(
                earning.lesson_amount ||
                  0,
              ).toFixed(2)}`}
            />

            <Fact
              label="Platform Fee"
              value={`$${Number(
                earning.platform_fee ||
                  0,
              ).toFixed(2)}`}
            />

            <Fact
              label="Tutor Amount"
              value={`$${Number(
                earning.tutor_amount ||
                  0,
              ).toFixed(2)}`}
            />

            <Fact
              label="Payout Status"
              value={
                earning.status ||
                'Pending'
              }
            />

            <Fact
              label="Paid At"
              value={
                earning.paid_at
                  ? formatDateTime(
                      earning.paid_at,
                    )
                  : 'Not paid'
              }
            />

            <Fact
              label="Reference"
              value={
                earning.payout_reference ||
                'Not available'
              }
            />
          </div>
        )}
      </div>

      <div className="detailSection">
        <p className="detailEyebrow">
          Tutor Payout Account
        </p>

        <h3>
          Payment destination
        </h3>

        {!tutor ? (
          <div className="alertBox warningBox">
            Tutor profile is not
            available.
          </div>
        ) : (
          <>
            <div className="financialGrid">
              <Fact
                label="Tutor"
                value={
                  tutor.full_name
                }
              />

              <Fact
                label="Method"
                value={
                  tutor.payout_method ||
                  'Not provided'
                }
              />

              <Fact
                label="Currency"
                value={
                  tutor.payout_currency ||
                  'Not provided'
                }
              />

              <Fact
                label="Account Name"
                value={
                  tutor.payout_account_name ||
                  'Not provided'
                }
              />

              <Fact
                label="Bank"
                value={
                  tutor.payout_bank_name ||
                  'Not provided'
                }
              />

              <Fact
                label="Account"
                value={
                  maskAccountNumber(
                    tutor.payout_account_number,
                  )
                }
              />

              <Fact
                label="PayPal"
                value={
                  tutor.paypal_email ||
                  'Not provided'
                }
              />

              <Fact
                label="Details Complete"
                value={
                  tutor.payout_details_completed
                    ? 'Yes'
                    : 'No'
                }
              />
            </div>

            <p className="securityNote">
              Account numbers are
              masked in the lesson
              control view. Full
              payout details should
              only be used from the
              dedicated Tutor Payouts
              screen when processing
              payment.
            </p>
          </>
        )}
      </div>

      <div className="detailSection">
        <p className="detailEyebrow">
          Booking Record
        </p>

        <h3>
          System information
        </h3>

        <div className="financialGrid">
          <Fact
            label="Booking ID"
            value={booking.id}
          />

          <Fact
            label="Student ID"
            value={
              booking.student_id
            }
          />

          <Fact
            label="Tutor ID"
            value={
              booking.tutor_id ||
              'Not assigned'
            }
          />

          <Fact
            label="Parent ID"
            value={
              booking.parent_id ||
              'Not available'
            }
          />
        </div>
      </div>
    </div>
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
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  )
}

function Fact({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="fact">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  )
}

function ReportField({
  label,
  value,
}: {
  label: string
  value: string | null
}) {
  return (
    <div className="reportField">
      <span>
        {label}
      </span>

      <p>
        {value ||
          'Not provided'}
      </p>
    </div>
  )
}

function MiniStatus({
  label,
  text,
  good,
}: {
  label: string
  text: string
  good: boolean
}) {
  return (
    <span
      className={
        good
          ? 'miniStatus good'
          : 'miniStatus attention'
      }
    >
      <b>
        {label}:
      </b>{' '}
      {text}
    </span>
  )
}

function Badge({
  text,
  tone,
}: {
  text: string
  tone:
    | 'green'
    | 'orange'
    | 'blue'
}) {
  return (
    <span
      className={`badge ${tone}`}
    >
      {text}
    </span>
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

function formatDateTime(
  value: string,
) {
  return new Intl.DateTimeFormat(
    'en-GB',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(
    new Date(value),
  )
}

function maskAccountNumber(
  value?: string | null,
) {
  if (!value) {
    return 'Not provided'
  }

  const clean =
    String(value).trim()

  if (clean.length <= 4) {
    return clean
  }

  return `•••• ${clean.slice(
    -4,
  )}`
}

const styles = `
  .page {
    min-height:100vh;
    padding:34px 16px 90px;
    color:#21152d;
    background:
      radial-gradient(circle at 8% 0%,rgba(124,58,237,.14),transparent 30%),
      linear-gradient(180deg,#fffaff,#fbf8ff 45%,#f4edff);
  }

  .hero,
  .controlCard,
  .lessonList {
    width:min(1220px,100%);
    margin-left:auto;
    margin-right:auto;
  }

  .hero {
    padding:42px;
    border-radius:38px;
    background:
      radial-gradient(circle at top right,rgba(124,58,237,.17),transparent 34%),
      linear-gradient(135deg,#fff,#f7f1ff);
    border:1px solid rgba(124,58,237,.13);
    box-shadow:0 30px 90px rgba(71,43,117,.1);
  }

  .eyebrow,
  .detailEyebrow {
    margin:0;
    color:#6d28d9;
    font-size:12px;
    font-weight:950;
    letter-spacing:.08em;
    text-transform:uppercase;
  }

  .hero h1 {
    margin:14px 0 0;
    font-size:clamp(42px,6vw,72px);
    line-height:.96;
    letter-spacing:-.06em;
  }

  .subtitle {
    max-width:800px;
    margin:18px 0 0;
    color:#716778;
    font-size:17px;
    line-height:1.7;
  }

  .kpiGrid {
    margin-top:28px;
    display:grid;
    grid-template-columns:repeat(4,minmax(0,1fr));
    gap:12px;
  }

  .kpiCard {
    padding:18px;
    border-radius:20px;
    background:rgba(255,255,255,.9);
    border:1px solid rgba(124,58,237,.1);
  }

  .kpiCard span {
    display:block;
    color:#7b7182;
    font-size:11px;
    font-weight:850;
  }

  .kpiCard strong {
    display:block;
    margin-top:7px;
    font-size:28px;
    letter-spacing:-.04em;
  }

  .heroActions {
    margin-top:25px;
    display:flex;
    gap:10px;
    flex-wrap:wrap;
  }

  .primaryButton,
  .secondaryButton,
  .meetButton {
    min-height:46px;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    padding:0 16px;
    border-radius:14px;
    text-decoration:none;
    font-size:12px;
    font-weight:950;
  }

  .primaryButton,
  .meetButton {
    color:white;
    background:linear-gradient(135deg,#7c3aed,#6d28d9);
  }

  .secondaryButton {
    color:#351e55;
    background:#fff;
    border:1px solid rgba(124,58,237,.14);
  }

  .controlCard {
    margin-top:20px;
    padding:20px;
    border-radius:25px;
    background:#fff;
    border:1px solid rgba(124,58,237,.11);
    box-shadow:0 15px 45px rgba(71,43,117,.06);
  }

  .filterRow {
    display:flex;
    flex-wrap:wrap;
    gap:8px;
  }

  .filterButton {
    min-height:39px;
    padding:0 13px;
    border-radius:999px;
    border:1px solid rgba(124,58,237,.13);
    background:#fff;
    color:#432566;
    font-weight:900;
    cursor:pointer;
  }

  .filterButton.active {
    color:white;
    background:#6d28d9;
  }

  .searchRow {
    margin-top:16px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:15px;
  }

  .searchRow input {
    width:min(520px,100%);
    min-height:46px;
    padding:0 15px;
    border-radius:14px;
    border:1px solid rgba(124,58,237,.15);
    outline:none;
  }

  .searchRow span {
    color:#756b7b;
    font-size:12px;
    font-weight:900;
  }

  .lessonList {
    margin-top:20px;
    display:grid;
    gap:14px;
  }

  .lessonCard {
    padding:23px;
    border-radius:27px;
    background:#fff;
    border:1px solid rgba(124,58,237,.1);
    box-shadow:0 17px 50px rgba(71,43,117,.06);
  }

  .lessonHeader {
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:15px;
  }

  .subject {
    margin:0;
    color:#6d28d9;
    font-size:11px;
    font-weight:950;
    text-transform:uppercase;
  }

  .lessonHeader h2 {
    margin:6px 0 0;
    font-size:27px;
    letter-spacing:-.04em;
  }

  .meta {
    margin:7px 0 0;
    color:#756b7b;
    font-size:13px;
    font-weight:750;
  }

  .statusStack {
    display:flex;
    gap:6px;
    flex-wrap:wrap;
  }

  .badge {
    padding:7px 10px;
    border-radius:999px;
    font-size:10px;
    font-weight:950;
  }

  .badge.green {
    background:#dcfce7;
    color:#166534;
  }

  .badge.orange {
    background:#fff7ed;
    color:#9a3412;
  }

  .badge.blue {
    background:#eff6ff;
    color:#1d4ed8;
  }

  .lessonFacts,
  .financialGrid {
    margin-top:16px;
    display:grid;
    grid-template-columns:repeat(3,minmax(0,1fr));
    gap:9px;
  }

  .fact {
    padding:13px;
    border-radius:15px;
    background:#faf7ff;
  }

  .fact span {
    display:block;
    color:#82778a;
    font-size:10px;
    font-weight:900;
  }

  .fact strong {
    display:block;
    margin-top:5px;
    font-size:12px;
    overflow-wrap:anywhere;
  }

  .healthStrip {
    margin-top:15px;
    display:flex;
    flex-wrap:wrap;
    gap:7px;
  }

  .miniStatus {
    padding:7px 10px;
    border-radius:999px;
    font-size:10px;
  }

  .miniStatus.good {
    color:#166534;
    background:#dcfce7;
  }

  .miniStatus.attention {
    color:#9a3412;
    background:#fff7ed;
  }

  .lessonActions {
    margin-top:16px;
    display:flex;
    flex-wrap:wrap;
    gap:8px;
  }

  .detailsButton {
    min-height:46px;
    padding:0 16px;
    border-radius:14px;
    border:1px solid rgba(124,58,237,.15);
    background:#fff;
    color:#432566;
    font-weight:950;
    cursor:pointer;
  }

  .detailPanel {
    margin-top:22px;
    padding-top:22px;
    border-top:1px solid rgba(124,58,237,.1);
    display:grid;
    gap:18px;
  }

  .detailSection {
    padding:19px;
    border-radius:20px;
    background:#faf8fd;
  }

  .detailSection h3 {
    margin:7px 0 0;
    font-size:21px;
  }

  .reportGrid {
    margin-top:15px;
    display:grid;
    grid-template-columns:repeat(2,minmax(0,1fr));
    gap:10px;
  }

  .reportField {
    padding:14px;
    border-radius:15px;
    background:#fff;
    border:1px solid rgba(124,58,237,.08);
  }

  .reportField span {
    color:#6d28d9;
    font-size:10px;
    font-weight:950;
    text-transform:uppercase;
  }

  .reportField p {
    margin:7px 0 0;
    color:#4b4050;
    line-height:1.55;
    font-size:13px;
  }

  .alertBox {
    margin-top:14px;
    padding:14px;
    border-radius:14px;
    font-size:12px;
    font-weight:850;
  }

  .warningBox {
    background:#fff7ed;
    color:#9a3412;
  }

  .securityNote {
    margin:13px 0 0;
    color:#756b7b;
    font-size:11px;
    line-height:1.55;
  }

  .emptyState {
    padding:30px;
    border-radius:25px;
    background:#fff;
    border:1px solid rgba(124,58,237,.1);
  }

  .emptyState h3 {
    margin:0;
  }

  .emptyState p {
    margin:8px 0 0;
    color:#756b7b;
  }

  @media(max-width:850px) {
    .kpiGrid {
      grid-template-columns:repeat(2,minmax(0,1fr));
    }

    .lessonFacts,
    .financialGrid,
    .reportGrid {
      grid-template-columns:1fr 1fr;
    }
  }

  @media(max-width:620px) {
    .page {
      padding:20px 10px 70px;
    }

    .hero {
      padding:23px;
      border-radius:26px;
    }

    .hero h1 {
      font-size:43px;
    }

    .kpiGrid,
    .lessonFacts,
    .financialGrid,
    .reportGrid {
      grid-template-columns:1fr;
    }

    .lessonHeader,
    .searchRow {
      flex-direction:column;
      align-items:flex-start;
    }

    .heroActions {
      display:grid;
    }

    .primaryButton,
    .secondaryButton {
      width:100%;
    }
  }
`
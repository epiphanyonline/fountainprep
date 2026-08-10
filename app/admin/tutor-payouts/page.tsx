'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type Earning = {
  id: string
  tutor_id: string
  booking_id: string
  lesson_amount: number | null
  platform_fee: number | null
  tutor_amount: number | null
  status: string
  lesson_date: string | null
  created_at: string
  paid_at: string | null
  payout_reference: string | null
  notes: string | null
}

type Tutor = {
  id: string
  full_name: string

  payout_method: string | null
  payout_currency: string | null

  payout_account_name: string | null
  payout_bank_name: string | null
  payout_account_number: string | null

  paypal_email: string | null

  payout_details_completed: boolean | null
  payout_details_completed_at: string | null
}

type Booking = {
  id: string
  student_id: string
  subject_id: string
  lesson_date: string | null
  lesson_time: string | null
  status: string
  payment_status: string
}

type Student = {
  id: string
  full_name: string
}

type Subject = {
  id: string
  name: string
}

type TutorGroup = {
  tutor: Tutor
  earnings: Earning[]
  total: number
}

type Filter =
  | 'READY'
  | 'HELD'
  | 'PAID'
  | 'ALL'

export default function AdminTutorPayoutsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)

  const [savingTutorId, setSavingTutorId] =
    useState('')

  const [message, setMessage] =
    useState('Loading tutor payouts...')

  const [earnings, setEarnings] =
    useState<Earning[]>([])

  const [tutors, setTutors] =
    useState<Record<string, Tutor>>({})

  const [bookings, setBookings] =
    useState<Record<string, Booking>>({})

  const [students, setStudents] =
    useState<Record<string, Student>>({})

  const [subjects, setSubjects] =
    useState<Record<string, Subject>>({})

  const [filter, setFilter] =
    useState<Filter>('READY')

  const [expandedTutorId, setExpandedTutorId] =
    useState<string | null>(null)

  const [references, setReferences] =
    useState<Record<string, string>>({})

  const [payoutNotes, setPayoutNotes] =
    useState<Record<string, string>>({})

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data: profile } =
      await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

    if (
      !profile ||
      profile.role !== 'ADMIN'
    ) {
      router.push('/account')
      return
    }

    const {
      data: earningRows,
      error: earningError,
    } = await supabase
      .from('tutor_earnings')
      .select(`
        id,
        tutor_id,
        booking_id,
        lesson_amount,
        platform_fee,
        tutor_amount,
        status,
        lesson_date,
        created_at,
        paid_at,
        payout_reference,
        notes
      `)
      .order(
        'lesson_date',
        { ascending: false },
      )

    if (earningError) {
      setMessage(
        earningError.message,
      )
      setLoading(false)
      return
    }

    const cleanEarnings =
      (earningRows ?? []) as Earning[]

    setEarnings(
      cleanEarnings,
    )

    const tutorIds =
      Array.from(
        new Set(
          cleanEarnings.map(
            (earning) =>
              earning.tutor_id,
          ),
        ),
      )

    const bookingIds =
      Array.from(
        new Set(
          cleanEarnings.map(
            (earning) =>
              earning.booking_id,
          ),
        ),
      )

    if (tutorIds.length > 0) {
      const {
        data: tutorRows,
        error: tutorError,
      } = await supabase
        .from('tutor_profiles')
        .select(`
          id,
          full_name,
          payout_method,
          payout_currency,
          payout_account_name,
          payout_bank_name,
          payout_account_number,
          paypal_email,
          payout_details_completed,
          payout_details_completed_at
        `)
        .in(
          'id',
          tutorIds,
        )

      if (tutorError) {
        setMessage(
          tutorError.message,
        )
        setLoading(false)
        return
      }

      const tutorMap:
        Record<string, Tutor> = {}

      ;(
        (tutorRows ?? []) as Tutor[]
      ).forEach(
        (tutor) => {
          tutorMap[
            tutor.id
          ] = tutor
        },
      )

      setTutors(
        tutorMap,
      )
    }

    if (bookingIds.length > 0) {
      const {
        data: bookingRows,
        error: bookingError,
      } = await supabase
        .from('lesson_bookings')
        .select(`
          id,
          student_id,
          subject_id,
          lesson_date,
          lesson_time,
          status,
          payment_status
        `)
        .in(
          'id',
          bookingIds,
        )

      if (bookingError) {
        setMessage(
          bookingError.message,
        )
        setLoading(false)
        return
      }

      const cleanBookings =
        (bookingRows ?? []) as Booking[]

      const bookingMap:
        Record<string, Booking> = {}

      cleanBookings.forEach(
        (booking) => {
          bookingMap[
            booking.id
          ] = booking
        },
      )

      setBookings(
        bookingMap,
      )

      const studentIds =
        Array.from(
          new Set(
            cleanBookings.map(
              (booking) =>
                booking.student_id,
            ),
          ),
        )

      const subjectIds =
        Array.from(
          new Set(
            cleanBookings.map(
              (booking) =>
                booking.subject_id,
            ),
          ),
        )

      if (
        studentIds.length > 0
      ) {
        const {
          data: studentRows,
        } = await supabase
          .from(
            'student_profiles',
          )
          .select(
            'id, full_name',
          )
          .in(
            'id',
            studentIds,
          )

        const studentMap:
          Record<string, Student> =
          {}

        ;(
          (studentRows ??
            []) as Student[]
        ).forEach(
          (student) => {
            studentMap[
              student.id
            ] = student
          },
        )

        setStudents(
          studentMap,
        )
      }

      if (
        subjectIds.length > 0
      ) {
        const {
          data: subjectRows,
        } = await supabase
          .from('subjects')
          .select(
            'id, name',
          )
          .in(
            'id',
            subjectIds,
          )

        const subjectMap:
          Record<string, Subject> =
          {}

        ;(
          (subjectRows ??
            []) as Subject[]
        ).forEach(
          (subject) => {
            subjectMap[
              subject.id
            ] = subject
          },
        )

        setSubjects(
          subjectMap,
        )
      }
    }

    setMessage('')
    setLoading(false)
  }

  function isPayable(
    earning: Earning,
  ) {
    const booking =
      bookings[
        earning.booking_id
      ]

    if (!booking) {
      return false
    }

    return (
      earning.status ===
        'pending' &&
      booking.status ===
        'COMPLETED'
    )
  }

  const payableEarnings =
    useMemo(
      () =>
        earnings.filter(
          (earning) =>
            isPayable(
              earning,
            ),
        ),
      [earnings, bookings],
    )

  const heldEarnings =
    useMemo(
      () =>
        earnings.filter(
          (earning) =>
            earning.status ===
              'pending' &&
            !isPayable(
              earning,
            ),
        ),
      [earnings, bookings],
    )

  const paidEarnings =
    useMemo(
      () =>
        earnings.filter(
          (earning) =>
            earning.status ===
            'paid',
        ),
      [earnings],
    )

  const readyGroups =
    useMemo(
      () =>
        groupByTutor(
          payableEarnings,
          tutors,
        ),
      [
        payableEarnings,
        tutors,
      ],
    )

  const heldGroups =
    useMemo(
      () =>
        groupByTutor(
          heldEarnings,
          tutors,
        ),
      [
        heldEarnings,
        tutors,
      ],
    )

  const readyTotal =
    useMemo(
      () =>
        payableEarnings.reduce(
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
      [payableEarnings],
    )

  const heldTotal =
    useMemo(
      () =>
        heldEarnings.reduce(
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
      [heldEarnings],
    )

  const paidTotal =
    useMemo(
      () =>
        paidEarnings.reduce(
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
      [paidEarnings],
    )

  const tutorsMissingDetails =
    useMemo(
      () =>
        readyGroups.filter(
          (group) =>
            !group.tutor
              .payout_details_completed,
        ).length,
      [readyGroups],
    )

  async function markTutorPaid(
    group: TutorGroup,
  ) {
    if (
      !group.tutor
        .payout_details_completed
    ) {
      setMessage(
        `${group.tutor.full_name} has not completed payout details.`,
      )
      return
    }

    const reference =
      (
        references[
          group.tutor.id
        ] || ''
      ).trim()

    if (!reference) {
      setMessage(
        'Enter a payout reference before marking this payment as paid.',
      )
      return
    }

    const confirmPay =
      window.confirm(
        `Confirm that you have paid ${group.tutor.full_name} $${group.total.toFixed(
          2,
        )} for ${
          group.earnings.length
        } completed lesson${
          group.earnings.length ===
          1
            ? ''
            : 's'
        }?`,
      )

    if (!confirmPay) {
      return
    }

    setSavingTutorId(
      group.tutor.id,
    )

    setMessage(
      'Recording tutor payout...',
    )

    const ids =
      group.earnings.map(
        (earning) =>
          earning.id,
      )

    const note =
      (
        payoutNotes[
          group.tutor.id
        ] || ''
      ).trim()

    const { error } =
      await supabase
        .from('tutor_earnings')
        .update({
          status: 'paid',

          paid_at:
            new Date()
              .toISOString(),

          payout_reference:
            reference,

          notes:
            note || null,
        })
        .in(
          'id',
          ids,
        )

    if (error) {
      setMessage(
        error.message,
      )

      setSavingTutorId('')
      return
    }

    setReferences(
      (current) => ({
        ...current,
        [group.tutor.id]:
          '',
      }),
    )

    setPayoutNotes(
      (current) => ({
        ...current,
        [group.tutor.id]:
          '',
      }),
    )

    await loadData()

    setMessage(
      `${group.tutor.full_name}'s payout has been recorded as paid.`,
    )

    setSavingTutorId('')
  }

  const displayedGroups =
    filter === 'READY'
      ? readyGroups
      : filter === 'HELD'
        ? heldGroups
        : []

  if (loading) {
    return (
      <main className="page">
        <section className="hero">
          <p className="eyebrow">
            Admin Payouts
          </p>

          <h1>
            Loading payout
            centre...
          </h1>

          <p className="subtitle">
            {message}
          </p>
        </section>

        <style jsx>
          {styles}
        </style>
      </main>
    )
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">
          FountainPrep Finance
        </p>

        <h1>
          Tutor Payout Centre
        </h1>

        <p className="subtitle">
          Review tutor earnings,
          confirm completed lessons,
          verify payout details and
          maintain a clear payment
          audit trail.
        </p>

        <div className="kpiGrid">
          <Kpi
            label="Ready to Pay"
            value={`$${readyTotal.toFixed(
              2,
            )}`}
          />

          <Kpi
            label="Future / Held"
            value={`$${heldTotal.toFixed(
              2,
            )}`}
          />

          <Kpi
            label="Already Paid"
            value={`$${paidTotal.toFixed(
              2,
            )}`}
          />

          <Kpi
            label="Tutors Due"
            value={String(
              readyGroups.length,
            )}
          />

          <Kpi
            label="Missing Details"
            value={String(
              tutorsMissingDetails,
            )}
          />

          <Kpi
            label="Payable Lessons"
            value={String(
              payableEarnings.length,
            )}
          />
        </div>

        <div className="actions">
          <Link
            href="/admin"
            className="secondaryBtn"
          >
            Back to Admin
          </Link>

          <Link
            href="/admin/bookings"
            className="secondaryBtn"
          >
            Lesson Control
          </Link>
        </div>
      </section>

      {message ? (
        <div className="notice">
          {message}
        </div>
      ) : null}

      <section className="filterCard">
        {[
          [
            'READY',
            `Ready to Pay (${readyGroups.length})`,
          ],
          [
            'HELD',
            `Future / Held (${heldEarnings.length})`,
          ],
          [
            'PAID',
            `Paid (${paidEarnings.length})`,
          ],
          [
            'ALL',
            `All Earnings (${earnings.length})`,
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
                  ? 'filter active'
                  : 'filter'
              }
            >
              {label}
            </button>
          ),
        )}
      </section>

      {filter === 'READY' ||
      filter === 'HELD' ? (
        <section className="card">
          <div className="sectionHead">
            <p className="eyebrow">
              {filter === 'READY'
                ? 'Approved Lesson Earnings'
                : 'Not Yet Payable'}
            </p>

            <h2>
              {filter === 'READY'
                ? 'Tutor payments due'
                : 'Future and held earnings'}
            </h2>

            <p>
              {filter === 'READY'
                ? 'Only earnings linked to lessons marked COMPLETED are payable.'
                : 'These earnings remain locked until the associated lesson is completed.'}
            </p>
          </div>

          {displayedGroups.length ===
          0 ? (
            <Empty
              title={
                filter ===
                'READY'
                  ? 'No tutor payouts are due'
                  : 'No held earnings'
              }
              text={
                filter ===
                'READY'
                  ? 'Completed tutor earnings awaiting payment will appear here.'
                  : 'Future or incomplete lessons will appear here when an earning has already been created.'
              }
            />
          ) : (
            <div className="payoutGrid">
              {displayedGroups.map(
                (group) => {
                  const ready =
                    Boolean(
                      group.tutor
                        .payout_details_completed,
                    )

                  const expanded =
                    expandedTutorId ===
                    group.tutor.id

                  return (
                    <article
                      key={
                        group.tutor.id
                      }
                      className="payoutCard"
                    >
                      <div className="payoutHead">
                        <div>
                          <h3>
                            {
                              group
                                .tutor
                                .full_name
                            }
                          </h3>

                          <p>
                            {
                              group
                                .earnings
                                .length
                            }{' '}
                            lesson
                            {group
                              .earnings
                              .length ===
                            1
                              ? ''
                              : 's'}
                          </p>
                        </div>

                        <span
                          className={
                            ready
                              ? 'readyBadge'
                              : 'missingBadge'
                          }
                        >
                          {ready
                            ? 'Payout details ready'
                            : 'Payout details missing'}
                        </span>
                      </div>

                      <div className="amountBox">
                        <span>
                          Recorded
                          tutor
                          earnings
                        </span>

                        <strong>
                          $
                          {group.total.toFixed(
                            2,
                          )}
                        </strong>
                      </div>

                      <PayoutDestination
                        tutor={
                          group.tutor
                        }
                      />

                      <button
                        type="button"
                        className="detailsBtn"
                        onClick={() =>
                          setExpandedTutorId(
                            expanded
                              ? null
                              : group
                                  .tutor
                                  .id,
                          )
                        }
                      >
                        {expanded
                          ? 'Hide lesson breakdown'
                          : 'View lesson breakdown'}
                      </button>

                      {expanded ? (
                        <div className="lessonBreakdown">
                          {group.earnings.map(
                            (
                              earning,
                            ) => (
                              <EarningRow
                                key={
                                  earning.id
                                }
                                earning={
                                  earning
                                }
                                booking={
                                  bookings[
                                    earning
                                      .booking_id
                                  ]
                                }
                                students={
                                  students
                                }
                                subjects={
                                  subjects
                                }
                              />
                            ),
                          )}
                        </div>
                      ) : null}

                      {filter ===
                      'READY' ? (
                        <>
                          <div className="formGrid">
                            <label>
                              <span>
                                Payout
                                reference
                              </span>

                              <input
                                value={
                                  references[
                                    group
                                      .tutor
                                      .id
                                  ] || ''
                                }
                                onChange={(
                                  event,
                                ) =>
                                  setReferences(
                                    (
                                      current,
                                    ) => ({
                                      ...current,
                                      [group
                                        .tutor
                                        .id]:
                                        event
                                          .target
                                          .value,
                                    }),
                                  )
                                }
                                placeholder="Bank reference / transfer ID"
                              />
                            </label>

                            <label>
                              <span>
                                Admin
                                notes
                              </span>

                              <textarea
                                value={
                                  payoutNotes[
                                    group
                                      .tutor
                                      .id
                                  ] || ''
                                }
                                onChange={(
                                  event,
                                ) =>
                                  setPayoutNotes(
                                    (
                                      current,
                                    ) => ({
                                      ...current,
                                      [group
                                        .tutor
                                        .id]:
                                        event
                                          .target
                                          .value,
                                    }),
                                  )
                                }
                                placeholder="Optional payout note"
                              />
                            </label>
                          </div>

                          <button
                            type="button"
                            className="primaryBtn full"
                            disabled={
                              !ready ||
                              savingTutorId ===
                                group
                                  .tutor
                                  .id
                            }
                            onClick={() =>
                              markTutorPaid(
                                group,
                              )
                            }
                          >
                            {savingTutorId ===
                            group.tutor.id
                              ? 'Recording Payment...'
                              : ready
                                ? `Confirm $${group.total.toFixed(
                                    2,
                                  )} Paid`
                                : 'Payout Details Required'}
                          </button>
                        </>
                      ) : (
                        <div className="heldNotice">
                          Payment is
                          locked until
                          the associated
                          lesson is
                          completed.
                        </div>
                      )}
                    </article>
                  )
                },
              )}
            </div>
          )}
        </section>
      ) : null}

      {filter === 'PAID' ||
      filter === 'ALL' ? (
        <section className="card">
          <div className="sectionHead">
            <p className="eyebrow">
              Payout Audit Trail
            </p>

            <h2>
              {filter === 'PAID'
                ? 'Paid history'
                : 'All tutor earnings'}
            </h2>
          </div>

          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>
                    Tutor
                  </th>
                  <th>
                    Lesson
                  </th>
                  <th>
                    Tutor Amount
                  </th>
                  <th>
                    Status
                  </th>
                  <th>
                    Reference
                  </th>
                  <th>
                    Paid At
                  </th>
                </tr>
              </thead>

              <tbody>
                {(filter ===
                'PAID'
                  ? paidEarnings
                  : earnings
                ).map(
                  (earning) => {
                    const booking =
                      bookings[
                        earning
                          .booking_id
                      ]

                    const tutor =
                      tutors[
                        earning
                          .tutor_id
                      ]

                    return (
                      <tr
                        key={
                          earning.id
                        }
                      >
                        <td>
                          <strong>
                            {tutor
                              ?.full_name ||
                              'Tutor'}
                          </strong>
                        </td>

                        <td>
                          {formatDate(
                            earning.lesson_date ||
                              booking
                                ?.lesson_date ||
                              null,
                          )}
                        </td>

                        <td>
                          <strong>
                            $
                            {Number(
                              earning.tutor_amount ||
                                0,
                            ).toFixed(
                              2,
                            )}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={
                              earning.status ===
                              'paid'
                                ? 'status paid'
                                : isPayable(
                                      earning,
                                    )
                                  ? 'status ready'
                                  : 'status pending'
                            }
                          >
                            {earning.status ===
                            'paid'
                              ? 'Paid'
                              : isPayable(
                                    earning,
                                  )
                                ? 'Ready'
                                : 'Held'}
                          </span>
                        </td>

                        <td>
                          {earning.payout_reference ||
                            '-'}
                        </td>

                        <td>
                          {earning.paid_at
                            ? formatDateTime(
                                earning.paid_at,
                              )
                            : '-'}
                        </td>
                      </tr>
                    )
                  },
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="currencyNotice">
        <strong>
          Payout currency
        </strong>

        <p>
          Tutor earnings are currently
          recorded in the existing
          earning system as USD amounts.
          A tutor's payout currency
          shows their preferred receiving
          currency. FountainPrep should
          not automatically convert the
          amount until an exchange-rate
          process is explicitly added.
        </p>
      </section>

      <style jsx>
        {styles}
      </style>
    </main>
  )
}

function groupByTutor(
  earnings: Earning[],
  tutors: Record<string, Tutor>,
) {
  const grouped:
    Record<string, TutorGroup> =
    {}

  earnings.forEach(
    (earning) => {
      const tutor =
        tutors[
          earning.tutor_id
        ] || {
          id:
            earning.tutor_id,

          full_name:
            'Tutor',

          payout_method:
            null,

          payout_currency:
            null,

          payout_account_name:
            null,

          payout_bank_name:
            null,

          payout_account_number:
            null,

          paypal_email:
            null,

          payout_details_completed:
            false,

          payout_details_completed_at:
            null,
        }

      if (
        !grouped[
          earning.tutor_id
        ]
      ) {
        grouped[
          earning.tutor_id
        ] = {
          tutor,
          earnings: [],
          total: 0,
        }
      }

      grouped[
        earning.tutor_id
      ].earnings.push(
        earning,
      )

      grouped[
        earning.tutor_id
      ].total +=
        Number(
          earning.tutor_amount ||
            0,
        )
    },
  )

  return Object.values(
    grouped,
  ).sort(
    (a, b) =>
      b.total - a.total,
  )
}

function PayoutDestination({
  tutor,
}: {
  tutor: Tutor
}) {
  if (
    !tutor.payout_details_completed
  ) {
    return (
      <div className="destination missingDestination">
        <strong>
          Payout destination
          missing
        </strong>

        <p>
          This tutor must complete
          payout details before
          payment can be recorded.
        </p>
      </div>
    )
  }

  if (
    tutor.payout_method ===
    'PAYPAL'
  ) {
    return (
      <div className="destination">
        <span>
          PayPal
        </span>

        <strong>
          {tutor.paypal_email ||
            'Email missing'}
        </strong>

        <small>
          Preferred currency:{' '}
          {tutor.payout_currency ||
            'Not specified'}
        </small>
      </div>
    )
  }

  return (
    <div className="destination">
      <div className="destinationGrid">
        <Info
          label="Method"
          value={
            tutor.payout_method ||
            'BANK'
          }
        />

        <Info
          label="Payout Currency"
          value={
            tutor.payout_currency ||
            'Not specified'
          }
        />

        <Info
          label="Account Name"
          value={
            tutor.payout_account_name ||
            'Not provided'
          }
        />

        <Info
          label="Bank"
          value={
            tutor.payout_bank_name ||
            'Not provided'
          }
        />

        <Info
          label="Account Number"
          value={
            tutor.payout_account_number ||
            'Not provided'
          }
        />
      </div>
    </div>
  )
}

function EarningRow({
  earning,
  booking,
  students,
  subjects,
}: {
  earning: Earning
  booking?: Booking
  students:
    Record<string, Student>
  subjects:
    Record<string, Subject>
}) {
  const student =
    booking
      ? students[
          booking.student_id
        ]
      : undefined

  const subject =
    booking
      ? subjects[
          booking.subject_id
        ]
      : undefined

  return (
    <div className="earningRow">
      <div>
        <strong>
          {subject?.name ||
            'Lesson'}
        </strong>

        <span>
          {student?.full_name ||
            'Learner'}
        </span>
      </div>

      <div>
        <strong>
          {formatDate(
            earning.lesson_date ||
              booking?.lesson_date ||
              null,
          )}
        </strong>

        <span>
          {booking?.status ||
            'Unknown status'}
        </span>
      </div>

      <strong>
        $
        {Number(
          earning.tutor_amount ||
            0,
        ).toFixed(2)}
      </strong>
    </div>
  )
}

function Info({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="info">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
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
    <div className="kpi">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
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
    <div className="empty">
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
  dateString:
    string | null,
) {
  if (!dateString) {
    return '-'
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
      dateString,
    ),
  )
}

function formatDateTime(
  dateString: string,
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
    new Date(
      dateString,
    ),
  )
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
  .card,
  .notice,
  .filterCard,
  .currencyNotice {
    width:min(1220px,100%);
    margin-left:auto;
    margin-right:auto;
  }

  .hero {
    padding:42px;
    border-radius:38px;

    background:
      radial-gradient(circle at top right,rgba(124,58,237,.18),transparent 34%),
      linear-gradient(135deg,#fff,#f7f1ff);

    border:1px solid rgba(124,58,237,.13);

    box-shadow:
      0 30px 90px
      rgba(71,43,117,.1);
  }

  .eyebrow {
    margin:0;
    color:#6d28d9;
    font-size:12px;
    font-weight:950;
    letter-spacing:.08em;
    text-transform:uppercase;
  }

  h1 {
    margin:14px 0 0;

    font-size:
      clamp(42px,6vw,72px);

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

    grid-template-columns:
      repeat(3,minmax(0,1fr));

    gap:12px;
  }

  .kpi {
    padding:18px;
    border-radius:20px;

    background:#fff;

    border:
      1px solid
      rgba(124,58,237,.1);
  }

  .kpi span {
    display:block;

    color:#7b7182;

    font-size:11px;
    font-weight:850;
  }

  .kpi strong {
    display:block;

    margin-top:7px;

    font-size:29px;
    letter-spacing:-.04em;
  }

  .actions {
    margin-top:25px;

    display:flex;
    flex-wrap:wrap;
    gap:10px;
  }

  .secondaryBtn,
  .primaryBtn,
  .detailsBtn {
    min-height:46px;

    display:inline-flex;
    align-items:center;
    justify-content:center;

    padding:0 16px;

    border-radius:14px;

    font-family:inherit;
    font-weight:950;

    cursor:pointer;
  }

  .secondaryBtn {
    text-decoration:none;

    background:#fff;
    color:#351e55;

    border:
      1px solid
      rgba(124,58,237,.14);
  }

  .primaryBtn {
    border:0;
    color:#fff;

    background:
      linear-gradient(
        135deg,
        #7c3aed,
        #6d28d9
      );
  }

  .primaryBtn:disabled {
    opacity:.5;
    cursor:not-allowed;
  }

  .full {
    width:100%;
    margin-top:15px;
  }

  .notice {
    margin-top:18px;
    padding:14px 17px;

    border-radius:16px;

    background:#fff7ed;
    color:#9a3412;

    border:
      1px solid #fed7aa;

    font-weight:850;
  }

  .filterCard {
    margin-top:20px;
    padding:14px;

    display:flex;
    flex-wrap:wrap;
    gap:8px;

    border-radius:22px;

    background:#fff;

    border:
      1px solid
      rgba(124,58,237,.1);
  }

  .filter {
    min-height:40px;
    padding:0 14px;

    border-radius:999px;

    background:#fff;
    color:#432566;

    border:
      1px solid
      rgba(124,58,237,.14);

    font-weight:900;
    cursor:pointer;
  }

  .filter.active {
    color:#fff;
    background:#6d28d9;
  }

  .card {
    margin-top:22px;
    padding:30px;

    border-radius:31px;

    background:#fff;

    border:
      1px solid
      rgba(124,58,237,.1);

    box-shadow:
      0 22px 65px
      rgba(71,43,117,.07);
  }

  .sectionHead {
    margin-bottom:22px;
  }

  .sectionHead h2 {
    margin:8px 0 0;

    font-size:
      clamp(28px,4vw,42px);

    letter-spacing:-.045em;
  }

  .sectionHead > p:last-child {
    color:#756b7b;
    line-height:1.6;
  }

  .payoutGrid {
    display:grid;

    grid-template-columns:
      repeat(
        auto-fit,
        minmax(330px,1fr)
      );

    gap:15px;
  }

  .payoutCard {
    padding:22px;

    border-radius:26px;

    background:#faf7ff;

    border:
      1px solid
      rgba(124,58,237,.1);
  }

  .payoutHead {
    display:flex;
    align-items:flex-start;
    justify-content:space-between;

    gap:12px;
  }

  .payoutHead h3 {
    margin:0;

    font-size:22px;
    letter-spacing:-.035em;
  }

  .payoutHead p {
    margin:6px 0 0;
    color:#756b7b;
  }

  .readyBadge,
  .missingBadge {
    padding:6px 9px;
    border-radius:999px;

    font-size:9px;
    font-weight:950;
  }

  .readyBadge {
    color:#166534;
    background:#dcfce7;
  }

  .missingBadge {
    color:#9a3412;
    background:#ffedd5;
  }

  .amountBox {
    margin-top:17px;
    padding:18px;

    border-radius:19px;

    background:#fff;

    border:
      1px solid
      rgba(124,58,237,.1);
  }

  .amountBox span {
    display:block;

    color:#7b7182;

    font-size:11px;
    font-weight:850;
  }

  .amountBox strong {
    display:block;
    margin-top:6px;

    font-size:37px;
    letter-spacing:-.05em;
  }

  .destination {
    margin-top:13px;
    padding:16px;

    border-radius:18px;

    background:#fff;

    border:
      1px solid
      rgba(124,58,237,.1);
  }

  .missingDestination {
    color:#9a3412;
    background:#fff7ed;
  }

  .destination p {
    margin:6px 0 0;

    line-height:1.5;
    font-size:12px;
  }

  .destinationGrid {
    display:grid;

    grid-template-columns:
      repeat(2,minmax(0,1fr));

    gap:9px;
  }

  .info span {
    display:block;

    color:#82778a;

    font-size:9px;
    font-weight:900;
    text-transform:uppercase;
  }

  .info strong {
    display:block;
    margin-top:4px;

    overflow-wrap:anywhere;

    font-size:12px;
  }

  .detailsBtn {
    width:100%;
    margin-top:13px;

    background:#fff;
    color:#432566;

    border:
      1px solid
      rgba(124,58,237,.15);
  }

  .lessonBreakdown {
    margin-top:12px;

    display:grid;
    gap:7px;
  }

  .earningRow {
    padding:11px;

    display:grid;

    grid-template-columns:
      1.4fr 1fr auto;

    gap:10px;
    align-items:center;

    border-radius:13px;

    background:#fff;
  }

  .earningRow span {
    display:block;
    margin-top:3px;

    color:#82778a;
    font-size:10px;
  }

  .formGrid {
    display:grid;

    grid-template-columns:1fr;

    gap:10px;

    margin-top:14px;
  }

  .formGrid label span {
    display:block;

    margin-bottom:5px;

    color:#665a70;

    font-size:10px;
    font-weight:900;
  }

  .formGrid input,
  .formGrid textarea {
    width:100%;
    box-sizing:border-box;

    padding:12px;

    border-radius:12px;

    border:
      1px solid
      rgba(124,58,237,.15);

    background:#fff;
    font:inherit;
  }

  .formGrid textarea {
    min-height:75px;
    resize:vertical;
  }

  .heldNotice {
    margin-top:14px;
    padding:12px;

    border-radius:13px;

    color:#9a3412;
    background:#fff7ed;

    font-size:11px;
    font-weight:850;
  }

  .tableWrap {
    overflow-x:auto;
  }

  table {
    width:100%;
    min-width:840px;

    border-collapse:collapse;
  }

  th {
    padding:13px;

    text-align:left;

    color:#7b7182;

    font-size:11px;
    font-weight:950;

    border-bottom:
      1px solid
      rgba(124,58,237,.12);
  }

  td {
    padding:14px 13px;

    border-bottom:
      1px solid
      rgba(124,58,237,.08);

    font-size:12px;
  }

  .status {
    padding:6px 9px;

    display:inline-flex;

    border-radius:999px;

    font-size:10px;
    font-weight:950;
  }

  .status.paid {
    color:#166534;
    background:#dcfce7;
  }

  .status.ready {
    color:#1d4ed8;
    background:#dbeafe;
  }

  .status.pending {
    color:#9a3412;
    background:#ffedd5;
  }

  .empty {
    padding:24px;

    border-radius:20px;

    background:#faf7ff;
  }

  .empty h3 {
    margin:0;
  }

  .empty p {
    margin:8px 0 0;

    color:#756b7b;
    line-height:1.6;
  }

  .currencyNotice {
    margin-top:22px;

    padding:18px;

    border-radius:20px;

    background:#f3f0ff;
    color:#49355d;

    border:
      1px solid
      rgba(124,58,237,.1);
  }

  .currencyNotice p {
    margin:7px 0 0;

    max-width:850px;

    font-size:12px;
    line-height:1.6;
  }

  @media(max-width:800px) {
    .kpiGrid {
      grid-template-columns:
        repeat(2,minmax(0,1fr));
    }

    .payoutGrid {
      grid-template-columns:1fr;
    }
  }

  @media(max-width:620px) {
    .page {
      padding:20px 10px 70px;
    }

    .hero,
    .card {
      padding:22px;
      border-radius:25px;
    }

    h1 {
      font-size:43px;
    }

    .kpiGrid,
    .destinationGrid {
      grid-template-columns:1fr;
    }

    .payoutHead {
      flex-direction:column;
    }

    .earningRow {
      grid-template-columns:1fr;
    }

    .actions {
      display:grid;
    }

    .secondaryBtn {
      width:100%;
      box-sizing:border-box;
    }
  }
`
'use client'

import Link from 'next/link'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type AccountType =
  | 'PARENT'
  | 'ADULT_LEARNER'
  | string

type FilterType =
  | 'ALL'
  | 'PARENT'
  | 'ADULT_LEARNER'
  | 'INCOMPLETE'

type EmailTemplate =
  | 'GENERAL'
  | 'COMPLETE_PARENT'
  | 'COMPLETE_ADULT'

type NoticeType =
  | 'success'
  | 'error'
  | 'info'
  | ''

type UserProfile = {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  country: string | null
  timezone: string | null
  account_type: AccountType | null
  created_at: string | null
  role: string
}

type ParentProfile = {
  id: string
  user_id: string
  full_name: string
  phone: string | null
  country_of_residence: string | null
  timezone: string | null
  preferred_currency: string | null
  account_type: string | null
  created_at: string | null
}

type StudentProfile = {
  id: string
  parent_id: string
  full_name: string
  is_self_learner: boolean | null
}

type Booking = {
  id: string
  parent_id: string
  payment_status: string
  status: string
  amount_gbp: number | null
}

type CommunicationDelivery = {
  id: string
  user_id: string | null
  recipient_email: string
  delivery_status: string
  sent_at: string | null
  created_at: string
}

type AccountRow = {
  user: UserProfile
  parentProfile: ParentProfile | null
  students: StudentProfile[]
  bookings: Booking[]
  paidBookings: Booking[]
  revenue: number
  accountType: 'PARENT' | 'ADULT_LEARNER'
  incomplete: boolean
  emailCount: number
  lastEmailAt: string | null
  lastEmailStatus: string | null
}

export default function AdminParentsPage() {
  const router = useRouter()

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  const [notice, setNotice] =
    useState('')

  const [noticeType, setNoticeType] =
    useState<NoticeType>('')

  const [users, setUsers] =
    useState<UserProfile[]>([])

  const [parents, setParents] =
    useState<ParentProfile[]>([])

  const [students, setStudents] =
    useState<StudentProfile[]>([])

  const [bookings, setBookings] =
    useState<Booking[]>([])

  const [deliveries, setDeliveries] =
    useState<CommunicationDelivery[]>([])

  const [search, setSearch] =
    useState('')

  const [filter, setFilter] =
    useState<FilterType>('ALL')

  const [selectedIds, setSelectedIds] =
    useState<string[]>([])

  const [showComposer, setShowComposer] =
    useState(false)

  const [sending, setSending] =
    useState(false)

  const [template, setTemplate] =
    useState<EmailTemplate>('GENERAL')

  const [emailSubject, setEmailSubject] =
    useState('')

  const [emailHeading, setEmailHeading] =
    useState('')

  const [emailMessage, setEmailMessage] =
    useState('')

  const [buttonText, setButtonText] =
    useState('')

  const [buttonUrl, setButtonUrl] =
    useState('')

  function showNotice(
    message: string,
    type: NoticeType
  ) {
    setNotice(message)
    setNoticeType(type)
  }

  const loadAccounts = useCallback(
    async (
      options?: {
        silent?: boolean
      }
    ) => {
      const silent =
        options?.silent ?? false

      if (silent) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        const {
          data: adminProfile,
          error: adminError,
        } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()

        if (adminError) {
          throw adminError
        }

        if (
          !adminProfile ||
          adminProfile.role !== 'ADMIN'
        ) {
          router.push('/account')
          return
        }

        const [
          userResult,
          parentResult,
          studentResult,
          bookingResult,
          deliveryResult,
        ] = await Promise.all([
          supabase
            .from('user_profiles')
            .select(`
              id,
              full_name,
              email,
              phone,
              country,
              timezone,
              account_type,
              created_at,
              role
            `)
            .eq('role', 'PARENT')
            .order(
              'created_at',
              {
                ascending: false,
              }
            ),

          supabase
            .from('parent_profiles')
            .select(`
              id,
              user_id,
              full_name,
              phone,
              country_of_residence,
              timezone,
              preferred_currency,
              account_type,
              created_at
            `),

          supabase
            .from('student_profiles')
            .select(`
              id,
              parent_id,
              full_name,
              is_self_learner
            `),

          supabase
            .from('lesson_bookings')
            .select(`
              id,
              parent_id,
              payment_status,
              status,
              amount_gbp
            `),

          supabase
            .from(
              'customer_communication_deliveries'
            )
            .select(`
              id,
              user_id,
              recipient_email,
              delivery_status,
              sent_at,
              created_at
            `)
            .order(
              'created_at',
              {
                ascending: false,
              }
            ),
        ])

        const firstError =
          userResult.error ||
          parentResult.error ||
          studentResult.error ||
          bookingResult.error ||
          deliveryResult.error

        if (firstError) {
          throw firstError
        }

        setUsers(
          (userResult.data ??
            []) as UserProfile[]
        )

        setParents(
          (parentResult.data ??
            []) as ParentProfile[]
        )

        setStudents(
          (studentResult.data ??
            []) as StudentProfile[]
        )

        setBookings(
          (bookingResult.data ??
            []) as Booking[]
        )

        setDeliveries(
          (deliveryResult.data ??
            []) as CommunicationDelivery[]
        )
      } catch (error) {
        console.error(error)

        showNotice(
          error instanceof Error
            ? error.message
            : 'Unable to load customer accounts.',
          'error'
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [router]
  )

  useEffect(() => {
    loadAccounts()
  }, [loadAccounts])

  const accountRows =
    useMemo<AccountRow[]>(() => {
      const parentMap =
        new Map(
          parents.map(
            (parent) => [
              parent.user_id,
              parent,
            ]
          )
        )

      return users.map((user) => {
        const parentProfile =
          parentMap.get(user.id) ??
          null

        const accountType =
          user.account_type ===
            'ADULT_LEARNER' ||
          parentProfile?.account_type ===
            'ADULT_LEARNER'
            ? 'ADULT_LEARNER'
            : 'PARENT'

        const accountStudents =
          parentProfile
            ? students.filter(
                (student) =>
                  student.parent_id ===
                  parentProfile.id
              )
            : []

        const accountBookings =
          bookings.filter(
            (booking) =>
              booking.parent_id ===
              user.id
          )

        const paidBookings =
          accountBookings.filter(
            (booking) => {
              const paymentStatus =
                String(
                  booking.payment_status
                ).toUpperCase()

              const bookingStatus =
                String(
                  booking.status
                ).toUpperCase()

              return (
                paymentStatus ===
                  'PAID' ||
                bookingStatus ===
                  'CONFIRMED' ||
                bookingStatus ===
                  'COMPLETED'
              )
            }
          )

        const revenue =
          paidBookings.reduce(
            (
              sum,
              booking
            ) =>
              sum +
              Number(
                booking.amount_gbp ||
                  0
              ),
            0
          )

        const hasSelfLearner =
          accountStudents.some(
            (student) =>
              student.is_self_learner ===
              true
          )

        const incomplete =
          accountType ===
          'ADULT_LEARNER'
            ? !parentProfile ||
              !hasSelfLearner
            : !parentProfile ||
              accountStudents.length ===
                0

        const accountEmail =
          String(
            user.email || ''
          )
            .trim()
            .toLowerCase()

        const accountDeliveries =
          deliveries.filter(
            (delivery) => {
              if (
                delivery.user_id
              ) {
                return (
                  delivery.user_id ===
                  user.id
                )
              }

              return (
                String(
                  delivery.recipient_email ||
                    ''
                )
                  .trim()
                  .toLowerCase() ===
                accountEmail
              )
            }
          )

        const sentDeliveries =
          accountDeliveries.filter(
            (delivery) =>
              String(
                delivery.delivery_status
              ).toUpperCase() ===
              'SENT'
          )

        const latestDelivery =
          accountDeliveries[0] ??
          null

        return {
          user,
          parentProfile,
          students:
            accountStudents,
          bookings:
            accountBookings,
          paidBookings,
          revenue,
          accountType,
          incomplete,

          emailCount:
            sentDeliveries.length,

          lastEmailAt:
            latestDelivery
              ?.sent_at ||
            latestDelivery
              ?.created_at ||
            null,

          lastEmailStatus:
            latestDelivery
              ?.delivery_status ||
            null,
        }
      })
    }, [
      users,
      parents,
      students,
      bookings,
      deliveries,
    ])

  const filteredRows =
    useMemo(() => {
      const q =
        search
          .trim()
          .toLowerCase()

      return accountRows.filter(
        (row) => {
          if (
            filter ===
              'PARENT' &&
            row.accountType !==
              'PARENT'
          ) {
            return false
          }

          if (
            filter ===
              'ADULT_LEARNER' &&
            row.accountType !==
              'ADULT_LEARNER'
          ) {
            return false
          }

          if (
            filter ===
              'INCOMPLETE' &&
            !row.incomplete
          ) {
            return false
          }

          if (!q) return true

          const values = [
            row.user.full_name,
            row.user.email,
            row.user.phone,
            row.user.country,
            row.parentProfile
              ?.country_of_residence,
            row.parentProfile
              ?.preferred_currency,
            row.accountType,
          ]

          return values
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(q)
            )
        }
      )
    }, [
      accountRows,
      search,
      filter,
    ])

  const parentCount =
    accountRows.filter(
      (row) =>
        row.accountType ===
        'PARENT'
    ).length

  const adultLearnerCount =
    accountRows.filter(
      (row) =>
        row.accountType ===
        'ADULT_LEARNER'
    ).length

  const incompleteCount =
    accountRows.filter(
      (row) =>
        row.incomplete
    ).length

  const totalRevenue =
    accountRows.reduce(
      (sum, row) =>
        sum + row.revenue,
      0
    )

  const totalEmailsSent =
    deliveries.filter(
      (delivery) =>
        String(
          delivery.delivery_status
        ).toUpperCase() ===
        'SENT'
    ).length

  const selectedRows =
    accountRows.filter(
      (row) =>
        selectedIds.includes(
          row.user.id
        )
    )

  const visibleSelectableIds =
    filteredRows
      .filter((row) =>
        Boolean(
          row.user.email?.trim()
        )
      )
      .map(
        (row) =>
          row.user.id
      )

  const allVisibleSelected =
    visibleSelectableIds.length >
      0 &&
    visibleSelectableIds.every(
      (id) =>
        selectedIds.includes(id)
    )

  function toggleAccount(
    userId: string
  ) {
    setSelectedIds(
      (current) =>
        current.includes(userId)
          ? current.filter(
              (id) =>
                id !== userId
            )
          : [
              ...current,
              userId,
            ]
    )
  }

  function toggleVisibleAccounts() {
    if (
      allVisibleSelected
    ) {
      setSelectedIds(
        (current) =>
          current.filter(
            (id) =>
              !visibleSelectableIds.includes(
                id
              )
          )
      )

      return
    }

    setSelectedIds(
      (current) =>
        Array.from(
          new Set([
            ...current,
            ...visibleSelectableIds,
          ])
        )
    )
  }

  function resetComposer() {
    setTemplate('GENERAL')
    setEmailSubject('')
    setEmailHeading('')
    setEmailMessage('')
    setButtonText('')
    setButtonUrl('')
  }

  function openSingleEmail(
    userId: string
  ) {
    setSelectedIds([userId])
    resetComposer()
    setShowComposer(true)
  }

  function applyTemplate(
    value: EmailTemplate
  ) {
    setTemplate(value)

    if (
      value === 'GENERAL'
    ) {
      setEmailSubject('')
      setEmailHeading('')
      setEmailMessage('')
      setButtonText('')
      setButtonUrl('')
      return
    }

    if (
      value ===
      'COMPLETE_PARENT'
    ) {
      setEmailSubject(
        'Complete your Fountain Prep setup'
      )

      setEmailHeading(
        'Your Fountain Prep account is ready'
      )

      setEmailMessage(
        `You have already taken the first step by creating your Fountain Prep account.

Add your child to continue your learning journey, explore subjects and choose a tutor and lesson time that works for your family.

If you need any help completing your setup, simply reply to this email and our team will be happy to assist.`
      )

      setButtonText(
        'Complete My Setup'
      )

      setButtonUrl(
        'https://www.fountainprep.com/parent/students?mode=booking'
      )

      return
    }

    setEmailSubject(
      'Continue your Fountain Prep learning journey'
    )

    setEmailHeading(
      'Your learning journey is ready'
    )

    setEmailMessage(
      `You have already created your Fountain Prep Adult Learner account.

Your next step is to continue your learning journey, explore available language tutors and choose a lesson time that works for you.

If you need help getting started, simply reply to this email and our team will be happy to assist.`
    )

    setButtonText(
      'Continue Learning'
    )

    setButtonUrl(
      'https://www.fountainprep.com/start?type=language'
    )
  }

  async function sendCommunication() {
    if (
      selectedRows.length === 0
    ) {
      showNotice(
        'Select at least one account.',
        'error'
      )
      return
    }

    if (
      !emailSubject.trim()
    ) {
      showNotice(
        'Enter an email subject.',
        'error'
      )
      return
    }

    if (
      !emailHeading.trim()
    ) {
      showNotice(
        'Enter an email heading.',
        'error'
      )
      return
    }

    if (
      !emailMessage.trim()
    ) {
      showNotice(
        'Enter an email message.',
        'error'
      )
      return
    }

    const recipients =
      selectedRows
        .filter(
          (row) =>
            Boolean(
              row.user.email?.trim()
            )
        )
        .map((row) => ({
          userId:
            row.user.id,

          parentProfileId:
            row.parentProfile
              ?.id,

          name:
            row.user
              .full_name ||
            row.parentProfile
              ?.full_name ||
            'Fountain Prep Learner',

          email:
            row.user.email,

          accountType:
            row.accountType,
        }))

    if (
      recipients.length === 0
    ) {
      showNotice(
        'The selected accounts do not have email addresses.',
        'error'
      )
      return
    }

    const confirmed =
      window.confirm(
        `Send this communication to ${recipients.length} account${
          recipients.length === 1
            ? ''
            : 's'
        }?`
      )

    if (!confirmed) return

    try {
      setSending(true)

      const {
        data: {
          session,
        },
      } =
        await supabase.auth.getSession()

      if (
        !session
          ?.access_token
      ) {
        throw new Error(
          'Your admin session has expired. Please log in again.'
        )
      }

      const uniqueTypes =
        new Set(
          selectedRows.map(
            (row) =>
              row.accountType
          )
        )

      const audienceType =
        uniqueTypes.size === 1
          ? Array.from(
              uniqueTypes
            )[0]
          : 'MIXED'

      const response =
        await fetch(
          '/api/admin/customer-general-communication',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${session.access_token}`,
            },

            body:
              JSON.stringify({
                subject:
                  emailSubject.trim(),

                heading:
                  emailHeading.trim(),

                message:
                  emailMessage.trim(),

                buttonText:
                  buttonText.trim() ||
                  null,

                buttonUrl:
                  buttonUrl.trim() ||
                  null,

                audienceType,

                recipients,
              }),
          }
        )

      const responseText =
        await response.text()

      let result: {
        error?: string
        message?: string
        sent?: number
        failed?: number
      } = {}

      try {
        result =
          responseText
            ? JSON.parse(
                responseText
              )
            : {}
      } catch {
        result = {}
      }

      if (!response.ok) {
        throw new Error(
          result.error ||
            `Unable to send communication. Server returned ${response.status}.`
        )
      }

      const sent =
        result.sent ??
        recipients.length

      const failed =
        result.failed ?? 0

      showNotice(
        failed === 0
          ? `✓ Email sent successfully. ${sent} recipient${
              sent === 1
                ? ''
                : 's'
            } · 0 failed.`
          : `Communication completed. ${sent} sent · ${failed} failed.`,
        failed === 0
          ? 'success'
          : 'info'
      )

      setShowComposer(false)
      setSelectedIds([])
      resetComposer()

      await loadAccounts({
        silent: true,
      })
    } catch (error) {
      console.error(error)

      showNotice(
        error instanceof Error
          ? error.message
          : 'Unable to send communication.',
        'error'
      )
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <main
        style={styles.page}
      >
        <div
          style={
            styles.loadingCard
          }
        >
          Loading parents and adult
          learners...
        </div>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div
          style={
            styles.heroTop
          }
        >
          <div>
            <p
              style={
                styles.eyebrow
              }
            >
              Customer Accounts
            </p>

            <h1
              style={
                styles.title
              }
            >
              Parents & Adult
              Learners
            </h1>

            <p
              style={
                styles.subtitle
              }
            >
              See who has joined
              Fountain Prep, identify
              incomplete registration,
              monitor learning and
              booking activity, and
              contact customers directly
              from one place.
            </p>
          </div>

          <button
            type="button"
            style={
              styles.refreshButton
            }
            disabled={refreshing}
            onClick={() =>
              loadAccounts({
                silent: true,
              })
            }
          >
            {refreshing
              ? 'Refreshing...'
              : 'Refresh'}
          </button>
        </div>

        <div
          style={
            styles.kpiGrid
          }
        >
          <Kpi
            label="All Accounts"
            value={String(
              accountRows.length
            )}
          />

          <Kpi
            label="Parents"
            value={String(
              parentCount
            )}
          />

          <Kpi
            label="Adult Learners"
            value={String(
              adultLearnerCount
            )}
          />

          <Kpi
            label="Incomplete Setup"
            value={String(
              incompleteCount
            )}
          />

          <Kpi
            label="Emails Sent"
            value={String(
              totalEmailsSent
            )}
          />

          <Kpi
            label="Revenue"
            value={`£${totalRevenue.toFixed(
              2
            )}`}
          />
        </div>

        <div
          style={
            styles.actions
          }
        >
          <Link
            href="/admin"
            style={
              styles.secondaryLink
            }
          >
            Back to Admin
          </Link>

          <Link
            href="/admin/students"
            style={
              styles.primaryLink
            }
          >
            Learners
          </Link>

          <Link
            href="/admin/bookings"
            style={
              styles.secondaryLink
            }
          >
            Bookings
          </Link>

          <Link
            href="/admin/communications"
            style={
              styles.secondaryLink
            }
          >
            Communications
          </Link>
        </div>
      </section>

      {notice ? (
        <section
          style={{
            ...styles.notice,

            ...(noticeType ===
            'success'
              ? styles.noticeSuccess
              : noticeType ===
                  'error'
                ? styles.noticeError
                : styles.noticeInfo),
          }}
        >
          <div>
            <strong>
              {noticeType ===
              'success'
                ? 'Success'
                : noticeType ===
                    'error'
                  ? 'Action needed'
                  : 'Update'}
            </strong>

            <p>
              {notice}
            </p>
          </div>

          <button
            type="button"
            style={
              styles.noticeClose
            }
            onClick={() => {
              setNotice('')
              setNoticeType('')
            }}
          >
            ×
          </button>
        </section>
      ) : null}

      <section
        style={
          styles.cardWide
        }
      >
        <div
          style={
            styles.toolbar
          }
        >
          <div>
            <p
              style={
                styles.sectionEyebrow
              }
            >
              Account Directory
            </p>

            <h2
              style={
                styles.sectionTitle
              }
            >
              Customer relationships
            </h2>

            <p
              style={
                styles.sectionSubtitle
              }
            >
              Filter accounts, identify
              incomplete registration,
              see communication history
              and send follow-up emails.
            </p>
          </div>

          <input
            value={search}
            onChange={
              (event) =>
                setSearch(
                  event.target
                    .value
                )
            }
            placeholder="Search name, email, phone, country..."
            style={
              styles.searchInput
            }
          />
        </div>

        <div
          style={
            styles.filterRow
          }
        >
          <FilterButton
            active={
              filter === 'ALL'
            }
            onClick={() =>
              setFilter('ALL')
            }
          >
            All (
            {accountRows.length})
          </FilterButton>

          <FilterButton
            active={
              filter === 'PARENT'
            }
            onClick={() =>
              setFilter('PARENT')
            }
          >
            Parents (
            {parentCount})
          </FilterButton>

          <FilterButton
            active={
              filter ===
              'ADULT_LEARNER'
            }
            onClick={() =>
              setFilter(
                'ADULT_LEARNER'
              )
            }
          >
            Adult Learners (
            {adultLearnerCount})
          </FilterButton>

          <FilterButton
            active={
              filter ===
              'INCOMPLETE'
            }
            onClick={() =>
              setFilter(
                'INCOMPLETE'
              )
            }
          >
            Incomplete (
            {incompleteCount})
          </FilterButton>
        </div>

        <div
          style={
            styles.selectionBar
          }
        >
          <label
            style={
              styles.selectAllLabel
            }
          >
            <input
              type="checkbox"
              checked={
                allVisibleSelected
              }
              onChange={
                toggleVisibleAccounts
              }
            />

            Select visible
          </label>

          <span
            style={
              styles.selectedCount
            }
          >
            {selectedIds.length}{' '}
            selected
          </span>

          {selectedIds.length >
          0 ? (
            <button
              type="button"
              style={
                styles.emailSelectedButton
              }
              onClick={() => {
                resetComposer()
                setShowComposer(
                  true
                )
              }}
            >
              Email Selected
            </button>
          ) : null}
        </div>

        {filteredRows.length ===
        0 ? (
          <div
            style={
              styles.emptyState
            }
          >
            <h3
              style={
                styles.emptyTitle
              }
            >
              No accounts found
            </h3>

            <p
              style={
                styles.emptyText
              }
            >
              Try changing your
              search or account
              filter.
            </p>
          </div>
        ) : (
          <div
            style={
              styles.parentGrid
            }
          >
            {filteredRows.map(
              (row) => {
                const {
                  user,
                  parentProfile,
                } = row

                return (
                  <article
                    key={
                      user.id
                    }
                    style={
                      styles.parentCard
                    }
                  >
                    <div
                      style={
                        styles.cardSelection
                      }
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(
                          user.id
                        )}
                        disabled={
                          !user.email
                        }
                        onChange={() =>
                          toggleAccount(
                            user.id
                          )
                        }
                      />
                    </div>

                    <div
                      style={
                        styles.parentTop
                      }
                    >
                      <div>
                        <div
                          style={
                            styles.badgeRow
                          }
                        >
                          <span
                            style={
                              row.accountType ===
                              'ADULT_LEARNER'
                                ? styles.adultBadge
                                : styles.parentBadge
                            }
                          >
                            {row.accountType ===
                            'ADULT_LEARNER'
                              ? 'Adult Learner'
                              : 'Parent'}
                          </span>

                          <span
                            style={
                              row.incomplete
                                ? styles.incompleteBadge
                                : styles.readyBadge
                            }
                          >
                            {row.incomplete
                              ? 'Incomplete Setup'
                              : 'Setup Complete'}
                          </span>
                        </div>

                        <p
                          style={
                            styles.parentName
                          }
                        >
                          {user.full_name ||
                            parentProfile
                              ?.full_name ||
                            'Unnamed account'}
                        </p>

                        <p
                          style={
                            styles.emailText
                          }
                        >
                          {user.email ||
                            'Email not available'}
                        </p>

                        <p
                          style={
                            styles.parentMeta
                          }
                        >
                          {user.country ||
                            parentProfile
                              ?.country_of_residence ||
                            'Country not set'}
                          {' • '}
                          {user.timezone ||
                            parentProfile
                              ?.timezone ||
                            'Timezone not set'}
                        </p>
                      </div>

                      <span
                        style={
                          styles.currencyBadge
                        }
                      >
                        {parentProfile
                          ?.preferred_currency ||
                          'GBP'}
                      </span>
                    </div>

                    <div
                      style={
                        styles.detailGrid
                      }
                    >
                      <Detail
                        label="Phone"
                        value={
                          user.phone ||
                          parentProfile
                            ?.phone ||
                          '-'
                        }
                      />

                      <Detail
                        label={
                          row.accountType ===
                          'ADULT_LEARNER'
                            ? 'Learner Profile'
                            : 'Children'
                        }
                        value={
                          row.accountType ===
                          'ADULT_LEARNER'
                            ? row.students.some(
                                (
                                  student
                                ) =>
                                  student.is_self_learner
                              )
                              ? 'Created'
                              : 'Missing'
                            : String(
                                row.students
                                  .length
                              )
                        }
                      />

                      <Detail
                        label="Bookings"
                        value={String(
                          row.bookings
                            .length
                        )}
                      />

                      <Detail
                        label="Paid"
                        value={String(
                          row.paidBookings
                            .length
                        )}
                      />

                      <Detail
                        label="Revenue"
                        value={`£${row.revenue.toFixed(
                          2
                        )}`}
                      />

                      <Detail
                        label="Joined"
                        value={
                          user.created_at
                            ? formatDate(
                                user.created_at
                              )
                            : '-'
                        }
                      />
                    </div>

                    <div
                      style={
                        styles.communicationBox
                      }
                    >
                      <div
                        style={
                          styles.communicationTop
                        }
                      >
                        <div>
                          <p
                            style={
                              styles.communicationEyebrow
                            }
                          >
                            Email Activity
                          </p>

                          <strong
                            style={
                              styles.communicationCount
                            }
                          >
                            {row.emailCount}
                          </strong>

                          <span
                            style={
                              styles.communicationCountLabel
                            }
                          >
                            {' '}
                            email
                            {row.emailCount ===
                            1
                              ? ''
                              : 's'}{' '}
                            sent
                          </span>
                        </div>

                        <span
                          style={
                            statusBadgeStyle(
                              row.lastEmailStatus
                            )
                          }
                        >
                          {row.lastEmailStatus
                            ? formatStatus(
                                row.lastEmailStatus
                              )
                            : 'Never emailed'}
                        </span>
                      </div>

                      <div
                        style={
                          styles.lastEmailRow
                        }
                      >
                        <span>
                          Last emailed
                        </span>

                        <strong>
                          {row.lastEmailAt
                            ? formatDateTime(
                                row.lastEmailAt
                              )
                            : 'Never'}
                        </strong>
                      </div>
                    </div>

                    <div
                      style={
                        styles.childrenBox
                      }
                    >
                      <p
                        style={
                          styles.childrenTitle
                        }
                      >
                        {row.accountType ===
                        'ADULT_LEARNER'
                          ? 'Learning Profile'
                          : 'Learners'}
                      </p>

                      {row.students
                        .length === 0 ? (
                        <p
                          style={
                            styles.muted
                          }
                        >
                          {row.accountType ===
                          'ADULT_LEARNER'
                            ? 'Self-learner profile has not been created.'
                            : 'No child has been added yet.'}
                        </p>
                      ) : (
                        <div
                          style={
                            styles.childList
                          }
                        >
                          {row.students
                            .slice(
                              0,
                              4
                            )
                            .map(
                              (
                                student
                              ) => (
                                <span
                                  key={
                                    student.id
                                  }
                                  style={
                                    styles.childPill
                                  }
                                >
                                  {
                                    student.full_name
                                  }
                                  {student.is_self_learner
                                    ? ' · Self'
                                    : ''}
                                </span>
                              )
                            )}
                        </div>
                      )}
                    </div>

                    <div
                      style={
                        styles.cardActions
                      }
                    >
                      <button
                        type="button"
                        style={
                          styles.emailButton
                        }
                        disabled={
                          !user.email
                        }
                        onClick={() =>
                          openSingleEmail(
                            user.id
                          )
                        }
                      >
                        Email
                      </button>

                      {row.incomplete ? (
                        <button
                          type="button"
                          style={
                            styles.reminderButton
                          }
                          disabled={
                            !user.email
                          }
                          onClick={() => {
                            setSelectedIds([
                              user.id,
                            ])

                            setShowComposer(
                              true
                            )

                            applyTemplate(
                              row.accountType ===
                                'ADULT_LEARNER'
                                ? 'COMPLETE_ADULT'
                                : 'COMPLETE_PARENT'
                            )
                          }}
                        >
                          Send Setup
                          Reminder
                        </button>
                      ) : null}
                    </div>
                  </article>
                )
              }
            )}
          </div>
        )}
      </section>

      {showComposer ? (
        <section
          style={
            styles.composerOverlay
          }
        >
          <div
            style={
              styles.composerCard
            }
          >
            <div
              style={
                styles.composerHeader
              }
            >
              <div>
                <p
                  style={
                    styles.sectionEyebrow
                  }
                >
                  Customer
                  Communication
                </p>

                <h2
                  style={
                    styles.composerTitle
                  }
                >
                  Email{' '}
                  {selectedRows.length}{' '}
                  account
                  {selectedRows.length ===
                  1
                    ? ''
                    : 's'}
                </h2>
              </div>

              <button
                type="button"
                style={
                  styles.closeButton
                }
                onClick={() =>
                  setShowComposer(
                    false
                  )
                }
              >
                ×
              </button>
            </div>

            <label
              style={
                styles.fieldLabel
              }
            >
              Template

              <select
                value={
                  template
                }
                onChange={
                  (event) =>
                    applyTemplate(
                      event
                        .target
                        .value as EmailTemplate
                    )
                }
                style={
                  styles.input
                }
              >
                <option value="GENERAL">
                  General
                  communication
                </option>

                <option value="COMPLETE_PARENT">
                  Parent setup
                  reminder
                </option>

                <option value="COMPLETE_ADULT">
                  Adult learner
                  reminder
                </option>
              </select>
            </label>

            <label
              style={
                styles.fieldLabel
              }
            >
              Email subject

              <input
                value={
                  emailSubject
                }
                onChange={
                  (event) =>
                    setEmailSubject(
                      event
                        .target
                        .value
                    )
                }
                style={
                  styles.input
                }
              />
            </label>

            <label
              style={
                styles.fieldLabel
              }
            >
              Email heading

              <input
                value={
                  emailHeading
                }
                onChange={
                  (event) =>
                    setEmailHeading(
                      event
                        .target
                        .value
                    )
                }
                style={
                  styles.input
                }
              />
            </label>

            <label
              style={
                styles.fieldLabel
              }
            >
              Message

              <textarea
                value={
                  emailMessage
                }
                onChange={
                  (event) =>
                    setEmailMessage(
                      event
                        .target
                        .value
                    )
                }
                rows={9}
                style={
                  styles.textarea
                }
              />
            </label>

            <div
              style={
                styles.twoColumns
              }
            >
              <label
                style={
                  styles.fieldLabel
                }
              >
                Button text

                <input
                  value={
                    buttonText
                  }
                  onChange={
                    (event) =>
                      setButtonText(
                        event
                          .target
                          .value
                      )
                  }
                  placeholder="Optional"
                  style={
                    styles.input
                  }
                />
              </label>

              <label
                style={
                  styles.fieldLabel
                }
              >
                Button URL

                <input
                  value={
                    buttonUrl
                  }
                  onChange={
                    (event) =>
                      setButtonUrl(
                        event
                          .target
                          .value
                      )
                  }
                  placeholder="https://..."
                  style={
                    styles.input
                  }
                />
              </label>
            </div>

            <div
              style={
                styles.recipientPreview
              }
            >
              <strong>
                Recipients
              </strong>

              <p>
                {selectedRows
                  .slice(0, 6)
                  .map(
                    (row) =>
                      row.user.email
                  )
                  .filter(Boolean)
                  .join(', ')}

                {selectedRows.length >
                6
                  ? ` +${
                      selectedRows.length -
                      6
                    } more`
                  : ''}
              </p>
            </div>

            <div
              style={
                styles.composerActions
              }
            >
              <button
                type="button"
                style={
                  styles.secondaryButton
                }
                onClick={() =>
                  setShowComposer(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                type="button"
                style={
                  styles.sendButton
                }
                disabled={
                  sending
                }
                onClick={
                  sendCommunication
                }
              >
                {sending
                  ? 'Sending...'
                  : `Send to ${selectedRows.length}`}
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      style={{
        ...styles.filterButton,

        ...(active
          ? styles.filterButtonActive
          : {}),
      }}
    >
      {children}
    </button>
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
    <div
      style={
        styles.kpiCard
      }
    >
      <p
        style={
          styles.kpiLabel
        }
      >
        {label}
      </p>

      <h2
        style={
          styles.kpiValue
        }
      >
        {value}
      </h2>
    </div>
  )
}

function Detail({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div
      style={
        styles.detailBox
      }
    >
      <p
        style={
          styles.detailLabel
        }
      >
        {label}
      </p>

      <p
        style={
          styles.detailValue
        }
      >
        {value}
      </p>
    </div>
  )
}

function formatDate(
  value: string
) {
  return new Date(
    value
  ).toLocaleDateString(
    'en-GB',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }
  )
}

function formatDateTime(
  value: string
) {
  return new Date(
    value
  ).toLocaleString(
    'en-GB',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  )
}

function formatStatus(
  value: string
) {
  return value
    .toLowerCase()
    .replaceAll(
      '_',
      ' '
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    )
}

function statusBadgeStyle(
  status: string | null
): CSSProperties {
  const normalised =
    String(
      status || ''
    ).toUpperCase()

  if (
    normalised === 'SENT'
  ) {
    return {
      ...styles.emailStatusBadge,
      background:
        '#ecfdf5',
      color:
        '#047857',
    }
  }

  if (
    normalised === 'FAILED'
  ) {
    return {
      ...styles.emailStatusBadge,
      background:
        '#fef2f2',
      color:
        '#b91c1c',
    }
  }

  return {
    ...styles.emailStatusBadge,
    background:
      '#f3eff8',
    color:
      '#6f637e',
  }
}

const styles: Record<
  string,
  CSSProperties
> = {
  page: {
    minHeight: '100vh',
    padding:
      '42px 20px 90px',
    background:
      'radial-gradient(circle at top right,#eee3ff 0,#faf7ff 34%,#f7f4ff 100%)',
    color: '#21152d',
  },

  loadingCard: {
    maxWidth: 700,
    margin: '60px auto',
    padding: 30,
    borderRadius: 26,
    background: '#fff',
    border:
      '1px solid rgba(124,58,237,.14)',
    fontWeight: 900,
    textAlign: 'center',
  },

  hero: {
    maxWidth: 1240,
    margin: '0 auto',
    padding: '46px 38px',
    borderRadius: 36,
    background:
      'linear-gradient(135deg,rgba(255,255,255,.98),rgba(247,240,255,.98))',
    border:
      '1px solid rgba(126,87,194,.16)',
    boxShadow:
      '0 30px 90px rgba(88,52,150,.12)',
  },

  heroTop: {
    display: 'flex',
    justifyContent:
      'space-between',
    alignItems:
      'flex-start',
    gap: 20,
    flexWrap: 'wrap',
  },

  refreshButton: {
    padding:
      '12px 16px',
    borderRadius: 14,
    border:
      '1px solid rgba(124,58,237,.16)',
    background: '#fff',
    color: '#5b21b6',
    fontWeight: 900,
    cursor: 'pointer',
  },

  eyebrow: {
    margin: 0,
    color: '#7441d8',
    fontWeight: 950,
    fontSize: 14,
    textTransform:
      'uppercase',
    letterSpacing: 1,
  },

  title: {
    margin:
      '14px 0 0',
    fontSize:
      'clamp(36px,5vw,58px)',
    lineHeight: 1.02,
    fontWeight: 950,
    letterSpacing: -1.5,
  },

  subtitle: {
    maxWidth: 820,
    margin:
      '18px 0 0',
    color: '#6f637e',
    fontSize: 17,
    lineHeight: 1.75,
  },

  kpiGrid: {
    marginTop: 30,
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit,minmax(145px,1fr))',
    gap: 14,
  },

  kpiCard: {
    padding: 20,
    borderRadius: 22,
    background:
      'rgba(255,255,255,.92)',
    border:
      '1px solid rgba(124,58,237,.12)',
  },

  kpiLabel: {
    margin: 0,
    color: '#7a7088',
    fontWeight: 850,
    fontSize: 13,
  },

  kpiValue: {
    margin:
      '8px 0 0',
    fontSize: 30,
    fontWeight: 950,
  },

  actions: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 26,
  },

  primaryLink: {
    display:
      'inline-flex',
    padding:
      '14px 20px',
    borderRadius: 16,
    background:
      'linear-gradient(135deg,#6d28d9,#8b5cf6)',
    color: '#fff',
    textDecoration:
      'none',
    fontWeight: 950,
  },

  secondaryLink: {
    display:
      'inline-flex',
    padding:
      '14px 20px',
    borderRadius: 16,
    background: '#fff',
    color: '#351e55',
    textDecoration:
      'none',
    fontWeight: 900,
    border:
      '1px solid rgba(124,58,237,.16)',
  },

  notice: {
    maxWidth: 1240,
    margin:
      '18px auto 0',
    padding:
      '18px 20px',
    borderRadius: 18,
    display: 'flex',
    justifyContent:
      'space-between',
    gap: 18,
    alignItems:
      'flex-start',
    boxShadow:
      '0 12px 35px rgba(31,18,45,.08)',
  },

  noticeSuccess: {
    background:
      '#ecfdf5',
    border:
      '1px solid #a7f3d0',
    color: '#065f46',
  },

  noticeError: {
    background:
      '#fef2f2',
    border:
      '1px solid #fecaca',
    color: '#991b1b',
  },

  noticeInfo: {
    background:
      '#f5f3ff',
    border:
      '1px solid #ddd6fe',
    color: '#5b21b6',
  },

  noticeClose: {
    border: 0,
    background:
      'transparent',
    fontSize: 22,
    cursor: 'pointer',
    color: 'inherit',
  },

  cardWide: {
    maxWidth: 1240,
    margin:
      '28px auto 0',
    padding: 30,
    borderRadius: 30,
    background:
      'rgba(255,255,255,.97)',
    border:
      '1px solid rgba(126,87,194,.14)',
    boxShadow:
      '0 25px 70px rgba(71,43,117,.09)',
  },

  toolbar: {
    display: 'flex',
    justifyContent:
      'space-between',
    alignItems:
      'flex-start',
    flexWrap: 'wrap',
    gap: 18,
  },

  sectionEyebrow: {
    margin: 0,
    color: '#7441d8',
    fontWeight: 950,
    fontSize: 12,
    textTransform:
      'uppercase',
    letterSpacing: 1,
  },

  sectionTitle: {
    margin:
      '7px 0 0',
    fontSize: 28,
    fontWeight: 950,
  },

  sectionSubtitle: {
    margin:
      '8px 0 0',
    color: '#75687f',
    lineHeight: 1.6,
    fontSize: 14,
  },

  searchInput: {
    width: 340,
    maxWidth: '100%',
    padding:
      '14px 16px',
    borderRadius: 16,
    border:
      '1px solid rgba(124,58,237,.18)',
    fontSize: 15,
    outline: 'none',
  },

  filterRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 22,
  },

  filterButton: {
    border:
      '1px solid rgba(124,58,237,.14)',
    background: '#faf7ff',
    color: '#5d4c6d',
    borderRadius: 999,
    padding:
      '10px 14px',
    fontWeight: 850,
    cursor: 'pointer',
  },

  filterButtonActive: {
    background: '#6d28d9',
    color: '#fff',
  },

  selectionBar: {
    marginTop: 18,
    padding:
      '13px 16px',
    borderRadius: 16,
    background: '#faf7ff',
    display: 'flex',
    alignItems:
      'center',
    gap: 14,
    flexWrap: 'wrap',
  },

  selectAllLabel: {
    display: 'flex',
    gap: 8,
    alignItems:
      'center',
    fontWeight: 850,
  },

  selectedCount: {
    color: '#6f637e',
    fontWeight: 800,
  },

  emailSelectedButton: {
    marginLeft: 'auto',
    padding:
      '11px 16px',
    border: 0,
    borderRadius: 14,
    background: '#6d28d9',
    color: '#fff',
    fontWeight: 950,
    cursor: 'pointer',
  },

  parentGrid: {
    marginTop: 20,
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit,minmax(330px,1fr))',
    gap: 18,
  },

  parentCard: {
    position: 'relative',
    padding: 22,
    borderRadius: 25,
    background:
      'linear-gradient(180deg,#fdfbff,#faf7ff)',
    border:
      '1px solid rgba(124,58,237,.12)',
  },

  cardSelection: {
    position: 'absolute',
    top: 18,
    right: 18,
  },

  parentTop: {
    display: 'flex',
    justifyContent:
      'space-between',
    gap: 14,
    paddingRight: 28,
  },

  badgeRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 10,
  },

  parentBadge: {
    padding:
      '6px 9px',
    borderRadius: 999,
    background: '#ede9fe',
    color: '#5b21b6',
    fontSize: 11,
    fontWeight: 950,
  },

  adultBadge: {
    padding:
      '6px 9px',
    borderRadius: 999,
    background: '#e0f2fe',
    color: '#075985',
    fontSize: 11,
    fontWeight: 950,
  },

  incompleteBadge: {
    padding:
      '6px 9px',
    borderRadius: 999,
    background: '#fff7ed',
    color: '#9a3412',
    fontSize: 11,
    fontWeight: 950,
  },

  readyBadge: {
    padding:
      '6px 9px',
    borderRadius: 999,
    background: '#ecfdf5',
    color: '#047857',
    fontSize: 11,
    fontWeight: 950,
  },

  parentName: {
    margin: 0,
    fontSize: 21,
    fontWeight: 950,
  },

  emailText: {
    margin:
      '6px 0 0',
    color: '#6d28d9',
    fontSize: 14,
    fontWeight: 850,
    wordBreak:
      'break-word',
  },

  parentMeta: {
    margin:
      '6px 0 0',
    color: '#75687f',
    fontSize: 13,
    lineHeight: 1.5,
  },

  currencyBadge: {
    marginTop: 34,
    padding:
      '7px 10px',
    borderRadius: 999,
    background: '#efe7ff',
    color: '#6d28d9',
    fontSize: 11,
    fontWeight: 950,
    height: 'fit-content',
  },

  detailGrid: {
    marginTop: 18,
    display: 'grid',
    gridTemplateColumns:
      'repeat(2,minmax(0,1fr))',
    gap: 10,
  },

  detailBox: {
    padding: 13,
    borderRadius: 16,
    background: '#fff',
    border:
      '1px solid rgba(124,58,237,.09)',
  },

  detailLabel: {
    margin: 0,
    color: '#80748a',
    fontSize: 12,
    fontWeight: 850,
  },

  detailValue: {
    margin:
      '6px 0 0',
    fontWeight: 950,
    wordBreak:
      'break-word',
  },

  communicationBox: {
    marginTop: 14,
    padding: 15,
    borderRadius: 17,
    background:
      'linear-gradient(135deg,#241133,#3b1c55)',
    color: '#fff',
  },

  communicationTop: {
    display: 'flex',
    justifyContent:
      'space-between',
    alignItems:
      'flex-start',
    gap: 12,
  },

  communicationEyebrow: {
    margin: 0,
    fontSize: 10,
    fontWeight: 950,
    textTransform:
      'uppercase',
    letterSpacing: 1,
    opacity: 0.72,
  },

  communicationCount: {
    display:
      'inline-block',
    marginTop: 8,
    fontSize: 26,
  },

  communicationCountLabel: {
    fontSize: 12,
    opacity: 0.78,
    fontWeight: 800,
  },

  emailStatusBadge: {
    padding:
      '6px 9px',
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 950,
    whiteSpace: 'nowrap',
  },

  lastEmailRow: {
    marginTop: 13,
    paddingTop: 12,
    borderTop:
      '1px solid rgba(255,255,255,.14)',
    display: 'flex',
    justifyContent:
      'space-between',
    gap: 12,
    fontSize: 12,
  },

  childrenBox: {
    marginTop: 14,
    padding: 14,
    borderRadius: 16,
    background: '#fff',
    border:
      '1px solid rgba(124,58,237,.09)',
  },

  childrenTitle: {
    margin: 0,
    color: '#80748a',
    fontSize: 12,
    fontWeight: 850,
  },

  childList: {
    marginTop: 9,
    display: 'flex',
    gap: 7,
    flexWrap: 'wrap',
  },

  childPill: {
    padding:
      '7px 9px',
    borderRadius: 999,
    background: '#f0e7ff',
    color: '#6d35d4',
    fontSize: 11,
    fontWeight: 900,
  },

  muted: {
    margin:
      '8px 0 0',
    color: '#75687f',
    fontSize: 13,
  },

  cardActions: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 16,
  },

  emailButton: {
    padding:
      '11px 15px',
    borderRadius: 14,
    border:
      '1px solid rgba(124,58,237,.16)',
    background: '#fff',
    color: '#5b21b6',
    fontWeight: 950,
    cursor: 'pointer',
  },

  reminderButton: {
    padding:
      '11px 15px',
    borderRadius: 14,
    border: 0,
    background: '#6d28d9',
    color: '#fff',
    fontWeight: 950,
    cursor: 'pointer',
  },

  emptyState: {
    marginTop: 20,
    padding: 26,
    borderRadius: 20,
    background: '#faf7ff',
  },

  emptyTitle: {
    margin: 0,
    fontWeight: 950,
  },

  emptyText: {
    color: '#6f637e',
  },

  composerOverlay: {
    position: 'fixed',
    inset: 0,
    background:
      'rgba(31,18,45,.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent:
      'center',
    padding: 18,
    zIndex: 1000,
  },

  composerCard: {
    width:
      'min(760px,100%)',
    maxHeight: '92vh',
    overflowY: 'auto',
    padding: 28,
    borderRadius: 28,
    background: '#fff',
    boxShadow:
      '0 35px 100px rgba(31,18,45,.28)',
  },

  composerHeader: {
    display: 'flex',
    justifyContent:
      'space-between',
    gap: 20,
  },

  composerTitle: {
    margin:
      '7px 0 0',
    fontSize: 28,
    fontWeight: 950,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    border: 0,
    background: '#f3eff8',
    fontSize: 24,
    cursor: 'pointer',
  },

  fieldLabel: {
    display: 'grid',
    gap: 7,
    marginTop: 17,
    fontWeight: 900,
    color: '#4c3a59',
  },

  input: {
    width: '100%',
    boxSizing:
      'border-box',
    padding:
      '13px 14px',
    borderRadius: 14,
    border:
      '1px solid rgba(124,58,237,.18)',
    fontSize: 15,
    outline: 'none',
  },

  textarea: {
    width: '100%',
    boxSizing:
      'border-box',
    padding: 14,
    borderRadius: 14,
    border:
      '1px solid rgba(124,58,237,.18)',
    fontSize: 15,
    lineHeight: 1.6,
    resize: 'vertical',
    outline: 'none',
  },

  twoColumns: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit,minmax(220px,1fr))',
    gap: 12,
  },

  recipientPreview: {
    marginTop: 18,
    padding: 15,
    borderRadius: 14,
    background: '#faf7ff',
    color: '#655873',
  },

  composerActions: {
    display: 'flex',
    justifyContent:
      'flex-end',
    gap: 10,
    marginTop: 20,
  },

  secondaryButton: {
    padding:
      '13px 18px',
    borderRadius: 14,
    border:
      '1px solid rgba(124,58,237,.16)',
    background: '#fff',
    fontWeight: 900,
    cursor: 'pointer',
  },

  sendButton: {
    padding:
      '13px 20px',
    borderRadius: 14,
    border: 0,
    background:
      'linear-gradient(135deg,#6d28d9,#8b5cf6)',
    color: '#fff',
    fontWeight: 950,
    cursor: 'pointer',
  },
}
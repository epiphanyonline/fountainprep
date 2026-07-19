'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type PayoutMethod = 'BANK' | 'PAYPAL' | 'BOTH'

type TutorProfile = {
  id: string
  orientation_completed: boolean
  payout_method: PayoutMethod | null
  payout_currency: string
  payout_account_name: string | null
  payout_bank_name: string | null
  payout_account_number: string | null
  paypal_email: string | null
}

export default function TutorPayoutSetupPage() {
  const router = useRouter()

  const [profile, setProfile] = useState<TutorProfile | null>(null)
  const [method, setMethod] = useState<PayoutMethod>('BANK')
  const [currency, setCurrency] = useState('GBP')
  const [accountName, setAccountName] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [paypalEmail, setPaypalEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('tutor_profiles')
        .select(`
          id,
          orientation_completed,
          payout_method,
          payout_currency,
          payout_account_name,
          payout_bank_name,
          payout_account_number,
          paypal_email
        `)
        .eq('user_id', user.id)
        .single()

      if (error || !data) {
        setMessage(error?.message || 'Tutor profile could not be found.')
        setLoading(false)
        return
      }

      if (!data.orientation_completed) {
        router.push('/tutor/orientation')
        return
      }

      const tutor = data as TutorProfile

      setProfile(tutor)
      setMethod(tutor.payout_method || 'BANK')
      setCurrency(tutor.payout_currency || 'GBP')
      setAccountName(tutor.payout_account_name || '')
      setBankName(tutor.payout_bank_name || '')
      setAccountNumber(tutor.payout_account_number || '')
      setPaypalEmail(tutor.paypal_email || '')
      setLoading(false)
    }

    loadProfile()
  }, [router])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!profile) return

    const usesBank = method === 'BANK' || method === 'BOTH'
    const usesPayPal = method === 'PAYPAL' || method === 'BOTH'

    if (
      usesBank &&
      (!accountName.trim() || !bankName.trim() || !accountNumber.trim())
    ) {
      setMessage('Please complete all required bank details.')
      return
    }

    if (usesPayPal && !paypalEmail.trim()) {
      setMessage('Please enter your PayPal email address.')
      return
    }

    setSaving(true)
    setMessage('')

    const { error } = await supabase
      .from('tutor_profiles')
      .update({
        payout_method: method,
        payout_currency: currency,
        payout_account_name: usesBank ? accountName.trim() : null,
        payout_bank_name: usesBank ? bankName.trim() : null,
        payout_account_number: usesBank ? accountNumber.trim() : null,
        paypal_email: usesPayPal ? paypalEmail.trim().toLowerCase() : null,
        payout_details_completed: true,
        payout_details_completed_at: new Date().toISOString(),
      })
      .eq('id', profile.id)

    setSaving(false)

    if (error) {
      setMessage(error.message)
      return
    }

    router.push('/tutor/dashboard')
    router.refresh()
  }

  if (loading) {
    return (
      <main className="page">
        <section className="card">
          <p>Loading payout setup...</p>
        </section>

        <style jsx global>{styles}</style>
      </main>
    )
  }

  const showBank = method === 'BANK' || method === 'BOTH'
  const showPayPal = method === 'PAYPAL' || method === 'BOTH'

  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">Final onboarding step</p>

        <h1>Set up your payout details</h1>

        <p className="subtitle">
          Choose how you would like Fountain Prep to send your tutor earnings.
        </p>

        <form onSubmit={handleSubmit} className="form">
          <div>
            <p className="label">Preferred payout method</p>

            <div className="methodGrid">
              {(['BANK', 'PAYPAL', 'BOTH'] as PayoutMethod[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  className={method === item ? 'method active' : 'method'}
                  onClick={() => setMethod(item)}
                >
                  {item === 'BANK'
                    ? 'Bank account'
                    : item === 'PAYPAL'
                      ? 'PayPal'
                      : 'Both'}
                </button>
              ))}
            </div>
          </div>

          <label className="field">
            <span>Payout currency</span>

            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
            >
              <option value="GBP">GBP — British Pound</option>
              <option value="USD">USD — US Dollar</option>
              <option value="NGN">NGN — Nigerian Naira</option>
              <option value="CAD">CAD — Canadian Dollar</option>
              <option value="AUD">AUD — Australian Dollar</option>
              <option value="EUR">EUR — Euro</option>
            </select>
          </label>

          {showBank ? (
            <section className="detailSection">
              <div>
                <p className="sectionTitle">Bank details</p>
                <p className="sectionText">
                  Enter the account where you want to receive tutor payouts.
                </p>
              </div>

              <label className="field">
                <span>Account holder name</span>

                <input
                  value={accountName}
                  onChange={(event) => setAccountName(event.target.value)}
                  placeholder="Name as shown on the bank account"
                />
              </label>

              <label className="field">
                <span>Bank name</span>

                <input
                  value={bankName}
                  onChange={(event) => setBankName(event.target.value)}
                  placeholder="Bank name"
                />
              </label>

              <label className="field">
                <span>Account number or IBAN</span>

                <input
                  value={accountNumber}
                  onChange={(event) => setAccountNumber(event.target.value)}
                  placeholder="Account number or IBAN"
                  autoComplete="off"
                />
              </label>
            </section>
          ) : null}

          {showPayPal ? (
            <section className="detailSection">
              <div>
                <p className="sectionTitle">PayPal details</p>
                <p className="sectionText">
                  Enter the email address linked to your PayPal account.
                </p>
              </div>

              <label className="field">
                <span>PayPal email address</span>

                <input
                  type="email"
                  value={paypalEmail}
                  onChange={(event) => setPaypalEmail(event.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </label>
            </section>
          ) : null}

          <div className="notice">
            Your payout details are used only for sending tutor earnings. Contact
            Fountain Prep support if you need to change them later.
          </div>

          {message ? <p className="message">{message}</p> : null}

          <button className="submit" type="submit" disabled={saving}>
            {saving ? 'Saving payout details...' : 'Save and complete onboarding'}
          </button>
        </form>
      </section>

      <style jsx global>{styles}</style>
    </main>
  )
}

const styles = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
  }

  .page {
    min-height: 100vh;
    padding: 34px 16px 70px;
    color: #241433;
    background:
      radial-gradient(circle at 8% 0%, rgba(124,58,237,0.16), transparent 30%),
      linear-gradient(180deg, #fffaff 0%, #f5efff 100%);
  }

  .card {
    width: min(780px, 100%);
    margin: 0 auto;
    padding: clamp(25px, 5vw, 52px);
    border-radius: 36px;
    background: rgba(255,255,255,0.97);
    border: 1px solid rgba(124,58,237,0.13);
    box-shadow: 0 30px 85px rgba(65,38,104,0.13);
  }

  .eyebrow,
  .sectionTitle,
  .label {
    margin: 0;
    color: #6d28d9;
    font-size: 13px;
    font-weight: 950;
  }

  h1 {
    margin: 12px 0 0;
    font-size: clamp(38px, 6vw, 62px);
    line-height: 0.98;
    letter-spacing: -0.055em;
  }

  .subtitle,
  .sectionText {
    margin: 16px 0 0;
    color: #70637b;
    line-height: 1.65;
  }

  .form {
    margin-top: 34px;
    display: grid;
    gap: 24px;
  }

  .methodGrid {
    margin-top: 10px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .method {
    min-height: 52px;
    border-radius: 16px;
    border: 1px solid rgba(124,58,237,0.16);
    background: white;
    color: #3b2451;
    font: inherit;
    font-weight: 900;
    cursor: pointer;
  }

  .method.active {
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    border-color: transparent;
  }

  .detailSection {
    padding: 22px;
    display: grid;
    gap: 17px;
    border-radius: 24px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,0.12);
  }

  .sectionText {
    margin-top: 5px;
    font-size: 14px;
  }

  .field {
    display: grid;
    gap: 8px;
  }

  .field span {
    font-size: 13px;
    font-weight: 900;
  }

  input,
  select {
    width: 100%;
    min-height: 52px;
    padding: 0 15px;
    border-radius: 15px;
    border: 1px solid rgba(124,58,237,0.17);
    background: white;
    color: #241433;
    font: inherit;
    outline: none;
  }

  input:focus,
  select:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 0 4px rgba(124,58,237,0.1);
  }

  .notice {
    padding: 16px;
    border-radius: 17px;
    color: #54415f;
    background: #f2eaff;
    line-height: 1.55;
    font-size: 14px;
    font-weight: 750;
  }

  .message {
    margin: 0;
    padding: 14px 16px;
    border-radius: 15px;
    color: #8a2b16;
    background: #fff4ed;
    font-weight: 850;
  }

  .submit {
    min-height: 56px;
    border: 0;
    border-radius: 18px;
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    box-shadow: 0 16px 36px rgba(124,58,237,0.28);
    font: inherit;
    font-weight: 950;
    cursor: pointer;
  }

  .submit:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  @media (max-width: 620px) {
    .page {
      padding: 18px 10px 45px;
    }

    .card {
      padding: 27px 18px;
      border-radius: 28px;
    }

    .methodGrid {
      grid-template-columns: 1fr;
    }
  }
`
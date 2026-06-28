import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ interviewId: string }> }
) {
  try {
    const { interviewId } = await params

    const { data: interview, error } = await supabaseAdmin
      .from('tutor_interviews')
      .select(`
        id,
        tutor_id,
        tutor_user_id,
        tutor_name,
        tutor_email,
        interview_date,
        interview_time,
        interview_link,
        status,
        created_at,
        updated_at
      `)
      .eq('id', interviewId)
      .single()

    if (error || !interview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      )
    }

    const jitsiRoomUrl = `https://meet.jit.si/fountainprep-interview-${interview.id}`

    return NextResponse.json({
      interview: {
        id: interview.id,
        tutor_id: interview.tutor_id,
        tutor_user_id: interview.tutor_user_id,
        candidate_email: interview.tutor_email,
        candidate_name: interview.tutor_name,
        interview_date: interview.interview_date,
        interview_time: interview.interview_time,
        timezone: 'Europe/London',
        interview_link: interview.interview_link,
        meeting_link: jitsiRoomUrl,
        status: interview.status || 'SCHEDULED',
        created_at: interview.created_at,
        updated_at: interview.updated_at,
      },
    })
  } catch (error) {
    console.error('Interview lookup error:', error)

    return NextResponse.json(
      { error: 'Unable to load interview' },
      { status: 500 }
    )
  }
}
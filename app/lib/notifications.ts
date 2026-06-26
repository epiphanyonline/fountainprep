import { supabase } from './supabase'

type CreateNotificationInput = {
  userId: string
  role: 'parent' | 'tutor' | 'admin'
  title: string
  message: string
  type?: string
  link?: string
}

export async function createNotification({
  userId,
  role,
  title,
  message,
  type = 'general',
  link = '/',
}: CreateNotificationInput) {
  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    role,
    title,
    message,
    type,
    link,
    is_read: false,
  })

  if (error) {
    console.error('Notification error:', error.message)
  }

  return { error }
}
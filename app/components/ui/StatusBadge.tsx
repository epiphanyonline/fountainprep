import Badge from './Badge'

export default function StatusBadge({ status }: { status: string }) {
  const clean = String(status || '').toLowerCase()

  if (clean === 'paid' || clean === 'confirmed' || clean === 'approved') {
    return <Badge tone="green">Confirmed</Badge>
  }

  if (clean.includes('pending') || clean === 'unpaid') {
    return <Badge tone="orange">Pending</Badge>
  }

  if (clean === 'rejected' || clean === 'failed' || clean === 'cancelled') {
    return <Badge tone="red">{status}</Badge>
  }

  return <Badge>{status || 'Status'}</Badge>
}
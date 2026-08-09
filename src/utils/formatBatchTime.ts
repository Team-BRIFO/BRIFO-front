import { getKstLocalDate, getKstLocalTime } from '@/api/contracts/localDateTime'

/** Formats a validated KST LocalDateTime without a browser-local Date conversion. */
export function formatBatchTime(batchTime?: string) {
  if (!batchTime) return { date: '', time: '' }

  const [, month, day] = getKstLocalDate(batchTime).split('-')
  const [hour, minute] = getKstLocalTime(batchTime).split(':')

  return {
    date: `${Number(month)}/${Number(day)}`,
    time: `${hour}:${minute}`,
  }
}

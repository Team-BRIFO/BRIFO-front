import { z } from 'zod'

/**
 * KST LocalDateTime response contract: seconds are required, fractional seconds
 * are optional, and every UTC/offset suffix (`Z`, `+09:00`, etc.) is forbidden.
 */
export const KST_LOCAL_DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/

/**
 * Validates the backend's Asia/Seoul LocalDateTime without converting or
 * normalizing the response string. `z.iso.datetime({ local: true })` alone
 * accepts `Z` and timestamps without seconds, so the pattern is intentional.
 */
export const KstLocalDateTimeSchema = z.iso
  .datetime({ local: true, offset: false })
  .refine((value) => KST_LOCAL_DATE_TIME_PATTERN.test(value), {
    message:
      'KST LocalDateTime must be YYYY-MM-DDTHH:mm:ss[.fraction] with no UTC or offset suffix.',
  })

export type KstLocalDateTime = z.output<typeof KstLocalDateTimeSchema>

const KOREA_STANDARD_TIME_OFFSET_MILLISECONDS = 9 * 60 * 60 * 1_000

/** Extracts the original KST calendar date without parsing it as a browser-local Date. */
export function getKstLocalDate(value: KstLocalDateTime): string {
  return value.slice(0, 10)
}

/** Extracts the original KST wall-clock time without parsing it as a Date. */
export function getKstLocalTime(value: KstLocalDateTime): string {
  return value.slice(11, 19)
}

/**
 * Converts a validated KST wall-clock value to an absolute timestamp without
 * letting the browser interpret the offset-less value in its own timezone.
 */
export function getKstLocalDateTimeTimestamp(value: KstLocalDateTime): number {
  const [year, month, day] = getKstLocalDate(value).split('-').map(Number)
  const [hour, minute, secondsWithFraction] = value.slice(11).split(':')
  const [second, fraction = ''] = secondsWithFraction.split('.')
  const milliseconds = Number(fraction.slice(0, 3).padEnd(3, '0'))
  const date = new Date(0)

  // Date.UTC treats years 0–99 as 1900–1999. setUTCFullYear preserves the
  // four-digit year that the LocalDateTime contract accepts.
  date.setUTCFullYear(year, month - 1, day)
  date.setUTCHours(Number(hour), Number(minute), Number(second), milliseconds)

  return date.getTime() - KOREA_STANDARD_TIME_OFFSET_MILLISECONDS
}

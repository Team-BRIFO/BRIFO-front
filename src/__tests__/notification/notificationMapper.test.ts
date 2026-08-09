import { afterEach, describe, expect, it, vi } from 'vitest'

import { formatNotificationRelativeTime } from '@/mappers/notificationMapper'

describe('notification mapper', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('calculates relative time from KST LocalDateTime without using the browser timezone', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-05T19:56:57.113Z'))

    expect(formatNotificationRelativeTime('2026-08-06T03:56:57.113442')).toBe('1시간 전')
  })
})

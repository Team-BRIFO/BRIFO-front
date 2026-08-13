import { useEffect, useState } from 'react'

const KST_OFFSET_MS = 9 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000
const SETTLEMENT_HOUR = 15
const SETTLEMENT_MINUTE = 30

function getNextSettlementTime(nowMs: number) {
  const kstNow = new Date(nowMs + KST_OFFSET_MS)
  let targetMs =
    Date.UTC(
      kstNow.getUTCFullYear(),
      kstNow.getUTCMonth(),
      kstNow.getUTCDate(),
      SETTLEMENT_HOUR,
      SETTLEMENT_MINUTE,
    ) - KST_OFFSET_MS

  if (targetMs < nowMs) targetMs += DAY_MS

  return targetMs
}

export function getSettlementRemainingTime(nowMs = Date.now()) {
  const remainingSeconds = Math.max(Math.floor((getNextSettlementTime(nowMs) - nowMs) / 1000), 0)
  const hours = Math.floor(remainingSeconds / 3600)
  const minutes = Math.floor((remainingSeconds % 3600) / 60)
  const seconds = remainingSeconds % 60

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':')
}

export function useSettlementCountdown() {
  const [remainingTime, setRemainingTime] = useState(() => getSettlementRemainingTime())

  useEffect(() => {
    const updateRemainingTime = () => {
      setRemainingTime(getSettlementRemainingTime())
    }

    updateRemainingTime()
    const intervalId = window.setInterval(updateRemainingTime, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  return remainingTime
}

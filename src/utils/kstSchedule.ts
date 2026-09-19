const KST_OFFSET_MS = 9 * 60 * 60 * 1000

/** 한국 표준시(KST) 기준으로 현재가 주말(토·일)인지 여부 */
export function isKstWeekend(nowMs = Date.now()): boolean {
  const kstDay = new Date(nowMs + KST_OFFSET_MS).getUTCDay()

  return kstDay === 0 || kstDay === 6
}

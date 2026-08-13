import { useSettlementCountdown } from '@/components/feature/home/hooks/useSettlementCountdown'
import SettlementCard from '@/components/feature/home/SettlementCard'

export default function SettlementCountdownCard() {
  const remainingTime = useSettlementCountdown()

  return <SettlementCard remainingTime={remainingTime} />
}

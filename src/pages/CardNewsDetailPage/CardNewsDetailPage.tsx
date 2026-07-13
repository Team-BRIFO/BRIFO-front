import { useParams } from 'react-router-dom'

/** 홈 탭 - SCR-05: 카드뉴스 상세 */
export function CardNewsDetailPage() {
  const { id } = useParams<{ id: string }>()

  return <div>CardNewsDetailPage id={id}</div>
}

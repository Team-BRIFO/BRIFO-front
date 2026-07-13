import { useParams } from 'react-router-dom'

export function CardNewsDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <h1>카드뉴스 상세</h1>
      <p>ID: {id}</p>
    </div>
  )
}

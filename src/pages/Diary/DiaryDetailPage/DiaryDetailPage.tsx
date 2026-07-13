import { useParams } from 'react-router-dom'

/** 피드 탭 - SCR-10: 일기 상세 및 메모 입력 */
export function DiaryDetailPage() {
  const { id } = useParams<{ id: string }>()

  return <div>DiaryDetailPage id={id}</div>
}

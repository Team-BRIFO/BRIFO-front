import type { NotificationCategory } from '@/components/feature/notification/NotificationTabs'

export interface NotificationData {
  id: number
  category: Exclude<NotificationCategory, 'all'>
  title: string
  description: string
  time: string
}

export const NOTIFICATION_MOCK_DATA: NotificationData[] = [
  {
    id: 1,
    category: 'system',
    title: '새 카드 뉴스 3건 도착',
    description: '새 카드뉴스 3건 도착 · 상승예측 성공',
    time: '41분 전',
  },
  {
    id: 2,
    category: 'system',
    title: '새 카드 뉴스 3건 도착',
    description: '새 카드뉴스 3건 도착 · 상승예측 성공',
    time: '41분 전',
  },
  {
    id: 3,
    category: 'system',
    title: '새 카드 뉴스 3건 도착',
    description: '새 카드뉴스 3건 도착 · 상승예측 성공',
    time: '41분 전',
  },
  {
    id: 4,
    category: 'settlement',
    title: '오늘의 정산이 끝났어요',
    description: '삼성전자 ▲+1.9% · 상승예측 적중 · AP +100',
    time: '41분 전',
  },
  {
    id: 5,
    category: 'employee',
    title: '사원 분석이 완료됐어요',
    description: '루키 사원의 분석 보고서를 확인해보세요',
    time: '1시간 전',
  },
]

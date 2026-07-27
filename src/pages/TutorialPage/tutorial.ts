import type { AgentSummary } from '@/types/domain/agent'

export type TutorialContent =
  | 'cardNewsList'
  | 'cardNewsDetail'
  | 'agentSelection'
  | 'analysisRequested'
  | 'analysisReport'
  | 'prediction'
  | 'predictionRegistered'
  | 'predictionResult'

export interface TutorialStep {
  id: string
  step: number
  title: string
  message: string
  content: TutorialContent
  buttonLabel: string
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'card-news-list',
    step: 1,
    title: '카드뉴스 받기',
    message: '안녕하세요 사장님! 먼저 오늘의 카드뉴스를 눌러 시장 분위기를 확인해봐요!',
    content: 'cardNewsList',
    buttonLabel: '다음',
  },
  {
    id: 'card-news-detail',
    step: 1,
    title: '카드뉴스 받기',
    message: '카드뉴스를 확인하러 가면 추천된 카드뉴스의 상세내용과 모르는 용어를 알수있어요!',
    content: 'cardNewsDetail',
    buttonLabel: '이해했어요',
  },
  {
    id: 'card-news-detail-guide',
    step: 1,
    title: '카드뉴스 받기',
    message:
      '뉴스를 보고 이 종목이 마음에 드시나요? 그러면 이제 사원들에게 분석을 맡기러 가봅시다!',
    content: 'cardNewsDetail',
    buttonLabel: '이해했어요',
  },
  {
    id: 'agent-selection',
    step: 2,
    title: '분석 맡기기',
    message: '사원들 중에서 저에게 분석을 맡겨보세요! 보고서를 금방 써올게요.',
    content: 'agentSelection',
    buttonLabel: '다음',
  },
  {
    id: 'analysis-requested',
    step: 2,
    title: '분석 맡기기',
    message: `사원들 중에서 저에게 분석을 맡겨보세요! \n보고서를 금방 써올게요.`,
    content: 'analysisRequested',
    buttonLabel: '다음',
  },
  {
    id: 'analysis-report',
    step: 2,
    title: '분석 맡기기',
    message: '제 분석이 완벽하게 완료되었어요! 이제 저의 브리핑을 읽고 방향성을 예측해 볼까요?',
    content: 'analysisReport',
    buttonLabel: '이해했어요',
  },
  {
    id: 'stock-prediction',
    step: 3,
    title: '방향 예측하기',
    message: `오를 것 같으면 '상승'을 고르세요. 확신도가 높을수록 보상도 커집니다.`,
    content: 'prediction',
    buttonLabel: '다음',
  },
  {
    id: 'prediction-registered',
    step: 3,
    title: '방향 예측하기',
    message: `예측 등록이 완료 되었네요! \n장 마감까지 기다려볼까요?`,
    content: 'predictionRegistered',
    buttonLabel: '다음',
  },
  {
    id: 'prediction-result',
    step: 3,
    title: '방향 예측하기',
    message: `축하해요 사장님! 예측이 적중하였어요.\n사장님만의 브리포 운영방법을 체득하셨어요!`,
    content: 'predictionResult',
    buttonLabel: '다음',
  },
]

export const TUTORIAL_AGENTS: AgentSummary[] = [
  {
    id: 'rookie',
    type: 'rookie',
    name: '루키',
    modelName: 'Claude Haiku 4.5',
    level: 8,
    levelProgress: 30,
    hitRate: 64,
    dailyAP: 10,
  },
  {
    id: 'pro',
    type: 'pro',
    name: '프로',
    modelName: 'Claude Opus 4.x',
    level: 7,
    levelProgress: 30,
    hitRate: 64,
    dailyAP: 10,
  },
]

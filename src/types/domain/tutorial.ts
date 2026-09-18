export type TutorialContent =
  | 'cardNewsList'
  | 'cardNewsDetail'
  | 'cardNewsTermBottomSheet'
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

/** 관심종목 검색·선택 UI에서 사용하는 화면 모델 */
export interface InterestStockOption {
  id: string
  name: string
  /** 종가가 아직 수집되지 않았으면 null. 0원·0% 대신 안내 문구를 보여준다. */
  price: string | null
  changeRate: number | null
  logoUrl: string
}

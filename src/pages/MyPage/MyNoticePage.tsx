import { MyPageLayout } from '@/pages/MyPage/MyPageLayout'

/** 아직 서버 공지 채널이 없을 때 제공하는 설정 공지사항 빈 화면. */
export function MyNoticePage() {
  return (
    <MyPageLayout title="공지사항">
      <p className="pretendard-Body2-Regular text-Gray-5 py-10 text-center">
        아직 등록된 공지사항이 없습니다.
      </p>
    </MyPageLayout>
  )
}

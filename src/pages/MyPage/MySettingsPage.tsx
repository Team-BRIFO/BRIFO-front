import { useNavigate } from 'react-router-dom'

import { AccountManagementSection } from '@/components/feature/my/AccountManagementSection'
import { MySettings } from '@/components/feature/my/MySettings'
import type { MyMenuKey } from '@/constants/myMenu'
import { MyPageLayout } from '@/pages/MyPage/MyPageLayout'
import { PATH } from '@/routes/paths'

const SETTINGS_PATHS: Partial<Record<MyMenuKey, string>> = {
  glossary: PATH.MY_GLOSSARY,
  tutorial: PATH.TUTORIAL_REPLAY_INTRO,
  notice: PATH.MY_NOTICES,
  terms: PATH.MY_TERMS,
}

const KAKAO_CONTACT_URL = 'https://open.kakao.com/o/sA4wcnui'

export function MySettingsPage() {
  const navigate = useNavigate()
  const onSelect = (key: MyMenuKey) => {
    if (key === 'contact') {
      window.open(KAKAO_CONTACT_URL, '_blank', 'noopener,noreferrer')
      return
    }
    if (key === 'interestStocks') {
      navigate(PATH.MY_EDIT_STOCKS, { state: { returnTo: PATH.MY_SETTINGS } })
      return
    }
    if (key === 'profileEdit') {
      navigate(PATH.MY_EDIT, { state: { returnTo: PATH.MY_SETTINGS } })
      return
    }
    const path = SETTINGS_PATHS[key]
    if (path) navigate(path)
  }
  return (
    <MyPageLayout title="설정" onBack={() => navigate(PATH.MY_PAGE, { replace: true })}>
      <MySettings onSelectMenu={onSelect} accountManagement={<AccountManagementSection />} />
    </MyPageLayout>
  )
}

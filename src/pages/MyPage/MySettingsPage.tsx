import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { browserTokenStore } from '@/api/client/tokenStore'
import {
  type AccountActionType,
  AccountConfirmModal,
} from '@/components/feature/my/AccountConfirmModal'
import { MySettings } from '@/components/feature/my/MySettings'
import type { MyMenuKey } from '@/constants/myMenu'
import { useDeleteMyAccountMutation } from '@/pages/MyPage/hooks/useDeleteMyAccountMutation'
import { MyPageLayout } from '@/pages/MyPage/MyPageLayout'
import { PATH } from '@/routes/paths'

const SETTINGS_PATHS: Partial<Record<MyMenuKey, string>> = {
  profileEdit: PATH.MY_EDIT,
  interestStocks: PATH.MY_EDIT,
  glossary: PATH.MY_GLOSSARY,
  tutorial: PATH.TUTORIAL,
}

export function MySettingsPage() {
  const navigate = useNavigate()
  const removeAccount = useDeleteMyAccountMutation()
  const [action, setAction] = useState<AccountActionType | null>(null)
  const onSelect = (key: MyMenuKey) => {
    if (key === 'logout' || key === 'withdraw') {
      removeAccount.reset()
      setAction(key)
      return
    }
    const path = SETTINGS_PATHS[key]
    if (path) navigate(path)
  }
  const onConfirm = () => {
    if (action === 'logout') {
      browserTokenStore.clear()
      navigate(PATH.SPLASH, { replace: true })
      return
    }
    removeAccount.mutate(undefined, {
      onSuccess: () => {
        browserTokenStore.clear()
        navigate(PATH.SPLASH, { replace: true })
      },
    })
  }
  return (
    <MyPageLayout title="설정">
      <MySettings onSelectMenu={onSelect} />
      <AccountConfirmModal
        isOpen={Boolean(action)}
        type={action ?? 'logout'}
        onClose={() => {
          removeAccount.reset()
          setAction(null)
        }}
        onConfirm={onConfirm}
        isConfirming={removeAccount.isPending}
        errorMessage={
          action === 'withdraw' && removeAccount.isError
            ? '탈퇴 처리에 실패했어요. 다시 시도해주세요.'
            : undefined
        }
      />
    </MyPageLayout>
  )
}

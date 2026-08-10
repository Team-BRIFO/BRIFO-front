import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { clearClientSession } from '@/api/client/sessionCleanup'
import { browserTokenStore } from '@/api/client/tokenStore'
import {
  type AccountActionType,
  AccountConfirmModal,
} from '@/components/feature/my/AccountConfirmModal'
import { MySettings } from '@/components/feature/my/MySettings'
import type { MyMenuKey } from '@/constants/myMenu'
import { useDeleteMyAccountMutation } from '@/pages/MyPage/hooks/useDeleteMyAccountMutation'
import { useLogoutMutation } from '@/pages/MyPage/hooks/useLogoutMutation'
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
  const queryClient = useQueryClient()
  const removeAccount = useDeleteMyAccountMutation()
  const logout = useLogoutMutation()
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
      const refreshToken = browserTokenStore.getRefreshToken()

      if (!refreshToken) {
        clearClientSession()
        queryClient.clear()
        navigate(PATH.SPLASH, { replace: true })
        return
      }

      logout.mutate(
        { refreshToken },
        {
          onSuccess: () => {
            clearClientSession()
            queryClient.clear()
            navigate(PATH.SPLASH, { replace: true })
          },
        },
      )
      return
    }
    removeAccount.mutate(undefined, {
      onSuccess: () => {
        clearClientSession()
        queryClient.clear()
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
        isConfirming={action === 'logout' ? logout.isPending : removeAccount.isPending}
        errorMessage={
          action === 'logout' && logout.isError
            ? '로그아웃에 실패했어요. 다시 시도해주세요.'
            : action === 'withdraw' && removeAccount.isError
              ? '탈퇴 처리에 실패했어요. 다시 시도해주세요.'
              : undefined
        }
      />
    </MyPageLayout>
  )
}

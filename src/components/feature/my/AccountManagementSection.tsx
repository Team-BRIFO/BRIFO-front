import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { clearClientSession } from '@/api/client/sessionCleanup'
import { browserTokenStore } from '@/api/client/tokenStore'
import { MenuRow, MenuRowGroup } from '@/components/common/MenuRow'
import {
  type AccountActionType,
  AccountConfirmModal,
} from '@/components/feature/my/AccountConfirmModal'
import { useDeleteMyAccountMutation } from '@/pages/MyPage/hooks/useDeleteMyAccountMutation'
import { useLogoutMutation } from '@/pages/MyPage/hooks/useLogoutMutation'
import { PATH } from '@/routes/paths'

/** 로그아웃·회원 탈퇴의 모달과 요청 상태를 설정 메뉴에서 격리한다. */
export function AccountManagementSection() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const removeAccount = useDeleteMyAccountMutation()
  const logout = useLogoutMutation()
  const [action, setAction] = useState<AccountActionType | null>(null)

  const handleOpen = (nextAction: AccountActionType) => {
    removeAccount.reset()
    setAction(nextAction)
  }

  const handleClose = () => {
    removeAccount.reset()
    setAction(null)
  }

  const handleConfirm = () => {
    if (action === 'logout') {
      const refreshToken = browserTokenStore.getRefreshToken()

      if (!refreshToken) {
        clearClientSession(queryClient)
        queryClient.clear()
        navigate(PATH.SPLASH, { replace: true })
        return
      }

      logout.mutate(
        { refreshToken },
        {
          onSuccess: () => {
            clearClientSession(queryClient)
            queryClient.clear()
            navigate(PATH.SPLASH, { replace: true })
          },
        },
      )
      return
    }

    removeAccount.mutate(undefined, {
      onSuccess: () => {
        clearClientSession(queryClient)
        queryClient.clear()
        navigate(PATH.SPLASH, { replace: true })
      },
    })
  }

  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-pretendard text-Gray-6 text-sm leading-5 font-normal tracking-[-0.56px]">
        계정관리
      </h2>

      <MenuRowGroup>
        <MenuRow label="로그아웃" onClick={() => handleOpen('logout')} />
        <MenuRow label="회원 탈퇴" variant="danger" onClick={() => handleOpen('withdraw')} />
      </MenuRowGroup>

      <AccountConfirmModal
        isOpen={Boolean(action)}
        type={action ?? 'logout'}
        onClose={handleClose}
        onConfirm={handleConfirm}
        isConfirming={action === 'logout' ? logout.isPending : removeAccount.isPending}
        errorMessage={
          action === 'logout' && logout.isError
            ? '로그아웃에 실패했어요. 다시 시도해주세요.'
            : action === 'withdraw' && removeAccount.isError
              ? '탈퇴 처리에 실패했어요. 다시 시도해주세요.'
              : undefined
        }
      />
    </section>
  )
}

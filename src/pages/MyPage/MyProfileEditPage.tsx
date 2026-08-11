import { useLocation, useNavigate } from 'react-router-dom'

import { MyProfileEdit } from '@/components/feature/my/MyProfileEdit'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { useUserProfileQuery } from '@/hooks/queries/user/useUserProfileQuery'
import { useUpdateMyProfileMutation } from '@/pages/MyPage/hooks/useUpdateMyProfileMutation'
import { MyPageLayout } from '@/pages/MyPage/MyPageLayout'
import { PATH } from '@/routes/paths'
import type { UserProfileFormValues } from '@/types/domain/user'

interface MyProfileEditLocationState {
  profileDraft?: UserProfileFormValues
  returnTo?: typeof PATH.MY_PAGE | typeof PATH.MY_SETTINGS
}

export function MyProfileEditPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const userQuery = useUserProfileQuery()
  const update = useUpdateMyProfileMutation()

  const locationState = location.state as MyProfileEditLocationState | null
  const profileDraft = locationState?.profileDraft
  const returnTo = locationState?.returnTo ?? PATH.MY_PAGE
  const handleBack = () => navigate(returnTo, { replace: true })

  const content =
    !!userQuery.error && userQuery.fetchStatus === 'idle' && !userQuery.data ? (
      <PageErrorView
        title="정보를 불러오지 못했어요."
        error={userQuery.error}
        onRetry={() => userQuery.refetch()}
      />
    ) : !userQuery.data ? (
      <PageLoadingView />
    ) : (
      <MyProfileEdit
        initialValues={profileDraft ?? userQuery.data.profileFormValues}
        characterType={userQuery.data.profile.characterType}
        isSubmitting={update.isPending}
        serverError={
          update.isError
            ? (update.error.serviceMessage ??
              '프로필을 저장하지 못했어요. 잠시 후 다시 시도해주세요.')
            : undefined
        }
        onSubmit={(values) => update.mutate(values, { onSuccess: () => navigate(PATH.MY_PAGE) })}
        onAddStock={(values) =>
          navigate(PATH.MY_EDIT_STOCKS, {
            state: { profileDraft: values, returnTo: PATH.MY_EDIT, profileEditReturnTo: returnTo },
          })
        }
      />
    )

  return (
    <MyPageLayout title="프로필 편집" onBack={handleBack}>
      {content}
    </MyPageLayout>
  )
}

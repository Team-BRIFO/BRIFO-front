import { useNavigate } from 'react-router-dom'

import { MyProfileEdit } from '@/components/feature/my/MyProfileEdit'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { useUserProfileQuery } from '@/hooks/queries/user/useUserProfileQuery'
import { useUpdateMyProfileMutation } from '@/pages/MyPage/hooks/useUpdateMyProfileMutation'
import { MyPageLayout } from '@/pages/MyPage/MyPageLayout'
import { PATH } from '@/routes/paths'

export function MyProfileEditPage() {
  const navigate = useNavigate()
  const userQuery = useUserProfileQuery()
  const update = useUpdateMyProfileMutation()
  if (!!userQuery.error && userQuery.fetchStatus === 'idle' && !userQuery.data)
    return (
      <MyPageLayout title="프로필 편집">
        <PageErrorView
          title="정보를 불러오지 못했어요."
          error={userQuery.error}
          onRetry={() => userQuery.refetch()}
        />
      </MyPageLayout>
    )
  if (!userQuery.data)
    return (
      <MyPageLayout title="프로필 편집">
        <PageLoadingView />
      </MyPageLayout>
    )
  const { profile, profileFormValues } = userQuery.data
  return (
    <MyPageLayout title="프로필 편집">
      <MyProfileEdit
        initialValues={profileFormValues}
        characterType={profile.characterType}
        isSubmitting={update.isPending}
        serverError={
          update.isError
            ? (update.error.serviceMessage ??
              '프로필을 저장하지 못했어요. 잠시 후 다시 시도해주세요.')
            : undefined
        }
        onSubmit={(values) => update.mutate(values, { onSuccess: () => navigate(PATH.MY_PAGE) })}
      />
    </MyPageLayout>
  )
}

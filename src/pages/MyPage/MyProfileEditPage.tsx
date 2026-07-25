import { useNavigate } from 'react-router-dom'

import { Loading } from '@/components/common/Loading'
import { MyProfileEdit } from '@/components/feature/my/MyProfileEdit'
import { useMyUser, useUpdateMyProfile } from '@/hooks/queries/useMy'
import { PATH } from '@/routes/paths'
import { mapMyUser, mapProfileFormValues } from '@/utils/myMapper'

import { MyPageError, MyPageLayout } from './MyPageLayout'

export function MyProfileEditPage() {
  const navigate = useNavigate()
  const userQuery = useMyUser()
  const update = useUpdateMyProfile()
  if (userQuery.isError)
    return (
      <MyPageLayout title="프로필 편집">
        <MyPageError onRetry={() => userQuery.refetch()} />
      </MyPageLayout>
    )
  if (!userQuery.data)
    return (
      <MyPageLayout title="프로필 편집">
        <Loading className="py-10" />
      </MyPageLayout>
    )
  const { profile } = mapMyUser(userQuery.data)
  return (
    <MyPageLayout title="프로필 편집">
      <MyProfileEdit
        initialValues={mapProfileFormValues(userQuery.data)}
        characterType={profile.characterType}
        isSubmitting={update.isPending}
        onSubmit={(values) =>
          update.mutate(
            {
              nickname: values.nickname,
              companyName: values.companyName,
              stockIds: values.interestStocks.map((stock) => stock.id),
            },
            { onSuccess: () => navigate(PATH.MY_PAGE) },
          )
        }
      />
    </MyPageLayout>
  )
}

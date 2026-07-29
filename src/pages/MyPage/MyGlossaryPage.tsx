import { Loading } from '@/components/common/Loading'
import { MyGlossaryList } from '@/components/feature/my/MyGlossaryList'
import { useMyLearnedTermsQuery } from '@/pages/MyPage/hooks/useMyQueries'
import { MyPageError, MyPageLayout } from '@/pages/MyPage/MyPageLayout'

export function MyGlossaryPage() {
  const query = useMyLearnedTermsQuery()
  if (query.isError && !query.data)
    return (
      <MyPageLayout title="내 용어장">
        <MyPageError onRetry={() => query.refetch()} />
      </MyPageLayout>
    )
  if (!query.data)
    return (
      <MyPageLayout title="내 용어장">
        <Loading className="py-10" />
      </MyPageLayout>
    )
  const entries = query.data.pages.flatMap((page) => page.entries)

  return (
    <MyPageLayout title="내 용어장">
      <MyGlossaryList
        learnedTermCount={query.data.pages[0].learnedTermCount}
        entries={entries}
        hasNext={query.hasNextPage}
        onLoadMore={() => query.fetchNextPage()}
        isLoadingMore={query.isFetchingNextPage}
        isEmpty={entries.length === 0}
      />
    </MyPageLayout>
  )
}

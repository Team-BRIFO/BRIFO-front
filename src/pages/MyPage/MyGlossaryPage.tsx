import { MyGlossaryList } from '@/components/feature/my/MyGlossaryList'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { useMyLearnedTermsQuery } from '@/pages/MyPage/hooks/useMyQueries'
import { MyPageLayout } from '@/pages/MyPage/MyPageLayout'

export function MyGlossaryPage() {
  const query = useMyLearnedTermsQuery()
  if (!!query.error && query.fetchStatus === 'idle' && !query.data)
    return (
      <MyPageLayout title="내 용어장">
        <PageErrorView
          title="정보를 불러오지 못했어요."
          error={query.error}
          onRetry={() => query.refetch()}
        />
      </MyPageLayout>
    )
  if (!query.data)
    return (
      <MyPageLayout title="내 용어장">
        <PageLoadingView />
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
        loadMoreError={query.isFetchNextPageError}
        isEmpty={entries.length === 0}
      />
    </MyPageLayout>
  )
}

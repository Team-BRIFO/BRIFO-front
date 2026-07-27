import { Loading } from '@/components/common/Loading'
import { MyGlossaryList } from '@/components/feature/my/MyGlossaryList'
import { useMyLearnedTerms } from '@/hooks/queries/useMy'
import { mapMyLearnedTerm } from '@/utils/myMapper'

import { MyPageError, MyPageLayout } from './MyPageLayout'

export function MyGlossaryPage() {
  const query = useMyLearnedTerms()
  if (query.isError)
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
  return (
    <MyPageLayout title="내 용어장">
      <MyGlossaryList
        learnedTermCount={query.data.pages[0].learnedTermCount}
        entries={query.data.pages.flatMap((page) => page.page.items.map(mapMyLearnedTerm))}
        hasNext={query.hasNextPage}
        onLoadMore={() => query.fetchNextPage()}
        isLoadingMore={query.isFetchingNextPage}
      />
    </MyPageLayout>
  )
}

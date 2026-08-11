import { useState } from 'react'

import { GlossaryBottomSheet } from '@/components/feature/glossary/GlossaryBottomSheet'
import { MyGlossaryList } from '@/components/feature/my/MyGlossaryList'
import { PageErrorView } from '@/components/feedback/PageErrorView'
import { PageLoadingView } from '@/components/feedback/PageLoadingView'
import { useMyLearnedTermsQuery } from '@/pages/MyPage/hooks/useMyQueries'
import { MyPageLayout } from '@/pages/MyPage/MyPageLayout'

export function MyGlossaryPage() {
  const query = useMyLearnedTermsQuery()
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null)
  const entries = query.data?.pages.flatMap((page) => page.entries) ?? []
  const content =
    !!query.error && query.fetchStatus === 'idle' && !query.data ? (
      <PageErrorView
        title="정보를 불러오지 못했어요."
        error={query.error}
        onRetry={() => query.refetch()}
      />
    ) : !query.data ? (
      <PageLoadingView />
    ) : (
      <>
        <MyGlossaryList
          learnedTermCount={query.data.pages[0].learnedTermCount}
          entries={entries}
          hasNext={query.hasNextPage}
          onLoadMore={() => query.fetchNextPage()}
          isLoadingMore={query.isFetchingNextPage}
          loadMoreError={query.isFetchNextPageError}
          isEmpty={entries.length === 0}
          onSelectEntry={setSelectedTermId}
        />
        <GlossaryBottomSheet
          isOpen={Boolean(selectedTermId)}
          term={selectedTermId ? { termId: selectedTermId, surface: '', displayOrder: 0 } : null}
          isLearned
          onClose={() => setSelectedTermId(null)}
        />
      </>
    )

  return <MyPageLayout title="내 용어장">{content}</MyPageLayout>
}

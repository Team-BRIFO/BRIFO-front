import { useMemo, useState } from 'react'

import BottomSheet from '@/components/common/BottomSheet'
import Button from '@/components/common/Button'
import UserAgreementItem from '@/components/feature/policy/UserAgreementItem'
import type { PolicyReagreementItem } from '@/types/domain/policy'
import { formatPolicyVersionTransition } from '@/utils/policyDate'

export interface PolicyReagreementBottomSheetProps {
  isOpen: boolean
  items: PolicyReagreementItem[]
  onAgree: (policyIds: string[]) => void
  onViewPolicy: (policyId: string) => void
  isPending?: boolean
}

interface PolicyReagreementSheetContentProps {
  items: PolicyReagreementItem[]
  onAgree: (policyIds: string[]) => void
  onViewPolicy: (policyId: string) => void
  isPending: boolean
}

function buildInitialCheckedState(items: PolicyReagreementItem[]) {
  return Object.fromEntries(items.map((item) => [item.policyId, false]))
}

function PolicyReagreementSheetContent({
  items,
  onAgree,
  onViewPolicy,
  isPending,
}: PolicyReagreementSheetContentProps) {
  const [checked, setChecked] = useState(() => buildInitialCheckedState(items))

  const requiredPolicyIds = useMemo(
    () => items.filter((item) => item.isRequired).map((item) => item.policyId),
    [items],
  )

  const isRequiredChecked =
    requiredPolicyIds.length > 0
      ? requiredPolicyIds.every((policyId) => checked[policyId])
      : items.every((item) => checked[item.policyId])

  const selectedPolicyIds = useMemo(
    () => items.filter((item) => checked[item.policyId]).map((item) => item.policyId),
    [checked, items],
  )

  const handleToggle = (policyId: string) => {
    setChecked((previous) => ({
      ...previous,
      [policyId]: !previous[policyId],
    }))
  }

  const handleAgree = () => {
    if (!isRequiredChecked || isPending) return
    onAgree(selectedPolicyIds)
  }

  return (
    <>
      <BottomSheet.Body className="flex flex-col">
        <div className="mt-4 flex flex-col gap-2 text-center">
          <h2 className="dnf-Subtitle2 text-Gray-10">약관이 개정되었어요</h2>
          <p className="pretendard-Caption2 text-Gray-6 leading-relaxed">
            서비스 이용을 위해 변경된 약관에 다시 동의해주세요
          </p>
        </div>

        <div className="border-Gray-2 mt-6 border-t">
          {items.map((item) => (
            <UserAgreementItem
              key={item.policyId}
              label={`${item.title} ${formatPolicyVersionTransition(item.version, item.previousVersion)}`}
              type={item.isRequired ? 'required' : 'optional'}
              checked={checked[item.policyId] ?? false}
              showType={false}
              onToggle={() => handleToggle(item.policyId)}
              onView={() => onViewPolicy(item.policyId)}
            />
          ))}
        </div>
      </BottomSheet.Body>

      <BottomSheet.Footer>
        <Button
          isFullWidth
          size="lg"
          color="primary"
          disabled={!isRequiredChecked || isPending}
          onClick={handleAgree}
        >
          {isPending ? '동의 처리 중...' : '동의하고 계속하기'}
        </Button>
      </BottomSheet.Footer>
    </>
  )
}

export function PolicyReagreementBottomSheet({
  isOpen,
  items,
  onAgree,
  onViewPolicy,
  isPending = false,
}: PolicyReagreementBottomSheetProps) {
  const itemsKey = useMemo(
    () => items.map((item) => `${item.policyId}:${item.version}`).join('|'),
    [items],
  )

  if (items.length === 0) return null

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={() => {}}
      ariaLabel="약관 개정 재동의"
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEscape={false}
    >
      {isOpen ? (
        <PolicyReagreementSheetContent
          key={itemsKey}
          items={items}
          onAgree={onAgree}
          onViewPolicy={onViewPolicy}
          isPending={isPending}
        />
      ) : null}
    </BottomSheet>
  )
}

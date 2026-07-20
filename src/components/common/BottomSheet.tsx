import type { ReactNode } from 'react'
import { Children, isValidElement, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children?: ReactNode
  /** 제목 영역 (header로도 대체 가능) */
  title?: ReactNode
  /** 커스텀 header 영역 (BottomSheet.Header를 children으로 넣는 방식도 지원) */
  header?: ReactNode
  /** 커스텀 footer 영역 (BottomSheet.Footer를 children으로 넣는 방식도 지원) */
  footer?: ReactNode
  /** 상단 그립(handle) 표시 여부 */
  showHandle?: boolean
  shouldCloseOnOverlayClick?: boolean
  shouldCloseOnEscape?: boolean
  ariaLabel?: string
  className?: string
}

function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  header,
  footer,
  showHandle = true,
  shouldCloseOnOverlayClick = true,
  shouldCloseOnEscape = true,
  ariaLabel = 'bottom sheet',
  className = '',
}: BottomSheetProps) {
  const dialogRef = useRef<HTMLElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const appRoot = document.getElementById('root')
    const previousAriaHidden = appRoot?.getAttribute('aria-hidden')

    appRoot?.setAttribute('aria-hidden', 'true')

    return () => {
      if (previousAriaHidden === null) {
        appRoot?.removeAttribute('aria-hidden')
        return
      }

      if (previousAriaHidden !== undefined) {
        appRoot?.setAttribute('aria-hidden', previousAriaHidden)
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const previousActiveElement = document.activeElement
    const dialog = dialogRef.current
    const firstFocusableElement = dialog?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)

    if (firstFocusableElement) {
      firstFocusableElement.focus()
    } else {
      dialog?.focus()
    }

    return () => {
      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus()
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const dialog = dialogRef.current
      const focusableElements = Array.from(
        dialog?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [],
      )

      if (focusableElements.length === 0) {
        event.preventDefault()
        dialog?.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
        return
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !shouldCloseOnEscape) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, shouldCloseOnEscape])

  const parsedChildren = Children.toArray(children)
  const headerChildren: ReactNode[] = []
  const bodyChildren: ReactNode[] = []
  const footerChildren: ReactNode[] = []
  const fallbackBodyChildren: ReactNode[] = []

  for (const child of parsedChildren) {
    if (isValidElement(child)) {
      if (child.type === Header) headerChildren.push(child)
      else if (child.type === Body) bodyChildren.push(child)
      else if (child.type === Footer) footerChildren.push(child)
      else fallbackBodyChildren.push(child)
    } else {
      fallbackBodyChildren.push(child)
    }
  }

  const resolvedBody = bodyChildren.length > 0 ? bodyChildren : fallbackBodyChildren
  const hasHeader = Boolean(title) || Boolean(header) || headerChildren.length > 0
  const hasFooter = Boolean(footer) || footerChildren.length > 0

  if (!isOpen) return null

  return createPortal(
    <div
      className="bg-Black/50 fixed inset-0 z-50 flex items-end justify-center"
      onClick={shouldCloseOnOverlayClick ? onClose : undefined}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : ariaLabel}
        tabIndex={-1}
        className={[
          'bg-White flex max-h-[85vh] w-full max-w-[360px] flex-col overflow-hidden rounded-t-3xl pt-3 shadow-lg',
          'focus-visible:outline-none',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={(event) => event.stopPropagation()}
      >
        {showHandle && (
          <div
            aria-hidden="true"
            className="bg-Gray-3 mx-auto mb-5 h-1 w-10 shrink-0 rounded-full"
          />
        )}

        {hasHeader && (
          <div className="shrink-0 px-6">
            {title && (
              <h3 id={titleId} className="pretendard-Title4 text-Gray-9 mb-4">
                {title}
              </h3>
            )}
            {header}
            {headerChildren}
          </div>
        )}

        <div className={`flex-1 overflow-y-auto px-6 ${hasFooter ? '' : 'pb-7'}`}>
          {resolvedBody}
        </div>

        {hasFooter && (
          <div className="shrink-0 px-6 pb-8">
            {footerChildren.length > 0 ? footerChildren : <div className="mt-6">{footer}</div>}
          </div>
        )}
      </section>
    </div>,
    document.body,
  )
}

interface BottomSheetSectionProps {
  children: ReactNode
  className?: string
}

function Header({ children, className = '' }: BottomSheetSectionProps) {
  return <header className={`mb-4 ${className}`}>{children}</header>
}

function Body({ children, className = '' }: BottomSheetSectionProps) {
  return <div className={`w-full ${className}`}>{children}</div>
}

function Footer({ children, className = '' }: BottomSheetSectionProps) {
  return <footer className={`mt-6 flex w-full flex-col gap-2 ${className}`}>{children}</footer>
}

BottomSheet.Header = Header
BottomSheet.Body = Body
BottomSheet.Footer = Footer

export default BottomSheet

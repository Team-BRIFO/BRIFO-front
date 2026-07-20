import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  shouldCloseOnOverlayClick?: boolean
  shouldCloseOnEscape?: boolean
  ariaLabel?: string
  className?: string
}

function Modal({
  isOpen,
  onClose,
  children,
  shouldCloseOnOverlayClick = true,
  shouldCloseOnEscape = true,
  ariaLabel = 'modal',
  className = '',
}: ModalProps) {
  const dialogRef = useRef<HTMLElement>(null)

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

  if (!isOpen) return null

  return createPortal(
    <div
      className="bg-Black/50 fixed inset-0 z-50 flex items-center justify-center"
      onClick={shouldCloseOnOverlayClick ? onClose : undefined}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        className={`bg-White w-82.5 rounded-3xl px-5 py-6 shadow-lg ${className} `}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </section>
    </div>,
    document.body,
  )
}

interface ModalHeaderProps {
  children: ReactNode
  className?: string
}

interface ModalBodyProps {
  children: ReactNode
  className?: string
}

interface ModalFooterProps {
  children: ReactNode
  className?: string
}

function Header({ children, className = '' }: ModalHeaderProps) {
  return <header className={`text-center ${className}`}>{children}</header>
}

function Body({ children, className = '' }: ModalBodyProps) {
  return <div className={`w-full ${className}`}>{children}</div>
}

function Footer({ children, className = '' }: ModalFooterProps) {
  return <footer className={`flex w-full flex-col gap-2 ${className}`}>{children}</footer>
}

Modal.Header = Header
Modal.Body = Body
Modal.Footer = Footer

export default Modal

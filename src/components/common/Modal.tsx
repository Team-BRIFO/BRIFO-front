import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

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
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={`bg-White w-82.5 rounded-3xl px-6 py-7 shadow-lg ${className} `}
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
  return <header className={`mb-4 text-center ${className}`}>{children}</header>
}

function Body({ children, className = '' }: ModalBodyProps) {
  return <div className={`w-full ${className}`}>{children}</div>
}

function Footer({ children, className = '' }: ModalFooterProps) {
  return <footer className={`mt-8 flex w-full flex-col gap-2 ${className}`}>{children}</footer>
}

Modal.Header = Header
Modal.Body = Body
Modal.Footer = Footer

export default Modal

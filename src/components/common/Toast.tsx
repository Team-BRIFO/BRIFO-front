interface ToastProps {
  message: string
}

export function Toast({ message }: ToastProps) {
  return (
    <div
      role="status"
      className="pretendard-Body2 fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-black/80 px-5 py-3 text-center text-white shadow-lg"
    >
      {message}
    </div>
  )
}

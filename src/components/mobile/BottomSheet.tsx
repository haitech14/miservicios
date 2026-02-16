import { useEffect } from 'react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[80vh] overflow-auto pb-safe"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'bottomsheet-title' : undefined}
      >
        <div className="sticky top-0 bg-white py-3 flex justify-center">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>
        {title && (
          <h2 id="bottomsheet-title" className="px-4 pb-2 font-semibold">
            {title}
          </h2>
        )}
        <div className="px-4 pb-6">{children}</div>
      </div>
    </>
  )
}

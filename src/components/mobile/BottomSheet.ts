import React, { useEffect, useState, useRef, useCallback, type ReactNode } from 'react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startY = useRef(0)
  const sheetRef = useRef<HTMLDivElement>(null)
  const scrollTopRef = useRef(0)

  useEffect(() => {
    if (isOpen) {
      scrollTopRef.current = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = '-' + scrollTopRef.current + 'px'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      window.scrollTo(0, scrollTopRef.current)
      setDragY(0)
      setIsDragging(false)
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
    }
  }, [isOpen])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && sheetRef.current) {
      const sheet = sheetRef.current
      if (sheet.scrollTop === 0 || e.target === sheet.querySelector('.drag-handle')) {
        startY.current = e.touches[0].clientY
        setIsDragging(true)
      }
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return
    const currentY = e.touches[0].clientY
    const deltaY = currentY - startY.current
    if (deltaY > 0) {
      setDragY(deltaY)
      e.preventDefault()
    }
  }, [isDragging])

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return
    if (dragY > 100) {
      onClose()
    } else {
      setDragY(0)
    }
    setIsDragging(false)
  }, [isDragging, dragY, onClose])

  if (!isOpen) return null

  const translateY = Math.max(0, dragY)
  const sheetStyle = {
    transform: 'translateY(' + translateY + 'px)',
    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: isDragging ? 'transform' : 'auto',
  }

  const overlay = React.createElement('div', {
    className: 'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
    style: { opacity: isOpen ? 1 : 0 },
    onClick: onClose,
    'aria-hidden': 'true',
  })

  const sheet = React.createElement(
    'div',
    {
      ref: sheetRef,
      className: 'fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[85vh] overflow-auto pb-safe shadow-2xl gpu-accelerated scroll-smooth-mobile',
      style: sheetStyle,
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': title ? 'bottomsheet-title' : undefined,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    React.createElement(
      'div',
      { className: 'sticky top-0 bg-white py-3 flex justify-center touch-none drag-handle z-10' },
      React.createElement('div', { className: 'w-12 h-1.5 bg-gray-300 rounded-full' })
    ),
    title ? React.createElement('h2', { id: 'bottomsheet-title', className: 'px-4 pb-3 font-semibold text-lg' }, title) : null,
    React.createElement('div', { className: 'px-4 pb-6' }, children)
  )

  return React.createElement(React.Fragment, null, overlay, sheet)
}

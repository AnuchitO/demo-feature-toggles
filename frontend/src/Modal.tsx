import { ReactNode } from 'react'
import { Dialog as HeadlessDialog, DialogTitle, DialogPanel } from '@headlessui/react'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  children: ReactNode
}

export function Dialog({ isOpen, onClose, title, description, children }: DialogProps) {
  return (
    <HeadlessDialog open={isOpen} onClose={onClose} className="relative z-10 focus:outline-none">
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out transform transition">
            <DialogTitle as="h3" className="text-base/7 font-medium text-white">
              {title}
            </DialogTitle>
            <p className="mt-2 text-sm/6 text-white/50">{description}</p>
            <div className="mt-4">
              {children}
            </div>
          </DialogPanel>
        </div>
      </div>
    </HeadlessDialog>
  )
}

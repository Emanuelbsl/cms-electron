import clsx from 'clsx'
import { ReactNode } from 'react'

interface ItemProps {
  isActive?: boolean
  children: ReactNode
}

export function Item({ isActive = false, children }: ItemProps) {
  const Comp = isActive ? 'span' : 'a'

  return (
    <Comp
      href="#"
      className={clsx(
        'inline-flex items-center gap-2 hover:text-portal-primary-800',
        {
          'text-portal-primary-600': isActive,
        },
      )}
    >
      {children}
    </Comp>
  )
}

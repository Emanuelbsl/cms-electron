import { DotsThree } from '@phosphor-icons/react'
import clsx from 'clsx'
import { ReactNode } from 'react'
import { Link as Redirect } from 'react-router-dom'

interface LinkProps {
  children: ReactNode
  to: string
}

export function Link({ children, to }: LinkProps) {
  return (
    <Redirect
      to={to}
      className={clsx(
        'flex items-center text-sm gap-2 text-san-marino-50 dark:text-gray-50 dark:hover:text-gray-900 py-1 px-3 rounded group hover:bg-san-marino-600 dark:hover:bg-gray-600',
      )}
    >
      <span className="truncate flex-1">{children}</span>

      <div className="flex items-center h-full group-hover:visible ml-auto text-san-marino-50 dark:text-gray-50">
        <button
          type="button"
          title="button-link"
          className="px-px rounded-sm hover:bg-san-marino-700 dark:hover:bg-gray-700"
        >
          <DotsThree weight="bold" className="h-4 w-4" />
        </button>
      </div>
    </Redirect>
  )
}

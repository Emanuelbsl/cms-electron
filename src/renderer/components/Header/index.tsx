import * as Collapsible from '@radix-ui/react-collapsible'

import { CaretDoubleRight, Door } from '@phosphor-icons/react'

import useAuth from '@renderer/store/useAuth'
import clsx from 'clsx'

interface HeaderProps {
  isSidebarOpen: boolean
}

export function Header({ isSidebarOpen }: HeaderProps) {
  const isMacOS = process.platform === 'darwin'
  const logout = useAuth((state) => state.logout)

  return (
    <div
      id="header"
      className={clsx(
        'border-b bg-san-marino-500 dark:bg-gray-800 border-b-san-marino-600 dark:border-b-gray-500 py-[1.125rem] px-6 flex items-center gap-4 leading-tight transition-all duration-250 region-drag relative left-[-1px]',
        {
          'pl-24': !isSidebarOpen && isMacOS,
          'w-screen': !isSidebarOpen,
          'w-[calc(100vw-240px)]': isSidebarOpen,
        },
      )}
    >
      <Collapsible.Trigger
        type="button"
        title="button-sidebar-open"
        className={clsx(
          'h-5 w-5 text-san-marino-50 dark:text-gray-50 dark:hover:text-gray-900 hover:text-san-marino-700 region-no-drag cursor-pointer',
          {
            hidden: isSidebarOpen,
            block: !isSidebarOpen,
          },
        )}
      >
        <CaretDoubleRight className="h-4 w-4" />
      </Collapsible.Trigger>

      <>
        <div className="ml-auto inline-flex region-no-drag">
          <button
            onClick={() => logout()}
            type="button"
            className="inline-flex items-center gap-1 text-san-marino-50 text-sm hover:text-san-marino-700 cursor-pointer dark:text-gray-50 dark:hover:text-gray-900"
          >
            <Door className="h-4 w-4" /> Sair
          </button>
        </div>
      </>
    </div>
  )
}

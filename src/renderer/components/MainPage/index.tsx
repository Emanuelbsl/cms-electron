import { ReactNode } from 'react'

interface RootProps {
  children: ReactNode
}

export const Main = (props: RootProps) => (
  <main
    className="h-full w-full flex-1 flex bg-san-marino-50 dark:bg-gray-900 items-center justify-center text-san-marino-700 dark:text-gray-50"
    {...props}
  />
)

import { ReactNode } from 'react'

interface RootProps {
  children: ReactNode
}

export const Paper = (props: RootProps) => {
  return (
    <div className="p-3 border border-san-marino-500 rounded-md bg-san-marino-200 h-full w-full dark:bg-gray-800 dark:border-gray-700">
      {props.children}
    </div>
  )
}

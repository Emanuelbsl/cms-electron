import { ReactNode } from 'react'

interface SectionTitleProps {
  children: ReactNode
}

export function SectionTitle(props: SectionTitleProps) {
  return (
    <div
      className="text-san-marino-300 dark:text-gray-500  mx-3 uppercase text-xs font-semibold"
      {...props}
    />
  )
}

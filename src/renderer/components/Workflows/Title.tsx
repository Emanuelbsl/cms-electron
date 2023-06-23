import { Plus } from '@phosphor-icons/react'
import clsx from 'clsx'

interface propsTitle {
  title: string
  subTitle: string
  nameButton: string
  disabled?: boolean
  onClick: () => void
}

export const Title = ({
  title,
  subTitle,
  nameButton,
  onClick,
  disabled,
}: propsTitle) => {
  return (
    <div className="relative">
      <h4 className="text-lg font-semibold">{title}</h4>
      <div className="text-sm font-normal opacity-80">{subTitle}</div>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={clsx(
          'text-san-marino-800 flex px-1 items-center text-sm gap-2 py-2 hover:text-san-marino-500 disabled:opacity-60 absolute right-1 top-1 cursor-pointer',
          {
            'cursor-not-allowed': disabled,
          },
        )}
      >
        <Plus className="h-4 w-4" weight="bold" />
        {nameButton}
      </button>
    </div>
  )
}

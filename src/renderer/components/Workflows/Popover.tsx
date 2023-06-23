import * as Popover from '@radix-ui/react-popover'

import { Gear, X } from '@phosphor-icons/react'
import React, { ReactNode, useState } from 'react'

import ButtonIcon from '../Button/Icon'

interface IPopoverWorkflow {
  icon: React.ComponentType
  disabled?: boolean
  children: ReactNode
  title?: string
}

export const PopoverWorkflow = (props: IPopoverWorkflow) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover.Root open={open}>
      <Popover.Trigger asChild>
        <ButtonIcon
          disabled={props?.disabled}
          onClick={(event: any) => {
            event.stopPropagation()
            setOpen((prevOpen) => !prevOpen)
          }}
          icon={props.icon || Gear}
        />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={5}
          className="border inline-block duration-300 rounded-md shadow-sm p-5 w-80 bg-portal-secondary-100 border-portal-secondary-500 data-[state=open]data-[side=top]:animate-slideDown data-[state=open]data-[side=right]:animate-slideLeft data-[state=open]data-[side=bottom]:animate-slideUp data-[state=open]data-[side=left]:animate-slideRight ease-in-out will-change-[transform, opacity]"
        >
          {props.title && (
            <div className="flex flex-col gap-2 text-sm font-medium">
              <p className="mb-2 m-0 text-portal-secondary-900">
                {props.title}
              </p>
            </div>
          )}
          {props.children}
          <Popover.Close className="absolute top-1 right-1" aria-label="Close">
            <X
              size={20}
              className="text-san-marino-800 hover:text-portal-primary-700 cursor-pointer"
              onClick={(event) => {
                event.stopPropagation()
                setOpen((prevOpen) => !prevOpen)
              }}
            />
          </Popover.Close>
          <Popover.Arrow />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

import { Gear, Key, TrafficSign, Trash, WarningCircle } from '@phosphor-icons/react'
import React, { useEffect, useState } from 'react'

import ButtonIcon from '../Button/Icon'
import { Input } from './Input'
import { PopoverWorkflow } from './Popover'
import clsx from 'clsx'
import useDebounce from '../../hooks/useDebounce'
import useWorkflowStore from '../../store/useWorkflowStore'

interface propsListGroup {
  children: any[]
  erro: any
  uuId: string
  color: string
  name: string
  is_handler: number
  sla?: number
  responsible?: boolean
  form_handle?: string
}

export const ListGroup = (props: propsListGroup) => {
  const selectedGroup = useWorkflowStore((state) => state.selectedGroup)
  const deleteGroup = useWorkflowStore((state) => state.deleteGroup)
  const updateGroup = useWorkflowStore((state) => state.updateGroup)

  const [params, setParams] = useState({ uuId: props?.uuId })
  const debounce = useDebounce(params, 3000)

  const uuId = props?.uuId
  const count = props?.children?.length || 0
  const error = !!props?.erro[uuId]

  useEffect(() => {
    if (!Object.keys(params).length) return
    updateGroup(uuId, params)
  }, [debounce])

  const handleInput = (events: React.ChangeEvent<HTMLInputElement>) => {
    const name = events.target.name
    const value = events.target.value
    setParams((prevParams) => ({ ...prevParams, [name]: value }))
  }

  return (
    <li
      className={clsx(
        'relative  hover:bg-san-marino-100 last:rounded-b-md first:rounded-t-md',
        {
          ' bg-red-100': error,
        },
      )}
    >
      <span
        className="border-l-4 h-4/5 absolute -left-2 top-2 rounded-md"
        style={{ borderLeftColor: props?.color }}
      />
      <a
        href="#"
        className="items-center block p-3 sm:flex "
        onClick={() => selectedGroup(uuId)}
      >
        <div className="text-san-marino-800">
          <div className="text-base font-normal ">
            <span className="font-medium ">{props?.name}</span>
          </div>
          <div className="text-sm font-normal">
            {count && `${count} status vinculados`}
          </div>
          <span className="inline-flex items-center text-xs font-normal text-san-marino-80 ">
            {props?.is_handler ? (
              <>
                <TrafficSign size={15} weight="bold" className="mr-1" />
                Fluxo
              </>
            ) : (
              <>
                <Key size={15} weight="bold" className="mr-1" />
                Formulário
              </>
            )}
          </span>
          <div className="absolute right-1 top-1 flex">
            {error && <WarningCircle size={20} className="text-red-500" />}
            <PopoverWorkflow
              icon={Gear}
              title="Configurações"
              disabled={false}
              // disabled={!props?.is_handler}
            >
              <Input
                label="Nome"
                name="name"
                defaultValue={props?.name}
                onChange={handleInput}
              />
              <Input
                label="sla"
                name="sla"
                defaultValue={props?.sla}
                onChange={handleInput}
              />
              <Input
                label="Campo responsável"
                name="responsible"
                onChange={handleInput}
              />
              <Input
                label="Key Formulário"
                name="form_handle"
                defaultValue={props?.form_handle}
                onChange={handleInput}
              />
            </PopoverWorkflow>

            <ButtonIcon
              onClick={(event: any) => {
                event.stopPropagation()
                deleteGroup(uuId)
              }}
              icon={Trash}
            />
          </div>
        </div>
      </a>
    </li>
  )
}

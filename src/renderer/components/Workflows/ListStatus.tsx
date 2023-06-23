import { Gear, Trash } from '@phosphor-icons/react'
import React, { useEffect, useState } from 'react'

import useDebounce from '../../hooks/useDebounce'
import useWorkflowStore from '../../store/useWorkflowStore'
import ButtonIcon from '../Button/Icon'
import { InputName } from './InputName'
import { PopoverWorkflow } from './Popover'
import { SelectComponent } from './Select'
import { Toggle } from './Toggle'

interface propsListStatus {
  erro: any
  uuId: string
  action: string
  name: string
  done: number
  isMan: boolean
}

export const ListStatus = (props: propsListStatus) => {
  const updateStatus = useWorkflowStore((state) => state.updateStatus)
  const deleteStatus = useWorkflowStore((state) => state.deleteStatus)
  const [params, setParams] = useState({
    uuId: props?.uuId,
    done: props?.done,
  })

  const debounce = useDebounce(params, 3000)
  const uuId = props?.uuId
  const error = !!props?.erro[uuId]

  useEffect(() => {
    if (!Object.keys(params).length) return
    updateStatus(uuId, params)
  }, [debounce])

  const handleInput = (events: React.ChangeEvent<HTMLInputElement>) => {
    const name = events.target.name
    const value = events.target.value
    setParams((prevParams) => ({ ...prevParams, [name]: value }))
  }

  const handleToggle = (events: React.ChangeEvent<HTMLInputElement>) => {
    const name = events?.target?.name
    const checked = events?.target?.checked ? 1 : 0
    setParams((prevParams) => ({ ...prevParams, [name]: checked }))
  }

  return (
    <li className="bg-portal-primary-100 rounded-sm mt-2 relative border border-portal-primary-200">
      <div className="items-center block p-3 sm:flex">
        <div className="text-gray-600 w-full">
          <div className="text-base font-normal">
            <span className="font-medium text-portal-primary-700">
              <InputName
                name="name"
                defaultValue={props?.name}
                onChange={handleInput}
              />
            </span>
          </div>
          <div className="text-sm font-normal text-san-marino-800 flex items-center">
            <span className="pr-3">Tratador:</span>
            {props?.action}
          </div>
          <div className="absolute right-1 top-1">
            <PopoverWorkflow
              icon={Gear}
              title="Configurações"
              disabled={props?.isMan}
            >
              <Toggle
                label="Encerrar"
                name="done"
                checked={!!params?.done}
                onChange={handleToggle}
              />
              <SelectComponent
                options={[
                  { value: 'fox', label: '🦊 Fox' },
                  { value: 'Butterfly', label: '🦋 Butterfly' },
                  { value: 'Honeybee', label: '🐝 Honeybee' },
                ]}
                isDisabled={!!params?.done}
              />
            </PopoverWorkflow>
            <ButtonIcon
              onClick={(event: any) => {
                event.stopPropagation()
                deleteStatus(uuId)
              }}
              icon={Trash}
            />
          </div>
        </div>
      </div>
    </li>
  )
}

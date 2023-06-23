import {
  Gear,
  Key,
  Plus,
  TrafficSign,
  Trash,
  WarningCircle,
} from '@phosphor-icons/react'
import { ChangeEvent, useEffect, useState } from 'react'

import clsx from 'clsx'
import ButtonIcon from '../../components/Button/Icon'

const uniqueId = () => `id-${Math.random().toString(16).slice(-4)}`

export function WORKFLOW_CREATE() {
  const workflowName = 'FLUXO TESTE' || ''
  const [workflow, setWorkflow] = useState<any[]>([
    {
      id: uniqueId(),
      is_handler: 0,
      name: 'Solicitação',
      color: '#f44336',
      children: [
        { id: uniqueId(), name: 'Enviado', action: 'Tratamento', done: 0 },
      ],
    },
    {
      id: uniqueId(),
      name: 'Tratamento',
      is_handler: 1,
      color: '#9c27b0',
      children: [
        {
          id: uniqueId(),
          name: 'Enviar p/ Validação',
          action: 'Validação',
          done: 0,
        },
        { id: uniqueId(), name: 'Enviar p/ Dúvida', action: 'Duvida', done: 0 },
      ],
    },
  ])
  const [selected, setSelected] = useState(
    // eslint-disable-next-line camelcase
    () => workflow?.find(({ is_handler }) => !is_handler)?.id,
  )

  const [directionSelected, setDirectionSelected] = useState({})

  const [erro, setError] = useState({})
  const actions = workflow?.find(({ id }) => id === selected)!.children || []

  const handleSelect = (id: any) => {
    setSelected(id)
  }

  const handleAddAction = () => {
    const temp = [...workflow]

    const id = uniqueId()
    const newState = {
      id,
      name: `* Nova Etapa ${id}`,
      action: null,
    }

    let newActin = temp?.find(({ id }) => id === selected) || {}

    if (!newActin?.is_handler) return

    newActin = newActin!.children || []
    newActin.push(newState)

    setWorkflow(temp)
  }

  const handleAddStage = () => {
    const id = uniqueId()
    const color = Math.floor(Math.random() * 16777215).toString(16)
    const newState = {
      id,
      is_handler: 1,
      name: `* Nova Etapa ${id}`,
      color: `#${color}`,
      children: [{ id: uniqueId(), name: 'Encerrar', action: null, done: 0 }],
    }
    setWorkflow((prev) => [...prev, newState])
  }

  const handleRemoverStage = (event: any, id: string) => {
    event.stopPropagation()
    const newWorkflow = workflow.filter((w) => w.id !== id)
    if (newWorkflow.length === 2) return

    setWorkflow(newWorkflow)
  }

  const handleRemoverAction = (event: any, idAction: string) => {
    event.stopPropagation()

    setWorkflow((prevWorkflow) =>
      prevWorkflow?.map((w) => {
        if (selected === w?.id && w?.children) {
          if (w?.children?.length === 1) return w
          w!.children = w?.children?.filter(
            (c: { id: string }) => c?.id !== idAction,
          )
        }
        return w
      }),
    )
  }

  useEffect(() => {
    generateWorkflowJSON(workflow)
  }, [workflow])

  useEffect(() => {
    workflow.map((w: { name: string; id: string; is_handler: number }) => {
      const requester = getRequester(w?.name, workflowName)
      const id = w?.id
      if (w?.is_handler && !requester) {
        return setError((prevError) => ({ ...prevError, [id]: true }))
      }
      setError((prevError) => ({ ...prevError, [id]: false }))
    })
  }, [workflow])

  const getRequester = (name: string, workflowName: string) => {
    return workflow.reduce((accumulator, w) => {
      const requestAction = w?.children?.reduce(
        (accumulator: string, c: { done: number; action: string }) => {
          if (!c?.done && c?.action === name) {
            return `${workflowName} - ${w?.name}`
          }
          return accumulator
        },
        null,
      )
      if (requestAction) {
        accumulator = requestAction
      }
      return accumulator
    }, null)
  }

  const handleSelectDirection = (
    event: ChangeEvent<HTMLSelectElement>,
    action: { id: string },
  ) => {
    let temp = [...workflow]
    const name = event.target.value

    let newActin = temp?.find((t: { id: string }) => t?.id === selected) || {}

    newActin = newActin!.children || []
    newActin = newActin?.map((a: { id: string }) => {
      return action?.id === a?.id ? { ...a, action: name } : a
    })

    temp = temp?.map((t) => {
      return t?.id === selected ? { ...t, children: newActin } : t
    })
    setWorkflow(temp)
    // setDirectionSelected((prev) => ({
    //   ...prev,
    //   [id]: event.target.value,
    // }));
  }

  const generateWorkflowJSON = (workflow: any[]) => {
    // eslint-disable-next-line camelcase
    const steps = workflow.map(({ name }) => name)
    const groups = workflow.map(
      // eslint-disable-next-line camelcase
      ({ name }) => `${workflowName} - ${name}`,
    )

    const groupOrderingTypes = workflow.map((w) => {
      const requester = getRequester(w?.name, workflowName)
      const handler = `${workflowName} - ${w.name}`

      return {
        handler,
        requester: !w?.is_handler ? handler : requester,
        step: w?.name,
        name: String(w?.name)
          .replace(/[^a-zA-Z\s]/g, '')
          .toUpperCase(),
        is_handler: w?.is_handler ?? 0,
        sla: w?.sla ?? 3,
        status: w?.children?.map(
          (c: { name: string; done: number; action: string }) => {
            return {
              status_name: c?.name,
              done: c?.done ?? 1,
              alias_unique: 'help-exclusao-02-solicitacao',
              default_status_id: !w?.is_handler ? 1 : 0,
              action: c?.action,
            }
          },
        ),
      }
    })

    const groupsRedirect = groupOrderingTypes.map((g) => {
      return {
        step: g?.step,
        name: g?.name,
        status: g?.status?.map(
          (s: { status_name: string; done: number; action: string }) => {
            return {
              status_name: s?.status_name,
              done: s?.done,
              task_redirect: String(s?.action)
                .replace(/[^a-zA-Z\s]/g, '')
                .toUpperCase(),
            }
          },
        ),
      }
    })

    const workflowJSON = {
      // eslint-disable-next-line camelcase
      workflow_name: workflowName,
      steps,
      groups,
      group_ordering_types: groupOrderingTypes,
      groups_redirect: groupsRedirect,
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center text-portal-primary-400 p-2 ">
      <div className="flex h-full w-full flex-col">
        <div className="flex p-1 px-3 w-full ">Nome do fluxo</div>
        <div className="flex h-full w-full p-2 gap-2">
          <div className="p-5 border border-portal-secondary-300 rounded-lg bg-portal-secondary-50 h-full w-full">
            <div className="relative">
              <h4 className="text-lg font-semibold">Etapa de Fluxo</h4>
              <div className="text-sm font-normal opacity-80">
                Informe as etapas para cada ação
              </div>
              <button
                onClick={() => handleAddStage()}
                className="text-portal-primary-700 flex px-1 items-center text-sm gap-2 py-2 hover:text-portal-primary-300 disabled:opacity-60 absolute right-1 top-1"
              >
                <Plus className="h-4 w-4" weight="bold" />
                Nova Etapa
              </button>
            </div>

            <ul className="mt-3 divide-y divide-portal-primary-100 bg-portal-primary-50 rounded-md border border-portal-primary-100">
              {workflow.map((etapa) => {
                const count = etapa?.children?.length || 0
                const error = !!erro[etapa.id]
                return (
                  <li
                    className={clsx('relative border-l-4', {
                      ' bg-red-100': error,
                    })}
                    key={etapa.id}
                    style={{ borderLeftColor: etapa?.color }}
                  >
                    <a
                      href="#"
                      className="items-center block p-3 sm:flex hover:bg-gray-100"
                      onClick={() => handleSelect(etapa?.id)}
                    >
                      <div className="text-gray-600">
                        <div className="text-base font-normal ">
                          <span className="font-medium ">{etapa?.name}</span>
                        </div>
                        <div className="text-sm font-normal">
                          {count && `${count} status vinculados`}
                        </div>
                        <span className="inline-flex items-center text-xs font-normal text-gray-500 ">
                          {etapa?.is_handler ? (
                            <>
                              <TrafficSign
                                size={15}
                                weight="bold"
                                className="mr-1"
                              />
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
                          {error && (
                            <WarningCircle
                              size={20}
                              weight="bold"
                              className="text-red-500"
                            />
                          )}
                          <Gear weight="bold" size={20} />
                          <ButtonIcon
                            onClick={(event: any) =>
                              handleRemoverStage(event, etapa?.id)
                            }
                            icon={Trash}
                          />
                        </div>
                      </div>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="p-5 border border-portal-secondary-300 rounded-lg bg-portal-secondary-50 h-full w-full">
            <div className="relative">
              <h4 className="text-lg font-semibold">Ações do Fluxo</h4>
              <div className="text-sm font-normal opacity-80">
                Informa as ações para cada item
              </div>
              <button
                onClick={() => handleAddAction()}
                className="text-portal-primary-700 flex px-1 items-center text-sm gap-2 py-2 hover:text-portal-primary-300 disabled:opacity-60 absolute right-1 top-1"
              >
                <Plus className="h-4 w-4" weight="bold" />
                Nova Ação
              </button>
            </div>
            <ul className="mt-3">
              {actions?.map((action: { id: any; name?: any; action?: any }) => {
                return (
                  <li
                    key={action.id}
                    className="bg-portal-primary-100 rounded-sm mt-2 relative"
                  >
                    <a
                      href="#"
                      className="items-center block p-3 sm:flex hover:bg-gray-100"
                    >
                      <div className="text-gray-600 w-full">
                        <div className="text-base font-normal">
                          <span className="font-medium text-portal-primary-700">
                            {action.name}
                          </span>
                        </div>
                        <div className="text-sm font-normal text-san-marino-800 flex items-center">
                          <span className="pr-3">Tratador:</span>
                          <label htmlFor="underline_select" className="sr-only">
                            Underline select
                          </label>
                          <select
                            defaultValue="encerrar"
                            // value={action?.action === w?.name}
                            onChange={(event) =>
                              handleSelectDirection(event, action)
                            }
                            className="block py-1 px-0 w-full text-sm text-portal-primary-800 bg-transparent border-0 border-b-2 border-portal-primary-300 appearance-none  focus:outline-none focus:ring-0 focus:border-portal-primary-500"
                          >
                            <option value="encerrar">ENCERRAR</option>
                            {workflow?.map(
                              (w: {
                                id: string
                                name: string
                                color: string
                              }) => {
                                return (
                                  <option
                                    className="border border-l-4"
                                    style={{ borderLeftColor: w?.color }}
                                    key={w?.id}
                                    value={w?.name}
                                    selected={action?.action === w?.name}
                                  >
                                    {w?.name}
                                  </option>
                                )
                              },
                            )}
                          </select>
                        </div>
                        <div className="absolute right-1 top-1">
                          <ButtonIcon
                            onClick={(event: any) =>
                              handleRemoverAction(event, action?.id)
                            }
                            icon={Trash}
                          />
                        </div>
                      </div>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

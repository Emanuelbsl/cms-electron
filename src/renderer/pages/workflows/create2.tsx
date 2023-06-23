import * as Workflows from '@renderer/components/Workflows'

import { Main } from '@renderer/components/MainPage'
import { Paper } from '@renderer/components/Paper'
import useWorkflowStore from '@renderer/store/useWorkflowStore'

export function WFCreate() {
  const { groups, selected, name, status, erro } = useWorkflowStore(
    (state) => ({
      groups: state.groups,
      selected: state.selected,
      name: state.name,
      erro: state.erro,
      status: state.status,
    }),
  )

  const addGroups = useWorkflowStore((state) => state.addGroups)
  const addStatus = useWorkflowStore((state) => state.addStatus)

  const isMain = groups?.find((group: any) => group.uuId === selected) || {}

  return (
    <Main>
      <div className="flex h-full w-full flex-col">
        <div className="flex p-1 px-3 w-full">Nome: {name}</div>
        <div className="flex h-full w-full p-2 gap-2">
          <Paper>
            <Workflows.Title
              title="Etapa de Fluxo"
              subTitle="Informe as etapas para cada ação"
              nameButton="Nova Etapa"
              onClick={() => addGroups()}
            />
            <ul className="mt-3 divide-y divide-san-marino-500 bg-san-marino-50 rounded-md border border-san-marino-500">
              {groups?.map((group) => (
                <Workflows.ListGroup {...group} key={group?.uuId} erro={erro} />
              ))}
            </ul>
          </Paper>
          <Paper>
            <Workflows.Title
              title="Ações do Fluxo"
              subTitle="Informa as ações para cada item"
              nameButton="Nova Ação"
              onClick={() => addStatus()}
              disabled={!isMain?.is_handler}
            />
            <ul className="mt-3">
              {status?.map((action) => (
                <Workflows.ListStatus
                  isMan={!isMain?.is_handler}
                  key={action?.uuId}
                  erro={erro}
                  {...action}
                />
              ))}
            </ul>
          </Paper>
        </div>
      </div>
    </Main>
  )
}

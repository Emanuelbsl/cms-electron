import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

const getColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
const uniqueId = () => Math.random().toString(26).slice(-12)

type WorkflowStore = {
  groups: any[]
  selected: string | null
  erro: any
  status: any[]
  name: string
}

type WorkflowDispatch = {
  addGroups: () => void
  deleteGroup: (uuId: string) => void
  selectedGroup: (uuId: string) => void
  addStatus: () => void
  deleteStatus: (statusUuId: string) => void
  updateGroup: (statusUuId: string, params: any) => void
  updateStatus: (statusUuId: string, params: any) => void
}

const workflowsDefaultValue = {
  groups: [
    {
      uuId: uuidv4(),
      is_handler: 0,
      name: 'Solicitação',
      sla: 3,
      color: '#f44336',
      children: [
        { uuId: uuidv4(), name: 'Enviado', action: 'Tratamento', done: 0 },
      ],
    },
    {
      uuId: uuidv4(),
      name: 'Tratamento',
      is_handler: 1,
      sla: 3,
      color: '#9c27b0',
      children: [
        {
          uuId: uuidv4(),
          name: 'Enviar p/ Validação',
          action: 'Validação',
          done: 0,
        },
        {
          uuId: uuidv4(),
          name: 'Enviar p/ Dúvida',
          action: 'Duvida',
          done: 0,
        },
      ],
    },
  ],
  selected: null,
  erro: {},
  status: [],
  name: '* nome do fluxo',
}

type WorkflowProps = WorkflowStore & WorkflowDispatch

const useWorkflowStore = create<WorkflowProps>((set) => ({
  ...workflowsDefaultValue,
  addGroups: () => {
    const uuIdGroup = uuidv4()
    const newGroup = {
      uuId: uuIdGroup,
      is_handler: 1,
      sla: 3,
      name: `* Nova Etapa ${uniqueId()}`,
      color: getColor(),
      children: [{ uuId: uuidv4(), name: 'Encerrar', action: null, done: 0 }],
    }

    set((state: WorkflowStore) => {
      return {
        ...state,
        groups: [...state?.groups, newGroup],
        erro: {
          ...state?.erro,
          [uuIdGroup]:
            'Grupo sem Item atrelado, Não existe direcionamento para essa etapa do fluxo!',
        },
      }
    })
  },
  deleteGroup: (uuId: string) => {
    set((state: WorkflowStore) => {
      if (state.groups.length === 2) return { ...state }

      const newError = { ...state.erro }
      delete newError[uuId]

      return {
        ...state,
        groups: state.groups.filter((group: any) => group?.uuId !== uuId),
        erro: newError,
      }
    })
  },
  selectedGroup: (uuId: string) => {
    set((state: WorkflowStore) => {
      return {
        ...state,
        selected: uuId,
        status:
          state.groups?.find((group: any) => group?.uuId === uuId)!.children ||
          [],
      }
    })
  },
  addStatus: () => {
    const newElement = {
      uuId: uuidv4(),
      name: `* Nova Etapa ${uniqueId()}`,
      done: 1,
      action: 'FINALIZAR',
    }

    set((state: WorkflowStore) => {
      const { groups, selected } = state
      const uuId = selected

      const tempGroups = groups?.find((group: any) => group.uuId === uuId) || {}
      if (!tempGroups?.is_handler) return { ...state }

      const newGroup = groups?.map((group: any) => {
        if (group?.uuId === uuId) {
          return { ...group, children: [...group?.children, newElement] }
        }
        return group
      })

      return {
        ...state,
        status: [...state?.status, newElement],
        groups: [...newGroup],
      }
    })
  },
  deleteStatus: (statusUuId: string) => {
    set((state: WorkflowStore) => {
      const { groups, selected, status } = state
      const uuId = selected

      if (status?.length <= 1) {
        return {
          ...state,
        }
      }

      const newStatus = status?.filter(
        (status: { uuId: string }) => status?.uuId !== statusUuId,
      )

      const newGroups = groups?.map((group: any) => {
        if (uuId === group?.uuId && group?.children) {
          if (group?.children?.length === 1) return group
          group!.children = newStatus
        }
        return group
      })

      return {
        ...state,
        status: [...newStatus],
        groups: [...newGroups],
      }
    })
  },
  updateGroup: (statusUuId: string, params: any) => {
    set((state: WorkflowStore) => {
      const { groups } = state

      const newGroups = groups?.map((group: any) => {
        if (group?.uuId === statusUuId) {
          return { ...group, ...params }
        }
        return group
      })

      return {
        ...state,
        groups: [...newGroups],
      }
    })
  },
  updateStatus: (statusUuId: string, params: any) => {
    set((state: WorkflowStore) => {
      const { groups, selected, status } = state
      const uuId = selected

      const newStatus = status?.map((st: any) => {
        if (st?.uuId === statusUuId) {
          return { ...st, ...params }
        }
        return st
      })

      const newGroups = groups?.map((group: any) => {
        if (uuId === group?.uuId && group?.children) {
          if (group?.children?.length === 1) return group
          group!.children = newStatus
        }
        return group
      })

      return {
        ...state,
        status: [...newStatus],
        groups: [...newGroups],
      }
    })
  },
}))

export default useWorkflowStore

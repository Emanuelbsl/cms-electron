import {
  ADD_GROUPS,
  ADD_STATUS,
  DELETE_GROUPS,
  DELETE_STATUS,
  SELECTED_GROUPS,
  UPDATE_GROUPS,
  UPDATE_NAME,
  UPDATE_STATUS,
} from './workflow.action'
import { ReactNode, createContext, useContext, useReducer } from 'react'
import {
  addGroups,
  addStatus,
  deleteGroup,
  deleteStatus,
  selectedGroup,
  updateGroup,
  updateStatus,
} from './workflow.dispatch'

import { v4 as uuidv4 } from 'uuid'

interface WorkflowsState {
  groups: any[]
  selected: string | null
  erro: any
  status: any[]
  name: string
}

interface ContextProps {
  state: WorkflowsState
  dispatch: ({ type }: { type: string; payload?: any }) => void
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

const Context = createContext<ContextProps>({} as ContextProps)
export const useWorkflow = () => useContext(Context)

export const initialState = { ...workflowsDefaultValue }

interface workflowsProviderProps {
  children: ReactNode
}

const reducer = (state: any, action: { type: string; payload?: any }) => {
  switch (action?.type) {
    case ADD_GROUPS:
      return addGroups(state)
    case DELETE_GROUPS:
      return deleteGroup(state, action?.payload)
    case UPDATE_GROUPS:
      return updateGroup(state, action?.payload)
    case SELECTED_GROUPS:
      return selectedGroup(state, action?.payload)
    case ADD_STATUS:
      return addStatus(state)
    case DELETE_STATUS:
      return deleteStatus(state, action?.payload)
    case UPDATE_STATUS:
      return updateStatus(state, action?.payload)
    case UPDATE_NAME:
      return null
    default:
      return state
  }
}

export const WorkflowsProvider = ({ children }: workflowsProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <Context.Provider value={{ dispatch, state }}>{children}</Context.Provider>
  )
}

import { v4 as uuidv4 } from 'uuid'

const getColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
const uniqueId = () => Math.random().toString(26).slice(-12)

export const addGroups = (state: any) => {
  const color = getColor()

  const uuIdGroup = uuidv4()

  const newGroup = {
    uuId: uuIdGroup,
    is_handler: 1,
    sla: 3,
    name: `* Nova Etapa ${uniqueId()}`,
    color,
    children: [{ uuId: uuidv4(), name: 'Encerrar', action: null, done: 0 }],
  }

  return {
    ...state,
    groups: [...state?.groups, newGroup],
    erro: {
      ...state?.erro,
      [uuIdGroup]:
        'Grupo sem Item atrelado, Não existe direcionamento para essa etapa do fluxo!',
    },
  }
}

export const deleteGroup = (state: any, payload: any) => {
  const { groups, erro } = state
  const uuId = payload?.uuId

  if (groups.length === 2) return { ...state }
  const newGroups = groups.filter((group: any) => group?.uuId !== uuId)

  const newError = { ...erro }
  delete newError[uuId]

  return {
    ...state,
    groups: newGroups,
    erro: newError,
  }
}

export const selectedGroup = (state: any, payload: any) => {
  const uuId = payload?.uuId
  const { groups } = state

  const newStatus =
    groups?.find((group: any) => group?.uuId === uuId)!.children || []

  return {
    ...state,
    selected: uuId,
    status: newStatus,
  }
}

export const addStatus = (state: any) => {
  const { groups, selected } = state
  const uuId = selected

  const tempGroups = groups?.find((group: any) => group.uuId === uuId) || {}
  if (!tempGroups?.is_handler) return { ...state }

  const newElement = {
    uuId: uuidv4(),
    name: `* Nova Etapa ${uniqueId()}`,
    done: 1,
    action: 'FINALIZAR',
  }

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
}

export const deleteStatus = (state: any, payload: any) => {
  const { groups, selected, status } = state
  const uuId = selected

  if (status?.length <= 1) {
    return {
      ...state,
    }
  }

  const newStatus = status?.filter(
    (status: { uuId: string }) => status?.uuId !== payload?.uuId,
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
}

export const updateGroup = (state: any, payload: any) => {
  const { groups } = state

  const newGroups = groups?.map((group: any) => {
    if (group?.uuId === payload?.uuId) {
      return { ...group, ...payload }
    }
    return group
  })

  return {
    ...state,
    groups: [...newGroups],
  }
}

export const updateStatus = (state: any, payload: any) => {
  const { groups, selected, status } = state
  const uuId = selected

  const newStatus = status?.map((st: any) => {
    if (st?.uuId === payload?.uuId) {
      return { ...st, ...payload }
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
}

// export const hasLinkedGroup = (
//   name: string,
//   workflowName: string,
//   groups: any[],
// ) => {
//   return groups.reduce(
//     (accumulator: string | null, w: { children: any[]; name: string }) => {
//       const requestAction = w?.children?.reduce(
//         (accumulator: string | null, c: { done: number; action: string }) => {
//           if (!c?.done && c?.action === name) {
//             return `${workflowName} - ${w?.name}`
//           }
//           return accumulator
//         },
//         null,
//       )
//       if (requestAction) {
//         accumulator = requestAction
//       }
//       return accumulator
//     },
//     null,
//   )
// }

export const createAlias = (alias: string) => {
  return String(alias)
    .toLowerCase()
    .replace(/[äáâàã]/g, 'a')
    .replace(/[éêëè]/g, 'e')
    .replace(/[íîïì]/g, 'i')
    .replace(/[öóôòõ]/g, 'o')
    .replace(/[üúûù]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/(?!_)[^a-zA-Z0-9]/g, '')
    .replace(/\s/g, '_')
}

// export const generateWorkflowJSON = (state: any) => {
//   const { groups, name } = state
//   const steps = groups.map((group: { name: string }) => group.name)
//   const newGroups = groups.map(
//     (group: { name: string }) => `${name} - ${group.name}`,
//   )

//   const groupOrderingTypes = groups.map(
//     (group: {
//       name: string
//       is_handler: number
//       sla: number
//       children: any[]
//     }) => {
//       const requester = hasLinkedGroup(group?.name, name, groups)
//       const handler = `${name} - ${group?.name}`

//       return {
//         handler,
//         requester: !group?.is_handler ? handler : requester,
//         step: group?.name,
//         name: String(group?.name)
//           .replace(/[^a-zA-Z\s]/g, '')
//           .toUpperCase(),
//         is_handler: group?.is_handler ?? 0,
//         sla: group?.sla ?? 3,
//         status: group?.children?.map(
//           (status: { name: string; done: number; action: string }) => {
//             const aliasUnique = createAlias(
//               `${name}_${group?.name}_${status?.name}_${uniqueId}`,
//             )
//             return {
//               status_name: status?.name,
//               done: status?.done ?? 1,
//               alias_unique: aliasUnique,
//               default_status_id: !group?.is_handler ? 1 : 0,
//               action: status?.action,
//             }
//           },
//         ),
//       }
//     },
//   )

//   const groupsRedirect = groupOrderingTypes.map(
//     (got: { step: string; name: string; status: any[] }) => {
//       return {
//         step: got?.step,
//         name: got?.name,
//         status: got?.status?.map(
//           (status: { status_name: string; done: number; action: string }) => {
//             return {
//               status_name: status?.status_name,
//               done: status?.done,
//               task_redirect: String(status?.action)
//                 .replace(/[^a-zA-Z\s]/g, '')
//                 .toUpperCase(),
//             }
//           },
//         ),
//       }
//     },
//   )

//   return {
//     workflow_name: name,
//     steps,
//     groups: newGroups,
//     group_ordering_types: groupOrderingTypes,
//     groups_redirect: groupsRedirect,
//   }
// }

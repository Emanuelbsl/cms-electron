import { Attribute, Information } from '@shared/types/ipc'

import { IPC } from '@shared/constants/ipc'
import { ipcMain } from 'electron'
import { getLDAPUsers } from './lib/ldap'

const os = require('os')

const domain = import.meta.env.MAIN_DOMAIN

ipcMain.handle(IPC.AUTHENTICATION.FETCH_AD, async (_, params) => {
  const username = params?.username
  const password = params?.password

  const information: Information | undefined = {
    platform: os.platform(),
    hostname: os.hostname(),
    networkInterfaces: os.networkInterfaces(),
    user: {
      cn: null,
      sn: null,
      displayName: null,
      memberOf: null,
      mail: null,
    },
  }

  try {
    const user = await getLDAPUsers(username, domain, password)

    if (Array.isArray(user?.attributes)) {
      user?.attributes.map((attribute: Attribute) => {
        if (attribute?.type) {
          information!.user[attribute.type] = attribute.values[0]
        }
        return null
      })
    }

    return {
      message: `Usuário autenticado ${username} com sucesso.`,
      success: true,
      authenticated: { ...information, token: 1223 },
    }
  } catch (error: any) {
    return { message: error, success: false, information: null }
  }
})

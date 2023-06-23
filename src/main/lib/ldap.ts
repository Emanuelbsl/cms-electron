'use strict'
const ldapJS = require('ldapjs')

const LDAP_URL = import.meta.env.MAIN_AD_URL
const baseDN = import.meta.env.MAIN_DOMAIN_CONTROLLER

export const createClient = () => {
  const ldapClient = ldapJS.createClient({
    url: [LDAP_URL],
    // reconnect: false,
    timeout: 1000,
    connectTimeout: 1000,
  })

  return new Promise((resolve, reject) => {
    ldapClient.on('connect', () => {
      resolve(ldapClient)
    })
    ldapClient.on('error', (error: any) => {
      return reject(error.message)
    })
    ldapClient.on('timeout', (error: any) => {
      // ldapClient.unbind()
      // ldapClient.destroy()
      return reject(error.message)
    })
    ldapClient.on('connectTimeout', (error: any) => {
      return reject(error.message)
    })
    ldapClient.on('connectError', (error: any) => {
      return reject(error.message)
    })
  })
}

export const sanitizeInput = function (input: string) {
  return input
    .replace(/\*/g, '\\2a')
    .replace(/\(/g, '\\28')
    .replace(/\)/g, '\\29')
    .replace(/\\/g, '\\5c')
    .replace(/\0/g, '\\00')
    .replace(/\//g, '\\2f')
}

export const authUser = async (
  client: any,
  username: string,
  password: string,
) => {
  return new Promise((resolve, reject) => {
    client.bind(username, password, (erro: any) => {
      if (erro) {
        return reject(new Error(erro.message))
      }
      return resolve(client)
    })
  })
}

export const search = async (client: any, username: string) => {
  const opts = {
    // filter: '(|(objectCategory=person)(|(ou=Reciclare,dc=reciclare,dc=local))',
    // filter: `(|(objectClass=user)(objectClass=person))(!(objectClass=computer))(!(objectClass=group))`,
    filter: `(&(objectCategory=User)(|(sAMAccountName=${username})(userPrincipalName=${username})))`,
    attributes: ['sn', 'cn', 'memberOf', 'user', 'mail', 'displayName'],
    scope: 'sub',
  }

  return new Promise((resolve, reject) => {
    if (!client) return reject(new Error('LDAP connection is not yet bound'))
    client.search(baseDN, opts, (_err: any, res: any) => {
      // assert.ifError(err.message)
      res.on('searchEntry', (entry: { pojo: any }) => {
        if (entry?.pojo) {
          client.unbind()
          return resolve(entry?.pojo)
        }
        client.unbind()
        return resolve(null)
      })
      res.on('error', (err: { message: string }) => {
        client.unbind()
        if (err) return reject(err.message)
      })
      res.on('end', (err: { message: string }) => {
        if (err) return reject(err.message)
      })
    })
  })
}

export const getLDAPUsers = (
  username: string,
  domain: string,
  password: string,
) => {
  const _username = sanitizeInput(username)
  return new Promise<any>((resolve, reject) => {
    createClient()
      .then((ldapClient) => authUser(ldapClient, _username + domain, password))
      .then((ldapClient) => search(ldapClient, _username))
      .then((user) => resolve(user))
      .catch((error) => {
        reject(error)
      })
  })
}

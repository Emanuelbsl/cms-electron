/**
 * Request
 */

/**
 * Response
 */
export type FetchAuthenticationResponse = {
  message: string
  success: boolean
  authenticated: any
}

/**
 *  Params
 */
export type ParamsAuthentication = {
  FETCH_AD: string
}

export type ReturnIpc = {
  AUTHENTICATION: ParamsAuthentication
}

export interface Attribute {
  type: string
  values: any[]
}

export interface RootInformation {
  messageId: number
  protocolOp: number
  type: string
  objectName: string
  attributes: Attribute[]
  controls: any[]
}

export interface NetworkInterfaces {}

export interface User {
  [index: string]: string | null | undefined
}

export interface Information {
  platform: string
  hostname: string
  networkInterfaces: NetworkInterfaces | null | undefined
  user: User
}

import { contextBridge, ipcRenderer } from 'electron'

import { ElectronAPI } from '@electron-toolkit/preload'
import { IPC } from '@shared/constants/ipc'
import { FetchAuthenticationResponse } from '@shared/types/ipc'

declare global {
  export interface Window {
    electron: ElectronAPI
    api: typeof api
  }
}

const api = {
  fetchAuthenticationAd(params: object): Promise<FetchAuthenticationResponse> {
    return ipcRenderer.invoke(IPC.AUTHENTICATION.FETCH_AD, params)
  },
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api
}

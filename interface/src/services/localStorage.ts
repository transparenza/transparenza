import { ENVIRONMENT, IS_CLIENT } from 'config'

export interface LocalWallet {
  address: string
  authToken: string | null
  isFirstTimeSignIn: boolean
}

export interface LocalState {
  version: number
  shouldAutoConnect: boolean
  hasUserAcceptedTerms: boolean
  currentWallet: string
  wallets: { [address: string]: LocalWallet }
}

const initialState: LocalState = {
  version: 1,
  shouldAutoConnect: false,
  hasUserAcceptedTerms: false,
  wallets: {},
  currentWallet: ''
}

const STORE_NAME = 'transparenza.store'
const STORE_KEY = `${STORE_NAME}${ENVIRONMENT === 'production' ? '' : `.${ENVIRONMENT}`}`

function init(): void {
  if (!IS_CLIENT) return
  const state = window.localStorage.getItem(STORE_KEY)
  if (!state) window.localStorage.setItem(STORE_KEY, JSON.stringify(initialState))
}

function get<K extends keyof LocalState>(key: K): LocalState[K] {
  const stateRaw = window.localStorage.getItem(STORE_KEY)
  const state: LocalState = stateRaw ? JSON.parse(stateRaw) : initialState
  return state[key] || initialState[key]
}

function set<K extends keyof LocalState>(key: K, value: LocalState[K]): void {
  const stateRaw = window.localStorage.getItem(STORE_KEY)
  const state: LocalState = stateRaw ? JSON.parse(stateRaw) : initialState
  state[key] = value
  window.localStorage.setItem(STORE_KEY, JSON.stringify(state))
}

const LocalStorage = {
  init,
  get,
  set
}

export default LocalStorage

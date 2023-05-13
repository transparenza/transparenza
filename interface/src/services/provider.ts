import { INFURA_API_KEY, INFURA_API_URL, CHAIN_ID } from 'config'
import { StaticJsonRpcProvider } from '@ethersproject/providers'

const url = `${INFURA_API_URL}/${INFURA_API_KEY}`
export const staticProvider = new StaticJsonRpcProvider(url, CHAIN_ID)

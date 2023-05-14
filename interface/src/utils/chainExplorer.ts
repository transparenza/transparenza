import { CHAIN_ID } from 'config'
import { Chain } from 'types/types'

const getBaseUrl = (network: Chain) => {
  switch (network) {
    case Chain.Polygon:
      return 'https://polygonscan.com/'
    default:
      return 'https://mumbai.polygonscan.com'
  }
}

const BASE_URL = getBaseUrl(CHAIN_ID)


export const buildExplorerTxLink = (txHash: string): string => {
  const path = `tx/${txHash}`
  return new URL(path, BASE_URL).toString()
}
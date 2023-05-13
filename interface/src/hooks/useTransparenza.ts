import { getPolygonMumbaiSdk } from '@dethcrypto/eth-sdk-client'
import { CHAIN_ID } from 'config'
import { Chain } from 'types/types'
import { staticProvider } from 'services/provider'
import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'

export default function useTransparenza(signerOrProvider?: Signer | Provider | null) {
  const connection = signerOrProvider || staticProvider

  const sdk =
    CHAIN_ID === Chain.Polygon ? getPolygonMumbaiSdk(connection) : getPolygonMumbaiSdk(connection) // todo: change to getPolygonMainnetSdk(staticProvider) when ready

  return sdk.Transparenza
}

import { getPolygonMumbaiSdk } from '@dethcrypto/eth-sdk-client'
import { CHAIN_ID } from 'config'
import { Chain } from 'types/types'
import { staticProvider } from './provider'

const sdk =
  CHAIN_ID === Chain.Polygon
    ? getPolygonMumbaiSdk(staticProvider)
    : getPolygonMumbaiSdk(staticProvider) // todo: change to getPolygonMainnetSdk(staticProvider) when ready
export default sdk

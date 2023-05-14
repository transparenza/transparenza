import { GelatoRelay, CallWithERC2771Request } from '@gelatonetwork/relay-sdk'
import { GELATO_RELAY_API_KEY, GELATO_RELAY_API_URL } from 'config'
import { Web3Provider } from '@ethersproject/providers'
import axios from 'axios'

export const gelatoRelay = new GelatoRelay()
export const gelatoApiClient = axios.create({
  baseURL: GELATO_RELAY_API_URL
})

export const sponsoredCall = async (request: CallWithERC2771Request, provider: Web3Provider) => {
  return await gelatoRelay.sponsoredCallERC2771(request, provider, GELATO_RELAY_API_KEY)
}

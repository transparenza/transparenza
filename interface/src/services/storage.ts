import { Web3Storage } from 'web3.storage'
import { STORAGE_API_KEY } from 'config'

const client = new Web3Storage({ token: STORAGE_API_KEY })

export function createIpfsUrl (cid:string, filename:string) {
  return `https://${cid}.ipfs.dweb.link/${filename}`
}
export default client

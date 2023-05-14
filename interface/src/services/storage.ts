import { Web3Storage } from 'web3.storage'
import { STORAGE_API_KEY } from 'config'

const client = new Web3Storage({ token: STORAGE_API_KEY })

export function createIpfsUrl(cid: string, filename: string) {
  const path = filename
  return new URL(path, `https://${cid}.ipfs.dweb.link`).toString()
}
export default client

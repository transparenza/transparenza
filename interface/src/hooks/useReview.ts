import { useQuery } from '@tanstack/react-query'
import storage, { createIpfsUrl } from 'services/storage'
import axios from 'axios'
import { Review } from 'types/types'

export default function useReview(cid: string) {
  return useQuery(['review', cid], async () => {
    const res = await storage.get(cid)

    if (!res?.ok) {
      throw new Error(`Failed to get ${cid} - [${res?.status}] ${res?.statusText}`)
    }

    const files = await res.files()
    const file = files[0]

    if (!file) {
      throw new Error(`Failed to find file ${cid}`)
    }

    const url = createIpfsUrl(cid, file.name)
    const { data } = await axios.get(url)
    const review: Review = {...data, url}

    return review
  })
}

import { BigNumber } from 'ethers'
import Image from 'next/image'
import { useState } from 'react'
import { useContractRead } from 'wagmi'
import useImageCollection from '../../hooks/useImageCollection'

export default function CollectionImage({ contract, name }: { contract: string; name: string }) {
  const tokenId = 1
  const [uri, setUri] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<unknown | null>(null)
  const { data } = useImageCollection(uri, contract)

  useContractRead({
    address: contract,
    abi: [
      {
        inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
        name: 'tokenURI',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function'
      }
    ],
    functionName: 'tokenURI',
    args: [BigNumber.from(tokenId)],
    onSuccess(data) {
      setUri(data)
      setIsLoading(false)
    },
    onError(error) {
      setIsLoading(false)
      setError(error)
    },
    watch: false
  })

  return (
    <div>
      {uri && data?.image && (
        <Image src={data?.image} alt={name || 'NFT'} fill={true} style={{ objectFit: 'cover' }} />
      )}
    </div>
  )
}

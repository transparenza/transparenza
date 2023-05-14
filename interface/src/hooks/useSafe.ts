import { Signer } from 'ethers'
import Safe, { EthersAdapter } from '@safe-global/protocol-kit'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

export default function useSafe(signer?: Signer | null) {
  const [safe, setSafe] = useState<Safe | null>(null)
  const [error, setError] = useState<unknown | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const initSafe = async () => {
      if (!signer) {
        setSafe(null)
        setError(null)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const address = await signer.getAddress()
        const ethAdapter = new EthersAdapter({
          ethers,
          signerOrProvider: signer
        })
        const newSafe = await Safe.create({
          ethAdapter,
          // safeAddress: address,
          safeAddress: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E'
        })

        const version = await newSafe.getContractVersion()
        if (version) {
          setSafe(newSafe)
        }
      } catch (e) {
        console.error(e)
        setError(e)
      } finally {
        setIsLoading(false)
      }
    }
    initSafe()
  }, [signer])

  return { data: safe, error, isLoading }
}

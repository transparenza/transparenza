import { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import entities from 'data/entities'
import { Entity } from 'types/types'
import ClientOnly from 'components/common/ClientOnly'
import { Rating } from 'react-simple-star-rating'
import { createJsonFile } from 'utils/files'
import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { useState, useCallback, useMemo, FC } from 'react'
import storage from 'services/storage'
import { useAccount, useSigner } from 'wagmi'
import { toast } from 'react-hot-toast'
import { CHAIN_ID } from 'config'
import useTransparenza from 'hooks/useTransparenza'
import { defaultAbiCoder as abi } from '@ethersproject/abi'
import useSafe from 'hooks/useSafe'
import { sponsoredCall } from 'services/gelato'
import { ethers } from 'ethers'

interface PageProps {
  entity: Entity
}

interface ReviewData {
  title: string
  text: string
  rating: number
}

// todo: delete
const faveVerification = {
  merkle_root: '0x2b52cef5e75567d9b9075b2ed16dc3936e54a444e0de6403fb34b325effb3d8a',
  nullifier_hash: '0x0d3a53cc025c4a5481062f0c52198763a9609c9a9c744fc25fec9231d4c2d219',
  proof:
  "0x11dc19c7fa9e4b816beb6f9752e7124f8260a4c083870aa07344ee944777b535230df3e19376e2532af4f36416e552c9e1a1bfe281b791e5f0cc6254fd4503e31aa0fd8095d98ab8652b2429bde22e1247817fad0bf907b7207ccf7e9c33fe44019aaf360ea61bff93eda737318c0d0f391622e7bb98cfee2a56bb428121784f052eadd9380048d60d34009314c05801c9418be40be394178fb64274baf2643d2ff0b098957ef0b7709c4638430b9d98989061b0a52bfe6c1b1c9e6cf122719a150a0f2277aadd641f2bc8d34ed76b2d489b779b870e6ee686989dac53d905bd0d1b3dfb82234ff120b8ab95c7616917c301a04511bde6cb9214c4f71d73946a",
  credential_type: 'orb'
}

const CreateReview: NextPage<PageProps> = ({ entity }) => {
  const { data: signer } = useSigner()
  const { data: safe } = useSafe(signer)
  const transparenza = useTransparenza(signer)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [review, setReview] = useState<ReviewData>({
    title: '',
    text: '',
    rating: 0
  })

  const resetForm = useCallback(() => {
    setReview({
      title: '',
      text: '',
      rating: 0
    })
  }, [])

  const onVerification = useCallback(
    async (verification: ISuccessResult) => {
      console.log('verification', verification)

      try {
        if (!signer || !transparenza) {
          toast.error('Please connect your wallet.')
          return
        }

        setIsSubmitting(true)

        const fileName = `${entity.slug}_${new Date().toISOString()}`
        const file = createJsonFile(review, fileName)
        const cid = await storage.put([file], {
          name: fileName
        })

        const unpackedProof = abi.decode(['uint256[8]'], verification.proof)[0]

        if (entity.tokenStandard === 'ERC20') {
          const tx = await transparenza.commentERC20(
            entity.tokenAddress[CHAIN_ID],
            cid,
            verification.merkle_root,
            verification.nullifier_hash,
            unpackedProof
          )

          const txResponse = await tx.wait()

          console.log(txResponse)
        } else if (entity.tokenStandard === 'ERC721') {
          // const tx = await transparenza.commentERC721(
          //   entity.tokenAddress[CHAIN_ID],
          //   cid,
          //   verification.merkle_root,
          //   verification.nullifier_hash,
          //   unpackedProof
          // )

          // const txResponse = await tx.wait()

          // console.log(txResponse)
          const userAddress = await signer.getAddress()
          const contractAddress = transparenza.address
          const { data } = await transparenza.populateTransaction.commentERC721(
            entity.tokenAddress[CHAIN_ID],
            cid,
            verification.merkle_root,
            verification.nullifier_hash,
            unpackedProof
          )

          if (!data) {
            toast.error('Something went wrong. Please try again.')
            return
          }
          if (!window.ethereum) {
            toast.error('Please install Metamask.')
            return
          }

          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const tx = await sponsoredCall(
            {
              chainId: CHAIN_ID,
              target: contractAddress,
              data: data,
              user: userAddress
            },
            provider
          )

          console.log(tx)
        } else if (entity.tokenStandard === 'ERC1155') {
          if (!entity.tokenId) {
            toast.error(`Token standard ${entity.tokenStandard} requires a token ID.}`)
            return
          }

          const tx = await transparenza.commentERC1155(
            entity.tokenAddress[CHAIN_ID],
            entity.tokenId[CHAIN_ID],
            cid,
            verification.merkle_root,
            verification.nullifier_hash,
            unpackedProof
          )

          const txResponse = await tx.wait()

          console.log(txResponse)
        } else {
          toast.error(`Token standard ${entity.tokenStandard} not supported.}`)
          return
        }

        resetForm()
        toast.success('Review created successfully!')
      } catch (e) {
        console.error(e)
        toast.error('Something went wrong. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    },
    [entity, resetForm, review, signer, transparenza]
  )

  return (
    <>
      <Head>
        <title>{`Review ${entity.name} | Transparenza`}</title>
      </Head>

      <div className="py-20">
        <div className="container-content flex justify-center">
          <div className="w-full max-w-[720px] border border-neutral-800">
            <IDKitWidget
              app_id="app_staging_391283f08c9663b3c213b71c38428724"
              action="create-comment"
              enableTelemetry
              onSuccess={onVerification}
              theme="dark"
            >
              {({ open }) => (
                <ReviewForm
                  review={review}
                  setReview={setReview}
                  // onSubmit={() => open()} // todo: uncomment
                  onSubmit={() => onVerification(faveVerification)} // todo: delete
                  isSubmitting={isSubmitting}
                />
              )}
            </IDKitWidget>
          </div>
        </div>
      </div>
    </>
  )
}

const ReviewForm: FC<{
  review: ReviewData
  setReview: (review: ReviewData) => void
  isSubmitting: boolean
  onSubmit: () => void
}> = ({ review, setReview, isSubmitting, onSubmit }) => {
  const { title, text, rating } = review
  const { isConnected } = useAccount()

  const isValid = useMemo(() => {
    return title.length > 0 && text.length > 0 && rating > 0
  }, [title.length, text.length, rating])

  return (
    <div className="w-full">
      <input
        placeholder="Title"
        className="w-full border-b border-b-neutral-800 bg-transparent p-5 text-3xl font-medium outline-none placeholder:text-neutral-600"
        value={title}
        onChange={(e) => setReview({ ...review, title: e.target.value })}
      />
      <textarea
        placeholder="Write your unhinged, honest thoughts here..."
        className="block min-h-[200px] w-full border-b border-b-neutral-800 bg-transparent p-5 text-lg text-white outline-none placeholder:text-neutral-600"
        value={text}
        onChange={(e) => setReview({ ...review, text: e.target.value })}
        style={{ resize: 'none' }}
      />
      <div className="flex items-center justify-between border-b border-b-neutral-800 p-5">
        <div className="font-medium text-white">{`What's your rating?`}</div>
        <ClientOnly>
          <Rating
            className="block"
            iconsCount={5}
            onClick={(rate) => setReview({ ...review, rating: rate })}
            SVGclassName="inline text-[10px]"
            size={24}
            allowFraction={false}
          />
        </ClientOnly>
      </div>
      <div className="p-5">
        <button
          className="w-full bg-white p-4 text-black"
          onClick={onSubmit}
          disabled={!isValid || !isConnected || isSubmitting}
        >
          Submit review
        </button>
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const slug = params?.slug?.toString()
  const entity = entities.find((entity) => entity.slug === slug)

  if (!entity) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      entity
    }
  }
}

export default CreateReview

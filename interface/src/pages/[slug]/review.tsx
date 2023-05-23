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
import { sponsoredCall, awaitSponsoredCall } from 'services/gelato'
import { ethers } from 'ethers'
import Link from 'next/link'
import Image from 'next/image'
import { ExternalProvider } from '@ethersproject/providers'
import { RiExternalLinkFill as IconLink } from 'react-icons/ri'
import { shortenAddress } from 'utils/address'
import { createIpfsUrl } from 'services/storage'
import IconSpinnerCircle from 'components/ui/IconSpinnerCircle'
import { buildExplorerTxLink } from 'utils/chainExplorer'

interface PageProps {
  entity: Entity
}

interface ReviewData {
  title: string
  text: string
  rating: number
}

interface SuccessData {
  verification: ISuccessResult
  txHash: string
  ipfsUrl: string
}

enum Step {
  Form = 'FORM',
  Signature = 'SIGNATURE',
  Processing = 'PROCESSING',
  Success = 'SUCCESS'
}

// todo: delete
const fakeVerification = {
  merkle_root: '0x2b52cef5e75567d9b9075b2ed16dc3936e54a444e0de6403fb34b325effb3d8a',
  nullifier_hash: '0x0d3a53cc025c4a5481062f0c52198763a9609c9a9c744fc25fec9231d4c2d219',
  proof:
    '0x11dc19c7fa9e4b816beb6f9752e7124f8260a4c083870aa07344ee944777b535230df3e19376e2532af4f36416e552c9e1a1bfe281b791e5f0cc6254fd4503e31aa0fd8095d98ab8652b2429bde22e1247817fad0bf907b7207ccf7e9c33fe44019aaf360ea61bff93eda737318c0d0f391622e7bb98cfee2a56bb428121784f052eadd9380048d60d34009314c05801c9418be40be394178fb64274baf2643d2ff0b098957ef0b7709c4638430b9d98989061b0a52bfe6c1b1c9e6cf122719a150a0f2277aadd641f2bc8d34ed76b2d489b779b870e6ee686989dac53d905bd0d1b3dfb82234ff120b8ab95c7616917c301a04511bde6cb9214c4f71d73946a',
  credential_type: 'orb'
} as ISuccessResult

const CreateReview: NextPage<PageProps> = ({ entity }) => {
  const { data: signer } = useSigner()
  const transparenza = useTransparenza(signer)

  const [step, setStep] = useState<Step>(Step.Form)
  const [review, setReview] = useState<ReviewData>({
    title: '',
    text: '',
    rating: 0
  })

  const [successData, setSuccessData] = useState<SuccessData | null>(null)
  const [verificationData, setVerificationData] = useState<{
    verification: ISuccessResult
    address: string
  } | null>(null)

  const resetForm = useCallback(() => {
    setReview({
      title: '',
      text: '',
      rating: 0
    })
  }, [])

  const onVerification = useCallback(
    async (verification: ISuccessResult) => {
      try {
        if (!signer || !transparenza) {
          toast.error('Please connect your wallet.')
          return
        }

        setStep(Step.Signature)

       // const userAddress = await signer.getAddress()
        // setVerificationData({
        //   verification,
        //   address: userAddress
        // })

        const fileName = `${entity.slug}_${new Date().toISOString()}`
        const file = createJsonFile(review, fileName)
        const cid = await storage.put([file], {
          name: fileName
        })

        // const unpackedProof = abi.decode(['uint256[8]'], verification.proof)[0]

        let txHash = ''
        if (entity.tokenStandard === 'ERC20') {
          const tx = await transparenza.commentERC20(
            entity.tokenAddress[CHAIN_ID],
            cid,
            verification.merkle_root,
            verification.nullifier_hash,
            unpackedProof
          )

          setStep(Step.Processing)
          const txResponse = await tx.wait()
          txHash = txResponse.transactionHash
          console.log(txResponse)
        } else if (entity.tokenStandard === 'ERC721') {
          const userAddress = await signer.getAddress()
          const contractAddress = transparenza.address
          const { data } = await transparenza.populateTransaction.commentERC721(
            entity.tokenAddress[CHAIN_ID],
            cid
          )

          if (!data) {
            toast.error('Something went wrong. Please try again.')
            return
          }

          if (!window.ethereum) {
            toast.error('No ethereum wallet found.')
            return
          }

          const provider = new ethers.providers.Web3Provider(window.ethereum as ExternalProvider)

          const callResponse = await sponsoredCall(
            {
              chainId: CHAIN_ID,
              target: contractAddress,
              data: data,
              user: userAddress
            },
            provider
          )

          console.log('callResponse', callResponse)

          setStep(Step.Processing)
          await new Promise((resolve) => setTimeout(resolve, 4000))

          const task = await awaitSponsoredCall(callResponse)
          console.log('task', task)
          if (!task || !task.transactionHash) {
            toast.error('Something went wrong. Please try again.')
            return
          }

          txHash = task.transactionHash
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

          setStep(Step.Processing)

          const txResponse = await tx.wait()
          txHash = txResponse.transactionHash
          console.log(txResponse)
        } else {
          toast.error(`Token standard ${entity.tokenStandard} not supported.}`)
          return
        }

        resetForm()
        setSuccessData({
          verification,
          txHash,
          ipfsUrl: createIpfsUrl(cid, fileName)
        })
        setStep(Step.Success)
      } catch (e) {
        console.error(e)
        toast.error('Something went wrong. Please try again.')
        setStep(Step.Form)
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
          <div className="w-full max-w-[720px]">
            <IDKitWidget
              app_id="app_staging_391283f08c9663b3c213b71c38428724"
              action="create-comment"
              enableTelemetry
              onSuccess={onVerification}
              theme="dark"
            >
              {({ open }) =>
                ({
                  [Step.Form]: (
                    <Form
                      entity={entity}
                      review={review}
                      setReview={setReview}
                      onSubmit={async () => {
                        if (!signer) return
                        const address = await signer.getAddress()
                        onVerification()
                        return
                        if (verificationData && address === verificationData.address) {
                          onVerification(verificationData.verification)
                        } else {
                          open()
                        }
                      }}
                    />
                  ),
                  [Step.Signature]: <Signature />,
                  [Step.Processing]: <Processing />,
                  [Step.Success]: <Success successData={successData} />
                }[step])
              }
            </IDKitWidget>
          </div>
        </div>
      </div>
    </>
  )
}

const Form: FC<{
  entity: Entity
  review: ReviewData
  setReview: (review: ReviewData) => void
  onSubmit: () => void
}> = ({ entity, review, setReview, onSubmit }) => {
  const { title, text, rating } = review
  const { isConnected } = useAccount()

  const isValid = useMemo(() => {
    return title.length > 0 && text.length > 0 && rating > 0
  }, [title.length, text.length, rating])

  return (
    <div>
      <div className="mb-6 flex w-full items-end justify-between">
        <Link href={`/${entity.slug}`}>
          <div className="flex items-center">
            <Image
              src={entity.logoUrl}
              width={24}
              height={24}
              className="overflow-hidden rounded-full bg-neutral-800"
              alt={entity.name}
            />
            <div className="ml-2 font-medium uppercase text-white">{entity.name}</div>
          </div>
        </Link>
        <Link
          href={`/${entity.slug}`}
          className="border-b border-b-neutral-400 text-sm text-neutral-400 transition-colors duration-200 hover:text-white"
        >
          View all reviews
        </Link>
      </div>
      <div className="w-full border border-neutral-800">
        <div className="w-full">
          <input
            placeholder="Title"
            className="w-full border-b border-b-neutral-800 bg-transparent p-5 text-3xl font-medium outline-none placeholder:text-neutral-600"
            value={title}
            onChange={(e) => setReview({ ...review, title: e.target.value })}
          />
          <textarea
            placeholder="Write your honest thoughts here..."
            className="block min-h-[200px] w-full border-b border-b-neutral-800 bg-transparent p-5 text-lg text-white outline-none placeholder:text-neutral-600"
            value={text}
            onChange={(e) => setReview({ ...review, text: e.target.value })}
            style={{ resize: 'none' }}
          />
          <div className="flex items-center justify-between border-b border-b-neutral-800 p-5">
            <div className="text-white">{`What's your rating?`}</div>
            <ClientOnly>
              <Rating
                className="block"
                iconsCount={5}
                onClick={(rate) => setReview({ ...review, rating: rate })}
                SVGclassName="inline text-[10px]"
                size={24}
                allowFraction={false}
                initialValue={rating}
              />
            </ClientOnly>
          </div>
          <div className="p-5">
            <button
              className="w-full bg-white p-4 font-medium text-black transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={onSubmit}
              disabled={!isValid || !isConnected}
            >
              Submit review
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const Signature: FC = () => {
  return (
    <div className="flex w-full flex-col items-center border border-neutral-800">
      <div className="w-full border-b border-b-neutral-800">
        <div className="p-6">
          <div className="mb-4 text-5xl font-medium uppercase">Sign the transaction</div>
          <div className="text-neutral-400 ">{`Don't worry, gas fees are on us ;)`}</div>
        </div>
      </div>
      <div className="w-full p-6">
        <div className="relative flex h-[350px] items-center justify-center bg-neutral-900 p-6">
          <IconSpinnerCircle />
        </div>
      </div>
    </div>
  )
}

const Processing: FC = () => {
  return (
    <div className="flex w-full flex-col items-center border border-neutral-800">
      <div className="w-full border-b border-b-neutral-800">
        <div className="p-6">
          <div className="mb-4 text-5xl font-medium uppercase">Hang tight</div>
          <div className="text-neutral-400 ">
            We are permantently recording your opinion on the blockchain. No backing out now!
          </div>
        </div>
      </div>
      <div className="w-full p-6">
        <div className="relative h-[350px] p-6">
          <Image
            src="https://media.tenor.com/bJcJ3r36dwgAAAAC/nouns-nounish.gif"
            fill={true}
            alt="Jim Carrey typing"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    </div>
  )
}

const Success: FC<{ successData: SuccessData | null }> = ({ successData }) => {
  return (
    <div className="w-full border border-neutral-800">
      <div className="w-full border-b border-b-neutral-800">
        <div className="p-6">
          <div className="mb-4 text-5xl font-medium uppercase">Success!</div>
          <div className="text-neutral-400 ">
            Thanks for making the internet more transparent. Your review is now permanently
            recorded.
          </div>
        </div>
      </div>
      <div className="w-full p-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <div>Transaction hash</div>
            {successData?.txHash && (
              <Link
                href={buildExplorerTxLink(successData.txHash)}
                target="_blank"
                rel="noreferrer"
                className="flex cursor-pointer items-center space-x-2 text-neutral-400 transition-colors duration-200 hover:text-white"
              >
                <span>{shortenAddress(successData.txHash)}</span>
                <IconLink />
              </Link>
            )}
          </div>
          <div className="flex justify-between">
            <div>Content URI</div>
            {successData?.ipfsUrl && (
              <Link
                href={successData.ipfsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex cursor-pointer items-center space-x-2 text-neutral-400 transition-colors duration-200 hover:text-white"
              >
                <div>{shortenAddress(successData.ipfsUrl)}</div>
                <IconLink />
              </Link>
            )}
          </div>
        </div>
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

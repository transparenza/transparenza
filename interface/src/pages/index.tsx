import type { NextPage } from 'next'
import Head from 'next/head'
import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { createJsonFile } from 'utils/files'
import { useState, useCallback, useMemo, FC } from 'react'
import { Rating } from 'react-simple-star-rating'
import ClientOnly from 'components/common/ClientOnly'
import storage from 'services/storage'
import { useQuery } from '@airstack/airstack-react'
import { useAccount } from 'wagmi'
import entities from 'data/entities'
import { Entity } from 'types/types'
import Image from 'next/image'
import Link from 'next/link'

interface Review {
  title: string
  text: string
  rating: number
}

const Home: NextPage = () => {
  const { address } = useAccount()
  const { data } = useQuery(`query walletSocials {
    Wallet(input: {identity: "${address}", blockchain: ethereum}) {
      socials {
        dappName
        profileName
      }
    }
  }`)
  const [entity, setEntity] = useState<Entity>(entities[0])
  const [review, setReview] = useState<Review>({
    title: '',
    text: '',
    rating: 0
  })

  const onVerification = useCallback(
    async (verification: ISuccessResult) => {
      const file = createJsonFile(review, 'review')
      const cid = await storage.put([file], {
        name: 'review'
      })

      // todo: Call the smart contract

      // Reset the form
      setReview({
        title: '',
        text: '',
        rating: 0
      })
    },
    [review]
  )

  return (
    <>
      <Head>
        <title>Transparenza</title>
        <meta name="description" content="On-chain opinions" />
      </Head>

      <div className="container-content grow">
        <h1 className='uppercase font-bold text-[104px] py-8'>Reviews you can trust</h1>
        <div className="grid grid-cols-3 gap-8">
          {entities.map((entity) => (
            <div key={entity.name} className="cursor-pointer border border-gray">
              <Link href={`/entity/${entity.slug}`}>
                <div className="relative aspect-[1.33] overflow-hidden rounded-none bg-black">
                  <Image
                    src={entity.logoUrl}
                    alt={entity.name}
                    fill={true}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-4 border-t border-t-gray font-bold">{entity.name}</div>
              </Link>
            </div>
          ))}
        </div>
        {/* <div>
          <IDKitWidget
            app_id="app_staging_391283f08c9663b3c213b71c38428724"
            action="create-comment"
            enableTelemetry
            onSuccess={onVerification}
          >
            {({ open }) => (
              <ReviewForm review={review} setReview={setReview} onSubmit={() => open()} />
            )}
          </IDKitWidget>
        </div> */}
      </div>
    </>
  )
}

const ReviewForm: FC<{
  review: Review
  setReview: (review: Review) => void
  onSubmit: () => void
}> = ({ review, setReview, onSubmit }) => {
  const { title, text, rating } = review

  const isValid = useMemo(() => {
    return title.length > 0 && text.length > 0 && rating > 0
  }, [title, text, rating])

  return (
    <div>
      <input
        placeholder="Title"
        className=""
        value={title}
        onChange={(e) => setReview({ ...review, title: e.target.value })}
      />
      <textarea
        placeholder="Comment"
        className="block"
        onChange={(e) => setReview({ ...review, text: e.target.value })}
      />
      <div>
        <ClientOnly>
          <Rating
            className="block"
            iconsCount={5}
            onClick={(rate) => setReview({ ...review, rating: rate })}
            SVGclassName="inline"
          />
        </ClientOnly>
      </div>
      <button className="bg-black p-4 text-white" onClick={onSubmit} disabled={!isValid}>
        Submit review
      </button>
    </div>
  )
}

export default Home

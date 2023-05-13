import { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import entities from 'data/entities'
import { Entity, ReviewEvent } from 'types/types'
import { useQuery } from '@airstack/airstack-react'
import Head from 'next/head'
import { shortenAddress } from 'utils/address'
import { CHAIN_ID } from 'config'
import Image from 'next/image'
import useReviewContent from 'hooks/useReviewContent'
import useReviews from 'hooks/useReviews'
import Link from 'next/link'

interface PageProps {
  entity: Entity
}

const Entity: NextPage<PageProps> = ({ entity }) => {
  const { data: reviewEvents } = useReviews(entity)

  return (
    <>
      <Head>
        <title>{`${entity.name} | Transparenza`}</title>
      </Head>

      <div className="py-20">
        <div className="container-content">
          <div className="flex items-center justify-between">
            <div className="flex space-x-5">
              <div>
                <Image
                  src={entity.logoUrl}
                  width={115}
                  height={115}
                  alt={entity.name}
                  className="rounded-full"
                />
              </div>
              <div>
                <h1 className="text-8xl font-medium uppercase">{entity.name}</h1>
                <div className="text-sm font-medium text-gray-500">
                  {shortenAddress(entity.tokenAddress[CHAIN_ID])}
                </div>
              </div>
            </div>
            <Link
              href={`/${entity.slug}/review`}
              className="block bg-white p-4 font-bold text-black"
            >
              Write review
            </Link>
          </div>
          <div className="mt-20 grid grid-cols-2 gap-12">
            {reviewEvents?.map((reviewEvent, i) => (
              <ReviewItem key={`review_${i}`} reviewEvent={reviewEvent} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

const ReviewItem = ({ reviewEvent }: { reviewEvent: ReviewEvent }) => {
  const { data: review } = useReviewContent(reviewEvent.cid)
  const { data: socials } = useQuery(`query walletSocials {
    Wallet(input: {identity: "${reviewEvent.sender}", blockchain: ethereum}) {
      socials {
        dappName
        profileName
      }
    }
  }`)

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="font-bold">{shortenAddress(reviewEvent.sender)}</div>
        <div className="flex">
          {/* <Rating iconsCount={1} /> */}
          <div>{review?.rating}</div>
        </div>
      </div>
      <div className="mt-4 text-gray-400">{review?.text}</div>
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
  } else {
    return {
      props: { entity }
    }
  }
}

export default Entity

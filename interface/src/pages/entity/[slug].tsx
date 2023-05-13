import { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import entities from 'data/entities'
import { Entity, TokenStandard, ReviewEvent } from 'types/types'
import Head from 'next/head'
import { shortenAddress } from 'utils/address'
import { CHAIN_ID } from 'config'
import ethSdk from 'services/ethSdk'
import Image from 'next/image'
import useReview from 'hooks/useReview'
import { Rating } from 'react-simple-star-rating'

const { CommentERC20, CommentERC721, CommentERC1155 } = ethSdk.Transparenza.filters
type ReviewERC20Event = ReturnType<typeof CommentERC20>
type ReviewERC721Event = ReturnType<typeof CommentERC721>
type ReviewERC1155Event = ReturnType<typeof CommentERC1155>

interface PageProps {
  entity: Entity
  reviews: ReviewERC20Event | ReviewERC721Event | ReviewERC1155Event
}

const fakeReviews = [
  {
    token: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    sender: '0x7F77c7bDB5445A3F27f2f5841bEc7fD05715cF44',
    cid: 'bafybeibqmgburqadkh3y3acfrqrwvskxovwpn3g44enesx4xxk3oezvamy'
  },
  {
    token: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    sender: '0x7F77c7bDB5445A3F27f2f5841bEc7fD05715cF44',
    cid: 'bafybeibqmgburqadkh3y3acfrqrwvskxovwpn3g44enesx4xxk3oezvamy'
  },
  {
    token: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    sender: '0x7F77c7bDB5445A3F27f2f5841bEc7fD05715cF44',
    cid: 'bafybeibqmgburqadkh3y3acfrqrwvskxovwpn3g44enesx4xxk3oezvamy'
  }
]

const Entity: NextPage<PageProps> = ({ entity }) => {
  return (
    <>
      <Head>
        <title>{`${entity.name} | Transparenza`}</title>
      </Head>

      <div className="py-20">
        <div className="container-content">
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
                {shortenAddress(entity.address[CHAIN_ID])}
              </div>
            </div>
          </div>
          <div className="mt-20 grid grid-cols-2 gap-12">
            {fakeReviews.map((reviewEvent, i) => (
              <ReviewItem key={`review_${i}`} reviewEvent={reviewEvent} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

const ReviewItem = ({ reviewEvent }: { reviewEvent: ReviewEvent }) => {
  const { data: review } = useReview(reviewEvent.cid)

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="font-bold">{shortenAddress(reviewEvent.sender)}</div>
        <div className='flex'>
          {/* <Rating iconsCount={1} /> */}
          <div>{review?.rating}</div>
        </div>
      </div>
      <div className="mt-4 text-gray-400">
        {review?.text}
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

  const { Transparenza } = ethSdk
  const standardToFilter: Record<
    TokenStandard,
    () => ReviewERC20Event | ReviewERC721Event | ReviewERC1155Event
  > = {
    ERC721: Transparenza.filters.CommentERC721,
    ERC20: Transparenza.filters.CommentERC20,
    ERC1155: Transparenza.filters.CommentERC1155
  }

  const filter = standardToFilter[entity.tokenStandard]
  const reviews = await ethSdk.Transparenza.queryFilter(filter())

  return {
    props: {
      entity,
      reviews
    }
  }
}

export default Entity

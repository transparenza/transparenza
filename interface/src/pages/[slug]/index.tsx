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
import { useMemo } from 'react'
import { buildLensProfileUrl } from 'utils/lens'
import { buildExplorerAddressLink } from 'utils/chainExplorer'
import { RiStarFill as IconStar } from 'react-icons/ri'

interface PageProps {
  entity: Entity
}

const Entity: NextPage<PageProps> = ({ entity }) => {
  const { data: reviewEventss } = useReviews(entity)
  const reviewEvents = reviewEventss?.filter((rv) => rv.sender === '0x75336b7f786df5647f6b20dc36eab9e27d704894')

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
                <div className="text-sm font-medium text-neutral-400">
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
          <div className="mt-20 grid border-collapse grid-cols-2">
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

  const lensName = useMemo(() => {
    if (reviewEvent.sender === '0x75336b7f786df5647f6b20dc36eab9e27d704894') {
      return 'ferrodri.lens'
    }
    const lensInfo = socials?.Wallet?.socials?.find(
      (social: { profileName: string; dappName: string }) => social.dappName === 'lens'
    )

    return lensInfo?.profileName
  }, [reviewEvent.sender, socials?.Wallet?.socials])

  const senderUrl = useMemo(() => {
    return lensName ? buildLensProfileUrl(lensName) : buildExplorerAddressLink(reviewEvent.sender)
  }, [lensName, reviewEvent.sender])

  return (
    <div className="border-collapse space-y-3 border border-neutral-800 p-8	">
      <div className="flex items-center justify-between">
        <div>
          <Link href={senderUrl} target="_blank" className="font-medium">
            {lensName ? `${lensName} 🌿` : shortenAddress(reviewEvent.sender)}
          </Link>
        </div>
        {review?.rating && (
          <div className="flex items-center space-x-1.5">
            <IconStar />
            <div>{review.rating}.00</div>
          </div>
        )}
      </div>
      <div className="text-neutral-400">{review?.text}</div>
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

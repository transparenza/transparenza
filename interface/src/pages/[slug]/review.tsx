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
import { useAccount } from 'wagmi'

interface PageProps {
  entity: Entity
}

interface ReviewData {
  title: string
  text: string
  rating: number
}

const CreateReview: NextPage<PageProps> = ({ entity }) => {
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
      const fileName = `${entity.slug}_${new Date().toISOString()}`
      const file = createJsonFile(review, fileName)
      const cid = await storage.put([file], {
        name: fileName
      })

      // todo: Call the smart contract

      resetForm()
    },
    [entity.slug, resetForm, review]
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
                <ReviewForm review={review} setReview={setReview} onSubmit={() => open()} />
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
  onSubmit: () => void
}> = ({ review, setReview, onSubmit }) => {
  const { title, text, rating } = review
  const { isConnected } = useAccount()

  const isValid = useMemo(() => {
    return title.length > 0 && text.length > 0 && rating > 0 && isConnected
  }, [title.length, text.length, rating, isConnected])

  return (
    <div className="w-full">
      <input
        placeholder="Title"
        className="placeholder:text-neutral-600 w-full border-b border-b-neutral-800 bg-transparent p-5 text-3xl font-medium outline-none"
        value={title}
        onChange={(e) => setReview({ ...review, title: e.target.value })}
      />
      <textarea
        placeholder="Write your unhinged, honest thoughts here..."
        className="placeholder:text-neutral-600 block min-h-[200px] w-full border-b border-b-neutral-800 bg-transparent p-5 text-lg text-white outline-none"
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
          />
        </ClientOnly>
      </div>
      <div className="p-5">
        <button className="w-full bg-white p-4 text-black" onClick={onSubmit} disabled={!isValid}>
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

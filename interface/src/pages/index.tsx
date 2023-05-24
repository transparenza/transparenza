import CollectionImage from 'components/ui/CollectionImage'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { Collection } from 'types/infuraTypes'
import useUserCollections from '../hooks/useUserCollections'

const Home: NextPage = () => {
  const { data } = useUserCollections()

  return (
    <>
      <Head>
        <title>Transparenza</title>
        <meta name="description" content="On-chain opinions" />
      </Head>

      <div className="container-content grow" style={{ padding: 0 }}>
        <h1
          className="py-8 text-[104px] font-bold uppercase"
          style={{
            fontSize: '84px',
            textAlign: 'center',
            paddingBottom: 0
          }}
        >
          Reviews you can trust
        </h1>
        <div className="grid grid-cols-3 gap-8" style={{ margin: '5vw' }}>
          {data?.collections
            ?.filter((collection: Collection) => !!collection.name)
            .map((collection: Collection) => (
              <div
                key={collection.contract}
                className="border-gray cursor-pointer border"
                style={{
                  display: 'auto',
                  borderRadius: '16px',
                  border: '2px solid white'
                }}
              >
                <Link href={`/${collection.contract}`}>
                  <div
                    className="relative aspect-[1.33] overflow-hidden rounded-none bg-black"
                    style={{ borderRadius: '16px' }}
                  >
                    <CollectionImage contract={collection.contract} name={collection.name} />
                  </div>
                  <div
                    className="border-t-gray border-t p-4 font-bold"
                    style={{ borderTop: '2px solid white' }}
                  >
                    {collection.name}
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}

export default Home

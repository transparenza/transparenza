import type { NextPage } from 'next'
import Head from 'next/head'
import entities from 'data/entities'
import Image from 'next/image'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Transparenza</title>
        <meta name="description" content="On-chain opinions" />
      </Head>

      <div className="container-content grow">
        <h1 className="py-8 text-[104px] font-bold uppercase">Reviews you can trust</h1>
        <div className="grid grid-cols-3 gap-8">
          {entities.map((entity) => (
            <div key={entity.name} className="border-gray cursor-pointer border">
              <Link href={`/${entity.slug}`}>
                <div className="relative aspect-[1.33] overflow-hidden rounded-none bg-black">
                  <Image
                    src={entity.logoUrl}
                    alt={entity.name}
                    fill={true}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="border-t-gray border-t p-4 font-bold">{entity.name}</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Home

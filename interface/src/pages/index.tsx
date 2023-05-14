import entities from 'data/entities'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

const Home: NextPage = () => {
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
        <Link href="/nouns">
          <div style={{ width: '100vw', padding: '0 5vw' }}>
            <div
              className="relative aspect-[1.33] overflow-hidden bg-black"
              style={{ borderRadius: '16px' }}
            >
              <Image
                src="https://3dnouns.com/static/media/ArmyFooterLarge.b458789dc314596fd087.webp"
                alt="Nouns"
                fill={true}
                style={{ objectFit: 'cover', maxWidth: '90vw' }}
              />
            </div>
          </div>
        </Link>
        <div className="grid grid-cols-3 gap-8" style={{ margin: '5vw' }}>
          {entities.map((entity) => (
            <div
              key={entity.name}
              className="border-gray cursor-pointer border"
              style={{
                display: entity.slug === 'nouns' ? 'none' : 'auto',
                borderRadius: '16px',
                border: '2px solid white'
              }}
            >
              <Link href={`/${entity.slug}`}>
                <div
                  className="relative aspect-[1.33] overflow-hidden rounded-none bg-black"
                  style={{ borderRadius: '16px' }}
                >
                  <Image
                    src={entity.logoUrl}
                    alt={entity.name}
                    fill={true}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div
                  className="border-t-gray border-t p-4 font-bold"
                  style={{ borderTop: '2px solid white' }}
                >
                  {entity.name}
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

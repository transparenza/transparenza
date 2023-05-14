import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  return (
    <header
      className="sticky top-0 z-10 w-full border-b border-b-neutral-800"
      style={{ background: '#00070F', borderBottom: '2px solid white' }}
    >
      <div className="container-content flex h-navbar items-center justify-between">
        <div>
          <Link
            href="/"
            className="flex text-lg font-medium uppercase"
            style={{
              alignContent: 'center'
            }}
          >
            <Image
              src="https://res.cloudinary.com/unicollector/image/upload/v1684038217/transparenza-logo_zprqmj.png"
              alt="Transparenza"
              width="24"
              height="24"
              style={{
                marginRight: '8px'
              }}
            />
            Transparenza
          </Link>
        </div>
        <nav className="flex items-center space-x-4">
          <span
            style={{
              color: '#ff0080',
              fontStyle: 'italic'
            }}
          >
            Gasless experience
          </span>
          <ConnectButton showBalance={false} />
        </nav>
      </div>
    </header>
  )
}

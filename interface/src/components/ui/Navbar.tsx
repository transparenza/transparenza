import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="sticky top-0 w-full">
      <div className="container-content flex h-navbar items-center justify-between">
        <div>
          <Link href="/" className="text-xl font-black">
            Transparenza
          </Link>
        </div>
        <nav className="flex items-center space-x-4">
          <ConnectButton />
        </nav>
      </div>
    </header>
  )
}

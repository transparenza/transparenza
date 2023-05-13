import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="sticky top-0 w-full border-b border-b-gray z-10">
      <div className="container-content flex h-navbar items-center justify-between">
        <div>
          <Link href="/" className="text-lg font-medium uppercase">
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

import Navbar from 'components/ui/Navbar'
import ProgressBar from 'components/ui/ProgressBar'
import type { ReactNode } from 'react'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ProgressBar />
      <div className="flex min-h-screen w-full flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </>
  )
}

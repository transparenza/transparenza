import { Toaster } from 'react-hot-toast'
import type { ReactNode } from 'react'
import Navbar from 'components/ui/Navbar'
import ProgressBar from 'components/ui/ProgressBar'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ProgressBar />
      <div className="flex min-h-screen w-full flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
      <Toaster />
    </>
  )
}

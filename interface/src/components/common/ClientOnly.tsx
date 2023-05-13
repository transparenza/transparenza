import { ReactNode, useEffect, useState } from 'react'

// Used to make hydration happy. Will be false until the first useEffect is ran.
let IS_SAFE_TO_RENDER = false

export default function ClientOnly(props: {
  children: ReactNode
  placeholder?: ReactNode
}): JSX.Element {
  const [isMounted, setIsMounted] = useState(IS_SAFE_TO_RENDER)

  useEffect(() => {
    IS_SAFE_TO_RENDER = true
    setIsMounted(true)
  }, [])

  if (!isMounted) return <>{props.placeholder}</> || null
  return <>{props.children}</>
}

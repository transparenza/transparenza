import NextNProgress from 'nextjs-progressbar'

export default function ProgressBar() {
  return (
    <NextNProgress
      color="#000000"
      startPosition={0.25}
      stopDelayMs={200}
      height={3}
      showOnShallow={false}
      options={{ showSpinner: false }}
    />
  )
}

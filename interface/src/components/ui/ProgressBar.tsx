import NextNProgress from 'nextjs-progressbar'

export default function ProgressBar() {
  return (
    <NextNProgress
      color="#ffffff"
      startPosition={0.25}
      stopDelayMs={200}
      height={2}
      showOnShallow={false}
      options={{ showSpinner: false }}
    />
  )
}

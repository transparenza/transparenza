export function createJsonFile(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })

  return new File([blob], `${filename}.json`, {
    type: 'application/json'
  })
}

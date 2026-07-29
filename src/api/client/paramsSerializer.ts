function appendValue(parameters: URLSearchParams, key: string, value: unknown) {
  if (value === undefined) return

  if (Array.isArray(value)) {
    value.forEach((item) => appendValue(parameters, key, item))
    return
  }

  parameters.append(key, value === null ? 'null' : String(value))
}

export function serializeQueryParameters(parameters: Record<string, unknown> | undefined) {
  const searchParameters = new URLSearchParams()

  Object.entries(parameters ?? {}).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        appendValue(searchParameters, nestedKey, nestedValue)
      })
      return
    }

    appendValue(searchParameters, key, value)
  })

  return searchParameters.toString()
}

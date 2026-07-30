function appendValue(parameters: URLSearchParams, key: string, value: unknown) {
  if (value === undefined || value === null) return

  if (Array.isArray(value)) {
    value.forEach((item) => appendValue(parameters, key, item))
    return
  }

  if (value instanceof Date) {
    parameters.append(key, value.toISOString())
    return
  }

  if (typeof value === 'object' && value !== null) {
    throw new TypeError(`Unsupported query parameter object at "${key}"`)
  }

  parameters.append(key, String(value))
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false

  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function hasSerializableValue(value: unknown): boolean {
  if (value === undefined || value === null) return false
  if (Array.isArray(value)) return value.some(hasSerializableValue)
  return true
}

export function serializeQueryParameters(parameters: Record<string, unknown> | undefined) {
  const searchParameters = new URLSearchParams()
  const parameterSources = new Map<string, string>()

  Object.entries(parameters ?? {}).forEach(([key, value]) => {
    // The current OpenAPI models query DTOs under a single `request` property.
    // Only unwrap that explicit transport wrapper; any other object must be
    // modeled deliberately instead of being flattened by convention.
    if (key === 'request' && isPlainRecord(value)) {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        if (!hasSerializableValue(nestedValue)) return

        const source = `${key}.${nestedKey}`
        const existingSource = parameterSources.get(nestedKey)
        if (existingSource && existingSource !== source) {
          throw new TypeError(
            `Duplicate query parameter "${nestedKey}" from "${existingSource}" and "${source}"`,
          )
        }

        parameterSources.set(nestedKey, source)
        appendValue(searchParameters, nestedKey, nestedValue)
      })
      return
    }

    if (!hasSerializableValue(value)) return

    const existingSource = parameterSources.get(key)
    if (existingSource && existingSource !== key) {
      throw new TypeError(
        `Duplicate query parameter "${key}" from "${existingSource}" and "${key}"`,
      )
    }

    parameterSources.set(key, key)
    appendValue(searchParameters, key, value)
  })

  return searchParameters.toString()
}

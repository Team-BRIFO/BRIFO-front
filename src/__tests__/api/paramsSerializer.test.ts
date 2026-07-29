import { describe, expect, it } from 'vitest'

import { serializeQueryParameters } from '@/api/client/paramsSerializer'

describe('serializeQueryParameters', () => {
  it('flattens the generated request wrapper without keeping its parent key', () => {
    expect(
      serializeQueryParameters({
        request: {
          cursor: 'cursor-1',
          size: 20,
        },
      }),
    ).toBe('cursor=cursor-1&size=20')
  })

  it('serializes top-level and nested Date values as ISO strings', () => {
    const requestedAt = new Date('2026-07-30T01:02:03.000Z')
    const parameters = new URLSearchParams(
      serializeQueryParameters({
        requestedAt,
        request: {
          startedAt: requestedAt,
        },
      }),
    )

    expect(parameters.get('requestedAt')).toBe('2026-07-30T01:02:03.000Z')
    expect(parameters.get('startedAt')).toBe('2026-07-30T01:02:03.000Z')
  })

  it('omits null and undefined values instead of sending string placeholders', () => {
    expect(
      serializeQueryParameters({
        cursor: null,
        sort: undefined,
        request: {
          search: null,
          size: 20,
        },
        tags: ['api', null, undefined],
      }),
    ).toBe('size=20&tags=api')
  })

  it('rejects duplicate wire keys between the request wrapper and top-level parameters', () => {
    expect(() =>
      serializeQueryParameters({
        size: 10,
        request: { size: 20 },
      }),
    ).toThrowError(/Duplicate query parameter "size"/)
  })

  it('does not reserve a wire key for omitted values', () => {
    expect(
      serializeQueryParameters({
        size: 20,
        request: { size: undefined },
      }),
    ).toBe('size=20')
  })

  it('rejects unsupported objects instead of flattening or silently dropping them', () => {
    expect(() =>
      serializeQueryParameters({
        filter: { keyword: 'BRIFO' },
      }),
    ).toThrowError(/Unsupported query parameter object/)

    expect(() =>
      serializeQueryParameters({
        request: {
          filter: { keyword: 'BRIFO' },
        },
      }),
    ).toThrowError(/Unsupported query parameter object/)
  })
})

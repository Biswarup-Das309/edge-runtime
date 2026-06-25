import * as EdgeRuntime from '@edge-runtime/primitives'
import { buildToHeaders } from '../../src/node-to-edge/headers'

const toHeaders = buildToHeaders({ Headers: EdgeRuntime.Headers })

describe('buildToHeaders', () => {
  it('returns an empty Headers for empty input', () => {
    const headers = toHeaders({})
    expect([...headers.entries()]).toEqual([])
  })

  it('converts a single header', () => {
    const headers = toHeaders({ 'content-type': 'text/plain' })
    expect(headers.get('content-type')).toBe('text/plain')
  })

  it('converts multiple headers', () => {
    const headers = toHeaders({
      'content-type': 'application/json',
      'x-custom': 'value',
    })
    expect(headers.get('content-type')).toBe('application/json')
    expect(headers.get('x-custom')).toBe('value')
  })

  it('handles array-valued headers (e.g. set-cookie)', () => {
    const headers = toHeaders({
      'set-cookie': ['a=1', 'b=2'],
    })
    expect(headers.get('set-cookie')).toContain('a=1')
    expect(headers.get('set-cookie')).toContain('b=2')
  })

  it('skips undefined values', () => {
    const headers = toHeaders({
      'x-present': 'value',
      'x-absent': undefined,
    })
    expect(headers.get('x-present')).toBe('value')
    expect(headers.get('x-absent')).toBeNull()
  })

  it('uses append so multiple values are concatenated', () => {
    const headers = toHeaders({
      accept: ['text/html', 'application/json'],
    })
    const value = headers.get('accept')
    expect(value).toContain('text/html')
    expect(value).toContain('application/json')
  })
})

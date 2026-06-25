import {
  stringifyCookie,
  parseCookie,
  parseSetCookie,
  splitCookiesString,
} from '../src/serialize'

describe('stringifyCookie', () => {
  it('serializes a simple name=value cookie', () => {
    expect(stringifyCookie({ name: 'foo', value: 'bar' })).toBe('foo=bar')
  })

  it('encodes the cookie value', () => {
    expect(stringifyCookie({ name: 'foo', value: 'hello world' })).toBe(
      'foo=hello%20world',
    )
  })

  it('handles an empty value', () => {
    expect(stringifyCookie({ name: 'foo', value: '' })).toBe('foo=')
  })

  it('includes Path attribute', () => {
    expect(stringifyCookie({ name: 'a', value: 'b', path: '/test' })).toBe(
      'a=b; Path=/test',
    )
  })

  it('includes Expires attribute from a Date', () => {
    const result = stringifyCookie({
      name: 'a',
      value: 'b',
      expires: new Date(0),
    })
    expect(result).toBe('a=b; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
  })

  it('includes Expires attribute from a number (timestamp)', () => {
    const result = stringifyCookie({
      name: 'a',
      value: 'b',
      expires: 0,
    })
    expect(result).toBe('a=b; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
  })

  it('includes Max-Age attribute', () => {
    expect(stringifyCookie({ name: 'a', value: 'b', maxAge: 3600 })).toBe(
      'a=b; Max-Age=3600',
    )
  })

  it('includes Max-Age=0', () => {
    expect(stringifyCookie({ name: 'a', value: 'b', maxAge: 0 })).toBe(
      'a=b; Max-Age=0',
    )
  })

  it('includes Domain attribute', () => {
    expect(
      stringifyCookie({ name: 'a', value: 'b', domain: 'example.com' }),
    ).toBe('a=b; Domain=example.com')
  })

  it('includes Secure flag', () => {
    expect(stringifyCookie({ name: 'a', value: 'b', secure: true })).toBe(
      'a=b; Secure',
    )
  })

  it('includes HttpOnly flag', () => {
    expect(stringifyCookie({ name: 'a', value: 'b', httpOnly: true })).toBe(
      'a=b; HttpOnly',
    )
  })

  it('includes SameSite attribute', () => {
    expect(stringifyCookie({ name: 'a', value: 'b', sameSite: 'strict' })).toBe(
      'a=b; SameSite=strict',
    )
  })

  it('includes Partitioned flag', () => {
    expect(stringifyCookie({ name: 'a', value: 'b', partitioned: true })).toBe(
      'a=b; Partitioned',
    )
  })

  it('includes Priority attribute', () => {
    expect(stringifyCookie({ name: 'a', value: 'b', priority: 'high' })).toBe(
      'a=b; Priority=high',
    )
  })

  it('serializes all attributes together', () => {
    const result = stringifyCookie({
      name: 'session',
      value: 'abc123',
      path: '/',
      domain: 'example.com',
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 86400,
      expires: new Date(0),
      partitioned: true,
      priority: 'medium',
    })
    expect(result).toBe(
      'session=abc123; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=86400; Domain=example.com; Secure; HttpOnly; SameSite=lax; Partitioned; Priority=medium',
    )
  })

  it('omits falsy optional attributes', () => {
    const result = stringifyCookie({
      name: 'a',
      value: 'b',
      secure: false,
      httpOnly: false,
      partitioned: false,
    })
    expect(result).toBe('a=b')
  })
})

describe('parseCookie', () => {
  it('parses a simple cookie string', () => {
    const result = parseCookie('foo=bar')
    expect(result.get('foo')).toBe('bar')
  })

  it('parses multiple cookies', () => {
    const result = parseCookie('foo=bar; baz=qux')
    expect(result.get('foo')).toBe('bar')
    expect(result.get('baz')).toBe('qux')
  })

  it('handles empty string', () => {
    const result = parseCookie('')
    expect(result.size).toBe(0)
  })

  it('handles cookie without value', () => {
    const result = parseCookie('flagonly')
    expect(result.get('flagonly')).toBe('true')
  })

  it('handles encoded values', () => {
    const result = parseCookie('foo=hello%20world')
    expect(result.get('foo')).toBe('hello world')
  })

  it('ignores invalid encoded values', () => {
    const result = parseCookie('good=fine; bad=%F6')
    expect(result.get('good')).toBe('fine')
    expect(result.has('bad')).toBe(false)
  })

  it('handles values containing =', () => {
    const result = parseCookie('foo=bar=baz')
    expect(result.get('foo')).toBe('bar=baz')
  })

  it('handles multiple semicolons and whitespace', () => {
    const result = parseCookie('a=1;  b=2;   c=3')
    expect(result.get('a')).toBe('1')
    expect(result.get('b')).toBe('2')
    expect(result.get('c')).toBe('3')
  })
})

describe('parseSetCookie', () => {
  it('returns undefined for empty string', () => {
    expect(parseSetCookie('')).toBeUndefined()
  })

  it('parses a simple Set-Cookie value', () => {
    const result = parseSetCookie('foo=bar')
    expect(result).toEqual({ name: 'foo', value: 'bar' })
  })

  it('parses Set-Cookie with Path', () => {
    const result = parseSetCookie('foo=bar; Path=/')
    expect(result).toEqual({ name: 'foo', value: 'bar', path: '/' })
  })

  it('parses Set-Cookie with HttpOnly', () => {
    const result = parseSetCookie('foo=bar; HttpOnly')
    expect(result).toEqual({ name: 'foo', value: 'bar', httpOnly: true })
  })

  it('parses Set-Cookie with Secure', () => {
    const result = parseSetCookie('foo=bar; Secure')
    expect(result).toEqual({ name: 'foo', value: 'bar', secure: true })
  })

  it('parses Set-Cookie with SameSite', () => {
    const result = parseSetCookie('foo=bar; SameSite=Lax')
    expect(result).toEqual({ name: 'foo', value: 'bar', sameSite: 'lax' })
  })

  it('parses Set-Cookie with SameSite=None', () => {
    const result = parseSetCookie('foo=bar; SameSite=None')
    expect(result).toEqual({ name: 'foo', value: 'bar', sameSite: 'none' })
  })

  it('parses Set-Cookie with SameSite=Strict', () => {
    const result = parseSetCookie('foo=bar; SameSite=Strict')
    expect(result).toEqual({ name: 'foo', value: 'bar', sameSite: 'strict' })
  })

  it('returns undefined sameSite for invalid value', () => {
    const result = parseSetCookie('foo=bar; SameSite=Invalid')
    expect(result).toEqual({ name: 'foo', value: 'bar' })
  })

  it('parses Set-Cookie with Max-Age', () => {
    const result = parseSetCookie('foo=bar; Max-Age=3600')
    expect(result).toEqual({ name: 'foo', value: 'bar', maxAge: 3600 })
  })

  it('parses Set-Cookie with Domain', () => {
    const result = parseSetCookie('foo=bar; Domain=example.com')
    expect(result).toEqual({
      name: 'foo',
      value: 'bar',
      domain: 'example.com',
    })
  })

  it('parses Set-Cookie with Expires', () => {
    const result = parseSetCookie(
      'foo=bar; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    )
    expect(result).toEqual({
      name: 'foo',
      value: 'bar',
      expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT'),
    })
  })

  it('parses Set-Cookie with Partitioned', () => {
    const result = parseSetCookie('foo=bar; Partitioned')
    expect(result).toEqual({
      name: 'foo',
      value: 'bar',
      partitioned: true,
    })
  })

  it('parses Set-Cookie with Priority', () => {
    const result = parseSetCookie('foo=bar; Priority=High')
    expect(result).toEqual({ name: 'foo', value: 'bar', priority: 'high' })
  })

  it('returns undefined priority for invalid value', () => {
    const result = parseSetCookie('foo=bar; Priority=Invalid')
    expect(result).toEqual({ name: 'foo', value: 'bar' })
  })

  it('parses Set-Cookie with all attributes', () => {
    const result = parseSetCookie(
      'session=abc; Path=/; Domain=example.com; Secure; HttpOnly; SameSite=Strict; Max-Age=86400; Partitioned; Priority=High',
    )
    expect(result).toEqual({
      name: 'session',
      value: 'abc',
      path: '/',
      domain: 'example.com',
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 86400,
      partitioned: true,
      priority: 'high',
    })
  })

  it('decodes encoded values', () => {
    const result = parseSetCookie('foo=hello%20world')
    expect(result).toEqual({ name: 'foo', value: 'hello world' })
  })
})

describe('splitCookiesString', () => {
  it('returns empty array for empty string', () => {
    expect(splitCookiesString('')).toEqual([])
  })

  it('returns a single cookie as-is', () => {
    expect(splitCookiesString('foo=bar; Path=/')).toEqual(['foo=bar; Path=/'])
  })

  it('splits comma-joined Set-Cookie strings', () => {
    const result = splitCookiesString('foo=bar; Path=/, baz=qux; Path=/')
    expect(result).toEqual(['foo=bar; Path=/', 'baz=qux; Path=/'])
  })

  it('does not split on commas inside Expires date', () => {
    const cookie = 'foo=bar; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/'
    const result = splitCookiesString(cookie)
    expect(result).toEqual([cookie])
  })

  it('handles multiple cookies with Expires dates', () => {
    const cookie1 = 'foo=bar; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/'
    const cookie2 = 'baz=qux; Expires=Fri, 02 Jan 1970 00:00:00 GMT; Path=/'
    const result = splitCookiesString(`${cookie1}, ${cookie2}`)
    expect(result).toEqual([cookie1, cookie2])
  })

  it('handles cookies without separators', () => {
    expect(splitCookiesString('single=cookie')).toEqual(['single=cookie'])
  })
})

import {
  getOwnNonIndexProperties,
  isTypedArray,
  kind,
  getConstructorName,
  getPrefix,
  PropertyFilter,
  ReflectGetOwnPropertyDescriptor,
  ReflectGetPrototypeOf,
  ArrayPrototypeFilter,
  ArrayPrototypePush,
  DatePrototypeGetTime,
  DatePrototypeToISOString,
  ObjectGetOwnPropertyDescriptors,
  ObjectGetOwnPropertyNames,
  ObjectGetOwnPropertySymbols,
  ObjectKeys,
  ObjectPrototypePropertyIsEnumerable,
  ObjectPrototypeToString,
  MapPrototypeGetSize,
  SetPrototypeGetSize,
  StringPrototypeIncludes,
  SymbolIterator,
  SymbolPrototypeToString,
  TypedArrayPrototypeGetLength,
} from '../src/primordials'

describe('kind', () => {
  it('identifies strings', () => {
    expect(kind('hello', 'string')).toBe(true)
    expect(kind(123, 'string')).toBe(false)
  })

  it('identifies numbers', () => {
    expect(kind(42, 'number')).toBe(true)
    expect(kind('42', 'number')).toBe(false)
  })

  it('identifies booleans', () => {
    expect(kind(true, 'boolean')).toBe(true)
    expect(kind(0, 'boolean')).toBe(false)
  })

  it('identifies objects', () => {
    expect(kind({}, 'object')).toBe(true)
    expect(kind(null, 'object')).toBe(true) // typeof null === 'object' in JS
    expect(kind([], 'object')).toBe(true)
    expect(kind(undefined, 'object')).toBe(false)
  })

  it('identifies functions', () => {
    expect(kind(() => {}, 'function')).toBe(true)
    expect(kind({}, 'function')).toBe(false)
  })

  it('identifies symbols', () => {
    expect(kind(Symbol('test'), 'symbol')).toBe(true)
    expect(kind('symbol', 'symbol')).toBe(false)
  })

  it('identifies bigints', () => {
    expect(kind(BigInt(123), 'bigint')).toBe(true)
    expect(kind(123, 'bigint')).toBe(false)
  })
})

describe('isTypedArray', () => {
  it('returns true for Uint8Array', () => {
    expect(isTypedArray(new Uint8Array([1, 2, 3]))).toBe(true)
  })

  it('returns true for Int32Array', () => {
    expect(isTypedArray(new Int32Array([1, 2]))).toBe(true)
  })

  it('returns true for Float64Array', () => {
    expect(isTypedArray(new Float64Array([1.5]))).toBe(true)
  })

  it('returns true for BigInt64Array', () => {
    expect(isTypedArray(new BigInt64Array([0n]))).toBe(true)
  })

  it('returns true for BigUint64Array', () => {
    expect(isTypedArray(new BigUint64Array([0n]))).toBe(true)
  })

  it('returns true for Uint8ClampedArray', () => {
    expect(isTypedArray(new Uint8ClampedArray([1]))).toBe(true)
  })

  it('returns true for Uint16Array', () => {
    expect(isTypedArray(new Uint16Array([1]))).toBe(true)
  })

  it('returns true for Uint32Array', () => {
    expect(isTypedArray(new Uint32Array([1]))).toBe(true)
  })

  it('returns true for Int8Array', () => {
    expect(isTypedArray(new Int8Array([1]))).toBe(true)
  })

  it('returns true for Int16Array', () => {
    expect(isTypedArray(new Int16Array([1]))).toBe(true)
  })

  it('returns true for Float32Array', () => {
    expect(isTypedArray(new Float32Array([1]))).toBe(true)
  })

  it('returns false for plain arrays', () => {
    expect(isTypedArray([1, 2, 3])).toBe(false)
  })

  it('returns false for non-objects', () => {
    expect(isTypedArray('string')).toBe(false)
    expect(isTypedArray(123)).toBe(false)
    expect(isTypedArray(null)).toBe(false)
    expect(isTypedArray(undefined)).toBe(false)
  })
})

describe('getConstructorName', () => {
  it('returns the constructor name for a plain object', () => {
    expect(getConstructorName({})).toBe('Object')
  })

  it('returns the constructor name for an array', () => {
    expect(getConstructorName([])).toBe('Array')
  })

  it('returns the constructor name for a Map', () => {
    expect(getConstructorName(new Map())).toBe('Map')
  })

  it('returns the constructor name for custom class', () => {
    class MyClass {}
    expect(getConstructorName(new MyClass())).toBe('MyClass')
  })

  it('returns undefined for null prototype object', () => {
    expect(getConstructorName(Object.create(null))).toBeUndefined()
  })
})

describe('getPrefix', () => {
  it('returns space for empty constructor', () => {
    expect(getPrefix()).toBe(' ')
  })

  it('returns constructor name with space', () => {
    expect(getPrefix('Array')).toBe('Array ')
  })

  it('returns constructor name with size', () => {
    expect(getPrefix('Set', '(3)')).toBe('Set(3) ')
  })

  it('handles empty string constructor', () => {
    expect(getPrefix('')).toBe(' ')
  })
})

describe('getOwnNonIndexProperties', () => {
  it('returns non-index properties of a plain object', () => {
    const obj = { a: 1, b: 2 }
    const result = getOwnNonIndexProperties(obj, PropertyFilter.ALL_PROPERTIES)
    expect(result).toEqual(['a', 'b'])
  })

  it('excludes array index properties', () => {
    const arr = [10, 20, 30]
    const result = getOwnNonIndexProperties(arr, PropertyFilter.ALL_PROPERTIES)
    expect(result).not.toContain('0')
    expect(result).not.toContain('1')
    expect(result).not.toContain('2')
    expect(result).toContain('length')
  })

  it('filters non-enumerable properties with ONLY_ENUMERABLE', () => {
    const obj = Object.create(null, {
      visible: { value: 1, enumerable: true },
      hidden: { value: 2, enumerable: false },
    })
    const result = getOwnNonIndexProperties(obj, PropertyFilter.ONLY_ENUMERABLE)
    expect(result).toContain('visible')
    expect(result).not.toContain('hidden')
  })

  it('includes non-enumerable properties with ALL_PROPERTIES', () => {
    const obj = Object.create(null, {
      visible: { value: 1, enumerable: true },
      hidden: { value: 2, enumerable: false },
    })
    const result = getOwnNonIndexProperties(obj, PropertyFilter.ALL_PROPERTIES)
    expect(result).toContain('visible')
    expect(result).toContain('hidden')
  })

  it('excludes TypedArray index properties', () => {
    const arr = new Uint8Array([1, 2, 3])
    const result = getOwnNonIndexProperties(arr, PropertyFilter.ALL_PROPERTIES)
    expect(result).not.toContain('0')
    expect(result).not.toContain('1')
    expect(result).not.toContain('2')
  })

  it('returns empty array for empty object', () => {
    const result = getOwnNonIndexProperties(
      Object.create(null),
      PropertyFilter.ONLY_ENUMERABLE,
    )
    expect(result).toEqual([])
  })
})

describe('primordial bindings', () => {
  it('ReflectGetOwnPropertyDescriptor works', () => {
    const desc = ReflectGetOwnPropertyDescriptor({ a: 1 }, 'a')
    expect(desc?.value).toBe(1)
  })

  it('ReflectGetPrototypeOf works', () => {
    expect(ReflectGetPrototypeOf([])).toBe(Array.prototype)
  })

  it('ArrayPrototypeFilter works', () => {
    const result = ArrayPrototypeFilter.call([1, 2, 3], (x: number) => x > 1)
    expect(result).toEqual([2, 3])
  })

  it('ArrayPrototypePush works', () => {
    const arr: number[] = []
    ArrayPrototypePush.call(arr, 1, 2)
    expect(arr).toEqual([1, 2])
  })

  it('DatePrototypeGetTime works', () => {
    const time = DatePrototypeGetTime.call(new Date(0))
    expect(time).toBe(0)
  })

  it('DatePrototypeToISOString works', () => {
    const iso = DatePrototypeToISOString.call(new Date(0))
    expect(iso).toBe('1970-01-01T00:00:00.000Z')
  })

  it('ObjectGetOwnPropertyDescriptors works', () => {
    const descs = ObjectGetOwnPropertyDescriptors({ x: 1 })
    expect(descs.x.value).toBe(1)
  })

  it('ObjectGetOwnPropertyNames works', () => {
    expect(ObjectGetOwnPropertyNames({ a: 1 })).toEqual(['a'])
  })

  it('ObjectGetOwnPropertySymbols works', () => {
    const sym = Symbol('s')
    expect(ObjectGetOwnPropertySymbols({ [sym]: 1 })).toEqual([sym])
  })

  it('ObjectKeys works', () => {
    expect(ObjectKeys({ a: 1, b: 2 })).toEqual(['a', 'b'])
  })

  it('ObjectPrototypePropertyIsEnumerable works', () => {
    expect(ObjectPrototypePropertyIsEnumerable.call({ a: 1 }, 'a')).toBe(true)
  })

  it('ObjectPrototypeToString works', () => {
    expect(ObjectPrototypeToString.call([])).toBe('[object Array]')
  })

  it('MapPrototypeGetSize works', () => {
    const map = new Map([['a', 1]])
    expect(MapPrototypeGetSize.call(map)).toBe(1)
  })

  it('SetPrototypeGetSize works', () => {
    const set = new Set([1, 2, 3])
    expect(SetPrototypeGetSize.call(set)).toBe(3)
  })

  it('StringPrototypeIncludes works', () => {
    expect(StringPrototypeIncludes.call('hello world', 'world')).toBe(true)
  })

  it('SymbolIterator is Symbol.iterator', () => {
    expect(SymbolIterator).toBe(Symbol.iterator)
  })

  it('SymbolPrototypeToString works', () => {
    expect(SymbolPrototypeToString.call(Symbol('test'))).toBe('Symbol(test)')
  })

  it('TypedArrayPrototypeGetLength works', () => {
    const arr = new Uint8Array([1, 2, 3])
    expect(TypedArrayPrototypeGetLength.call(arr)).toBe(3)
  })
})

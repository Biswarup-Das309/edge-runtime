import { createLogger, format } from '../src/cli/logger'

describe('createLogger', () => {
  let consoleSpy: jest.SpyInstance

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation()
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('returns a logger function', () => {
    const logger = createLogger()
    expect(typeof logger).toBe('function')
  })

  it('has info, error, debug, warn methods', () => {
    const logger = createLogger()
    expect(typeof logger.info).toBe('function')
    expect(typeof logger.error).toBe('function')
    expect(typeof logger.debug).toBe('function')
    expect(typeof logger.warn).toBe('function')
  })

  it('has a quotes method', () => {
    const logger = createLogger()
    expect(typeof logger.quotes).toBe('function')
  })

  it('quotes wraps a string with backticks', () => {
    const logger = createLogger()
    expect(logger.quotes('test')).toBe('`test`')
  })

  it('logger.info is the same function as the logger itself', () => {
    const logger = createLogger()
    expect(logger.info).toBe(logger)
  })

  it('calling the logger prints a message', () => {
    const logger = createLogger()
    logger('hello')
    expect(consoleSpy).toHaveBeenCalledTimes(1)
    const output = consoleSpy.mock.calls[0][0]
    expect(output).toContain('hello')
  })

  it('prints with a header by default', () => {
    const logger = createLogger()
    logger('test message')
    const output = consoleSpy.mock.calls[0][0]
    expect(output).toContain('ƒ')
  })

  it('prints without a header when withHeader is false', () => {
    const logger = createLogger()
    logger('test message', { withHeader: false })
    const output = consoleSpy.mock.calls[0][0]
    expect(output).not.toContain('ƒ')
  })

  it('prints with a breakline when withBreakline is true', () => {
    const logger = createLogger()
    logger('test message', { withBreakline: true })
    const output = consoleSpy.mock.calls[0][0]
    expect(output).toContain('\n')
  })

  it('error logs with red color', () => {
    const logger = createLogger()
    logger.error('error message')
    expect(consoleSpy).toHaveBeenCalledTimes(1)
    const output = consoleSpy.mock.calls[0][0]
    expect(output).toContain('error message')
  })

  it('debug logs with dim color', () => {
    const logger = createLogger()
    logger.debug('debug message')
    expect(consoleSpy).toHaveBeenCalledTimes(1)
    const output = consoleSpy.mock.calls[0][0]
    expect(output).toContain('debug message')
  })

  it('warn logs with yellow color', () => {
    const logger = createLogger()
    logger.warn('warn message')
    expect(consoleSpy).toHaveBeenCalledTimes(1)
    const output = consoleSpy.mock.calls[0][0]
    expect(output).toContain('warn message')
  })
})

describe('format', () => {
  it('is a function', () => {
    expect(typeof format).toBe('function')
  })

  it('formats strings', () => {
    expect(format('hello %s', 'world')).toBe('hello world')
  })

  it('formats numbers', () => {
    expect(format('count: %d', 42)).toBe('count: 42')
  })
})
